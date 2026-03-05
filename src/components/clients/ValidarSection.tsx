import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { ClientProfile } from '@/lib/services/clients'

interface ValidarSectionProps {
  clients: ClientProfile[]
  onEdit: (client: ClientProfile) => void
}

export function ValidarSection({ clients, onEdit }: ValidarSectionProps) {
  const [expanded, setExpanded] = useState(true)

  if (clients.length === 0) return null

  return (
    <div className="border border-amber-200 rounded-lg bg-amber-50 overflow-hidden">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-amber-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-semibold text-amber-800">Validar</span>
          <Badge className="bg-amber-600 text-white text-xs h-5 px-1.5">{clients.length}</Badge>
          <span className="text-xs text-amber-600">
            {clients.length === 1 ? 'cliente sem dados completos' : 'clientes sem dados completos'}
          </span>
        </div>
        {expanded
          ? <ChevronUp className="w-4 h-4 text-amber-600" />
          : <ChevronDown className="w-4 h-4 text-amber-600" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {clients.map((client) => (
            <div
              key={client.phone_number}
              className="bg-white border border-amber-200 rounded-lg p-3 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="text-sm font-medium text-[#111B21] truncate">
                  {client.contact_name ?? <span className="text-[#667781] italic">Sem nome</span>}
                </div>
                <div className="text-xs text-[#667781] truncate">{client.phone_number}</div>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {!client.contact_name && (
                    <span className="text-xs text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">
                      nome
                    </span>
                  )}
                  {(!client.tipos || client.tipos.length === 0) && (
                    <span className="text-xs text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">
                      tipo
                    </span>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="shrink-0 text-xs border-amber-300 text-amber-700 hover:bg-amber-100"
                onClick={() => onEdit(client)}
              >
                Preencher
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
