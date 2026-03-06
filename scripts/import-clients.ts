/**
 * import-clients.ts
 *
 * Importa dados da planilha para client_profiles e meus_clientes.
 *
 * Planilha esperada (colunas):
 *   Nome do negócio | Tipo | Telefone | Email | Etapa do negócio |
 *   Data 1ª Call    | Data 2ª Call | CSAT 1 | Comentário CSAT 1 | Comentário CSAT 2
 *
 * Lógica:
 *   1. Baixa a planilha CSV
 *   2. Para cada linha, normaliza o telefone (com/sem 9 após DDD)
 *   3. Faz upsert em client_profiles: nome, email, tipo, propriedade=true
 *   4. Faz upsert em meus_clientes: etapa, call dates, CSAT
 *
 * Uso:
 *   export SUPABASE_SERVICE_ROLE_KEY="eyJ..."
 *   npx tsx scripts/import-clients.ts
 */

// ─── Config ────────────────────────────────────────────────────────────────

const SHEET_ID = '1ZX67cFUdolKqWwmgXPnJ6QsYhQXHyELn8aylp0rIXGw'
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`

const SUPABASE_URL =
  process.env.VITE_SUPABASE_URL || 'https://lasmxppjkfpypotnweyj.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const HEADERS = {
  'Content-Type': 'application/json',
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
}

// ─── Normalização de telefone ──────────────────────────────────────────────

function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '')
  if (!digits || digits.length < 7) return null

  // 13 dígitos: 55 + DDD(2) + 9 + número(8) — completo
  if (digits.length === 13 && digits.startsWith('55')) return digits

  // 12 dígitos: 55 + DDD(2) + número(8) — falta o 9 após DDD
  if (digits.length === 12 && digits.startsWith('55'))
    return `55${digits.slice(2, 4)}9${digits.slice(4)}`

  // 11 dígitos: DDD(2) + 9 + número(8)
  if (digits.length === 11 && !digits.startsWith('0')) return `55${digits}`

  // 10 dígitos: DDD(2) + número(8)
  if (digits.length === 10 && !digits.startsWith('0'))
    return `55${digits.slice(0, 2)}9${digits.slice(2)}`

  if (digits.length >= 7 && digits.length <= 15) return digits
  return null
}

/** Alternativa BR: com/sem o 9 após DDD */
function brAlternate(phone: string): string | null {
  if (phone.length === 13 && phone.startsWith('55') && phone[4] === '9') {
    return `55${phone.slice(2, 4)}${phone.slice(5)}`
  }
  if (phone.length === 12 && phone.startsWith('55')) {
    return `55${phone.slice(2, 4)}9${phone.slice(4)}`
  }
  return null
}

// ─── CSV Parser ────────────────────────────────────────────────────────────

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

/** Converte "2025-10-29" ou "29/10/2025" para "YYYY-MM-DD" ou null */
function parseDate(raw: string): string | null {
  if (!raw?.trim()) return null
  const s = raw.trim()
  // ISO: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  // BR: DD/MM/YYYY
  const br = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (br) return `${br[3]}-${br[2].padStart(2, '0')}-${br[1].padStart(2, '0')}`
  return null
}

// ─── Supabase helpers ──────────────────────────────────────────────────────

async function upsertBatch(table: string, rows: object[], onConflict: string) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}?on_conflict=${onConflict}`,
    {
      method: 'POST',
      headers: {
        ...HEADERS,
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify(rows),
    },
  )
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Erro ao upsert em ${table}: ${body}`)
  }
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  if (!SUPABASE_KEY) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY não definido.')
    process.exit(1)
  }

  // ── 1. Baixa a planilha ────────────────────────────────────────────────────
  console.log('⬇  Baixando planilha...')
  const sheetRes = await fetch(SHEET_CSV_URL)
  if (!sheetRes.ok)
    throw new Error(`Erro ao buscar planilha: ${sheetRes.status}`)

  const csv = await sheetRes.text()
  const lines = csv.split('\n').filter((l) => l.trim())
  const [headerLine, ...dataLines] = lines
  const headers = parseCSVLine(headerLine).map((h) => h.toLowerCase())

  // Detecta colunas dinamicamente
  const idx = {
    nome: headers.findIndex((h) => h.includes('nome')),
    tipo: headers.findIndex((h) => h === 'tipo' || h.includes('tipo')),
    tel: headers.findIndex(
      (h) => h.includes('telefone') || h.includes('phone'),
    ),
    email: headers.findIndex((h) => h.includes('email')),
    etapa: headers.findIndex((h) => h.includes('etapa')),
    call1: headers.findIndex(
      (h) =>
        (h.includes('1') && h.includes('call')) ||
        h.includes('1ª call') ||
        h.includes('data 1'),
    ),
    call2: headers.findIndex(
      (h) =>
        (h.includes('2') && h.includes('call')) ||
        h.includes('2ª call') ||
        h.includes('data 2'),
    ),
    csat1: headers.findIndex(
      (h) =>
        h.includes('avalia') ||
        h.includes('satisfaç') ||
        h.includes('nota') ||
        (h.includes('csat') && !h.includes('coment')),
    ),
    csatCom1: headers.findIndex(
      (h) =>
        h.includes('comentário') && (h.includes('primeir') || h.includes('1')),
    ),
    csatCom2: headers.findIndex(
      (h) =>
        h.includes('comentário') && (h.includes('segund') || h.includes('2')),
    ),
  }

  console.log(`   ${dataLines.length} linhas na planilha`)
  console.log(
    `   Índices: nome[${idx.nome}] tipo[${idx.tipo}] tel[${idx.tel}] email[${idx.email}] etapa[${idx.etapa}]`,
  )
  console.log(
    `   call1[${idx.call1}] call2[${idx.call2}] csat1[${idx.csat1}] csatCom1[${idx.csatCom1}] csatCom2[${idx.csatCom2}]`,
  )

  // ── 2. Processa linhas ────────────────────────────────────────────────────
  type SheetRow = {
    phones: string[]
    profileData: object
    csData: object
  }

  const rows: SheetRow[] = []
  const now = new Date().toISOString()
  let skipped = 0

  for (const line of dataLines) {
    const cols = parseCSVLine(line)
    const rawPhone = cols[idx.tel] ?? ''
    const phone = normalizePhone(rawPhone)
    if (!phone) {
      skipped++
      continue
    }

    const nome = cols[idx.nome]?.trim() || null
    const tipo = cols[idx.tipo]?.trim() || null
    const email = idx.email >= 0 ? cols[idx.email]?.trim() || null : null
    const etapa = idx.etapa >= 0 ? cols[idx.etapa]?.trim() || null : null
    const call1 = idx.call1 >= 0 ? parseDate(cols[idx.call1]) : null
    const call2 = idx.call2 >= 0 ? parseDate(cols[idx.call2]) : null
    const csatRaw = idx.csat1 >= 0 ? cols[idx.csat1]?.trim() : null
    const csat1 = csatRaw ? parseFloat(csatRaw) : null
    const csatC1 = idx.csatCom1 >= 0 ? cols[idx.csatCom1]?.trim() || null : null
    const csatC2 = idx.csatCom2 >= 0 ? cols[idx.csatCom2]?.trim() || null : null

    const phones = [phone]
    const alt = brAlternate(phone)
    if (alt) phones.push(alt)

    rows.push({
      phones,
      profileData: {
        contact_name: nome,
        email,
        tipos: tipo ? [tipo] : [],
        propriedade: true,
        updated_at: now,
      },
      csData: {
        etapa_negocio: etapa,
        call_1_date: call1,
        call_2_date: call2,
        csat_1: isNaN(csat1 as number) ? null : csat1,
        csat_comment_1: csatC1,
        csat_comment_2: csatC2,
        updated_at: now,
      },
    })
  }

  console.log(
    `\n   ✅ ${rows.length} entradas processadas (${skipped} sem telefone ignoradas)\n`,
  )

  // ── 3. Upsert client_profiles ──────────────────────────────────────────────
  // Upserta ambas as variações de telefone (com/sem 9) para garantir o match
  console.log('🚀 Upserting client_profiles...')
  const BATCH = 50
  const profileRows = rows.flatMap(({ phones, profileData }) =>
    phones.map((p) => ({ phone_number: p, ...profileData })),
  )
  let profOk = 0,
    profErr = 0

  for (let i = 0; i < profileRows.length; i += BATCH) {
    const batch = profileRows.slice(i, i + BATCH)
    try {
      await upsertBatch('client_profiles', batch, 'phone_number')
      profOk += batch.length
      process.stdout.write(
        `   Lote ${Math.floor(i / BATCH) + 1}/${Math.ceil(profileRows.length / BATCH)} ✓\r`,
      )
    } catch (e: any) {
      console.error(
        `\n   ❌ Erro lote ${Math.floor(i / BATCH) + 1}: ${e.message}`,
      )
      profErr += batch.length
    }
  }
  console.log(`\n   ✅ client_profiles: ${profOk} ok, ${profErr} erros\n`)

  // ── 4. Busca os IDs gerados em client_profiles ─────────────────────────────
  // meus_clientes referencia client_profiles.id (UUID), não phone_number
  console.log('🔍 Buscando IDs de client_profiles...')
  const allPhones = rows.flatMap((r) => r.phones)
  const phoneChunks: string[][] = []
  for (let i = 0; i < allPhones.length; i += 100)
    phoneChunks.push(allPhones.slice(i, i + 100))

  const phoneToId = new Map<string, string>()
  for (const chunk of phoneChunks) {
    const filter = chunk.map((p) => encodeURIComponent(p)).join(',')
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/client_profiles?phone_number=in.(${filter})&select=id,phone_number`,
      { headers: HEADERS },
    )
    if (!res.ok) throw new Error(`Erro ao buscar IDs: ${await res.text()}`)
    const records: { id: string; phone_number: string }[] = await res.json()
    for (const r of records) phoneToId.set(r.phone_number, r.id)
  }
  console.log(`   ${phoneToId.size} IDs recuperados\n`)

  // ── 5. Upsert meus_clientes usando client_id (UUID) ────────────────────────
  console.log('🚀 Upserting meus_clientes...')

  // Para cada entrada da planilha, pega o primeiro phone que tem ID conhecido.
  // Usa Map para deduplicar por client_id — planilha pode ter telefones duplicados
  // que apontam para o mesmo registro, causando erro 21000 no upsert.
  const csRowsMap = new Map<string, object>()
  for (const { phones, csData } of rows) {
    const clientId = phones.map((p) => phoneToId.get(p)).find(Boolean)
    if (!clientId) continue
    csRowsMap.set(clientId, { client_id: clientId, ...csData })
  }
  const csRows = Array.from(csRowsMap.values())

  let csOk = 0,
    csErr = 0
  for (let i = 0; i < csRows.length; i += BATCH) {
    const batch = csRows.slice(i, i + BATCH)
    try {
      await upsertBatch('meus_clientes', batch, 'client_id')
      csOk += batch.length
      process.stdout.write(
        `   Lote ${Math.floor(i / BATCH) + 1}/${Math.ceil(csRows.length / BATCH)} ✓\r`,
      )
    } catch (e: any) {
      console.error(
        `\n   ❌ Erro lote ${Math.floor(i / BATCH) + 1}: ${e.message}`,
      )
      csErr += batch.length
    }
  }
  console.log(`\n   ✅ meus_clientes: ${csOk} ok, ${csErr} erros\n`)

  console.log('📦 Importação concluída.')
}

main().catch((err) => {
  console.error('Erro fatal:', err)
  process.exit(1)
})
