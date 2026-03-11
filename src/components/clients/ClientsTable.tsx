import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { AlertTriangle, MessageCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { ClientProfile } from '@/lib/services/clients'

interface ClientsTableProps {
  clients: ClientProfile[]
  onEdit: (client: ClientProfile) => void
}

const tipoColors: Record<string, string> = {
  Elite: 'bg-purple-100 text-purple-800',
  Scale: 'bg-blue-100 text-blue-800',
  'skip - pro': 'bg-slate-800 text-white',
  'skip - gold': 'bg-yellow-100 text-yellow-800',
  'skip - basic': 'bg-gray-100 text-gray-700',
  'Rec Onboar': 'bg-green-100 text-green-800',
  Vendas: 'bg-orange-100 text-orange-800',
}

export function ClientsTable({ clients, onEdit }: ClientsTableProps) {
  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#667781]">
        <MessageCircle className="w-10 h-10 opacity-30" />
        <p className="text-sm">Nenhum cliente encontrado</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#E2E8F0] bg-[#F8F9FA]">
            <th className="text-left px-4 py-3 text-xs font-semibold text-[#667781] uppercase tracking-wide">
              Nome
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-[#667781] uppercase tracking-wide">
              Número
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-[#667781] uppercase tracking-wide">
              Tipo
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-[#667781] uppercase tracking-wide">
              Tags
            </th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-[#667781] uppercase tracking-wide">
              Última msg
            </th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F0F2F5]">
          {clients.map((client) => {
            const isIncomplete =
              !client.contact_name || !client.tipos || client.tipos.length === 0
            return (
              <tr
                key={client.phone_number}
                className="hover:bg-[#F8F9FA] transition-colors cursor-pointer group"
                onClick={() => onEdit(client)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0"
                      style={{
                        backgroundColor: phoneToColor(client.phone_number),
                      }}
                    >
                      {(client.contact_name ?? client.phone_number)
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={
                          !client.contact_name
                            ? 'text-[#667781] italic'
                            : 'text-[#111B21] font-medium'
                        }
                      >
                        {client.contact_name ?? 'Sem nome'}
                      </span>
                      {isIncomplete && (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-[#667781] font-mono text-xs">
                  {client.phone_number}
                </td>
                <td className="px-4 py-3">
                  {client.tipos && client.tipos.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {client.tipos.map((tipo) => (
                        <span
                          key={tipo}
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${tipoColors[tipo] ?? 'bg-gray-100 text-gray-700'}`}
                        >
                          {tipo}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-[#B0B8BF] italic">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {client.tags && client.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {client.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs py-0 px-1.5"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {client.tags.length > 3 && (
                        <span className="text-xs text-[#667781]">
                          +{client.tags.length - 3}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-[#B0B8BF] italic">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-[#667781] whitespace-nowrap">
                  {client.last_message_at
                    ? formatDistanceToNow(new Date(client.last_message_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })
                    : '—'}
                </td>
                <td className="px-4 py-3">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-[#667781] hover:text-[#25D366]"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEdit(client)
                    }}
                  >
                    Editar
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function phoneToColor(phone: string): string {
  const colors = [
    '#FF6B6B',
    '#4ECDC4',
    '#45B7D1',
    '#96CEB4',
    '#FFEAA7',
    '#DDA0DD',
    '#98D8C8',
    '#F7DC6F',
    '#BB8FCE',
    '#82E0AA',
  ]
  let hash = 0
  for (let i = 0; i < phone.length; i++)
    hash = phone.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}
