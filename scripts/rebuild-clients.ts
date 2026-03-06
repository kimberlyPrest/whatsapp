/**
 * rebuild-clients.ts
 *
 * Reorganiza client_profiles e meus_clientes em 4 etapas:
 *   1. Insere números do WhatsApp faltantes em client_profiles
 *   2. Aplica dados da Planilha 1 (atualização apenas)
 *   3. Aplica dados da Planilha 2 (prioridade + criação)
 *   4. Reseta propriedade e recria meus_clientes
 *
 * Uso:
 *   export SUPABASE_SERVICE_ROLE_KEY="eyJ..."
 *   npx tsx scripts/rebuild-clients.ts
 */

const SUPABASE_URL = 'https://lasmxppjkfpypotnweyj.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const SHEET1_ID = '1LtxdAbE0e4AEmP16dlcO4Lf0Rq6uoRV_r_zp5cTtl7c'
const SHEET2_ID = '1ZX67cFUdolKqWwmgXPnJ6QsYhQXHyELn8aylp0rIXGw'

const HEADERS = {
  'Content-Type': 'application/json',
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
}

// ─── Helpers ───────────────────────────────────────────────────────────────

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

function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, '')
  if (!digits || digits.length < 7) return null
  if (digits.length === 13 && digits.startsWith('55')) return digits
  if (digits.length === 12 && digits.startsWith('55'))
    return `55${digits.slice(2, 4)}9${digits.slice(4)}`
  if (digits.length === 11 && !digits.startsWith('0')) return `55${digits}`
  if (digits.length === 10 && !digits.startsWith('0'))
    return `55${digits.slice(0, 2)}9${digits.slice(2)}`
  if (digits.length >= 7 && digits.length <= 15) return digits
  return null
}

/** Gera a variante BR: com/sem o 9 após DDD */
function brAlternate(phone: string): string | null {
  if (phone.length === 13 && phone.startsWith('55') && phone[4] === '9')
    return `55${phone.slice(2, 4)}${phone.slice(5)}`
  if (phone.length === 12 && phone.startsWith('55'))
    return `55${phone.slice(2, 4)}9${phone.slice(4)}`
  return null
}

function parseDate(raw: string): string | null {
  if (!raw?.trim()) return null
  const s = raw.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  const br = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (br) return `${br[3]}-${br[2].padStart(2, '0')}-${br[1].padStart(2, '0')}`
  return null
}

async function fetchCSV(sheetId: string): Promise<string[][]> {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`
  const res = await fetch(url)
  if (!res.ok)
    throw new Error(`Erro ao buscar planilha ${sheetId}: ${res.status}`)
  const text = await res.text()
  const lines = text.split('\n').filter((l) => l.trim())
  return lines.map((l) => parseCSVLine(l))
}

async function supabaseGet(path: string): Promise<any[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: HEADERS,
  })
  if (!res.ok) throw new Error(`GET ${path}: ${await res.text()}`)
  return res.json()
}

async function supabasePost(
  path: string,
  body: any,
  prefer = 'resolution=merge-duplicates,return=minimal',
) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'POST',
    headers: { ...HEADERS, Prefer: prefer },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`POST ${path}: ${err}`)
  }
}

async function supabasePatch(path: string, body: any) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'PATCH',
    headers: HEADERS,
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`PATCH ${path}: ${await res.text()}`)
}

async function supabaseDelete(path: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'DELETE',
    headers: HEADERS,
  })
  if (!res.ok) throw new Error(`DELETE ${path}: ${await res.text()}`)
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  if (!SUPABASE_KEY) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY não definido.')
    process.exit(1)
  }

  const now = new Date().toISOString()

  // Carrega números existentes em client_profiles (com variantes)
  console.log('📦 Carregando client_profiles existentes...')
  const existingProfiles: { phone_number: string; id: string }[] =
    await supabaseGet('client_profiles?select=phone_number,id')
  const phoneSet = new Set(existingProfiles.map((p) => p.phone_number))

  // Função para achar o número no banco (tenta original + variante)
  function findInDb(phone: string): string | null {
    if (phoneSet.has(phone)) return phone
    const alt = brAlternate(phone)
    if (alt && phoneSet.has(alt)) return alt
    return null
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ETAPA 1: Inserir números do WhatsApp faltantes
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n═══ ETAPA 1: Inserindo números do WhatsApp faltantes ═══')

  const conversations: { phone_number: string }[] = await supabaseGet(
    'conversations?select=phone_number&phone_number=not.like.*JWL*',
  )

  const toInsert: {
    phone_number: string
    propriedade: boolean
    created_at: string
  }[] = []
  for (const c of conversations) {
    if (!findInDb(c.phone_number)) {
      toInsert.push({
        phone_number: c.phone_number,
        propriedade: false,
        created_at: now,
      })
      phoneSet.add(c.phone_number) // Adiciona ao set para não duplicar
    }
  }

  if (toInsert.length > 0) {
    const BATCH = 100
    for (let i = 0; i < toInsert.length; i += BATCH) {
      const batch = toInsert.slice(i, i + BATCH)
      try {
        await supabasePost('client_profiles?on_conflict=phone_number', batch)
      } catch (e: any) {
        // Tenta um por um se o batch falhar
        for (const item of batch) {
          try {
            await supabasePost('client_profiles?on_conflict=phone_number', item)
          } catch {}
        }
      }
    }
  }

  console.log(`   ✅ ${toInsert.length} números inseridos.`)

  // Recarrega profiles
  const allProfiles: { phone_number: string; id: string }[] = await supabaseGet(
    'client_profiles?select=phone_number,id',
  )
  const phoneToId = new Map(allProfiles.map((p) => [p.phone_number, p.id]))
  const phoneSetFresh = new Set(allProfiles.map((p) => p.phone_number))

  function findPhone(phone: string): string | null {
    if (phoneSetFresh.has(phone)) return phone
    const alt = brAlternate(phone)
    if (alt && phoneSetFresh.has(alt)) return alt
    return null
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ETAPA 2: Aplicar dados da Planilha 1
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n═══ ETAPA 2: Aplicando dados da Planilha 1 ═══')

  const sheet1 = await fetchCSV(SHEET1_ID)
  const [h1, ...rows1] = sheet1

  // Detecta colunas
  const h1l = h1.map((h) => h.toLowerCase())
  const s1idx = {
    nome: h1l.findIndex((h) => h.includes('nome')),
    tipo: h1l.findIndex((h) => h === 'tipo' || h.includes('tipo')),
    tel: h1l.findIndex((h) => h.includes('telefone') || h.includes('phone')),
    email: h1l.findIndex((h) => h.includes('email')),
  }

  let s1Updated = 0,
    s1Skipped = 0

  for (const cols of rows1) {
    const rawPhone = cols[s1idx.tel] ?? ''
    const phone = normalizePhone(rawPhone)
    if (!phone) {
      s1Skipped++
      continue
    }

    const dbPhone = findPhone(phone)
    if (!dbPhone) {
      s1Skipped++
      continue
    } // Não existe no banco, ignora

    const nome = cols[s1idx.nome]?.trim() || null
    const email = cols[s1idx.email]?.trim() || null
    const tipo = cols[s1idx.tipo]?.trim() || null

    // Valida email
    const validEmail =
      email &&
      email.includes('@') &&
      !email.toLowerCase().includes('não encontrado')
        ? email
        : null

    const updates: any = { updated_at: now }
    if (nome) updates.contact_name = nome
    if (validEmail) updates.email = validEmail
    if (tipo) updates.tipos = [tipo]

    try {
      await supabasePatch(
        `client_profiles?phone_number=eq.${encodeURIComponent(dbPhone)}`,
        updates,
      )
      s1Updated++
    } catch {
      // silently skip
    }
  }

  console.log(`   ✅ ${s1Updated} perfis atualizados pela Planilha 1.`)
  console.log(
    `   ⏭  ${s1Skipped} linhas ignoradas (sem telefone ou não existe no banco).`,
  )

  // ═══════════════════════════════════════════════════════════════════════════
  // ETAPA 3: Aplicar dados da Planilha 2 (prioridade + criação)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n═══ ETAPA 3: Aplicando dados da Planilha 2 (prioridade) ═══')

  const sheet2 = await fetchCSV(SHEET2_ID)
  const [h2, ...rows2] = sheet2

  const h2l = h2.map((h) => h.toLowerCase())
  const s2idx = {
    nome: h2l.findIndex((h) => h.includes('nome')),
    tipo: h2l.findIndex((h) => h === 'tipo' || h.includes('tipo')),
    tel: h2l.findIndex((h) => h.includes('telefone') || h.includes('phone')),
    email: h2l.findIndex((h) => h.includes('email')),
    etapa: h2l.findIndex((h) => h.includes('etapa')),
    call1: h2l.findIndex(
      (h) =>
        (h.includes('1') && h.includes('call')) ||
        h.includes('1ª call') ||
        h.includes('data 1'),
    ),
    call2: h2l.findIndex(
      (h) =>
        (h.includes('2') && h.includes('call')) ||
        h.includes('2ª call') ||
        h.includes('data 2'),
    ),
    csat1: h2l.findIndex(
      (h) =>
        h.includes('avalia') ||
        h.includes('satisfaç') ||
        h.includes('nota') ||
        (h.includes('csat') && !h.includes('coment')),
    ),
    csatCom1: h2l.findIndex(
      (h) =>
        h.includes('comentário') && (h.includes('primeir') || h.includes('1')),
    ),
    csatCom2: h2l.findIndex(
      (h) =>
        h.includes('comentário') && (h.includes('segund') || h.includes('2')),
    ),
  }

  const sheet2Phones = new Set<string>() // Números da planilha 2 para marcar propriedade
  const meusClientesData: any[] = [] // Dados para popular meus_clientes

  let s2Updated = 0,
    s2Created = 0

  for (const cols of rows2) {
    const rawPhone = cols[s2idx.tel] ?? ''
    const phone = normalizePhone(rawPhone)
    if (!phone) continue

    const nome = cols[s2idx.nome]?.trim() || null
    const tipo = cols[s2idx.tipo]?.trim() || null
    const email = cols[s2idx.email]?.trim() || null
    const etapa = s2idx.etapa >= 0 ? cols[s2idx.etapa]?.trim() || null : null
    const call1 = s2idx.call1 >= 0 ? parseDate(cols[s2idx.call1]) : null
    const call2 = s2idx.call2 >= 0 ? parseDate(cols[s2idx.call2]) : null
    const csatRaw = s2idx.csat1 >= 0 ? cols[s2idx.csat1]?.trim() : null
    const csat1 = csatRaw ? parseFloat(csatRaw) : null
    const csatC1 =
      s2idx.csatCom1 >= 0 ? cols[s2idx.csatCom1]?.trim() || null : null
    const csatC2 =
      s2idx.csatCom2 >= 0 ? cols[s2idx.csatCom2]?.trim() || null : null

    const validEmail =
      email &&
      email.includes('@') &&
      !email.toLowerCase().includes('não encontrado')
        ? email
        : null

    let dbPhone = findPhone(phone)

    if (dbPhone) {
      // Existe → atualiza (com prioridade sobre Planilha 1)
      const updates: any = { updated_at: now, propriedade: true }
      if (nome) updates.contact_name = nome
      if (validEmail) updates.email = validEmail
      if (tipo) updates.tipos = [tipo]

      await supabasePatch(
        `client_profiles?phone_number=eq.${encodeURIComponent(dbPhone)}`,
        updates,
      )
      sheet2Phones.add(dbPhone)
      s2Updated++
    } else {
      // Não existe → cria com o número normalizado
      const newProfile: any = {
        phone_number: phone,
        contact_name: nome,
        email: validEmail,
        tipos: tipo ? [tipo] : [],
        propriedade: true,
        created_at: now,
        updated_at: now,
      }
      try {
        await supabasePost(
          'client_profiles?on_conflict=phone_number',
          newProfile,
        )
        // Tenta também com a variante
        const alt = brAlternate(phone)
        if (alt) {
          try {
            await supabasePost('client_profiles?on_conflict=phone_number', {
              ...newProfile,
              phone_number: alt,
            })
          } catch {}
        }
        phoneSetFresh.add(phone)
        sheet2Phones.add(phone)
        s2Created++
      } catch (e: any) {
        console.error(`   ❌ Erro ao criar ${phone}: ${e.message}`)
      }
      dbPhone = phone
    }

    // Salva dados para meus_clientes
    meusClientesData.push({
      phone: dbPhone || phone,
      etapa,
      call1,
      call2,
      csat1: isNaN(csat1 as number) ? null : csat1,
      csatC1,
      csatC2,
    })
  }

  console.log(`   ✅ ${s2Updated} perfis atualizados pela Planilha 2.`)
  console.log(`   ✅ ${s2Created} perfis criados pela Planilha 2.`)

  // ═══════════════════════════════════════════════════════════════════════════
  // ETAPA 4: Resetar propriedade e recriar meus_clientes
  // ═══════════════════════════════════════════════════════════════════════════
  console.log(
    '\n═══ ETAPA 4: Resetando propriedade e recriando meus_clientes ═══',
  )

  // 4a. Seta propriedade = false em TODOS
  await supabasePatch('client_profiles?propriedade=eq.true', {
    propriedade: false,
    updated_at: now,
  })
  console.log('   Propriedade resetada para false em todos.')

  // 4b. Seta propriedade = true nos da Planilha 2
  for (const phone of sheet2Phones) {
    try {
      await supabasePatch(
        `client_profiles?phone_number=eq.${encodeURIComponent(phone)}`,
        { propriedade: true },
      )
    } catch {}
  }
  console.log(`   Propriedade = true marcada em ${sheet2Phones.size} perfis.`)

  // 4c. Limpa meus_clientes
  await supabaseDelete('meus_clientes?id=not.is.null')
  console.log('   Tabela meus_clientes limpa.')

  // 4d. Recarrega IDs atualizados
  const finalProfiles: { phone_number: string; id: string }[] =
    await supabaseGet(
      'client_profiles?select=phone_number,id&propriedade=eq.true',
    )
  const finalPhoneToId = new Map(
    finalProfiles.map((p) => [p.phone_number, p.id]),
  )

  // 4e. Insere todos em meus_clientes
  let mcInserted = 0
  for (const data of meusClientesData) {
    let clientId = finalPhoneToId.get(data.phone)
    if (!clientId) {
      const alt = brAlternate(data.phone)
      if (alt) clientId = finalPhoneToId.get(alt)
    }
    if (!clientId) continue

    const record: any = {
      client_id: clientId,
      etapa_negocio: data.etapa,
      call_1_date: data.call1,
      call_2_date: data.call2,
      csat_1: data.csat1,
      csat_comment_1: data.csatC1,
      csat_comment_2: data.csatC2,
      created_at: now,
      updated_at: now,
    }

    try {
      await supabasePost('meus_clientes?on_conflict=client_id', record)
      mcInserted++
    } catch (e: any) {
      // Pode dar duplicata se variante com/sem 9 coincidir apontar pro mesmo client_id
    }
  }

  console.log(`   ✅ ${mcInserted} registros criados em meus_clientes.`)

  // ═══════════════════════════════════════════════════════════════════════════
  // Resumo
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n═══ RESULTADO FINAL ═══')
  console.log(`   Etapa 1: ${toInsert.length} números do WhatsApp inseridos`)
  console.log(`   Etapa 2: ${s1Updated} perfis atualizados (Planilha 1)`)
  console.log(
    `   Etapa 3: ${s2Updated} atualizados + ${s2Created} criados (Planilha 2)`,
  )
  console.log(
    `   Etapa 4: ${sheet2Phones.size} com propriedade=true, ${mcInserted} em meus_clientes`,
  )
  console.log('\n✅ Reorganização concluída!')
}

main().catch((err) => {
  console.error('Erro fatal:', err.message)
  process.exit(1)
})
