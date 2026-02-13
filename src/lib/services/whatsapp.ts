import { supabase } from '@/lib/supabase/client'

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
      .order('last_message_at', { ascending: false })

    if (error) throw error
    return data
  },

  async getMessages(phoneNumber: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('phone_number', phoneNumber)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data
  },

  async sendMessage(phoneNumber: string, text: string) {
    const { data: userData } = await supabase.auth.getUser()

    // 1. Insert message
    const { data: message, error: messageError } = await supabase
      .from('messages')
      .insert({
        phone_number: phoneNumber,
        sender: 'me',
        message_text: text,
      })
      .select()
      .single()

    if (messageError) throw messageError

    // 2. Update conversation
    const { error: convError } = await supabase
      .from('conversations')
      .update({
        last_message_text: text,
        last_message_at: new Date().toISOString(),
        last_sender: 'me',
      })
      .eq('phone_number', phoneNumber)

    if (convError) throw convError

    return message
  },

  async getAISuggestion(phoneNumber: string) {
    const { data, error } = await supabase
      .from('suggestions')
      .select('*')
      .eq('phone_number', phoneNumber)
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
    const { data, error } = await supabase.functions.invoke('enviar-mensagem', {
      body: {
        suggestion_id: suggestionId,
        final_text: text,
        phone_number: phoneNumber,
      },
    })

    if (error) throw error
    return data
  },

  async getDashboardStats() {
    const { data, error } = await supabase
      .from('dashboard_kpis')
      .select('*')
      .single()

    if (error) throw error
    return data
  },

  async getConversationsPerDay() {
    const { data, error } = await supabase
      .from('chart_conversations_per_day')
      .select('*')

    if (error) throw error
    return data
  },

  async getAIPerformance() {
    const { data, error } = await supabase
      .from('chart_ai_performance')
      .select('*')

    if (error) throw error
    return data
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
    const { error } = await supabase
      .from('conversations')
      .update({ manually_closed: true })
      .eq('phone_number', phoneNumber)
    if (error) throw error
  },

  async reopenConversation(phoneNumber: string) {
    const { error } = await supabase
      .from('conversations')
      .update({ manually_closed: false })
      .eq('phone_number', phoneNumber)
    if (error) throw error
  },
}
