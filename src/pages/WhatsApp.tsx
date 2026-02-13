import { useState, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { Sidebar } from '@/components/whatsapp/Sidebar'
import { ChatWindow } from '@/components/whatsapp/ChatWindow'
import { whatsappService, Conversation, Message } from '@/lib/services/whatsapp'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export default function WhatsApp() {
  const location = useLocation()
  const [conversations, setConversations] = useState<any[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedId, setSelectedId] = useState<string | undefined>(
    location.state?.selectedId
  )
  const [statusFilter, setStatusFilter] = useState<string>('Todas')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const isMobile = useIsMobile()
  const { toast } = useToast()

  // Fetch conversations
  const loadConversations = async () => {
    try {
      const data = await whatsappService.getConversations()
      setConversations(data)
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Erro ao carregar conversas' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConversations()
  }, [])

  // Fetch messages when conversation selected
  useEffect(() => {
    if (selectedId) {
      const loadMessages = async () => {
        try {
          const data = await whatsappService.getMessages(selectedId)
          setMessages(data)
        } catch (error) {
          toast({ variant: 'destructive', title: 'Erro', description: 'Erro ao carregar mensagens' })
        }
      }
      loadMessages()
    } else {
      setMessages([])
    }
  }, [selectedId])

  const handleSelectConversation = (id: string) => {
    setSelectedId(id)
  }

  const handleSendMessage = async (text: string) => {
    if (!selectedId) return

    try {
      const newMessage = await whatsappService.sendMessage(selectedId, text)
      setMessages((prev) => [...prev, newMessage])
      loadConversations() // Refresh list
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Erro ao enviar mensagem' })
    }
  }

  const handleCloseConversation = async () => {
    if (!selectedId) return
    try {
      await whatsappService.closeConversation(selectedId)
      toast({ title: 'Sucesso', description: 'Conversa finalizada' })
      loadConversations()
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Erro ao finalizar conversa' })
    }
  }

  const handleReopenConversation = async () => {
    if (!selectedId) return
    try {
      await whatsappService.reopenConversation(selectedId)
      toast({ title: 'Sucesso', description: 'Conversa reaberta' })
      loadConversations()
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Erro ao reabrir conversa' })
    }
  }

  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      const matchesStatus =
        statusFilter === 'Todas' || conv.status === statusFilter
      const matchesSearch = (conv.contact_name || conv.phone_number)
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [conversations, statusFilter, searchTerm])

  const handleMessageSent = (newMessage: Message) => {
    setMessages((prev) => [...prev, newMessage])
    loadConversations() // Refresh sidebar counts and last message
  }

  const selectedConversation = conversations.find((c) => c.phone_number === selectedId)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#F0F2F5] relative">
      <div className="z-10 flex w-full h-full shadow-lg overflow-hidden bg-white">
        <Sidebar
          className={cn(
            'w-full md:w-[400px] md:max-w-[35%] border-r border-[#E2E8F0]',
            isMobile && selectedId ? 'hidden' : 'flex',
          )}
          conversations={filteredConversations}
          selectedId={selectedId}
          onSelect={handleSelectConversation}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <div className={cn('flex-1 h-full', isMobile && !selectedId && 'hidden')}>
          <ChatWindow
            conversation={selectedConversation}
            messages={messages}
            onBack={() => setSelectedId(undefined)}
            onSendMessage={handleSendMessage}
            onCloseConversation={handleCloseConversation}
            onReopenConversation={handleReopenConversation}
            onMessageSent={handleMessageSent}
          />
        </div>
      </div>
    </div>
  )
}
