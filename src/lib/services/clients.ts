import { supabase } from '@/lib/supabase/client'

export const TIPOS_OPTIONS = [
  'Elite',
  'Scale',
  'Skip',
  'Rec Onboar',
  'Vendas',
] as const
export type TipoCliente = (typeof TIPOS_OPTIONS)[number]

export interface ClientProfile {
  id: string
  phone_number: string
  contact_name: string | null
  email: string | null
  tipos: string[]
  tags: string[]
  tldv_link: string | null
  observations: string | null
  created_at: string
  updated_at: string
  // campos joined do conversation_status
  last_message_at?: string | null
  status?: string | null
  status_color?: string | null
  unread_count?: number
}

export interface TldvMeeting {
  id: string
  phone_number: string | null
  meeting_title: string | null
  tldv_link: string
  transcript: string | null
  summary: string | null
  participant_emails: string[]
  meeting_date: string | null
  created_at: string
}

export const clientsService = {
  async getClients(): Promise<ClientProfile[]> {
    // Busca perfis + dados da conversa mais recente via conversation_status
    const { data: profiles, error: profilesErr } = await supabase
      .from('client_profiles')
      .select('*')
      .order('updated_at', { ascending: false })

    if (profilesErr) throw profilesErr

    const { data: convStatus, error: convErr } = await supabase
      .from('conversation_status')
      .select(
        'phone_number, last_message_at, status, status_color, unread_count',
      )

    if (convErr) throw convErr

    // Normaliza phone numbers das conversas para join
    const convMap = new Map<string, any>()
    for (const c of convStatus ?? []) {
      const base = c.phone_number.split('@')[0]
      if (!convMap.has(base)) convMap.set(base, c)
    }

    return (profiles ?? []).map((p) => ({
      ...p,
      tipos: p.tipos ?? [],
      tags: p.tags ?? [],
      ...(convMap.get(p.phone_number) ?? {}),
    }))
  },

  async getClientsToValidate(): Promise<ClientProfile[]> {
    const { data, error } = await supabase
      .from('client_profiles')
      .select('*')
      .or('contact_name.is.null,tipos.eq.{}')
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data ?? []).map((p) => ({
      ...p,
      tipos: p.tipos ?? [],
      tags: p.tags ?? [],
    }))
  },

  async getClientProfile(phoneNumber: string): Promise<ClientProfile | null> {
    const { data, error } = await supabase
      .from('client_profiles')
      .select('*')
      .eq('phone_number', phoneNumber)
      .maybeSingle()

    if (error) throw error
    if (!data) return null
    return { ...data, tipos: data.tipos ?? [], tags: data.tags ?? [] }
  },

  async updateClient(
    phoneNumber: string,
    updates: Partial<
      Pick<
        ClientProfile,
        | 'contact_name'
        | 'email'
        | 'tipos'
        | 'tags'
        | 'tldv_link'
        | 'observations'
      >
    >,
  ): Promise<ClientProfile> {
    const { data, error } = await supabase
      .from('client_profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('phone_number', phoneNumber)
      .select()
      .single()

    if (error) throw error
    return { ...data, tipos: data.tipos ?? [], tags: data.tags ?? [] }
  },

  async getTldvMeetings(phoneNumber: string): Promise<TldvMeeting[]> {
    const { data, error } = await supabase
      .from('tldv_meetings')
      .select('*')
      .eq('phone_number', phoneNumber)
      .order('meeting_date', { ascending: false })

    if (error) throw error
    return (data ?? []).map((m) => ({
      ...m,
      participant_emails: m.participant_emails ?? [],
    }))
  },
}
