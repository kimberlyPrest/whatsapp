import { supabase } from '@/lib/supabase/client'

// Normaliza número de telefone removendo o sufixo JID do WhatsApp (@s.whatsapp.net, @c.us, etc)
function normalizePhone(phone: string): string {
  return phone.split('@')[0]
}

export interface Message {
  id: string
  phone_number: string
  sender: 'me' | 'client'
  message_text: string | null
  message_type: string
  is_audio: boolean
  audio_url?: string
  transcription?: string
  media_url?: string
  created_at: string
}

export interface Conversation {
  phone_number: string
  contact_name: string | null
  last_message_text: string | null
  last_message_at: string | null
  last_sender: string | null
  manually_closed: boolean
  unread_count: number
  status?: string
  status_color?: string
}

export const whatsappService = {
  async getConversations() {
    const { data, error } = await supabase
      .from('conversation_status')
      .select('*')
      .order('last_message_at', { ascending: false, nullsFirst: false })

    if (error) throw error

    // Deduplica por número base (remove sufixo JID), mantendo a entrada mais recente
    const seen = new Set<string>()
    return (data || []).filter((conv) => {
      const key = normalizePhone(conv.phone_number)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  },

  async getMessages(phoneNumber: string) {
    const base = normalizePhone(phoneNumber)
    // Busca mensagens com qualquer formato de phone_number (número limpo ou JID do WhatsApp)
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(
        `phone_number.eq.${base},phone_number.eq.${base}@s.whatsapp.net,phone_number.eq.${base}@c.us`,
      )
      .order('created_at', { ascending: true })

    if (error) throw error
    return data
  },

  async sendMessage(phoneNumber: string, text: string) {
    const base = normalizePhone(phoneNumber)

    // 1. Insere mensagem sempre com número normalizado
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        phone_number: base,
        sender: 'me',
        message_text: text,
      })
      .select()
      .single()

    if (messageError) throw messageError

    // 2. Atualiza conversa — tenta com número limpo e formato JID
    const { error: convError } = await supabase
      .from('conversations')
      .update({
        last_message_text: text,
        last_message_at: new Date().toISOString(),
        last_sender: 'me',
      })
      .or(
        `phone_number.eq.${base},phone_number.eq.${base}@s.whatsapp.net,phone_number.eq.${base}@c.us`,
      )

    if (convError) throw convError

    return message
  },

  async getAISuggestion(phoneNumber: string) {
    const base = normalizePhone(phoneNumber)
    const { data, error } = await supabase
      .from('suggestions')
      .select('*')
      .or(
        `phone_number.eq.${base},phone_number.eq.${base}@s.whatsapp.net,phone_number.eq.${base}@c.us`,
      )
      .is('approved_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) throw error
    return data
  },

  async approveSuggestion(
    suggestionId: string,
    phoneNumber: string,
    text: string,
  ) {
    return this.sendFinalMessage(phoneNumber, text, suggestionId)
  },

  async sendFinalMessage(
    phoneNumber: string,
    text: string,
    suggestionId?: string,
  ) {
    const base = normalizePhone(phoneNumber)
    const { data, error } = await supabase.functions.invoke('enviar-mensagem', {
      body: {
        suggestion_id: suggestionId,
        final_text: text,
        phone_number: base,
      },
    })

    if (error) throw error
    return data
  },

  async getDashboardStats(startDate: Date, endDate: Date) {
    const { data, error } = await supabase.rpc('get_dashboard_stats', {
      p_start_date: startDate.toISOString(),
      p_end_date: endDate.toISOString(),
    })

    if (error) {
      console.error('Error fetching dashboard stats from RPC', error)
      return null
    }

    return data && data.length > 0 ? data[0] : null
  },

  async getConversationsPerDay(startDate: Date, endDate: Date) {
    const { data, error } = await supabase.rpc(
      'get_chart_conversations_per_day',
      {
        p_start_date: startDate.toISOString(),
        p_end_date: endDate.toISOString(),
      },
    )

    if (error) {
      console.error('Error fetching conv per day from RPC', error)
      return []
    }

    return data || []
  },

  async getAIPerformance(startDate: Date, endDate: Date) {
    const { data, error } = await supabase.rpc('get_chart_ai_performance', {
      p_start_date: startDate.toISOString(),
      p_end_date: endDate.toISOString(),
    })

    if (error) {
      console.error('Error fetching AI performance from RPC', error)
      return []
    }

    return data || []
  },

  async getStatusDistribution() {
    const { data, error } = await supabase
      .from('chart_status_distribution')
      .select('*')

    if (error) throw error
    return data
  },

  async getTopRules() {
    const { data, error } = await supabase
      .from('autonomous_rules')
      .select('rule_name, usage_count')
      .order('usage_count', { ascending: false })
      .limit(5)

    if (error) throw error
    return data
  },

  async getLastUpdatedConversations() {
    const { data, error } = await supabase
      .from('conversation_status')
      .select('*')
      .order('last_message_at', { ascending: false, nullsFirst: false })
      .limit(10)

    if (error) throw error
    return data
  },

  // AI Agent Rules
  async getAutonomousRules() {
    const { data, error } = await supabase
      .from('autonomous_rules')
      .select('*')
      .order('priority', { ascending: false })
    if (error) throw error
    return data
  },

  async createAutonomousRule(rule: any) {
    const { data, error } = await supabase
      .from('autonomous_rules')
      .insert(rule)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async updateAutonomousRule(id: string, rule: any) {
    const { data, error } = await supabase
      .from('autonomous_rules')
      .update(rule)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async deleteAutonomousRule(id: string) {
    const { error } = await supabase
      .from('autonomous_rules')
      .delete()
      .eq('id', id)
    if (error) throw error
  },

  // Training Feedback
  async getTrainingFeedback(status: string = 'pending') {
    const { data, error } = await supabase
      .from('training_feedback')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async updateFeedbackStatus(id: string, status: string, notes?: string) {
    const { data, error } = await supabase
      .from('training_feedback')
      .update({
        status,
        reviewed_notes: notes,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  // AI Prompts
  async getAIPrompts() {
    const { data, error } = await supabase
      .from('ai_prompts')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async updateAIPrompt(id: string, content: string) {
    const { data, error } = await supabase
      .from('ai_prompts')
      .update({ prompt_content: content })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async closeConversation(phoneNumber: string) {
    const base = normalizePhone(phoneNumber)
    const { error } = await supabase
      .from('conversations')
      .update({ manually_closed: true })
      .or(
        `phone_number.eq.${base},phone_number.eq.${base}@s.whatsapp.net,phone_number.eq.${base}@c.us`,
      )
    if (error) throw error
  },

  async reopenConversation(phoneNumber: string) {
    const base = normalizePhone(phoneNumber)
    const { error } = await supabase
      .from('conversations')
      .update({ manually_closed: false })
      .or(
        `phone_number.eq.${base},phone_number.eq.${base}@s.whatsapp.net,phone_number.eq.${base}@c.us`,
      )
    if (error) throw error
  },
}
