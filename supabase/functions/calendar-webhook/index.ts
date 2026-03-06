const CALENDAR_ID = 'kimberly@adapta.org'
const WEBHOOK_URL = 'https://lasmxppjkfpypotnweyj.supabase.co/functions/v1/calendar-webhook'

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
  if (!data.access_token) throw new Error(`OAuth token error: ${JSON.stringify(data)}`)
  return data.access_token
}

async function registerWatch(token: string): Promise<any> {
  // Expira em 6 dias (máximo do Google é 7 — renovamos antes)
  const expiration = Date.now() + 6 * 24 * 60 * 60 * 1000
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events/watch`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: crypto.randomUUID(),
        type: 'web_hook',
        address: WEBHOOK_URL,
        expiration: expiration.toString(),
      }),
    },
  )
  const data = await res.json()
  if (!res.ok) throw new Error(`Watch register error: ${JSON.stringify(data)}`)
  return data
}

Deno.serve(async (req) => {
  const url = new URL(req.url)

  // ── Endpoint de setup/renovação do watch ─────────────────────────────────
  if (url.searchParams.get('setup') === '1') {
    try {
      const token = await getAccessToken()
      const watch = await registerWatch(token)
      console.log('Watch registrado:', watch)
      return new Response(JSON.stringify({ ok: true, watch }), {
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (err: any) {
      console.error('Setup watch error:', err)
      return new Response(JSON.stringify({ ok: false, error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  // ── Receber notificação do Google Calendar ────────────────────────────────
  const resourceState = req.headers.get('x-goog-resource-state')

  // Mensagem inicial de sincronização — apenas acusar recebimento
  if (resourceState === 'sync') {
    return new Response('ok', { status: 200 })
  }

  // Evento criado, atualizado ou cancelado → disparar sync
  if (resourceState === 'exists' || resourceState === 'not_exists') {
    const syncUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/sync-calendar`
    fetch(syncUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}` },
    }).catch((e) => console.error('Erro ao chamar sync-calendar:', e))
  }

  return new Response('ok', { status: 200 })
})
