export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.1'
  }
  public: {
    Tables: {
      ai_prompts: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          performance_notes: string | null
          prompt_content: string
          prompt_name: string
          version: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          performance_notes?: string | null
          prompt_content: string
          prompt_name: string
          version?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          performance_notes?: string | null
          prompt_content?: string
          prompt_name?: string
          version?: string | null
        }
        Relationships: []
      }
      autonomous_rules: {
        Row: {
          auto_send: boolean | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          last_used_at: string | null
          priority: number | null
          response_template: string | null
          rule_name: string
          should_close: boolean | null
          trigger_patterns: string[] | null
          updated_at: string | null
          usage_count: number | null
        }
        Insert: {
          auto_send?: boolean | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          priority?: number | null
          response_template?: string | null
          rule_name: string
          should_close?: boolean | null
          trigger_patterns?: string[] | null
          updated_at?: string | null
          usage_count?: number | null
        }
        Update: {
          auto_send?: boolean | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          priority?: number | null
          response_template?: string | null
          rule_name?: string
          should_close?: boolean | null
          trigger_patterns?: string[] | null
          updated_at?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      calendar_events: {
        Row: {
          attendees: Json | null
          client_email: string | null
          client_phone: string | null
          created_at: string | null
          description: string | null
          end_at: string | null
          google_event_id: string
          id: string
          meet_link: string | null
          reschedule_link: string | null
          start_at: string
          status: string | null
          synced_at: string | null
          title: string | null
        }
        Insert: {
          attendees?: Json | null
          client_email?: string | null
          client_phone?: string | null
          created_at?: string | null
          description?: string | null
          end_at?: string | null
          google_event_id: string
          id?: string
          meet_link?: string | null
          reschedule_link?: string | null
          start_at: string
          status?: string | null
          synced_at?: string | null
          title?: string | null
        }
        Update: {
          attendees?: Json | null
          client_email?: string | null
          client_phone?: string | null
          created_at?: string | null
          description?: string | null
          end_at?: string | null
          google_event_id?: string
          id?: string
          meet_link?: string | null
          reschedule_link?: string | null
          start_at?: string
          status?: string | null
          synced_at?: string | null
          title?: string | null
        }
        Relationships: []
      }
      client_profiles: {
        Row: {
          contact_name: string | null
          created_at: string | null
          email: string | null
          emails_alternativos: string[] | null
          id: string
          next_meeting_at: string | null
          next_meeting_link: string | null
          observations: string | null
          phone_number: string
          propriedade: boolean
          tags: string[] | null
          tipos: string[] | null
          updated_at: string | null
        }
        Insert: {
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          emails_alternativos?: string[] | null
          id?: string
          next_meeting_at?: string | null
          next_meeting_link?: string | null
          observations?: string | null
          phone_number: string
          propriedade?: boolean
          tags?: string[] | null
          tipos?: string[] | null
          updated_at?: string | null
        }
        Update: {
          contact_name?: string | null
          created_at?: string | null
          email?: string | null
          emails_alternativos?: string[] | null
          id?: string
          next_meeting_at?: string | null
          next_meeting_link?: string | null
          observations?: string | null
          phone_number?: string
          propriedade?: boolean
          tags?: string[] | null
          tipos?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      conversation_embeddings: {
        Row: {
          conversation_date: string | null
          conversation_id: string | null
          conversation_summary: string | null
          conversation_theme: string | null
          created_at: string | null
          embedding: string | null
          id: string
          message_count: number | null
          outcome: string | null
          phone_number: string | null
          quality_score: number | null
          tone: string | null
        }
        Insert: {
          conversation_date?: string | null
          conversation_id?: string | null
          conversation_summary?: string | null
          conversation_theme?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: string
          message_count?: number | null
          outcome?: string | null
          phone_number?: string | null
          quality_score?: number | null
          tone?: string | null
        }
        Update: {
          conversation_date?: string | null
          conversation_id?: string | null
          conversation_summary?: string | null
          conversation_theme?: string | null
          created_at?: string | null
          embedding?: string | null
          id?: string
          message_count?: number | null
          outcome?: string | null
          phone_number?: string | null
          quality_score?: number | null
          tone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'conversation_embeddings_conversation_id_fkey'
            columns: ['conversation_id']
            isOneToOne: false
            referencedRelation: 'conversations'
            referencedColumns: ['id']
          },
        ]
      }
      conversation_finalizers: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          keyword: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          keyword: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          keyword?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          client_id: string | null
          contact_name: string | null
          created_at: string | null
          id: string
          last_execution_id: string | null
          last_message_at: string | null
          last_message_text: string | null
          last_sender: string | null
          manually_closed: boolean | null
          notes: string | null
          phone_number: string
          remote_jid: string | null
          tags: string[] | null
          unread_count: number | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          contact_name?: string | null
          created_at?: string | null
          id?: string
          last_execution_id?: string | null
          last_message_at?: string | null
          last_message_text?: string | null
          last_sender?: string | null
          manually_closed?: boolean | null
          notes?: string | null
          phone_number: string
          remote_jid?: string | null
          tags?: string[] | null
          unread_count?: number | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          contact_name?: string | null
          created_at?: string | null
          id?: string
          last_execution_id?: string | null
          last_message_at?: string | null
          last_message_text?: string | null
          last_sender?: string | null
          manually_closed?: boolean | null
          notes?: string | null
          phone_number?: string
          remote_jid?: string | null
          tags?: string[] | null
          unread_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'conversations_client_id_fkey'
            columns: ['client_id']
            isOneToOne: false
            referencedRelation: 'client_profiles'
            referencedColumns: ['id']
          },
        ]
      }
      messages: {
        Row: {
          audio_url: string | null
          conversation_id: string | null
          created_at: string | null
          id: string
          is_audio: boolean | null
          media_url: string | null
          message_hash: string | null
          message_text: string | null
          message_type: string | null
          phone_number: string | null
          remote_jid: string | null
          sender: string
          transcription: string | null
        }
        Insert: {
          audio_url?: string | null
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          is_audio?: boolean | null
          media_url?: string | null
          message_hash?: string | null
          message_text?: string | null
          message_type?: string | null
          phone_number?: string | null
          remote_jid?: string | null
          sender: string
          transcription?: string | null
        }
        Update: {
          audio_url?: string | null
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          is_audio?: boolean | null
          media_url?: string | null
          message_hash?: string | null
          message_text?: string | null
          message_type?: string | null
          phone_number?: string | null
          remote_jid?: string | null
          sender?: string
          transcription?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'messages_conversation_id_fkey'
            columns: ['conversation_id']
            isOneToOne: false
            referencedRelation: 'conversations'
            referencedColumns: ['id']
          },
        ]
      }
      meus_clientes: {
        Row: {
          call_1_date: string | null
          call_1_link: string | null
          call_10_date: string | null
          call_10_link: string | null
          call_11_date: string | null
          call_11_link: string | null
          call_12_date: string | null
          call_12_link: string | null
          call_2_date: string | null
          call_2_link: string | null
          call_3_date: string | null
          call_3_link: string | null
          call_4_date: string | null
          call_4_link: string | null
          call_5_date: string | null
          call_5_link: string | null
          call_6_date: string | null
          call_6_link: string | null
          call_7_date: string | null
          call_7_link: string | null
          call_8_date: string | null
          call_8_link: string | null
          call_9_date: string | null
          call_9_link: string | null
          client_id: string
          created_at: string
          csat_1: number | null
          csat_10: number | null
          csat_11: number | null
          csat_12: number | null
          csat_2: number | null
          csat_3: number | null
          csat_4: number | null
          csat_5: number | null
          csat_6: number | null
          csat_7: number | null
          csat_8: number | null
          csat_9: number | null
          csat_comment_1: string | null
          csat_comment_10: string | null
          csat_comment_11: string | null
          csat_comment_12: string | null
          csat_comment_2: string | null
          csat_comment_3: string | null
          csat_comment_4: string | null
          csat_comment_5: string | null
          csat_comment_6: string | null
          csat_comment_7: string | null
          csat_comment_8: string | null
          csat_comment_9: string | null
          etapa_negocio: string | null
          id: string
          tldv_link: string | null
          updated_at: string
        }
        Insert: {
          call_1_date?: string | null
          call_1_link?: string | null
          call_10_date?: string | null
          call_10_link?: string | null
          call_11_date?: string | null
          call_11_link?: string | null
          call_12_date?: string | null
          call_12_link?: string | null
          call_2_date?: string | null
          call_2_link?: string | null
          call_3_date?: string | null
          call_3_link?: string | null
          call_4_date?: string | null
          call_4_link?: string | null
          call_5_date?: string | null
          call_5_link?: string | null
          call_6_date?: string | null
          call_6_link?: string | null
          call_7_date?: string | null
          call_7_link?: string | null
          call_8_date?: string | null
          call_8_link?: string | null
          call_9_date?: string | null
          call_9_link?: string | null
          client_id: string
          created_at?: string
          csat_1?: number | null
          csat_10?: number | null
          csat_11?: number | null
          csat_12?: number | null
          csat_2?: number | null
          csat_3?: number | null
          csat_4?: number | null
          csat_5?: number | null
          csat_6?: number | null
          csat_7?: number | null
          csat_8?: number | null
          csat_9?: number | null
          csat_comment_1?: string | null
          csat_comment_10?: string | null
          csat_comment_11?: string | null
          csat_comment_12?: string | null
          csat_comment_2?: string | null
          csat_comment_3?: string | null
          csat_comment_4?: string | null
          csat_comment_5?: string | null
          csat_comment_6?: string | null
          csat_comment_7?: string | null
          csat_comment_8?: string | null
          csat_comment_9?: string | null
          etapa_negocio?: string | null
          id?: string
          tldv_link?: string | null
          updated_at?: string
        }
        Update: {
          call_1_date?: string | null
          call_1_link?: string | null
          call_10_date?: string | null
          call_10_link?: string | null
          call_11_date?: string | null
          call_11_link?: string | null
          call_12_date?: string | null
          call_12_link?: string | null
          call_2_date?: string | null
          call_2_link?: string | null
          call_3_date?: string | null
          call_3_link?: string | null
          call_4_date?: string | null
          call_4_link?: string | null
          call_5_date?: string | null
          call_5_link?: string | null
          call_6_date?: string | null
          call_6_link?: string | null
          call_7_date?: string | null
          call_7_link?: string | null
          call_8_date?: string | null
          call_8_link?: string | null
          call_9_date?: string | null
          call_9_link?: string | null
          client_id?: string
          created_at?: string
          csat_1?: number | null
          csat_10?: number | null
          csat_11?: number | null
          csat_12?: number | null
          csat_2?: number | null
          csat_3?: number | null
          csat_4?: number | null
          csat_5?: number | null
          csat_6?: number | null
          csat_7?: number | null
          csat_8?: number | null
          csat_9?: number | null
          csat_comment_1?: string | null
          csat_comment_10?: string | null
          csat_comment_11?: string | null
          csat_comment_12?: string | null
          csat_comment_2?: string | null
          csat_comment_3?: string | null
          csat_comment_4?: string | null
          csat_comment_5?: string | null
          csat_comment_6?: string | null
          csat_comment_7?: string | null
          csat_comment_8?: string | null
          csat_comment_9?: string | null
          etapa_negocio?: string | null
          id?: string
          tldv_link?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'meus_clientes_client_id_fkey'
            columns: ['client_id']
            isOneToOne: true
            referencedRelation: 'client_profiles'
            referencedColumns: ['id']
          },
        ]
      }
      suggestions: {
        Row: {
          approved_at: string | null
          auto_send: boolean | null
          context_messages: Json | null
          conversation_id: string | null
          created_at: string | null
          edit_diff: string | null
          id: string
          is_gold_standard: boolean | null
          matched_rule_id: string | null
          matched_rule_name: string | null
          phone_number: string | null
          quality_rating: number | null
          sent_text: string | null
          status: string | null
          suggestion_text: string
          use_for_training: boolean | null
          was_edited: boolean | null
        }
        Insert: {
          approved_at?: string | null
          auto_send?: boolean | null
          context_messages?: Json | null
          conversation_id?: string | null
          created_at?: string | null
          edit_diff?: string | null
          id?: string
          is_gold_standard?: boolean | null
          matched_rule_id?: string | null
          matched_rule_name?: string | null
          phone_number?: string | null
          quality_rating?: number | null
          sent_text?: string | null
          status?: string | null
          suggestion_text: string
          use_for_training?: boolean | null
          was_edited?: boolean | null
        }
        Update: {
          approved_at?: string | null
          auto_send?: boolean | null
          context_messages?: Json | null
          conversation_id?: string | null
          created_at?: string | null
          edit_diff?: string | null
          id?: string
          is_gold_standard?: boolean | null
          matched_rule_id?: string | null
          matched_rule_name?: string | null
          phone_number?: string | null
          quality_rating?: number | null
          sent_text?: string | null
          status?: string | null
          suggestion_text?: string
          use_for_training?: boolean | null
          was_edited?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: 'suggestions_conversation_id_fkey'
            columns: ['conversation_id']
            isOneToOne: false
            referencedRelation: 'conversations'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'suggestions_matched_rule_id_fkey'
            columns: ['matched_rule_id']
            isOneToOne: false
            referencedRelation: 'autonomous_rules'
            referencedColumns: ['id']
          },
        ]
      }
      tldv_meetings: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          meeting_date: string | null
          meeting_title: string | null
          participant_emails: string[] | null
          phone_number: string | null
          summary: string | null
          tldv_link: string
          transcript: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          meeting_date?: string | null
          meeting_title?: string | null
          participant_emails?: string[] | null
          phone_number?: string | null
          summary?: string | null
          tldv_link: string
          transcript?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          meeting_date?: string | null
          meeting_title?: string | null
          participant_emails?: string[] | null
          phone_number?: string | null
          summary?: string | null
          tldv_link?: string
          transcript?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'tldv_meetings_client_id_fkey'
            columns: ['client_id']
            isOneToOne: false
            referencedRelation: 'client_profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'tldv_meetings_phone_number_fkey'
            columns: ['phone_number']
            isOneToOne: false
            referencedRelation: 'client_profiles'
            referencedColumns: ['phone_number']
          },
        ]
      }
      training_feedback: {
        Row: {
          created_at: string | null
          current_value: string | null
          description: string | null
          evidence: Json | null
          feedback_type: string | null
          id: string
          reviewed_at: string | null
          reviewed_notes: string | null
          status: string | null
          suggested_value: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          current_value?: string | null
          description?: string | null
          evidence?: Json | null
          feedback_type?: string | null
          id?: string
          reviewed_at?: string | null
          reviewed_notes?: string | null
          status?: string | null
          suggested_value?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          current_value?: string | null
          description?: string | null
          evidence?: Json | null
          feedback_type?: string | null
          id?: string
          reviewed_at?: string | null
          reviewed_notes?: string | null
          status?: string | null
          suggested_value?: string | null
          title?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      chart_ai_performance: {
        Row: {
          approved: number | null
          date: string | null
          edited: number | null
        }
        Relationships: []
      }
      chart_conversations_per_day: {
        Row: {
          count: number | null
          date: string | null
        }
        Relationships: []
      }
      chart_status_distribution: {
        Row: {
          count: number | null
          status: string | null
        }
        Relationships: []
      }
      conversation_status: {
        Row: {
          contact_name: string | null
          last_message_at: string | null
          last_message_text: string | null
          last_sender: string | null
          phone_number: string | null
          status: string | null
          status_color: string | null
          unread_count: number | null
        }
        Relationships: []
      }
      dashboard_kpis: {
        Row: {
          active_conversations: number | null
          ai_approval_rate: number | null
          avg_response_time: number | null
          messages_today: number | null
          pending_suggestions: number | null
          rules_today: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_business_seconds: {
        Args: { end_ts: string; start_ts: string }
        Returns: number
      }
      get_chart_ai_performance: {
        Args: { p_end_date: string; p_start_date: string }
        Returns: {
          approved: number
          date: string
          edited: number
        }[]
      }
      get_chart_conversations_per_day: {
        Args: { p_end_date: string; p_start_date: string }
        Returns: {
          count: number
          date: string
        }[]
      }
      get_dashboard_stats: {
        Args: { p_end_date: string; p_start_date: string }
        Returns: {
          active_conversations: number
          ai_approval_rate: number
          avg_response_time: number
          clients_served: number
          messages_received: number
          pending_suggestions: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
