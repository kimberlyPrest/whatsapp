import { useState, useEffect, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, RefreshCw, Users } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  clientsService,
  TIPOS_OPTIONS,
  type ClientProfile,
} from '@/lib/services/clients'
import { ClientsTable } from '@/components/clients/ClientsTable'
import { ClientModal } from '@/components/clients/ClientModal'
import { ValidarSection } from '@/components/clients/ValidarSection'
import { useToast } from '@/hooks/use-toast'

export default function Clients() {
  const { toast } = useToast()
  const [clients, setClients] = useState<ClientProfile[]>([])
  const [toValidate, setToValidate] = useState<ClientProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [tipoFilter, setTipoFilter] = useState<string>('Todos')
  const [selectedClient, setSelectedClient] = useState<ClientProfile | null>(
    null,
  )
  const [modalOpen, setModalOpen] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const [allClients, invalidClients] = await Promise.all([
        clientsService.getClients(),
        clientsService.getClientsToValidate(),
      ])
      setClients(allClients)
      setToValidate(invalidClients)
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao carregar clientes',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchesSearch =
        !searchTerm ||
        (c.contact_name ?? '')
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        c.phone_number.includes(searchTerm)

      const matchesTipo =
        tipoFilter === 'Todos' || (c.tipos ?? []).includes(tipoFilter)

      return matchesSearch && matchesTipo
    })
  }, [clients, searchTerm, tipoFilter])

  const handleEdit = (client: ClientProfile) => {
    setSelectedClient(client)
    setModalOpen(true)
  }

  const handleSaved = () => {
    loadData()
  }

  return (
    <div className="flex flex-col h-full bg-[#F0F2F5] overflow-y-auto">
      <div className="max-w-7xl mx-auto w-full px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-[#25D366] p-2 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#111B21]">Clientes</h1>
              <p className="text-sm text-[#667781]">
                {loading
                  ? '…'
                  : `${clients.length} cliente${clients.length !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        {/* Seção Validar */}
        <ValidarSection clients={toValidate} onEdit={handleEdit} />

        {/* Filtros */}
        <div className="bg-white rounded-lg border border-[#E2E8F0] overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[#E2E8F0]">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#667781]" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome ou número..."
                className="pl-9 border-[#E2E8F0]"
              />
            </div>

            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-40 border-[#E2E8F0]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos os tipos</SelectItem>
                {TIPOS_OPTIONS.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-6 h-6 animate-spin text-[#25D366]" />
            </div>
          ) : (
            <ClientsTable clients={filteredClients} onEdit={handleEdit} />
          )}
        </div>
      </div>

      <ClientModal
        client={selectedClient}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
      />
    </div>
  )
}
