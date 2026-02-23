import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'

export function useBackup() {
  const [state, setState] = useState({
    isRunning: false,
    current: 0,
    total: 0,
    progress: 0,
  })
  const [logs, setLogs] = useState<string[]>([])

  const addLog = useCallback(
    (msg: string) =>
      setLogs((p) => [...p, `[${new Date().toLocaleTimeString()}] ${msg}`]),
    [],
  )

  const startBackup = async () => {
    if (state.isRunning) return false
    setState({ isRunning: true, current: 0, total: 0, progress: 0 })
    setLogs([])
    addLog('Iniciando processo de backup...')

    try {
      let page = 1
      let hasMore = true
      let totalPagesCount = 0

      while (hasMore) {
        addLog(`Buscando página ${page}...`)
        const { data, error } = await supabase.functions.invoke(
          'evolution-backup',
          { body: { page, limit: 50 } },
        )
        if (error) throw new Error(error.message)

        const records: any[] = Array.isArray(data)
          ? data
          : data?.records || data?.messages?.records || data?.data || []
        const total = data?.count || data?.messages?.count || data?.total || 0

        if (total > 0 && totalPagesCount === 0) {
          totalPagesCount = Math.ceil(total / 50)
          setState((s) => ({ ...s, total: totalPagesCount }))
        }

        if (!records.length) break

        const valid = records.filter((m) => {
          const jid = m?.key?.remoteJid || m?.remoteJid || ''
          return !jid.includes('@g.us') && jid !== 'status@broadcast'
        })
        addLog(
          `Página ${page}: ${records.length} recebidas, ${valid.length} válidas.`,
        )

        if (valid.length > 0) {
          const messages = valid.map((msg) => {
            const jid = msg?.key?.remoteJid || msg?.remoteJid || ''
            const type =
              msg?.messageType ||
              (msg?.message ? Object.keys(msg.message)[0] : 'conversation')
            const text =
              msg?.message?.conversation ||
              msg?.message?.extendedTextMessage?.text ||
              msg?.text ||
              ''
            const ts = msg?.messageTimestamp

            return {
              phone_number: jid
                .replace('@s.whatsapp.net', '')
                .replace('@c.us', ''),
              remote_jid: jid,
              sender: (msg?.key?.fromMe ?? msg?.fromMe) ? 'me' : 'client',
              message_text: text,
              message_type: type,
              is_audio: type.toLowerCase().includes('audio'),
              created_at: new Date(
                typeof ts === 'number' && ts < 1e10
                  ? ts * 1000
                  : ts || Date.now(),
              ).toISOString(),
              message_hash: `wa_id_${msg?.key?.id || msg?.id}`,
            }
          })

          const convsMap = new Map()
          messages.forEach((m) => {
            const ex = convsMap.get(m.phone_number)
            if (!ex || new Date(m.created_at) > new Date(ex.last_message_at)) {
              convsMap.set(m.phone_number, {
                phone_number: m.phone_number,
                remote_jid: m.remote_jid,
                last_message_text: m.message_text,
                last_message_at: m.created_at,
                last_sender: m.sender,
              })
            }
          })

          await supabase
            .from('conversations')
            .upsert(Array.from(convsMap.values()), {
              onConflict: 'phone_number',
            })
          const { error: insErr } = await supabase
            .from('messages')
            .upsert(messages, {
              onConflict: 'message_hash',
              ignoreDuplicates: true,
            })
          if (insErr) addLog(`Erro ao salvar mensagens: ${insErr.message}`)
        }

        const currentTotal =
          totalPagesCount > 0
            ? totalPagesCount
            : total > 0
              ? Math.ceil(total / 50)
              : page + 1
        setState((s) => ({
          ...s,
          current: page,
          progress: Math.min(100, Math.round((page / currentTotal) * 100)),
        }))

        if (
          records.length < 50 ||
          (totalPagesCount > 0 && page >= totalPagesCount)
        ) {
          hasMore = false
        } else {
          page++
          await new Promise((r) => setTimeout(r, 2000))
        }
      }

      setState((s) => ({ ...s, progress: 100 }))
      addLog('Backup finalizado com sucesso!')
      return true
    } catch (err: any) {
      addLog(`Erro crítico: ${err.message}`)
      return false
    } finally {
      setState((s) => ({ ...s, isRunning: false }))
    }
  }

  return {
    isRunning: state.isRunning,
    currentPage: state.current,
    totalPages: state.total,
    progress: state.progress,
    logs,
    startBackup,
  }
}
