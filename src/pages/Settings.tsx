import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#F8FAFC] min-h-screen">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#111B21]">
          Configurações
        </h1>
        <p className="text-gray-500">
          Gerencie as integrações e preferências do sistema.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Geral</CardTitle>
            <CardDescription>
              Nenhuma configuração avançada disponível no momento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              As opções de configuração do sistema aparecerão aqui quando forem
              adicionadas ao ambiente.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
