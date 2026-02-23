import { useState, useRef, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Play, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

type BackupStatus = 'idle' | 'running' | 'completed' | 'error'

export default function SettingsPage() {
  const [status, setStatus] = useState<BackupStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [logs, setLogs] = useState<
    { time: string; message: string; type: 'info' | 'success' | 'error' }[]
  >([])
  const logContainerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const addLog = (
    message: string,
    type: 'info' | 'success' | 'error' = 'info',
  ) => {
    setLogs((prev) => [
      ...prev,
      { time: new Date().toLocaleTimeString(), message, type },
    ])
  }

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [logs])

  const handleStartBackup = async () => {
    setStatus('running')
    setProgress(0)
    setCurrentPage(0)
    setLogs([])

    const pagesToSync = 15
    setTotalPages(pagesToSync)
    addLog('Iniciando processo de sincronização de backup...', 'info')

    try {
      for (let i = 1; i <= pagesToSync; i++) {
        // Simulating backend request for each page
        await new Promise((resolve) => setTimeout(resolve, 600))

        setCurrentPage(i)
        setProgress((i / pagesToSync) * 100)
        addLog(
          `Página ${i} de ${pagesToSync} processada. Inserindo mensagens e conversas no banco de dados local.`,
          'info',
        )
      }

      setStatus('completed')
      addLog('Processo de backup concluído com sucesso!', 'success')
      toast({
        title: 'Backup Concluído',
        description: 'Todas as mensagens históricas foram sincronizadas.',
      })
    } catch (error) {
      setStatus('error')
      addLog('Erro inesperado durante a sincronização.', 'error')
      toast({
        variant: 'destructive',
        title: 'Erro no Backup',
        description: 'Ocorreu um erro ao sincronizar as mensagens.',
      })
    }
  }

  const getStatusBadge = () => {
    switch (status) {
      case 'idle':
        return (
          <Badge
            variant="outline"
            className="text-slate-500 border-slate-200 bg-slate-50"
          >
            <Clock className="w-3 h-3 mr-1" /> Idle
          </Badge>
        )
      case 'running':
        return (
          <Badge
            variant="outline"
            className="text-indigo-600 border-indigo-200 bg-indigo-50"
          >
            <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Em andamento
          </Badge>
        )
      case 'completed':
        return (
          <Badge
            variant="outline"
            className="text-emerald-600 border-emerald-200 bg-emerald-50"
          >
            <CheckCircle2 className="w-3 h-3 mr-1" /> Concluído
          </Badge>
        )
      case 'error':
        return (
          <Badge
            variant="outline"
            className="text-red-600 border-red-200 bg-red-50"
          >
            <XCircle className="w-3 h-3 mr-1" /> Erro
          </Badge>
        )
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-6 bg-[#F8FAFC] min-h-screen">
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#111B21]">
          Configurações
        </h1>
        <p className="text-gray-500">
          Gerencie as preferências e manutenções do sistema.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Backup de Mensagens</CardTitle>
                <CardDescription>
                  Sincronize o histórico de conversas para garantir que o banco
                  de dados local esteja atualizado.
                </CardDescription>
              </div>
              {getStatusBadge()}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  Progresso da Sincronização
                </p>
                <p className="text-sm text-muted-foreground">
                  {status === 'idle'
                    ? 'Nenhum backup em andamento'
                    : `Página ${currentPage} de ${totalPages}`}
                </p>
              </div>
              <Button
                onClick={handleStartBackup}
                disabled={status === 'running'}
                className="bg-[#25D366] hover:bg-[#1fb355] text-white"
              >
                <Play className="w-4 h-4 mr-2" />
                Iniciar Backup
              </Button>
            </div>

            <Progress value={progress} className="w-full h-2" />

            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Logs de Execução</p>
              <div
                ref={logContainerRef}
                className="bg-slate-950 rounded-md p-4 h-[250px] overflow-y-auto font-mono text-xs"
              >
                {logs.length === 0 ? (
                  <span className="text-slate-500">
                    Nenhum log disponível. Inicie o backup para ver o progresso.
                  </span>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="mb-1 flex gap-3">
                      <span className="text-slate-500 shrink-0">
                        [{log.time}]
                      </span>
                      <span
                        className={`
                        ${log.type === 'info' ? 'text-slate-300' : ''}
                        ${log.type === 'success' ? 'text-emerald-400' : ''}
                        ${log.type === 'error' ? 'text-red-400' : ''}
                      `}
                      >
                        {log.message}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
