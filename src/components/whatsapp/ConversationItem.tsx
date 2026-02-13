import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Conversation, ConversationStatus } from '@/data/mockData'

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onClick: () => void
}

const statusColors: Record<ConversationStatus, string> = {
  'Aguardando Validação': 'bg-[#EF4444]',
  'Sem Resposta': 'bg-[#FBBF24]',
  'Aguardando Cliente': 'bg-[#3B82F6]',
  Finalizadas: 'bg-[#6B7280]',
}

export function ConversationItem({
  conversation,
  isActive,
  onClick,
}: ConversationItemProps) {
  const lastMessage = conversation.messages[conversation.messages.length - 1]

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-200 border-b border-[#F0F2F5] hover:bg-[#F5F6F6]',
        isActive ? 'bg-[#F0F2F5]' : 'bg-white',
      )}
    >
      <Avatar className="h-12 w-12">
        <AvatarImage src={conversation.avatar} alt={conversation.contactName} />
        <AvatarFallback>
          {conversation.contactName.substring(0, 2)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="font-medium text-[#111B21] truncate">
            {conversation.contactName}
          </span>
          <span className="text-xs text-gray-500 flex-shrink-0">
            {conversation.lastMessageTime}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500 truncate mr-2">
            {lastMessage?.sender === 'me' ? 'Você: ' : ''}
            {lastMessage?.text}
          </p>
          {conversation.unreadCount > 0 && (
            <Badge
              variant="default"
              className="bg-[#25D366] hover:bg-[#25D366] text-white rounded-full px-1.5 min-w-[20px] h-5 flex items-center justify-center text-[10px]"
            >
              {conversation.unreadCount}
            </Badge>
          )}
        </div>

        <div className="mt-1.5">
          <Badge
            className={cn(
              'text-[10px] text-white px-2 py-0 h-4 hover:opacity-90 font-normal uppercase tracking-wide border-0',
              statusColors[conversation.status],
            )}
          >
            {conversation.status}
          </Badge>
        </div>
      </div>
    </div>
  )
}
