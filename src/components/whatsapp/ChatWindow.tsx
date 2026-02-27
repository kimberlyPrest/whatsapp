import { useState, useRef, useEffect } from 'react'
import {
  MoreVertical,
  Search,
  Paperclip,
  Smile,
  Mic,
  Send,
  ArrowLeft,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { MessageBubble } from './MessageBubble'
import { AISuggestion } from './AISuggestion'
import { Message, whatsappService } from '@/lib/services/whatsapp'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

function getDateLabel(isoDate: string): string {
  const today = new Date()
  const msgDate = new Date(isoDate)

  const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const msgDay = new Date(msgDate.getFullYear(), msgDate.getMonth(), msgDate.getDate())

  const diffMs = todayDay.getTime() - msgDay.getTime()
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Hoje'
  if (diffDays === 1) return 'Ontem'
  return msgDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
}

function groupMessagesByDate(messages: Message[]) {
  const groups: { dateLabel: string; messages: Message[] }[] = []
  for (const msg of messages) {
    const label = getDateLabel(msg.created_at)
    const last = groups[groups.length - 1]
    if (!last || last.dateLabel !== label) {
      groups.push({ dateLabel: label, messages: [msg] })
    } else {
      last.messages.push(msg)
    }
  }
  return groups
}

interface ChatWindowProps {
  conversation?: any
  messages: Message[]
  onBack: () => void
  onSendMessage: (text: string) => void
  onCloseConversation: () => void
  onReopenConversation: () => void
  onMessageSent?: (message: Message) => void
}

export function ChatWindow({
  conversation,
  messages,
  onBack,
  onSendMessage,
  onCloseConversation,
  onReopenConversation,
  onMessageSent,
}: ChatWindowProps) {
  const [inputText, setInputText] = useState('')
  const [suggestion, setSuggestion] = useState<any>(null)
  const [showSuggestion, setShowSuggestion] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Reset state when conversation changes
  useEffect(() => {
    setInputText('')
    setShowSuggestion(true)
    setSuggestion(null)
    setIsSending(false)

    if (conversation?.phone_number) {
      whatsappService
        .getAISuggestion(conversation.phone_number)
        .then(setSuggestion)
    }
  }, [conversation?.phone_number])

  // Scroll to top on new messages as they are ordered newest first
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (inputText.trim() && conversation) {
      setIsSending(true)
      try {
        // Se houver uma sugestão pendente e o texto for enviado (mesmo que editado),
        // usamos a Edge Function para marcar como resolvida
        let sentMessage
        if (suggestion) {
          sentMessage = await whatsappService.sendFinalMessage(
            conversation.phone_number,
            inputText,
            suggestion.id,
          )
        } else {
          sentMessage = await whatsappService.sendMessage(
            conversation.phone_number,
            inputText,
          )
        }

        onMessageSent?.(sentMessage)
        setInputText('')
        setSuggestion(null)
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Erro ao enviar mensagem',
        })
      } finally {
        setIsSending(false)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleApproveSuggestion = async () => {
    if (suggestion && conversation) {
      setIsSending(true)
      try {
        const sentMessage = await whatsappService.approveSuggestion(
          suggestion.id,
          conversation.phone_number,
          suggestion.suggestion_text,
        )
        onMessageSent?.(sentMessage)
        setShowSuggestion(false)
        setSuggestion(null)
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Erro ao aprovar sugestão',
        })
      } finally {
        setIsSending(false)
      }
    }
  }

  if (!conversation) {
    return (
      <div className="flex-1 h-full bg-[#F0F2F5] border-b-[6px] border-[#25D366] flex flex-col items-center justify-center text-center p-8">
        <div className="max-w-[560px]">
          <div className="mb-8 relative inline-flex items-center justify-center w-64 h-64 rounded-full bg-[#E9EDEF]">
            <img
              src="https://img.usecurling.com/i?q=secure%20chat&color=green"
              alt="Secure Chat"
              className="w-32 h-32 opacity-80"
            />
          </div>
          <h1 className="text-3xl font-light text-[#41525d] mb-4">
            WhatsApp para Operadores
          </h1>
          <p className="text-[#667781] text-sm leading-6">
            Atendimento inteligente com suporte de IA.
            <br />
            Gerencie suas conversas e aprove as sugestões com facilidade.
          </p>
        </div>
      </div>
    )
  }

  const contactName = conversation.contact_name || conversation.phone_number

  return (
    <div className="flex flex-col h-full bg-[#EFEAE2]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-2.5 bg-[#F0F2F5] shrink-0 h-[60px] border-l border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden -ml-2 text-[#54656F]"
            onClick={onBack}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <Avatar className="cursor-pointer">
            <AvatarImage
              src={`https://img.usecurling.com/ppl/thumbnail?seed=${conversation.phone_number}`}
            />
            <AvatarFallback>{contactName.substring(0, 2)}</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <span className="font-medium text-[#111B21] text-sm md:text-base leading-tight">
              {contactName}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge
                className={cn(
                  'text-[9px] text-white px-1.5 py-0 h-3.5 font-normal uppercase tracking-wide border-0',
                )}
                style={{
                  backgroundColor: conversation.status_color || '#6B7280',
                }}
              >
                {conversation.status?.replace('_', ' ')}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[#54656F]">
          {conversation.status === 'FINALIZADO' ? (
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-medium border-[#25D366] text-[#25D366] hover:bg-[#25D366]/10"
              onClick={onReopenConversation}
            >
              Reabrir
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs font-medium text-gray-500 hover:text-red-500 hover:bg-red-50"
              onClick={onCloseConversation}
            >
              Finalizar Conversa
            </Button>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Search className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Pesquisar</TooltipContent>
          </Tooltip>
        </div>
      </header>

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto p-4 md:p-[5%] bg-repeat bg-[length:400px_400px]"
        ref={scrollRef}
        style={{
          backgroundColor: '#E5DDD5',
          backgroundImage:
            "linear-gradient(rgba(229, 221, 213, 0.9), rgba(229, 221, 213, 0.9)), url('https://img.usecurling.com/i?q=seamless%20pattern&color=gray')",
        }}
      >
        <div className="flex flex-col gap-1">
          {groupMessagesByDate(messages).map(({ dateLabel, messages: dayMessages }) => (
            <div key={dateLabel}>
              {/* Separador de data */}
              <div className="flex justify-center my-3">
                <span className="bg-[#E1F2FB] text-[#54656F] text-[11px] font-medium px-3 py-1 rounded-full shadow-sm">
                  {dateLabel}
                </span>
              </div>
              {dayMessages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Area */}
      <div className="bg-[#F0F2F5] p-2 md:p-3 shrink-0">
        {/* AI Suggestion */}
        {suggestion && showSuggestion && (
          <AISuggestion
            suggestion={suggestion.suggestion_text}
            onApprove={handleApproveSuggestion}
            onEdit={() => {
              setInputText(suggestion.suggestion_text)
              setShowSuggestion(false)
            }}
            onDiscard={() => {
              setShowSuggestion(false)
            }}
          />
        )}

        {/* Input Bar */}
        <div className="flex items-end gap-2 max-w-full">
          <div className="flex gap-1 mb-2 text-[#54656F]">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 shrink-0"
              disabled={isSending}
            >
              <Smile className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 shrink-0"
              disabled={isSending}
            >
              <Paperclip className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex-1 bg-white rounded-lg min-h-[42px] flex items-center px-4 py-2 shadow-sm mb-1">
            <input
              className="w-full bg-transparent border-none outline-none text-[#111B21] text-[15px] placeholder:text-[#54656F]"
              placeholder={isSending ? 'Enviando...' : 'Mensagem'}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSending}
            />
          </div>

          <div className="mb-2">
            {inputText.trim() || isSending ? (
              <Button
                onClick={handleSendMessage}
                size="icon"
                className={cn(
                  'rounded-full bg-[#25D366] hover:bg-[#1fb355] h-10 w-10 shrink-0 transition-all',
                  isSending && 'w-auto px-4',
                )}
                disabled={isSending}
              >
                {isSending ? (
                  <span className="text-xs text-white font-medium animate-pulse">
                    Enviando...
                  </span>
                ) : (
                  <Send className="w-5 h-5 text-white ml-0.5" />
                )}
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10 shrink-0 text-[#54656F]"
              >
                <Mic className="w-6 h-6" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
