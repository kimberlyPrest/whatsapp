import { useBackup } from '@/hooks/use-backup'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, RefreshCw, Trash2 } from 'lucide-react'

export default function SettingsPage() {
  const {
    isRunning,
    isPaused,
    isCompleted,
    currentPage,
    totalPages,
    progress,
    logs,
    startBackup,
    togglePause,
    clearLogs,
  } = useBackup()

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#F8FAFC] min-h-screen">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#111B21]">
          Configurações
        </h1>
        <p className="text-gray-500">
          Gerencie as integrações e backups do sistema.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Gerenciamento de Backup</CardTitle>
                <CardDescription>
                  Sincronize mensagens da Evolution API para o banco de dados
                  local.
                </CardDescription>
              </div>
              <Badge
                variant={
                  isCompleted ? 'default' : isRunning ? 'secondary' : 'outline'
                }
                className={
                  isCompleted
                    ? 'bg-green-500 hover:bg-green-600 text-white border-transparent'
                    : isRunning
                      ? 'bg-blue-500 hover:bg-blue-600 text-white border-transparent'
                      : isPaused
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white border-transparent'
                        : ''
                }
              >
                {isCompleted
                  ? 'Concluído'
                  : isRunning
                    ? 'Em andamento'
                    : isPaused
                      ? 'Pausado'
                      : 'Aguardando'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Progresso</span>
                <span className="text-gray-500">
                  {progress}% ({currentPage} / {totalPages || '?'} páginas)
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="flex flex-wrap gap-3">
              {!isRunning && !isPaused && !isCompleted && (
                <Button
                  onClick={() => startBackup(false)}
                  className="gap-2 bg-[#25D366] hover:bg-[#1FA855] text-white"
                >
                  <Play className="w-4 h-4" />
                  Iniciar Backup
                </Button>
              )}

              {(isRunning || isPaused) && (
                <Button
                  onClick={togglePause}
                  variant={isRunning ? 'outline' : 'default'}
                  className="gap-2"
                >
                  {isRunning ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                  {isRunning ? 'Pausar' : 'Retomar'}
                </Button>
              )}

              {(isPaused || isCompleted) && (
                <Button
                  onClick={() => startBackup(false)}
                  variant="outline"
                  className="gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reiniciar
                </Button>
              )}

              <Button
                onClick={clearLogs}
                variant="ghost"
                className="gap-2 ml-auto text-gray-500 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
                Limpar Logs
              </Button>
            </div>

            <div className="mt-6">
              <div className="text-sm font-medium text-gray-700 mb-2">
                Logs de Execução
              </div>
              <ScrollArea className="h-[250px] w-full rounded-md border bg-[#111B21] text-[#25D366] p-4 font-mono text-xs">
                {logs.length === 0 ? (
                  <div className="text-gray-500 italic">
                    Nenhum log disponível...
                  </div>
                ) : (
                  logs.map((log, i) => (
                    <div key={i} className="mb-1">
                      {log}
                    </div>
                  ))
                )}
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
