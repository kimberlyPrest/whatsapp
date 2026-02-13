import { useState, useMemo } from 'react'
import { Sidebar } from '@/components/whatsapp/Sidebar'
import { ChatWindow } from '@/components/whatsapp/ChatWindow'
import {
  conversations as initialConversations,
  Conversation,
  ConversationStatus,
  Message,
} from '@/data/mockData'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

export default function WhatsApp() {
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations)
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<
    ConversationStatus | 'Todas'
  >('Todas')
  const [searchTerm, setSearchTerm] = useState('')
  const isMobile = useIsMobile()
  const { toast } = useToast()

  const handleSelectConversation = (id: string) => {
    setSelectedId(id)

    // Mark messages as read when opening (mock logic)
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === id) {
          return {
            ...conv,
            unreadCount: 0,
            messages: conv.messages.map((msg) =>
              msg.sender === 'them' ? { ...msg, status: 'read' as const } : msg,
            ),
          }
        }
        return conv
      }),
    )
  }

  const handleSendMessage = (text: string) => {
    if (!selectedId) return

    const newMessage: Message = {
      id: `m${Date.now()}`,
      text,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      status: 'sent',
    }

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === selectedId) {
          return {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessageTime: newMessage.timestamp,
          }
        }
        return conv
      }),
    )

    // Simulate message received (delivered) effect
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === selectedId) {
            return {
              ...conv,
              messages: conv.messages.map((m) =>
                m.id === newMessage.id
                  ? { ...m, status: 'delivered' as const }
                  : m,
              ),
            }
          }
          return conv
        }),
      )
    }, 1000)

    // Simulate read effect
    setTimeout(() => {
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id === selectedId) {
            return {
              ...conv,
              messages: conv.messages.map((m) =>
                m.id === newMessage.id ? { ...m, status: 'read' as const } : m,
              ),
            }
          }
          return conv
        }),
      )
    }, 2500)
  }

  const filteredConversations = useMemo(() => {
    return conversations.filter((conv) => {
      const matchesStatus =
        statusFilter === 'Todas' || conv.status === statusFilter
      const matchesSearch = conv.contactName
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      return matchesStatus && matchesSearch
    })
  }, [conversations, statusFilter, searchTerm])

  const selectedConversation = conversations.find((c) => c.id === selectedId)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#D1D7DB] relative">
      <div className="absolute top-0 w-full h-32 bg-[#00A884] z-0 hidden md:block" />

      <div className="z-10 flex w-full h-full md:h-[calc(100vh-38px)] md:w-[calc(100vw-38px)] md:m-auto md:max-w-[1600px] shadow-lg rounded-none md:rounded-lg overflow-hidden bg-white">
        <Sidebar
          className={cn(
            'w-full md:w-[400px] md:max-w-[35%] transition-all duration-300',
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
          className={cn(
            'flex-1 w-full h-full transition-all duration-300',
            isMobile && !selectedId ? 'hidden' : 'flex',
          )}
        >
          <ChatWindow
            conversation={selectedConversation}
            onBack={() => setSelectedId(undefined)}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
    </div>
  )
}
