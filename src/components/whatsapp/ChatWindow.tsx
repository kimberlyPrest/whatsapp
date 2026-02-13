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
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { MessageBubble } from './MessageBubble'
import { AISuggestion } from './AISuggestion'
import { Conversation, Message, ConversationStatus } from '@/data/mockData'
import { cn } from '@/lib/utils'

interface ChatWindowProps {
  conversation?: Conversation
  onBack: () => void
  onSendMessage: (text: string) => void
}

const statusColors: Record<ConversationStatus, string> = {
  'Aguardando Validação': 'bg-[#EF4444]',
  'Sem Resposta': 'bg-[#FBBF24]',
  'Aguardando Cliente': 'bg-[#3B82F6]',
  Finalizadas: 'bg-[#6B7280]',
}

export function ChatWindow({
  conversation,
  onBack,
  onSendMessage,
}: ChatWindowProps) {
  const [inputText, setInputText] = useState('')
  const [showSuggestion, setShowSuggestion] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Reset state when conversation changes
  useEffect(() => {
    setInputText('')
    setShowSuggestion(true)
  }, [conversation?.id])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [conversation?.messages])

  const handleSendMessage = () => {
    if (inputText.trim()) {
      onSendMessage(inputText)
      setInputText('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
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
            Envie e receba mensagens sem precisar manter seu celular conectado.{' '}
            <br />
            Use o WhatsApp em até 4 aparelhos e 1 celular ao mesmo tempo.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-[#8696a0] text-xs">
            <span className="w-3 h-3 bg-gray-400 rounded-full inline-block"></span>
            Protegido com criptografia de ponta a ponta
          </div>
        </div>
      </div>
    )
  }

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
            <AvatarImage src={conversation.avatar} />
            <AvatarFallback>
              {conversation.contactName.substring(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <span className="font-medium text-[#111B21] text-sm md:text-base leading-tight">
              {conversation.contactName}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge
                className={cn(
                  'text-[9px] text-white px-1.5 py-0 h-3.5 font-normal uppercase tracking-wide border-0',
                  statusColors[conversation.status],
                )}
              >
                {conversation.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[#54656F]">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Search className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Pesquisar</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mais opções</TooltipContent>
          </Tooltip>
        </div>
      </header>

      {/* Messages Area */}
      <div
        className="flex-1 overflow-y-auto p-4 md:p-[5%] bg-[url('https://img.usecurling.com/i?q=subtle%20doodle%20pattern&color=gray')] bg-repeat bg-[length:400px_400px]"
        ref={scrollRef}
        style={{
          backgroundColor: '#E5DDD5',
          backgroundImage:
            "linear-gradient(rgba(229, 221, 213, 0.9), rgba(229, 221, 213, 0.9)), url('https://img.usecurling.com/i?q=seamless%20pattern&color=gray')",
        }}
      >
        <div className="flex flex-col gap-1">
          {conversation.messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </div>
      </div>

      {/* Footer Area */}
      <div className="bg-[#F0F2F5] p-2 md:p-3 shrink-0">
        {/* AI Suggestion */}
        {conversation.aiSuggestion && showSuggestion && (
          <AISuggestion
            suggestion={conversation.aiSuggestion}
            onApprove={() => {
              onSendMessage(conversation.aiSuggestion!)
              setShowSuggestion(false)
            }}
            onEdit={() => {
              setInputText(conversation.aiSuggestion!)
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
            >
              <Smile className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-10 w-10 shrink-0"
            >
              <Paperclip className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex-1 bg-white rounded-lg min-h-[42px] flex items-center px-4 py-2 shadow-sm mb-1">
            <input
              className="w-full bg-transparent border-none outline-none text-[#111B21] text-[15px] placeholder:text-[#54656F]"
              placeholder="Mensagem"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="mb-2">
            {inputText.trim() ? (
              <Button
                onClick={handleSendMessage}
                size="icon"
                className="rounded-full bg-[#00A884] hover:bg-[#008f6f] h-10 w-10 shrink-0"
              >
                <Send className="w-5 h-5 text-white ml-0.5" />
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
