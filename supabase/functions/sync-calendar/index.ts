import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CALENDAR_ID = 'kimberly@adapta.org'

// ─── OAuth helpers ───────────────────────────────────────────────────────────

async function getAccessToken(): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: Deno.env.get('GOOGLE_OAUTH_CLIENT_ID')!,
      client_secret: Deno.env.get('GOOGLE_OAUTH_CLIENT_SECRET')!,
      refresh_token: Deno.env.get('GOOGLE_OAUTH_REFRESH_TOKEN')!,
      grant_type: 'refresh_token',
    }),
  })
  const data = await res.json()
  if (!data.access_token)
    throw new Error(`OAuth token error: ${JSON.stringify(data)}`)
  return data.access_token
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Extrai o link de reagendamento do HubSpot da descrição do evento.
 * O HubSpot cria eventos com links no formato:
 *   https://meetings.hubspot.com/kimberly-prestes/skip?...&action=reschedule
 */
function extractRescheduleLink(description: string | null): string | null {
  if (!description) return null
  // Prioridade: link com action=reschedule
  const rescheduleMatch = description.match(
    /https:\/\/meetings\.hubspot\.com\/[^\s"<>]*reschedule[^\s"<>]*/i,
  )
  if (rescheduleMatch) return rescheduleMatch[0]
  // Fallback: qualquer link HubSpot meetings na descrição
  const anyMatch = description.match(
    /https:\/\/meetings\.hubspot\.com\/[^\s"<>]+/,
  )
  return anyMatch ? anyMatch[0] : null
}

// ─── Google Calendar fetch ───────────────────────────────────────────────────

async function fetchCalendarEvents(token: string): Promise<any[]> {
  const timeMin = new Date()
  timeMin.setDate(timeMin.getDate() - 1)
  const timeMax = new Date()
  timeMax.setDate(timeMax.getDate() + 60)

  const url = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`,
  )
  url.searchParams.set('timeMin', timeMin.toISOString())
  url.searchParams.set('timeMax', timeMax.toISOString())
  url.searchParams.set('singleEvents', 'true')
  url.searchParams.set('orderBy', 'startTime')
  url.searchParams.set('maxResults', '250')

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(`Calendar API error: ${JSON.stringify(data)}`)
  return data.items || []
}

// ─── Main handler ────────────────────────────────────────────────────────────

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  try {
    const token = await getAccessToken()
    const events = await fetchCalendarEvents(token)

    // Montar mapa email → phone_number para matching
    const { data: clients } = await supabase
      .from('client_profiles')
      .select('phone_number, email, emails_alternativos')

    const emailToPhone: Record<string, string> = {}
    for (const c of clients || []) {
      if (c.email) emailToPhone[c.email.toLowerCase()] = c.phone_number
      for (const alt of c.emails_alternativos || []) {
        emailToPhone[alt.toLowerCase()] = c.phone_number
      }
    }

    let synced = 0
    const now = new Date().toISOString()

    for (const ev of events) {
      if (ev.status === 'cancelled') continue
      const startAt = ev.start?.dateTime || ev.start?.date
      if (!startAt) continue

      // Extrair link do Google Meet
      const meetLink =
        ev.hangoutLink ||
        ev.conferenceData?.entryPoints?.find(
          (e: any) => e.entryPointType === 'video',
        )?.uri ||
        null

      const attendees = (ev.attendees || []).map((a: any) => ({
        email: a.email,
        name: a.displayName || null,
        responseStatus: a.responseStatus || null,
      }))

      // Tentar vincular a um cliente pelo email
      let clientPhone: string | null = null
      let clientEmail: string | null = null
      for (const att of attendees) {
        const phone = emailToPhone[att.email?.toLowerCase() || '']
        if (phone) {
          clientPhone = phone
          clientEmail = att.email
          break
        }
      }

      // Só salvar se for reunião com cliente cadastrado
      if (!clientPhone) continue

      const { error } = await supabase.from('calendar_events').upsert(
        {
          google_event_id: ev.id,
          title: ev.summary || '(Sem título)',
          description: ev.description || null,
          start_at: startAt,
          end_at: ev.end?.dateTime || ev.end?.date || null,
          meet_link: meetLink,
          reschedule_link: extractRescheduleLink(ev.description || null),
          attendees,
          client_phone: clientPhone,
          client_email: clientEmail,
          status: ev.status || 'confirmed',
          synced_at: now,
        },
        { onConflict: 'google_event_id' },
      )

      if (error) {
        console.error(`Erro ao upsert evento ${ev.id}:`, error)
        continue
      }

      synced++
    }

    // Atualizar próxima reunião em client_profiles
    const { data: futureEvents } = await supabase
      .from('calendar_events')
      .select('client_phone, start_at, meet_link')
      .not('client_phone', 'is', null)
      .gte('start_at', now)
      .neq('status', 'cancelled')
      .order('start_at', { ascending: true })

    const nextByClient: Record<
      string,
      { start_at: string; meet_link: string | null }
    > = {}
    for (const ev of futureEvents || []) {
      if (!nextByClient[ev.client_phone]) {
        nextByClient[ev.client_phone] = {
          start_at: ev.start_at,
          meet_link: ev.meet_link,
        }
      }
    }

    for (const [phone, next] of Object.entries(nextByClient)) {
      await supabase
        .from('client_profiles')
        .update({
          next_meeting_at: next.start_at,
          next_meeting_link: next.meet_link,
        })
        .eq('phone_number', phone)
    }

    return new Response(JSON.stringify({ ok: true, synced }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    console.error('sync-calendar error:', err)
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
