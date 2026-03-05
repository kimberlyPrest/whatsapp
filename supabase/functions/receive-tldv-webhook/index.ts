/**
 * receive-tldv-webhook
 *
 * Recebe o webhook do TL.DV quando uma reunião termina.
 * Fluxo:
 *   1. Extrai dados da reunião (título, link, transcrição, emails, data)
 *   2. Para cada email dos participantes, tenta encontrar um client_profile
 *   3. Insere em tldv_meetings
 *   4. Atualiza client_profiles.tldv_link com o link mais recente
 *
 * URL para configurar no TL.DV:
 *   https://lasmxppjkfpypotnweyj.supabase.co/functions/v1/receive-tldv-webhook
 *
 * Env vars necessárias:
 *   SUPABASE_URL (automático)
 *   SUPABASE_SERVICE_ROLE_KEY (automático)
 *   TLDV_WEBHOOK_SECRET — opcional, valida header x-tldv-signature
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-tldv-signature',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const secret = Deno.env.get('TLDV_WEBHOOK_SECRET')

    // Valida assinatura se secret estiver configurado
    if (secret) {
      const sig = req.headers.get('x-tldv-signature')
      if (sig !== secret) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    const body = await req.json()

    // TL.DV envia o payload com campos variando por versão da API
    // Normaliza para o formato interno
    const meetingTitle: string =
      body.title ?? body.meeting?.title ?? body.name ?? 'Reunião sem título'

    const tldvLink: string =
      body.share_url ?? body.url ?? body.meeting?.share_url ?? body.meeting?.url ?? ''

    if (!tldvLink) {
      return new Response(JSON.stringify({ error: 'tldv_link não encontrado no payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const transcript: string =
      body.transcript ?? body.transcription ?? body.meeting?.transcript ?? ''

    const summary: string =
      body.summary ?? body.meeting?.summary ?? ''

    const meetingDate: string =
      body.started_at ?? body.date ?? body.meeting?.started_at ?? new Date().toISOString()

    // Extrai emails dos participantes
    const participants: any[] =
      body.participants ?? body.meeting?.participants ?? body.attendees ?? []

    const participantEmails: string[] = participants
      .map((p: any) => p.email ?? p.user?.email ?? '')
      .filter((e: string) => e && e.includes('@'))

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )

    // Busca client_profile pelo email dos participantes
    let linkedPhoneNumber: string | null = null

    if (participantEmails.length > 0) {
      const { data: matchedProfile } = await supabase
        .from('client_profiles')
        .select('phone_number')
        .in('email', participantEmails)
        .limit(1)
        .maybeSingle()

      if (matchedProfile) {
        linkedPhoneNumber = matchedProfile.phone_number
      }
    }

    // Insere reunião
    const { data: meeting, error: meetingErr } = await supabase
      .from('tldv_meetings')
      .insert({
        phone_number: linkedPhoneNumber,
        meeting_title: meetingTitle,
        tldv_link: tldvLink,
        transcript: transcript || null,
        summary: summary || null,
        participant_emails: participantEmails,
        meeting_date: meetingDate,
      })
      .select()
      .single()

    if (meetingErr) throw meetingErr

    // Atualiza tldv_link no perfil do cliente (mantém sempre o mais recente)
    if (linkedPhoneNumber) {
      await supabase
        .from('client_profiles')
        .update({ tldv_link: tldvLink, updated_at: new Date().toISOString() })
        .eq('phone_number', linkedPhoneNumber)
    }

    console.log(`✅ TL.DV reunião recebida: "${meetingTitle}" | phone: ${linkedPhoneNumber ?? 'não vinculado'} | emails: ${participantEmails.join(', ')}`)

    return new Response(
      JSON.stringify({ success: true, meeting_id: meeting.id, linked_phone: linkedPhoneNumber }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error('Erro ao processar webhook TL.DV:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
