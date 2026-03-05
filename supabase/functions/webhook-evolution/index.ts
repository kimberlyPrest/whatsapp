/**
 * webhook-evolution — Substitui o Workflow 1 (n8n)
 *
 * Recebe eventos da Evolution API via webhook, valida, extrai e salva
 * mensagens no Supabase. Suporta mensagens de texto e áudio (com transcrição
 * via Gemini). Cria/atualiza a conversa e registra o execution_id para
 * que o cron de `processar-sugestao` saiba qual é a execução mais recente.
 *
 * Env vars necessárias (supabase secrets set):
 *   GEMINI_API_KEY — chave da API do Google Gemini (para transcrição de áudio)
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Remove sufixo JID do WhatsApp (@s.whatsapp.net, @c.us, etc.)
function normalizePhone(jid: string): string {
  return jid.split('@')[0]
}

// Transcreve áudio usando Gemini multimodal
async function transcribeAudio(audioUrl: string, geminiKey: string): Promise<string> {
  try {
    const audioRes = await fetch(audioUrl)
    if (!audioRes.ok) return ''

    const audioBuffer = await audioRes.arrayBuffer()
    const bytes = new Uint8Array(audioBuffer)
    let binary = ''
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i])
    const base64Audio = btoa(binary)

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { inlineData: { mimeType: 'audio/ogg', data: base64Audio } },
                { text: 'Transcreva este áudio em português. Retorne apenas o texto transcrito, sem explicações.' },
              ],
            },
          ],
        }),
      },
    )
    const data = await res.json()
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ''
  } catch (e) {
    console.error('Transcription error:', e)
    return ''
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const body = await req.json()

    // Evolution API envia eventos com formato { event, data, ... }
    const event = (body.event ?? '').toLowerCase()

    // Processar apenas eventos de mensagens novas (messages.upsert / MESSAGES_UPSERT)
    if (!event.includes('upsert')) {
      return new Response(JSON.stringify({ skip: true, reason: `Evento ignorado: ${event}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const data = body.data ?? {}
    const key = data.key ?? {}

    // Ignorar mensagens enviadas por nós mesmos
    if (key.fromMe === true) {
      return new Response(JSON.stringify({ skip: true, reason: 'Mensagem própria (fromMe)' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const remoteJid: string = key.remoteJid ?? ''
    const phone = normalizePhone(remoteJid)

    // Ignorar grupos (@g.us) e números inválidos
    if (!phone || phone.includes('-') || remoteJid.includes('@g.us')) {
      return new Response(
        JSON.stringify({ skip: true, reason: 'Número inválido ou grupo' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      )
    }

    const msg = data.message ?? {}
    const messageType: string = data.messageType ?? 'conversation'
    const isAudio = messageType === 'audioMessage' || messageType === 'pttMessage'
    const contactName: string = data.pushName ?? 'Desconhecido'
    const rawTimestamp: number = data.messageTimestamp ?? Math.floor(Date.now() / 1000)
    const timestamp = new Date(rawTimestamp * 1000).toISOString()

    // Extrai texto da mensagem
    let messageText: string =
      msg.conversation ??
      msg.extendedTextMessage?.text ??
      msg.imageMessage?.caption ??
      msg.videoMessage?.caption ??
      ''
    const audioUrl: string = msg.audioMessage?.url ?? ''

    // Hash para deduplicação de mensagens
    const msgHash = `${phone}_${timestamp}_${messageText.substring(0, 50)}`

    const GEMINI_KEY = Deno.env.get('GEMINI_API_KEY') ?? ''
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // Transcrição de áudio
    let transcription = ''
    if (isAudio && audioUrl && GEMINI_KEY) {
      transcription = await transcribeAudio(audioUrl, GEMINI_KEY)
      if (transcription) messageText = transcription
    }

    // 1. Inserir mensagem (ignorar duplicatas pelo hash)
    const { error: msgError } = await supabase.from('messages').upsert(
      {
        phone_number: phone,
        remote_jid: remoteJid,
        sender: 'client',
        message_text: messageText || null,
        message_type: messageType,
        is_audio: isAudio,
        audio_url: isAudio ? audioUrl : null,
        transcription: transcription || null,
        message_hash: msgHash,
        created_at: timestamp,
      },
      { onConflict: 'message_hash', ignoreDuplicates: true },
    )

    if (msgError) console.error('Erro ao inserir mensagem:', msgError)

    // 2. Upsert da conversa (criar se não existir, atualizar se existir)
    const { data: existingConv } = await supabase
      .from('conversations')
      .select('unread_count')
      .eq('phone_number', phone)
      .maybeSingle()

    const newUnreadCount = (existingConv?.unread_count ?? 0) + 1

    const { error: convError } = await supabase.from('conversations').upsert(
      {
        phone_number: phone,
        remote_jid: remoteJid,
        contact_name: contactName,
        last_message_text: messageText || '[mídia]',
        last_message_at: timestamp,
        last_sender: 'client',
        unread_count: newUnreadCount,
        manually_closed: false,
      },
      { onConflict: 'phone_number' },
    )

    if (convError) console.error('Erro ao upsert conversa:', convError)

    console.log(`✅ Mensagem salva | phone: ${phone}`)

    return new Response(
      JSON.stringify({ success: true, phone_number: phone }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('Erro no webhook:', msg)
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
