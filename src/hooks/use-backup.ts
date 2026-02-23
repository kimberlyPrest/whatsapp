import { useState, useCallback, useRef, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

const STORAGE_KEY = 'whatsapp_backup_state'

export function useBackup() {
  const { toast } = useToast()

  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return {
          isRunning: false,
          isPaused: parsed.current > 0 && parsed.current < parsed.total,
          isCompleted: parsed.current > 0 && parsed.current >= parsed.total,
          current: parsed.current || 0,
          total: parsed.total || 0,
          progress: parsed.progress || 0,
        }
      } catch (e) {
        // Ignore JSON parse error and fallback to default state
      }
    }
    return {
      isRunning: false,
      isPaused: false,
      isCompleted: false,
      current: 0,
      total: 0,
      progress: 0,
    }
  })

  const [logs, setLogs] = useState<string[]>([])
  const pauseRef = useRef(false)
  const totalProcessedRef = useRef(0)

  useEffect(() => {
    if (
      state.current > 0 &&
      !state.isCompleted &&
      (state.isRunning || state.isPaused)
    ) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          current: state.current,
          total: state.total,
          progress: state.progress,
        }),
      )
    } else if (state.isCompleted) {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [
    state.total,
    state.progress,
    state.isCompleted,
    state.isRunning,
    state.isPaused,
  ])

  const addLog = useCallback(
    (msg: string) =>
      setLogs((p) => [...p, `[${new Date().toLocaleTimeString()}] ${msg}`]),
    [],
  )

  const clearLogs = useCallback(() => {
    setLogs([])
  }, [])

  const togglePause = useCallback(() => {
    if (state.isRunning) {
      pauseRef.current = true
      setState((s) => ({ ...s, isRunning: false, isPaused: true }))
      addLog(
        'Sinal de pausa enviado. O backup será pausado após a iteração atual.',
      )
    } else if (state.isPaused) {
      startBackup(true)
    }
  }, [state.isRunning, state.isPaused])

  const startBackup = async (resume = false) => {
    if (state.isRunning) return false

    let startPage = 1
    if (resume && state.current > 0) {
      startPage = state.current
    } else {
      setLogs([])
      totalProcessedRef.current = 0
      setState({
        isRunning: true,
        isPaused: false,
        isCompleted: false,
        current: 0,
        total: 0,
        progress: 0,
      })
      localStorage.removeItem(STORAGE_KEY)
    }

    setState((s) => ({
      ...s,
      isRunning: true,
      isPaused: false,
      isCompleted: false,
    }))
    pauseRef.current = false

    addLog(
      resume
        ? `Retomando processo de backup da página ${startPage}...`
        : 'Iniciando processo de backup...',
    )

    try {
      let page = startPage
      let hasMore = true
      let totalPagesCount = state.total

      while (hasMore && !pauseRef.current) {
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

        if (!records.length) {
          hasMore = false
          break
        }

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
                updated_at: new Date().toISOString(),
              })
            }
          })

          try {
            const { error: convErr } = await supabase
              .from('conversations')
              .upsert(Array.from(convsMap.values()), {
                onConflict: 'remote_jid',
                ignoreDuplicates: false,
              })
            if (convErr) throw new Error(convErr.message)

            const { error: msgErr } = await supabase
              .from('messages')
              .upsert(messages, {
                onConflict: 'message_hash',
                ignoreDuplicates: true,
              })
            if (msgErr) throw new Error(msgErr.message)

            totalProcessedRef.current += messages.length
            addLog(
              `✅ Página ${page}: ${messages.length} mensagens processadas.`,
            )
          } catch (dbErr: any) {
            addLog(`❌ Página ${page}: ${dbErr.message}`)
            setState((s) => ({ ...s, isRunning: false }))
            return false
          }
        }

        const currentTotal =
          totalPagesCount > 0
            ? totalPagesCount
            : total > 0
              ? Math.ceil(total / 50)
              : page + 1

        const nextProgress = Math.min(
          100,
          Math.round((page / currentTotal) * 100),
        )

        setState((s) => ({
          ...s,
          current: page,
          total: totalPagesCount > 0 ? totalPagesCount : s.total,
          progress: nextProgress,
        }))

        if (
          records.length < 50 ||
          (totalPagesCount > 0 && page >= totalPagesCount)
        ) {
          hasMore = false
        } else {
          if (!pauseRef.current) {
            page++
            await new Promise((r) => setTimeout(r, 2000))
          }
        }
      }

      if (pauseRef.current) {
        addLog('Backup pausado com sucesso.')
        return true
      }

      setState((s) => ({
        ...s,
        progress: 100,
        isRunning: false,
        isCompleted: true,
        isPaused: false,
      }))
      addLog('Backup finalizado com sucesso!')
      toast({
        title: 'Sucesso',
        description: `Backup concluído! ${totalProcessedRef.current} mensagens verificadas/processadas.`,
      })
      return true
    } catch (err: any) {
      addLog(`Erro crítico: ${err.message}`)
      setState((s) => ({ ...s, isRunning: false }))
      return false
    }
  }

  return {
    isRunning: state.isRunning,
    isPaused: state.isPaused,
    isCompleted: state.isCompleted,
    currentPage: state.current,
    totalPages: state.total,
    progress: state.progress,
    logs,
    startBackup,
    togglePause,
    clearLogs,
  }
}
