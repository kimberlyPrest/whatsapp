export type MessageStatus = 'sent' | 'delivered' | 'read'
export type ConversationStatus =
  | 'Aguardando Validação'
  | 'Sem Resposta'
  | 'Aguardando Cliente'
  | 'Finalizadas'

export interface Message {
  id: string
  text: string
  sender: 'me' | 'them'
  timestamp: string
  status?: MessageStatus
}

export interface Conversation {
  id: string
  contactName: string
  avatar: string
  status: ConversationStatus
  unreadCount: number
  lastMessageTime: string
  messages: Message[]
  aiSuggestion?: string
}

export const conversations: Conversation[] = [
  {
    id: '1',
    contactName: 'Ana Silva',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=1',
    status: 'Aguardando Validação',
    unreadCount: 2,
    lastMessageTime: '10:30',
    messages: [
      {
        id: 'm1',
        text: 'Olá, gostaria de saber mais sobre o plano premium.',
        sender: 'them',
        timestamp: '10:28',
        status: 'read',
      },
      {
        id: 'm2',
        text: 'Claro! Vou te enviar os detalhes agora mesmo.',
        sender: 'me',
        timestamp: '10:29',
        status: 'read',
      },
      {
        id: 'm3',
        text: 'Pode me enviar o contrato?',
        sender: 'them',
        timestamp: '10:30',
      },
    ],
    aiSuggestion:
      'Com certeza, Ana. Segue em anexo a minuta do contrato para sua análise. Precisa de ajuda com mais alguma coisa?',
  },
  {
    id: '2',
    contactName: 'Carlos Oliveira',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=2',
    status: 'Sem Resposta',
    unreadCount: 0,
    lastMessageTime: 'Ontem',
    messages: [
      {
        id: 'm1',
        text: 'Bom dia, Carlos! Chegou a ver nossa proposta?',
        sender: 'me',
        timestamp: '09:15',
        status: 'read',
      },
      {
        id: 'm2',
        text: 'Ainda não, vou olhar hoje à tarde.',
        sender: 'them',
        timestamp: '14:20',
      },
      {
        id: 'm3',
        text: 'Combinado. Fico no aguardo.',
        sender: 'me',
        timestamp: '14:22',
        status: 'delivered',
      },
    ],
  },
  {
    id: '3',
    contactName: 'Mariana Costa',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=3',
    status: 'Aguardando Cliente',
    unreadCount: 1,
    lastMessageTime: '09:45',
    messages: [
      {
        id: 'm1',
        text: 'Preciso agendar a visita técnica.',
        sender: 'them',
        timestamp: '09:40',
      },
      {
        id: 'm2',
        text: 'Temos disponibilidade para amanhã às 14h.',
        sender: 'me',
        timestamp: '09:42',
        status: 'read',
      },
      {
        id: 'm3',
        text: 'Vou confirmar com minha equipe.',
        sender: 'them',
        timestamp: '09:45',
      },
    ],
    aiSuggestion:
      'Perfeito, Mariana. Assim que tiver a confirmação, por favor me avise para eu reservar o horário.',
  },
  {
    id: '4',
    contactName: 'João Pereira',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=male&seed=4',
    status: 'Finalizadas',
    unreadCount: 0,
    lastMessageTime: 'Segunda',
    messages: [
      {
        id: 'm1',
        text: 'Tudo resolvido, obrigado!',
        sender: 'them',
        timestamp: '10:00',
      },
      {
        id: 'm2',
        text: 'Que ótimo! Qualquer coisa estamos à disposição.',
        sender: 'me',
        timestamp: '10:05',
        status: 'read',
      },
    ],
  },
  {
    id: '5',
    contactName: 'Fernanda Lima',
    avatar: 'https://img.usecurling.com/ppl/thumbnail?gender=female&seed=5',
    status: 'Aguardando Validação',
    unreadCount: 3,
    lastMessageTime: '08:20',
    messages: [
      {
        id: 'm1',
        text: 'Meus documentos foram aprovados?',
        sender: 'them',
        timestamp: '08:15',
      },
      {
        id: 'm2',
        text: 'Estamos analisando, Fernanda.',
        sender: 'me',
        timestamp: '08:18',
        status: 'read',
      },
      {
        id: 'm3',
        text: 'Quanto tempo demora?',
        sender: 'them',
        timestamp: '08:20',
      },
    ],
    aiSuggestion:
      'Normalmente o processo leva até 24 horas úteis. Assim que tivermos um retorno, te aviso imediatamente.',
  },
]
