/**
 * clean-client-profiles.ts
 *
 * Limpa a tabela client_profiles:
 *   1. Remove sufixos JID (@s.whatsapp.net, @c.us) de phone_number
 *   2. Resolve duplicatas causadas pela limpeza (mantém o registro mais completo)
 *
 * NÃO deleta contatos do WhatsApp que não estão na planilha.
 * Regra: client_profiles = todos que conversaram (WhatsApp + planilha)
 *        meus_clientes   = só clientes da planilha (gerenciado pelo import-clients.ts)
 *
 * Uso:
 *   export SUPABASE_SERVICE_ROLE_KEY="eyJ..."
 *   npx tsx scripts/clean-client-profiles.ts            # dry-run
 *   npx tsx scripts/clean-client-profiles.ts --execute  # executa
 */

const DRY_RUN = !process.argv.includes('--execute')

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://lasmxppjkfpypotnweyj.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

const HEADERS = {
  'Content-Type': 'application/json',
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
}

// ─── Normalização ─────────────────────────────────────────────────────────────

function stripJid(raw: string): string {
  return raw.split('@')[0]
}

function normalizePhone(raw: string): string | null {
  const digits = stripJid(raw).replace(/\D/g, '')
  if (!digits || digits.length < 7) return null

  if (digits.length === 13 && digits.startsWith('55')) return digits
  if (digits.length === 12 && digits.startsWith('55'))
    return `55${digits.slice(2, 4)}9${digits.slice(4)}`
  if (digits.length === 11 && !digits.startsWith('0') && !digits.startsWith('55'))
    return `55${digits}`
  if (digits.length === 10 && !digits.startsWith('0') && !digits.startsWith('55'))
    return `55${digits.slice(0, 2)}9${digits.slice(2)}`
  if (digits.length >= 7 && digits.length <= 15) return digits
  return null
}

// ─── Supabase helpers ─────────────────────────────────────────────────────────

async function fetchAll<T>(path: string): Promise<T[]> {
  const results: T[] = []
  let offset = 0
  while (true) {
    const sep = path.includes('?') ? '&' : '?'
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}${sep}limit=1000&offset=${offset}`, {
      headers: HEADERS,
    })
    if (!res.ok) throw new Error(`Erro GET ${path}: ${await res.text()}`)
    const data: T[] = await res.json()
    results.push(...data)
    if (data.length < 1000) break
    offset += 1000
  }
  return results
}

async function apiPatch(path: string, body: object) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'PATCH',
    headers: { ...HEADERS, Prefer: 'return=minimal' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Erro PATCH ${path}: ${await res.text()}`)
}

async function apiDelete(path: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: 'DELETE',
    headers: { ...HEADERS, Prefer: 'return=minimal' },
  })
  if (!res.ok) throw new Error(`Erro DELETE ${path}: ${await res.text()}`)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  if (!SUPABASE_KEY) { console.error('❌ SUPABASE_SERVICE_ROLE_KEY não definido'); process.exit(1) }

  console.log(DRY_RUN ? '\n🔍 DRY-RUN (nenhuma alteração será feita)\n' : '\n🚀 MODO EXECUÇÃO\n')

  // ── 1. Busca todos os client_profiles ──────────────────────────────────────

  console.log('📥 Buscando client_profiles...')
  type Profile = {
    id: string
    phone_number: string
    contact_name: string | null
    email: string | null
    tipos: string[] | null
    tags: string[] | null
    observations: string | null
  }
  const profiles = await fetchAll<Profile>(
    'client_profiles?select=id,phone_number,contact_name,email,tipos,tags,observations',
  )
  console.log(`   ${profiles.length} registros encontrados\n`)

  // ── 2. Classifica registros ────────────────────────────────────────────────

  // Mapa canonical phone → perfil que vamos manter
  const canonical = new Map<string, Profile>()

  const toFix: { id: string; oldPhone: string; newPhone: string }[] = []
  const toDrop: Profile[] = [] // duplicatas que serão deletadas

  // Pontuação para decidir qual registro manter quando há duplicata
  function score(p: Profile): number {
    return (p.contact_name ? 2 : 0) + (p.email ? 2 : 0) + (p.tipos?.length ?? 0) + (p.tags?.length ?? 0)
  }

  for (const p of profiles) {
    const isJid = p.phone_number.includes('@')
    const clean = normalizePhone(p.phone_number)

    if (!clean) {
      // Número que não conseguimos normalizar — manter sem alterar
      continue
    }

    const existing = canonical.get(clean)

    if (!existing) {
      // Primeiro registro com esse número canônico
      canonical.set(clean, p)
      if (isJid) {
        toFix.push({ id: p.id, oldPhone: p.phone_number, newPhone: clean })
      }
    } else {
      // Duplicata — comparar qual tem mais dados
      if (score(p) > score(existing)) {
        // O atual (p) é mais completo: vira o keeper, o existing vai para drop
        toDrop.push(existing)
        canonical.set(clean, p)
        // Remove qualquer fix pendente do existing
        const fixIdx = toFix.findIndex((f) => f.id === existing.id)
        if (fixIdx >= 0) toFix.splice(fixIdx, 1)
        if (isJid) {
          toFix.push({ id: p.id, oldPhone: p.phone_number, newPhone: clean })
        }
      } else {
        // O existente é melhor ou igual: descarta o atual (p)
        toDrop.push(p)
      }
    }
  }

  // ── 3. Relatório ───────────────────────────────────────────────────────────

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`📊 RELATÓRIO ${DRY_RUN ? '(simulação)' : '(execução)'}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`✏️  Limpar JID (phone_number):      ${toFix.length}`)
  console.log(`🗑️  Deletar duplicatas:             ${toDrop.length}`)
  console.log(`✅  Manter sem alteração:           ${profiles.length - toFix.length - toDrop.length}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`   Total final esperado: ${profiles.length - toDrop.length}`)

  if (toFix.length) {
    console.log('\n✏️  JIDs a limpar (primeiros 20):')
    toFix.slice(0, 20).forEach((f) =>
      console.log(`   ${f.oldPhone.padEnd(45)}→ ${f.newPhone}`),
    )
    if (toFix.length > 20) console.log(`   ... e mais ${toFix.length - 20}`)
  }

  if (toDrop.length) {
    console.log('\n🗑️  Duplicatas a deletar:')
    toDrop.forEach((p) =>
      console.log(`   ${p.phone_number.padEnd(35)} (${p.contact_name ?? 'sem nome'})`),
    )
  }

  if (DRY_RUN) {
    console.log('\n⚠️  Nenhuma alteração feita. Para executar:\n')
    console.log('   npx tsx scripts/clean-client-profiles.ts --execute\n')
    console.log('💡 Depois rode o import-clients.ts para sincronizar a planilha com meus_clientes.\n')
    return
  }

  // ── 4. Executa ────────────────────────────────────────────────────────────

  if (toFix.length) {
    console.log(`\n✏️  Limpando ${toFix.length} JIDs...`)
    for (const { id, newPhone } of toFix) {
      await apiPatch(`client_profiles?id=eq.${id}`, { phone_number: newPhone })
    }
    console.log('   ✅ JIDs limpos')
  }

  if (toDrop.length) {
    console.log(`\n🗑️  Deletando ${toDrop.length} duplicatas...`)
    const BATCH = 100
    for (let i = 0; i < toDrop.length; i += BATCH) {
      const chunk = toDrop.slice(i, i + BATCH)
      const inClause = `(${chunk.map((p) => `"${p.id}"`).join(',')})`
      await apiDelete(`meus_clientes?client_id=in.${inClause}`)
      await apiDelete(`client_profiles?id=in.${inClause}`)
      process.stdout.write(`   Lote ${Math.floor(i / BATCH) + 1}/${Math.ceil(toDrop.length / BATCH)} ✓\r`)
    }
    console.log('\n   ✅ Duplicatas removidas')
  }

  console.log('\n🎉 Limpeza concluída!')
  console.log('💡 Agora rode: npx tsx scripts/import-clients.ts\n')
}

main().catch((err) => {
  console.error('Erro fatal:', err)
  process.exit(1)
})
