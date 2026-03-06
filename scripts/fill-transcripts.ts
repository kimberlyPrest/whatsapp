/**
 * fill-transcripts.ts
 *
 * Busca transcrições e resumos no TL.DV para todas as reuniões
 * que já estão salvas em tldv_meetings mas sem transcript/summary.
 *
 * Uso:
 *   export SUPABASE_SERVICE_ROLE_KEY="eyJ..."
 *   export TLDV_API_KEY="sua_key"
 *   npx tsx scripts/fill-transcripts.ts
 */

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://lasmxppjkfpypotnweyj.supabase.co'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const TLDV_KEY = process.env.TLDV_API_KEY || ''
const TLDV_BASE = 'https://pasta.tldv.io/v1alpha1'

const SUPABASE_HEADERS = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
}

const TLDV_HEADERS = {
    'x-api-key': TLDV_KEY,
    'Content-Type': 'application/json',
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function flattenTranscript(data: any): string {
    if (!data) return ''
    if (typeof data === 'string') return data

    // Tenta diferentes formatos
    for (const key of ['data', 'transcript', 'entries', 'segments', 'results']) {
        const arr = data[key]
        if (Array.isArray(arr)) {
            const lines = arr.map((entry: any) => {
                const speaker = entry.speaker ?? entry.speakerName ?? ''
                const text = entry.text ?? entry.content ?? ''
                return speaker ? `${speaker}: ${text.trim()}` : text.trim()
            }).filter(Boolean)
            if (lines.length > 0) return lines.join('\n')
        }
    }

    // Tenta texto plano
    for (const key of ['text', 'content', 'body']) {
        if (data[key]) return String(data[key])
    }

    return ''
}

function flattenHighlights(data: any): string {
    if (!data) return ''
    const items: any[] = data.highlights ?? data.notes ?? data.topics ?? []
    return items
        .map((h: any) => h.summary ?? h.text ?? h.content ?? '')
        .filter(Boolean)
        .join('\n\n')
}

function extractMeetingId(tldvLink: string): string | null {
    // https://tldv.io/app/meetings/69a9e0b50bda070014023f9e
    const match = tldvLink.match(/meetings\/([a-f0-9]+)/)
    return match ? match[1] : null
}

async function main() {
    if (!SUPABASE_KEY || !TLDV_KEY) {
        console.error('❌ Chaves não configuradas.')
        process.exit(1)
    }

    // 1. Busca reuniões sem transcrição
    console.log('📦 Buscando reuniões sem transcrição no banco...')
    const res = await fetch(
        `${SUPABASE_URL}/rest/v1/tldv_meetings?select=id,tldv_link,meeting_title&or=(transcript.is.null,transcript.eq.)`,
        { headers: SUPABASE_HEADERS }
    )
    const meetings: any[] = await res.json()
    console.log(`   ${meetings.length} reuniões precisam de transcrição.\n`)

    if (meetings.length === 0) {
        console.log('✅ Todas as reuniões já têm transcrição!')
        return
    }

    let filled = 0
    let noTranscript = 0
    let errors = 0

    for (let i = 0; i < meetings.length; i++) {
        const m = meetings[i]
        const meetingId = extractMeetingId(m.tldv_link)
        if (!meetingId) {
            errors++
            continue
        }

        process.stdout.write(`   [${i + 1}/${meetings.length}] "${m.meeting_title ?? 'Sem título'}"... `)

        let transcript = ''
        let summary = ''

        try {
            // Busca transcrição
            const tRes = await fetch(`${TLDV_BASE}/meetings/${meetingId}/transcript`, { headers: TLDV_HEADERS })
            if (tRes.ok) {
                const tData = await tRes.json()
                transcript = flattenTranscript(tData)
            }

            await sleep(150)

            // Busca highlights/summary
            const hRes = await fetch(`${TLDV_BASE}/meetings/${meetingId}/highlights`, { headers: TLDV_HEADERS })
            if (hRes.ok) {
                const hData = await hRes.json()
                summary = flattenHighlights(hData)
            }
        } catch (err: any) {
            process.stdout.write(`❌ ${err.message}\n`)
            errors++
            await sleep(300)
            continue
        }

        if (!transcript && !summary) {
            process.stdout.write('⏭ sem dados\n')
            noTranscript++
            await sleep(150)
            continue
        }

        // Salva no banco
        const updates: any = {}
        if (transcript) updates.transcript = transcript
        if (summary) updates.summary = summary

        const patchRes = await fetch(
            `${SUPABASE_URL}/rest/v1/tldv_meetings?id=eq.${m.id}`,
            {
                method: 'PATCH',
                headers: SUPABASE_HEADERS,
                body: JSON.stringify(updates),
            }
        )

        if (patchRes.ok) {
            filled++
            process.stdout.write('✓\n')
        } else {
            process.stdout.write(`❌ DB error\n`)
            errors++
        }

        // Rate limit
        await sleep(250)
    }

    console.log(`\n📦 Resultado:`)
    console.log(`   ✅ Transcrições preenchidas: ${filled}`)
    console.log(`   ⏭  Sem transcrição disponível: ${noTranscript}`)
    if (errors > 0) console.log(`   ❌ Erros: ${errors}`)
}

main().catch((err) => {
    console.error('Erro fatal:', err.message)
    process.exit(1)
})
