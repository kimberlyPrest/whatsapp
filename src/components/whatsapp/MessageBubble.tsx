import { Check, CheckCheck } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Message } from '@/lib/services/whatsapp'

interface MessageBubbleProps {
  message: Message
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isMe = message.sender === 'me'
  const time = new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div
      className={cn(
        'flex w-full mb-2 animate-fade-in-up',
        isMe ? 'justify-end' : 'justify-start',
      )}
    >
      <div
        className={cn(
          'relative max-w-[85%] md:max-w-[65%] px-3 py-1.5 rounded-lg shadow-sm text-sm',
          isMe ? 'bg-[#DCF8C6] rounded-tr-none' : 'bg-white rounded-tl-none',
        )}
      >
        <div className="pr-6 pb-2 text-[#111B21] whitespace-pre-wrap">
          {message.message_text}
        </div>
        <div className="absolute right-2 bottom-1 flex items-center gap-1">
          <span className="text-[11px] text-gray-500 leading-none">
            {time}
          </span>
          {isMe && (
            <span
              className={cn(
                'text-[11px]',
                'text-[#53bdeb]' // Default is read for now in this mock-to-real transition
              )}
            >
              <CheckCheck className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
