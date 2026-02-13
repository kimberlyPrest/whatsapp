import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Conversation } from '@/lib/services/whatsapp'

interface ConversationItemProps {
  conversation: any
  isActive: boolean
  onClick: () => void
}

export function ConversationItem({
  conversation,
  isActive,
  onClick,
}: ConversationItemProps) {
  const lastMessageText = conversation.last_message_text
  const contactName = conversation.contact_name || conversation.phone_number
  const lastMessageAt = conversation.last_message_at
    ? new Date(conversation.last_message_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''

  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-200 border-b border-[#F0F2F5] hover:bg-[#F5F6F6]',
        isActive ? 'bg-[#F0F2F5]' : 'bg-white',
      )}
    >
      <Avatar className="h-12 w-12">
        <AvatarImage
          src={`https://img.usecurling.com/ppl/thumbnail?seed=${conversation.phone_number}`}
          alt={contactName}
        />
        <AvatarFallback>{contactName.substring(0, 2)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className="font-medium text-[#111B21] truncate">
            {contactName}
          </span>
          <span className="text-xs text-gray-500 flex-shrink-0">
            {lastMessageAt}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500 truncate mr-2">
            {conversation.last_sender === 'me' ? 'Você: ' : ''}
            {lastMessageText}
          </p>
          {conversation.unread_count > 0 && (
            <Badge
              variant="default"
              className="bg-[#25D366] hover:bg-[#25D366] text-white rounded-full px-1.5 min-w-[20px] h-5 flex items-center justify-center text-[10px]"
            >
              {conversation.unread_count}
            </Badge>
          )}
        </div>

        <div className="mt-1.5">
          <Badge
            className={cn(
              'text-[10px] text-white px-2 py-0 h-4 hover:opacity-90 font-normal uppercase tracking-wide border-0',
            )}
            style={{ backgroundColor: conversation.status_color || '#6B7280' }}
          >
            {conversation.status?.replace('_', ' ')}
          </Badge>
        </div>
      </div>
    </div>
  )
}
