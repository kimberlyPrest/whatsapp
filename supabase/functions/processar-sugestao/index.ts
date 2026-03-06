/**
 * processar-sugestao — Substitui o Workflow 2 (n8n)
 *
 * Gera sugestões de resposta com IA para conversas pendentes.
 * Pode ser chamado de duas formas:
 *   1. Via pg_cron a cada minuto (processa todas conversas com debounce >= 3min)
 *   2. Diretamente com { phone_number } para processar uma conversa específica
 *
 * Lógica:
 *   1. Busca conversas onde last_sender='client' e last_message_at >= 3 minutos atrás
 *   2. Para cada conversa sem sugestão pendente:
 *      a. Verifica regras autônomas (por regex) → se bate, salva sugestão baseada na regra
 *      b. Se nenhuma regra bate → chama Gemini para gerar sugestão de IA
 *
 * Env vars necessárias:
 *   GEMINI_API_KEY — chave da API do Google Gemini
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function normalizePhone(jid: string): string {
  return jid.split('@')[0]
}

// Gera sugestão para uma conversa específica
async function generateSuggestion(supabase: ReturnType<typeof createClient>, conv: Record<string, unknown>, geminiKey: string) {
  const phone = conv.phone_number as string
  const contactName = (conv.contact_name as string) ?? 'Cliente'

  // Busca últimas 20 mensagens da conversa (todos os formatos de phone)
  const base = normalizePhone(phone)
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .or(`phone_number.eq.${base},phone_number.eq.${base}@s.whatsapp.net,phone_number.eq.${base}@c.us`)
    .order('created_at', { ascending: false })
    .limit(20)

  if (!messages?.length) return

  // Ordena cronologicamente (mais antigo primeiro)
  const sorted = [...messages].reverse()

  // Identifica mensagens recentes (últimos 3 minutos antes da última mensagem do cliente)
  const lastMsgAt = new Date(conv.last_message_at as string).getTime()
  const threeMinBefore = new Date(lastMsgAt - 3 * 60 * 1000).toISOString()
  const recentClientMessages = sorted.filter(
    (m) => m.sender === 'client' && m.created_at >= threeMinBefore,
  )
  const recentText = recentClientMessages
    .map((m) => (m.message_text ?? m.transcription ?? '') as string)
    .filter(Boolean)
    .join('\n')

  if (!recentText.trim()) return

  // --- 1. Verifica regras autônomas ---
  const { data: rules } = await supabase
    .from('autonomous_rules')
    .select('*')
    .eq('is_active', true)

  if (rules?.length) {
    const sortedRules = [...rules].sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999))

    for (const rule of sortedRules) {
      if (!rule.trigger_patterns?.length) continue

      for (const pattern of rule.trigger_patterns as string[]) {
        try {
          const regex = new RegExp(pattern, 'gi')
          if (regex.test(recentText.toLowerCase())) {
            let responseText: string = rule.response_template ?? ''
            responseText = responseText.replace(/\{\{contact_name\}\}/g, contactName)
            responseText = responseText.replace(/\{\{phone_number\}\}/g, phone)

            // Salva sugestão baseada na regra
            await supabase.from('suggestions').insert({
              phone_number: phone,
              suggestion_text: responseText,
              auto_send: rule.auto_send ?? false,
              matched_rule_id: rule.id,
              matched_rule_name: rule.rule_name,
              context_messages: { recent_text: recentText },
            })

            // Atualiza contador de uso da regra
            await supabase
              .from('autonomous_rules')
              .update({
                usage_count: (rule.usage_count ?? 0) + 1,
                last_used_at: new Date().toISOString(),
              })
              .eq('id', rule.id)

            console.log(`✅ Regra "${rule.rule_name}" aplicada para ${phone}`)
            return
          }
        } catch (_e) {
          // regex inválida, pular
        }
      }
    }
  }

  // --- 2. Nenhuma regra bateu → gera com Gemini ---
  if (!geminiKey) {
    console.warn(`Sem GEMINI_API_KEY — sugestão não gerada para ${phone}`)
    return
  }

  // Exemplos de sugestões aprovadas (para few-shot)
  const { data: approvedSuggs } = await supabase
    .from('suggestions')
    .select('sent_text')
    .eq('was_edited', false)
    .not('sent_text', 'is', null)
    .limit(5)

  // Prompt do sistema ativo
  const { data: promptData } = await supabase
    .from('ai_prompts')
    .select('prompt_content')
    .eq('is_active', true)
    .maybeSingle()

  const systemPrompt =
    (promptData?.prompt_content as string | null) ??
    'Você é um assistente virtual que responde mensagens de WhatsApp. Responda de forma cordial, profissional e objetiva. Se não souber algo, sugira que o cliente entre em contato por telefone.'

  // Histórico legível das últimas 10 mensagens
  const history = sorted
    .slice(-10)
    .map((m) => {
      const who = m.sender === 'client' ? contactName : 'Atendente'
      const text = (m.message_text ?? m.transcription ?? '[mídia]') as string
      return `${who}: ${text}`
    })
    .join('\n')

  // Exemplos de boas respostas
  let examples = ''
  if (approvedSuggs?.length) {
    examples = '\n\n## Exemplos de respostas aprovadas anteriormente:\n'
    approvedSuggs.forEach((s, i) => {
      if (s.sent_text) examples += `\nExemplo ${i + 1}: "${s.sent_text}"\n`
    })
  }

  const fullPrompt = `${systemPrompt}

## Dados da conversa:
Cliente: ${contactName}

### Histórico das últimas mensagens:
${history}

### Mensagem(ns) atual(is) do cliente:
${recentText}
${examples}

## Instrução:
Gere UMA resposta adequada para enviar ao cliente agora.
Retorne APENAS o texto da resposta, sem explicações ou formatação extra.`

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
        }),
      },
    )

    const aiData = await res.json()
    let aiText: string = aiData?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ''

    // Remove aspas desnecessárias que o Gemini às vezes adiciona
    if (aiText.startsWith('"') && aiText.endsWith('"')) aiText = aiText.slice(1, -1)

    if (!aiText) {
      aiText = 'Olá! Recebi sua mensagem e retorno em breve. 😊'
    }

    await supabase.from('suggestions').insert({
      phone_number: phone,
      suggestion_text: aiText,
      auto_send: false,
      context_messages: { is_ai: true, generated_at: new Date().toISOString() },
    })

    console.log(`✅ Sugestão IA gerada para ${phone}: "${aiText.substring(0, 60)}..."`)
  } catch (e) {
    console.error(`Erro Gemini para ${phone}:`, e)
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )
    const GEMINI_KEY = Deno.env.get('GEMINI_API_KEY') ?? ''

    // Aceita chamada com phone_number específico ou sem (processa todas)
    let specificPhone: string | null = null
    try {
      const bodyText = await req.text()
      if (bodyText) {
        const body = JSON.parse(bodyText)
        specificPhone = body.phone_number ?? null
      }
    } catch {}

    // Janela de debounce: mensagens com mais de 3min e menos de 10min sem resposta
    const threeMinAgo = new Date(Date.now() - 3 * 60 * 1000).toISOString()
    const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()

    let convQuery = supabase
      .from('conversations')
      .select('*')
      .eq('last_sender', 'client')
      .eq('manually_closed', false)
      .lte('last_message_at', threeMinAgo)  // ≥ 3 minutos atrás (debounce)
      .gte('last_message_at', tenMinAgo)    // ≤ 10 minutos atrás (não muito antiga)

    if (specificPhone) {
      convQuery = convQuery.eq('phone_number', normalizePhone(specificPhone))
    }

    const { data: conversations, error: convQueryErr } = await convQuery.limit(20)

    if (convQueryErr) throw convQueryErr
    if (!conversations?.length) {
      return new Response(JSON.stringify({ processed: 0, message: 'Nenhuma conversa pendente' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    let processed = 0
    for (const conv of conversations) {
      // Verifica se já existe uma sugestão pendente gerada após a última mensagem
      const { data: existingSugg } = await supabase
        .from('suggestions')
        .select('id')
        .eq('phone_number', conv.phone_number)
        .is('approved_at', null)
        .gte('created_at', conv.last_message_at)
        .maybeSingle()

      if (existingSugg) {
        console.log(`Sugestão já existe para ${conv.phone_number}, pulando`)
        continue
      }

      await generateSuggestion(supabase, conv, GEMINI_KEY)
      processed++
    }

    return new Response(
      JSON.stringify({ processed, total_checked: conversations.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Erro ao processar sugestões:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
