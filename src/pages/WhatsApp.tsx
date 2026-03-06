import { useState, useEffect, useMemo, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Sidebar } from '@/components/whatsapp/Sidebar'
import { ChatWindow } from '@/components/whatsapp/ChatWindow'
import {
  whatsappService,
  Message,
  normalizePhone,
} from '@/lib/services/whatsapp'
import { supabase } from '@/lib/supabase/client'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export default function WhatsApp() {
  const location = useLocation()
  const [conversations, setConversations] = useState<any[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedId, setSelectedId] = useState<string | undefined>(
    location.state?.selectedId,
  )
  const [statusFilter, setStatusFilter] = useState<string>('Todas')
  const [searchTerm, setSearchTerm] = useState('')
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [scrollTrigger, setScrollTrigger] = useState(0)
  const isMobile = useIsMobile()
  const { toast } = useToast()

  // Ref para evitar stale closures nos callbacks de realtime
  const selectedIdRef = useRef<string | undefined>(selectedId)
  useEffect(() => {
    selectedIdRef.current = selectedId
  }, [selectedId])

  const loadConversations = async () => {
    try {
      const data = await whatsappService.getConversations()
      setConversations(data)
    } catch {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao carregar conversas',
      })
    }
  }

  // Carga inicial
  useEffect(() => {
    loadConversations()
  }, [])

  // Subscriptions de tempo real
  useEffect(() => {
    // Qualquer mudança em conversations → atualiza sidebar
    const convChannel = supabase
      .channel('realtime-conversations')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations' },
        () => {
          loadConversations()
        },
      )
      .subscribe()

    // Inserção de mensagem → append na conversa ativa
    const msgChannel = supabase
      .channel('realtime-messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const msg = payload.new as Message
          const msgBase = normalizePhone(msg.phone_number)
          const currentBase = selectedIdRef.current
            ? normalizePhone(selectedIdRef.current)
            : null

          if (currentBase && msgBase === currentBase) {
            setMessages((prev) => {
              // Dedup: mensagem pode já ter sido adicionada optimisticamente
              if (prev.some((m) => m.id === msg.id)) return prev
              return [...prev, msg]
            })
            setScrollTrigger(Date.now())
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(convChannel)
      supabase.removeChannel(msgChannel)
    }
  }, [])

  // Carrega mensagens ao selecionar conversa
  useEffect(() => {
    if (!selectedId) {
      setMessages([])
      setHasMore(false)
      return
    }

    const loadMessages = async () => {
      try {
        const data = await whatsappService.getMessages(selectedId, {
          limit: 20,
        })
        setMessages(data)
        setHasMore(data.length === 20)
        setScrollTrigger(Date.now())
        // Zera contador de não lidas
        whatsappService.resetUnreadCount(selectedId)
      } catch {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: 'Erro ao carregar mensagens',
        })
      }
    }

    loadMessages()
  }, [selectedId])

  const handleSelectConversation = (id: string) => {
    setSelectedId(id)
  }

  const handleLoadMore = async () => {
    if (!selectedId || loadingMore || !hasMore || messages.length === 0) return
    setLoadingMore(true)
    try {
      const oldest = messages[0].created_at
      const older = await whatsappService.getMessages(selectedId, {
        before: oldest,
        limit: 20,
      })
      setHasMore(older.length === 20)
      setMessages((prev) => [...older, ...prev])
    } catch {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao carregar mensagens antigas',
      })
    } finally {
      setLoadingMore(false)
    }
  }

  const handleCloseConversation = async () => {
    if (!selectedId) return
    try {
      await whatsappService.closeConversation(selectedId)
      toast({ title: 'Sucesso', description: 'Conversa finalizada' })
      // Realtime subscription atualiza conversations automaticamente
    } catch {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao finalizar conversa',
      })
    }
  }

  const handleReopenConversation = async () => {
    if (!selectedId) return
    try {
      await whatsappService.reopenConversation(selectedId)
      toast({ title: 'Sucesso', description: 'Conversa reaberta' })
    } catch {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao reabrir conversa',
      })
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
    setMessages((prev) => {
      // Dedup: realtime pode já ter adicionado a mensagem
      if (prev.some((m) => m.id === newMessage.id)) return prev
      return [...prev, newMessage]
    })
    setScrollTrigger(Date.now())
  }

  const selectedConversation = conversations.find(
    (c) => c.phone_number === selectedId,
  )

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#F0F2F5] relative">
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

        <div
          className={cn('flex-1 h-full', isMobile && !selectedId && 'hidden')}
        >
          <ChatWindow
            conversation={selectedConversation}
            messages={messages}
            hasMore={hasMore}
            loadingMore={loadingMore}
            scrollTrigger={scrollTrigger}
            onBack={() => setSelectedId(undefined)}
            onCloseConversation={handleCloseConversation}
            onReopenConversation={handleReopenConversation}
            onMessageSent={handleMessageSent}
            onLoadMore={handleLoadMore}
          />
        </div>
      </div>
    </div>
  )
}
