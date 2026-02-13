import { useState } from 'react'
import { Search, MoreVertical, MessageSquare, CircleDashed } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { ConversationItem } from './ConversationItem'
import { Conversation, ConversationStatus } from '@/data/mockData'
import { cn } from '@/lib/utils'

interface SidebarProps {
  conversations: any[]
  selectedId?: string
  onSelect: (id: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  className?: string
}

const statusFilters = [
  { label: 'Todas', value: 'Todas' },
  { label: 'Pendentes', value: 'AGUARDANDO_VALIDACAO' },
  { label: 'Gerando', value: 'GERANDO_SUGESTAO' },
  { label: 'Aguardando Cliente', value: 'AGUARDANDO_CLIENTE' },
  { label: 'Finalizadas', value: 'FINALIZADO' },
]

export function Sidebar({
  conversations,
  selectedId,
  onSelect,
  statusFilter,
  setStatusFilter,
  searchTerm,
  setSearchTerm,
  className,
}: SidebarProps) {
  return (
    <div
      className={cn(
        'flex flex-col h-full bg-white border-r border-[#E2E8F0]',
        className,
      )}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-[#F0F2F5] shrink-0 h-[60px]">
        <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
          <AvatarImage src="https://img.usecurling.com/ppl/thumbnail?gender=male&seed=99" />
          <AvatarFallback>OP</AvatarFallback>
        </Avatar>

        <div className="flex items-center gap-2 text-[#54656F]">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <CircleDashed className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Status</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MessageSquare className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Nova Conversa</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Menu</TooltipContent>
          </Tooltip>
        </div>
      </header>

      {/* Search */}
      <div className="px-3 py-2 bg-white border-b border-[#F0F2F5] shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#54656F]" />
          <Input
            placeholder="Pesquisar ou começar uma nova conversa"
            className="pl-9 bg-[#F0F2F5] border-none focus-visible:ring-1 focus-visible:ring-[#25D366] h-9 text-sm placeholder:text-[#54656F]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-[#F0F2F5] shrink-0">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex p-2 gap-2">
            {statusFilters.map((status) => (
              <button
                key={status.value}
                onClick={() => setStatusFilter(status.value)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap',
                  statusFilter === status.value
                    ? 'bg-[#25D366] text-white shadow-sm'
                    : 'bg-[#F0F2F5] text-[#54656F] hover:bg-[#E9EDEF]',
                )}
              >
                {status.label}
              </button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="h-1.5" />
        </ScrollArea>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length > 0 ? (
          conversations.map((conv) => (
            <ConversationItem
              key={conv.phone_number}
              conversation={conv}
              isActive={selectedId === conv.phone_number}
              onClick={() => onSelect(conv.phone_number)}
            />
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p className="text-sm">Nenhuma conversa encontrada.</p>
          </div>
        )}
      </div>
    </div>
  )
}
