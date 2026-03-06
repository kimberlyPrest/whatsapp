/**
 * sync-tldv.ts
 *
 * Sincroniza reuniões do TL.DV com os clientes do banco.
 *
 * Fluxo:
 *   1. Busca todos os client_profiles que têm email no banco
 *   2. Busca TODAS as reuniões do TL.DV (paginado)
 *   3. Para cada reunião, verifica se algum invitee.email bate com um cliente
 *   4. Para os matches: busca transcrição + highlights e salva em tldv_meetings
 *   5. Atualiza client_profiles.tldv_link com o link da reunião mais recente
 *
 * Uso:
 *   export SUPABASE_SERVICE_ROLE_KEY="eyJ..."
 *   export TLDV_API_KEY="sua_api_key_do_tldv"
 *   npx tsx scripts/sync-tldv.ts
 */

// ─── Config ────────────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://lasmxppjkfpypotnweyj.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const TLDV_KEY    = process.env.TLDV_API_KEY || ''
const TLDV_BASE   = 'https://pasta.tldv.io/v1alpha1'

const SUPABASE_HEADERS = {
  'Content-Type': 'application/json',
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`,
}

const TLDV_HEADERS = {
  'x-api-key': TLDV_KEY,
  'Content-Type': 'application/json',
}

// ─── Helpers ───────────────────────────────────────────────────────────────

async function tldvGet(path: string) {
  const res = await fetch(`${TLDV_BASE}${path}`, { headers: TLDV_HEADERS })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`TL.DV ${path} → ${res.status}: ${body}`)
  }
  return res.json()
}

/** Junta os segmentos de transcrição em texto plano */
function flattenTranscript(transcript: any): string {
  if (!transcript) return ''
  const segments: any[] = transcript.segments ?? transcript.results ?? transcript.entries ?? []
  return segments
    .map((s: any) => {
      const speaker = s.speaker ?? s.speakerName ?? ''
      const text = s.text ?? s.content ?? ''
      return speaker ? `${speaker}: ${text}` : text
    })
    .filter(Boolean)
    .join('\n')
}

/** Junta highlights/notes em texto plano */
function flattenHighlights(highlights: any): string {
  if (!highlights) return ''
  const items: any[] = highlights.highlights ?? highlights.notes ?? highlights.topics ?? []
  return items
    .map((h: any) => h.summary ?? h.text ?? h.content ?? JSON.stringify(h))
    .filter(Boolean)
    .join('\n\n')
}

/** Delay simples para não bater rate limit */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  if (!SUPABASE_KEY) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY não definido.')
    process.exit(1)
  }
  if (!TLDV_KEY) {
    console.error('❌ TLDV_API_KEY não definido.')
    console.error('   Encontre em: tldv.io → Settings → API')
    process.exit(1)
  }

  // ── 1. Busca clientes com email no banco ──────────────────────────────────
  console.log('📦 Buscando clientes com email no banco...')

  const dbRes = await fetch(
    `${SUPABASE_URL}/rest/v1/client_profiles?select=phone_number,email&email=not.is.null`,
    { headers: SUPABASE_HEADERS },
  )
  if (!dbRes.ok) throw new Error(`Erro Supabase: ${await dbRes.text()}`)

  const dbClients: { phone_number: string; email: string }[] = await dbRes.json()
  console.log(`   ${dbClients.length} clientes com email\n`)

  if (dbClients.length === 0) {
    console.log('Nenhum cliente com email. Rode primeiro o import-clients.ts.')
    return
  }

  // Mapa email (lowercase) → phone_number
  const emailToPhone = new Map<string, string>()
  for (const c of dbClients) {
    emailToPhone.set(c.email.toLowerCase().trim(), c.phone_number)
  }

  // ── 2. Busca todas as reuniões do TL.DV (paginado) ────────────────────────
  console.log('⬇  Buscando reuniões no TL.DV...')

  const allMeetings: any[] = []
  let page = 1
  let totalPages = 1

  while (page <= totalPages) {
    const data = await tldvGet(`/meetings?page=${page}&limit=50`)
    allMeetings.push(...(data.results ?? []))
    totalPages = data.pages ?? 1
    process.stdout.write(`   Página ${page}/${totalPages} (${allMeetings.length} reuniões)...\r`)
    page++
    if (page <= totalPages) await sleep(300)
  }
  process.stdout.write('\n')

  console.log(`   ${allMeetings.length} reuniões encontradas no TL.DV\n`)

  // ── 3. Cruza emails dos invitees com os clientes do banco ─────────────────
  console.log('🔍 Cruzando participantes com clientes...')

  const matches: Array<{ meeting: any; phoneNumber: string }> = []

  for (const meeting of allMeetings) {
    const invitees: { name: string; email: string }[] = meeting.invitees ?? []
    for (const inv of invitees) {
      const phone = emailToPhone.get(inv.email?.toLowerCase()?.trim() ?? '')
      if (phone) {
        matches.push({ meeting, phoneNumber: phone })
        break // um match por reunião é suficiente
      }
    }
  }

  console.log(`   ${matches.length} reuniões com clientes reconhecidos\n`)

  if (matches.length === 0) {
    console.log('Nenhum match encontrado. Verifique se os emails estão corretos.')
    return
  }

  // ── 4. Para cada match: busca transcrição + highlights, salva no banco ────
  console.log(`📝 Buscando detalhes e salvando ${matches.length} reuniões...`)

  // Busca tldv_meetings já existentes para evitar duplicatas
  const existingRes = await fetch(
    `${SUPABASE_URL}/rest/v1/tldv_meetings?select=tldv_link`,
    { headers: SUPABASE_HEADERS },
  )
  const existingMeetings: { tldv_link: string }[] = existingRes.ok ? await existingRes.json() : []
  const existingLinks = new Set(existingMeetings.map((m) => m.tldv_link))

  let saved = 0
  let skipped = 0
  let errors = 0

  // Agrupa por phone para saber qual é a mais recente ao final
  const latestMeetingByPhone = new Map<string, { link: string; date: string }>()

  for (let i = 0; i < matches.length; i++) {
    const { meeting, phoneNumber } = matches[i]
    const meetingLink: string = meeting.url ?? `${TLDV_BASE}/meetings/${meeting.id}`

    // Atualiza o mais recente por phone
    const meetingIso = meeting.happenedAt ? new Date(meeting.happenedAt).toISOString() : ''
    const current = latestMeetingByPhone.get(phoneNumber)
    if (!current || meetingIso > current.date) {
      latestMeetingByPhone.set(phoneNumber, { link: meetingLink, date: meetingIso })
    }

    // Pula se já existe no banco
    if (existingLinks.has(meetingLink)) {
      skipped++
      continue
    }

    process.stdout.write(`   [${i + 1}/${matches.length}] "${meeting.name ?? 'Sem título'}"... `)

    let transcriptText = ''
    let summaryText = ''

    try {
      const [transcriptData, highlightsData] = await Promise.allSettled([
        tldvGet(`/meetings/${meeting.id}/transcript`),
        tldvGet(`/meetings/${meeting.id}/highlights`),
      ])

      if (transcriptData.status === 'fulfilled') {
        transcriptText = flattenTranscript(transcriptData.value)
      }
      if (highlightsData.status === 'fulfilled') {
        summaryText = flattenHighlights(highlightsData.value)
      }
    } catch {
      // Segue sem transcrição se falhar
    }

    const participantEmails = (meeting.invitees ?? [])
      .map((inv: any) => inv.email)
      .filter(Boolean)

    const record = {
      phone_number: phoneNumber,
      meeting_title: meeting.name ?? null,
      tldv_link: meetingLink,
      transcript: transcriptText || null,
      summary: summaryText || null,
      participant_emails: participantEmails,
      meeting_date: meeting.happenedAt ? new Date(meeting.happenedAt).toISOString() : null,
    }

    const insertRes = await fetch(
      `${SUPABASE_URL}/rest/v1/tldv_meetings?on_conflict=tldv_link`,
      {
        method: 'POST',
        headers: { ...SUPABASE_HEADERS, 'Prefer': 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify(record),
      },
    )

    if (!insertRes.ok) {
      console.error(`\n   ❌ Erro: ${await insertRes.text()}`)
      errors++
    } else {
      process.stdout.write('✓\n')
      saved++
    }

    // Respeita rate limit do TL.DV
    await sleep(200)
  }

  // ── 5. Atualiza tldv_link em meus_clientes (via client_id) ───────────────
  console.log(`\n🔗 Atualizando link mais recente em ${latestMeetingByPhone.size} clientes...`)

  // Busca client_profiles.id para cada phone
  const tldvPhones = [...latestMeetingByPhone.keys()]
  const tldvFilter = tldvPhones.map((p) => encodeURIComponent(p)).join(',')
  const profilesRes = await fetch(
    `${SUPABASE_URL}/rest/v1/client_profiles?phone_number=in.(${tldvFilter})&select=id,phone_number`,
    { headers: SUPABASE_HEADERS },
  )
  const tldvProfiles: { id: string; phone_number: string }[] = profilesRes.ok ? await profilesRes.json() : []
  const phoneToClientId = new Map(tldvProfiles.map((p) => [p.phone_number, p.id]))

  const linkNow = new Date().toISOString()
  for (const [phone, { link }] of latestMeetingByPhone) {
    const clientId = phoneToClientId.get(phone)
    if (!clientId) continue
    await fetch(
      `${SUPABASE_URL}/rest/v1/meus_clientes`,
      {
        method: 'POST',
        headers: { ...SUPABASE_HEADERS, 'Prefer': 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify({ client_id: clientId, tldv_link: link, updated_at: linkNow }),
      },
    )
  }

  console.log(`\n📦 Resultado final:`)
  console.log(`   ✅ Reuniões salvas: ${saved}`)
  console.log(`   ⏭  Já existiam (puladas): ${skipped}`)
  if (errors > 0) console.log(`   ❌ Erros: ${errors}`)
  console.log(`   🔗 Clientes com tldv_link atualizado: ${latestMeetingByPhone.size}`)
}

main().catch((err) => {
  console.error('Erro fatal:', err.message)
  process.exit(1)
})
