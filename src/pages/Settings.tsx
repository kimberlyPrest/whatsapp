import { useEffect, useRef } from 'react'
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
import { useBackup } from '@/hooks/use-backup'
import { useToast } from '@/hooks/use-toast'

export default function SettingsPage() {
  const { isRunning, currentPage, totalPages, progress, logs, startBackup } =
    useBackup()
  const logContainerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [logs])

  const handleStartBackup = async () => {
    const success = await startBackup()
    if (success) {
      toast({
        title: 'Backup Concluído',
        description: 'O histórico de mensagens foi sincronizado.',
      })
    } else {
      toast({
        variant: 'destructive',
        title: 'Erro no Backup',
        description: 'Verifique os logs para detalhes do erro.',
      })
    }
  }

  const getStatusBadge = () => {
    if (isRunning) {
      return (
        <Badge
          variant="outline"
          className="text-indigo-600 border-indigo-200 bg-indigo-50"
        >
          <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Em andamento
        </Badge>
      )
    }
    if (logs.some((l) => l.toLowerCase().includes('erro crítico'))) {
      return (
        <Badge
          variant="outline"
          className="text-red-600 border-red-200 bg-red-50"
        >
          <XCircle className="w-3 h-3 mr-1" /> Erro
        </Badge>
      )
    }
    if (progress === 100) {
      return (
        <Badge
          variant="outline"
          className="text-emerald-600 border-emerald-200 bg-emerald-50"
        >
          <CheckCircle2 className="w-3 h-3 mr-1" /> Concluído
        </Badge>
      )
    }
    return (
      <Badge
        variant="outline"
        className="text-slate-500 border-slate-200 bg-slate-50"
      >
        <Clock className="w-3 h-3 mr-1" /> Idle
      </Badge>
    )
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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Backup de Mensagens</CardTitle>
              <CardDescription>
                Sincronize o histórico de conversas para garantir que o banco de
                dados local esteja atualizado.
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
                {!isRunning && progress === 0
                  ? 'Nenhum backup em andamento'
                  : `Página ${currentPage} de ${totalPages || '?'}`}
              </p>
            </div>
            <Button
              onClick={handleStartBackup}
              disabled={isRunning}
              className="bg-[#25D366] hover:bg-[#1fb355] text-white"
            >
              <Play className="w-4 h-4 mr-2" /> Iniciar Backup
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
                logs.map((log, i) => {
                  const isError = log.toLowerCase().includes('erro')
                  const isSuccess = log.toLowerCase().includes('sucesso')
                  return (
                    <div key={i} className="mb-1 flex gap-3">
                      <span
                        className={`${isError ? 'text-red-400' : ''} ${
                          isSuccess ? 'text-emerald-400' : ''
                        } ${!isError && !isSuccess ? 'text-slate-300' : ''}`}
                      >
                        {log}
                      </span>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
