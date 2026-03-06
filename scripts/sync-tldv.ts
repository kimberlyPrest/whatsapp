/**
 * sync-tldv.ts
 *
 * Versão Final Turbo: Match por Email, Nome Completo, Domínio e PRIMEIRO NOME (se único).
 */

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || 'https://lasmxppjkfpypotnweyj.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const TLDV_KEY = process.env.TLDV_API_KEY || ''
const TLDV_BASE = 'https://pasta.tldv.io/v1alpha1'

const SUPABASE_HEADERS = {
  'Content-Type': 'application/json',
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
}
const TLDV_HEADERS = {
  'x-api-key': TLDV_KEY,
  'Content-Type': 'application/json',
}

async function tldvGet(path: string) {
  const res = await fetch(`${TLDV_BASE}${path}`, { headers: TLDV_HEADERS })
  return res.json()
}

function normalize(str: string): string {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

const GENERIC_DOMAINS = new Set([
  'gmail.com',
  'hotmail.com',
  'outlook.com',
  'yahoo.com',
  'icloud.com',
  'terra.com.br',
  'uol.com.br',
  'bol.com.br',
  'live.com',
])

async function main() {
  console.log('📦 Carregando dados...')
  const profilesRes = await fetch(
    `${SUPABASE_URL}/rest/v1/client_profiles?select=id,contact_name,email&propriedade=eq.true`,
    { headers: SUPABASE_HEADERS },
  )
  const profiles: any[] = await profilesRes.json()

  const emailMap = new Map()
  const nameMap = new Map()
  const domainMap = new Map()
  const firstNameMap = new Map()

  for (const p of profiles) {
    if (p.email) {
      const normEmail = normalize(p.email)
      emailMap.set(normEmail, p.id)
      const dom = p.email.split('@')[1]?.toLowerCase()
      if (dom && !GENERIC_DOMAINS.has(dom))
        domainMap.set(dom, domainMap.has(dom) ? 'multiple' : p.id)
    }
    if (p.contact_name) {
      const normName = normalize(p.contact_name)
      nameMap.set(normName, p.id)
      const first = normName.split(' ')[0]
      if (first.length > 3)
        firstNameMap.set(first, firstNameMap.has(first) ? 'multiple' : p.id)
    }
  }

  const allMeetings: any[] = []
  let page = 1
  let totalPages = 1
  while (page <= totalPages) {
    const data = await tldvGet(`/meetings?page=${page}&limit=100`)
    allMeetings.push(...(data.results ?? []))
    totalPages = data.pages ?? 1
    process.stdout.write(`   Busca TL.DV: ${allMeetings.length} reuniões...\r`)
    page++
    await new Promise((r) => setTimeout(r, 100))
  }
  process.stdout.write('\n')

  const profileToMeetings = new Map<string, any[]>()

  for (const m of allMeetings) {
    const title = normalize(m.name ?? '')
    const invitees = m.invitees ?? []
    let foundId = null

    // 1. Email exato
    for (const inv of invitees) {
      const e = normalize(inv.email ?? '')
      if (emailMap.has(e)) {
        foundId = emailMap.get(e)
        break
      }
    }
    // 2. Domínio corp
    if (!foundId) {
      for (const inv of invitees) {
        const d = (inv.email ?? '').split('@')[1]?.toLowerCase()
        if (d && domainMap.get(d) && domainMap.get(d) !== 'multiple') {
          foundId = domainMap.get(d)
          break
        }
      }
    }
    // 3. Nome no título
    if (!foundId) {
      // Tenta nome completo
      for (const [n, id] of nameMap) {
        if (n.length > 5 && title.includes(n)) {
          foundId = id
          break
        }
      }
      // Se título tem "melisa" e só temos uma Melisa
      if (!foundId) {
        for (const [f, id] of firstNameMap) {
          if (
            id !== 'multiple' &&
            (title.endsWith(` ${f}`) ||
              title.includes(` ${f} `) ||
              title.includes(` <> ${f}`))
          ) {
            foundId = id
            break
          }
        }
      }
    }

    if (foundId) {
      if (!profileToMeetings.has(foundId)) profileToMeetings.set(foundId, [])
      profileToMeetings.get(foundId)!.push(m)
    }
  }

  const mcRes = await fetch(`${SUPABASE_URL}/rest/v1/meus_clientes?select=*`, {
    headers: SUPABASE_HEADERS,
  })
  const meusClientes: any[] = await mcRes.json()

  let count = 0
  for (const mc of meusClientes) {
    const meetings = profileToMeetings.get(mc.client_id)
    if (!meetings) continue

    const latest = meetings.sort(
      (a, b) =>
        new Date(b.happenedAt).getTime() - new Date(a.happenedAt).getTime(),
    )[0]
    const latestLink = latest.url ?? `${TLDV_BASE}/meetings/${latest.id}`

    const updates: any = {}
    if (mc.tldv_link !== latestLink) updates.tldv_link = latestLink

    for (let i = 1; i <= 12; i++) {
      const d = mc[`call_${i}_date`]
      if (d) {
        const match = meetings.find((m) => m.happenedAt.split('T')[0] === d)
        if (match) {
          const link = match.url ?? `${TLDV_BASE}/meetings/${match.id}`
          if (mc[`call_${i}_link`] !== link) updates[`call_${i}_link`] = link
        }
      }
    }

    if (Object.keys(updates).length > 0) {
      await fetch(`${SUPABASE_URL}/rest/v1/meus_clientes?id=eq.${mc.id}`, {
        method: 'PATCH',
        headers: SUPABASE_HEADERS,
        body: JSON.stringify(updates),
      })
      count++
    }
  }

  console.log(`✅ Sincronização concluída: ${count} clientes atualizados.`)
  console.log(
    `🔍 Total de ${profileToMeetings.size} clientes vinculados a reuniões.`,
  )
}

main().catch(console.error)
