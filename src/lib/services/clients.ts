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
  // novos campos da tabela meus_clientes
  etapa_negocio?: string | null
  propriedade?: boolean
  // call dates e links (resumo para interface)
  call_1_date?: string | null
  call_1_link?: string | null
  call_2_date?: string | null
  call_2_link?: string | null
  csat_1?: number | null
  csat_comment_1?: string | null
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

  async getMeusClientes(): Promise<ClientProfile[]> {
    // Inner join ensures we only get profiles that have a related meus_clientes record
    const { data: profiles, error: profilesErr } = await supabase
      .from('client_profiles')
      .select('*, meus_clientes!inner(*)')
      .order('updated_at', { ascending: false })

    if (profilesErr) throw profilesErr

    const { data: convStatus, error: convErr } = await supabase
      .from('conversation_status')
      .select(
        'phone_number, last_message_at, status, status_color, unread_count',
      )

    if (convErr) throw convErr

    const convMap = new Map<string, any>()
    for (const c of convStatus ?? []) {
      const base = c.phone_number.split('@')[0]
      if (!convMap.has(base)) convMap.set(base, c)
    }

    return (profiles ?? []).map((p: any) => {
      const mc = Array.isArray(p.meus_clientes)
        ? p.meus_clientes[0]
        : p.meus_clientes
      return {
        ...p,
        tipos: p.tipos ?? [],
        tags: p.tags ?? [],
        ...mc,
        ...(convMap.get(p.phone_number) ?? {}),
      }
    })
  },

  async getParaValidar(): Promise<ClientProfile[]> {
    const { data: profiles, error: profilesErr } = await supabase
      .from('client_profiles')
      .select('*, meus_clientes(id)')
      .order('created_at', { ascending: false })

    if (profilesErr) throw profilesErr

    const { data: convStatus, error: convErr } = await supabase
      .from('conversation_status')
      .select(
        'phone_number, last_message_at, status, status_color, unread_count',
      )

    if (convErr) throw convErr

    const convMap = new Map<string, any>()
    for (const c of convStatus ?? []) {
      const base = c.phone_number.split('@')[0]
      if (!convMap.has(base)) convMap.set(base, c)
    }

    // Filters out those present in meus_clientes or categorized as "Vendas"
    const filtered = (profiles ?? []).filter((p: any) => {
      const hasMeusClientes = Array.isArray(p.meus_clientes)
        ? p.meus_clientes.length > 0
        : !!p.meus_clientes
      if (hasMeusClientes) return false
      const isVendas = p.tipos && p.tipos.includes('Vendas')
      if (isVendas) return false
      return true
    })

    return filtered.map((p: any) => {
      return {
        ...p,
        tipos: p.tipos ?? [],
        tags: p.tags ?? [],
        ...(convMap.get(p.phone_number) ?? {}),
      }
    })
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

    // Busca dados extras de meus_clientes
    const { data: mc } = await supabase
      .from('meus_clientes')
      .select('*')
      .eq('client_id', data.id)
      .maybeSingle()

    return {
      ...data,
      tipos: data.tipos ?? [],
      tags: data.tags ?? [],
      ...mc,
    }
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
        | 'etapa_negocio'
      >
    >,
  ): Promise<ClientProfile> {
    // 1. Atualiza client_profiles
    const cpFields = [
      'contact_name',
      'email',
      'tipos',
      'tags',
      'tldv_link',
      'observations',
    ]
    const cpUpdates: any = { updated_at: new Date().toISOString() }
    Object.keys(updates).forEach((k) => {
      if (cpFields.includes(k)) cpUpdates[k] = (updates as any)[k]
    })

    const { data, error } = await supabase
      .from('client_profiles')
      .update(cpUpdates)
      .eq('phone_number', phoneNumber)
      .select()
      .single()

    if (error) throw error

    // 2. Atualiza meus_clientes (etapa_negocio) se necessário
    if (updates.etapa_negocio !== undefined) {
      await supabase.from('meus_clientes').upsert(
        {
          client_id: data.id,
          etapa_negocio: updates.etapa_negocio,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'client_id' },
      )
    }

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
