/**
 * enviar-mensagem — Substitui o Workflow 3 (n8n)
 *
 * Chamado pelo frontend quando o operador envia/aprova uma mensagem.
 * Fluxo completo (sem dependência de n8n):
 *   1. Valida payload
 *   2. Verifica idempotência (mensagem já enviada?)
 *   3. Analisa edição vs. sugestão original (similarity score)
 *   4. Envia via Evolution API
 *   5. Salva mensagem no DB
 *   6. Atualiza conversa e sugestão
 *   7. Se editada: gera training_feedback para revisão do prompt
 *
 * Env vars necessárias (supabase secrets set):
 *   EVOLUTION_API_URL   — ex: https://skinnysalmon-evolution.cloudfy.cloud
 *   EVOLUTION_API_KEY   — API key da Evolution
 *   EVOLUTION_INSTANCE  — nome da instância, ex: org-prestes
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

function normalizePhone(phone: string): string {
  return phone.split('@')[0]
}

// Similaridade por interseção de palavras (0..1)
function calcSimilarity(text1: string, text2: string): number {
  if (text1 === text2) return 1
  const getWords = (t: string) =>
    t
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(Boolean)
  const w1 = getWords(text1)
  const w2 = getWords(text2)
  const set1 = new Set(w1)
  const intersection = w2.filter((w) => set1.has(w))
  return intersection.length / Math.max(w1.length, w2.length, 1)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS')
    return new Response('ok', { headers: corsHeaders })

  try {
    const { suggestion_id, final_text, phone_number } = await req.json()

    if (!final_text?.trim() || !phone_number) {
      throw new Error('Campos obrigatórios: final_text e phone_number')
    }

    const trimmedText = (final_text as string).trim()
    const base = normalizePhone(phone_number as string)

    const EVOLUTION_URL = Deno.env.get('EVOLUTION_API_URL')
    const EVOLUTION_KEY = Deno.env.get('EVOLUTION_API_KEY')
    const EVOLUTION_INSTANCE =
      Deno.env.get('EVOLUTION_INSTANCE') ?? 'org-prestes'

    if (!EVOLUTION_URL || !EVOLUTION_KEY) {
      throw new Error(
        'Configuração incompleta: EVOLUTION_API_URL e EVOLUTION_API_KEY são obrigatórios',
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // --- 1. Idempotência: verifica se sugestão já foi enviada ---
    let originalText = trimmedText
    if (suggestion_id) {
      const { data: sugg } = await supabase
        .from('suggestions')
        .select('suggestion_text, sent_text')
        .eq('id', suggestion_id)
        .maybeSingle()

      if (sugg?.sent_text) {
        return new Response(
          JSON.stringify({
            success: true,
            already_sent: true,
            phone_number: base,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
        )
      }
      originalText = sugg?.suggestion_text ?? trimmedText
    }

    // --- 2. Análise de edição ---
    const wasEdited = originalText !== trimmedText
    const similarity = calcSimilarity(originalText, trimmedText)
    const qualityRating =
      similarity > 0.98 ? 5 : similarity > 0.85 ? 4 : similarity > 0.6 ? 3 : 2
    const approvedAt = new Date().toISOString()

    // --- 3. Envia via Evolution API ---
    const evolutionRes = await fetch(
      `${EVOLUTION_URL}/message/sendText/${EVOLUTION_INSTANCE}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: EVOLUTION_KEY },
        body: JSON.stringify({ number: base, text: trimmedText }),
      },
    )

    if (!evolutionRes.ok) {
      const errorBody = await evolutionRes.text()
      if (suggestion_id) {
        await supabase
          .from('suggestions')
          .update({ status: 'failed_to_send' })
          .eq('id', suggestion_id)
      }
      throw new Error(`Evolution API ${evolutionRes.status}: ${errorBody}`)
    }

    // --- 4. Salva mensagem enviada no DB ---
    const { data: insertedMessage, error: insertErr } = await supabase
      .from('messages')
      .insert({
        phone_number: base,
        sender: 'me',
        message_text: trimmedText,
        message_type: 'text',
        is_audio: false,
      })
      .select()
      .single()

    if (insertErr) console.error('Erro ao salvar mensagem:', insertErr)

    // --- 5. Atualiza conversa ---
    await supabase
      .from('conversations')
      .update({
        last_message_text: trimmedText,
        last_message_at: approvedAt,
        last_sender: 'me',
      })
      .or(
        `phone_number.eq.${base},phone_number.eq.${base}@s.whatsapp.net,phone_number.eq.${base}@c.us`,
      )

    // --- 6. Atualiza sugestão ---
    if (suggestion_id) {
      await supabase
        .from('suggestions')
        .update({
          sent_text: trimmedText,
          was_edited: wasEdited,
          edit_diff: JSON.stringify({
            similarity: Math.round(similarity * 100) / 100,
          }),
          approved_at: approvedAt,
          quality_rating: qualityRating,
          use_for_training: similarity > 0.9,
          is_gold_standard: !wasEdited,
          status: 'sent',
        })
        .eq('id', suggestion_id)

      // --- 7. Feedback de treinamento se editada ---
      if (wasEdited) {
        await supabase.from('training_feedback').insert({
          feedback_type: 'prompt_update',
          title: 'Edição de sugestão IA',
          description: `Atendente alterou sugestão para ${base} (similaridade: ${Math.round(similarity * 100)}%)`,
          current_value: originalText,
          suggested_value: trimmedText,
          evidence: JSON.stringify({
            suggestion_id,
            phone_number: base,
            similarity: Math.round(similarity * 100) / 100,
          }),
          status: 'pending',
        })
      }
    }

    console.log(
      `✅ Mensagem enviada | phone: ${base} | editada: ${wasEdited} | quality: ${qualityRating}`,
    )

    // Retorna a mensagem inserida para o frontend adicionar no chat
    return new Response(
      JSON.stringify(
        insertedMessage ?? {
          phone_number: base,
          sender: 'me',
          message_text: trimmedText,
          message_type: 'text',
          is_audio: false,
          created_at: approvedAt,
        },
      ),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
