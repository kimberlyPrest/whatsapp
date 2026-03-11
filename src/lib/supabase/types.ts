// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
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
    PostgrestVersion: "14.1"
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
          client_id: string | null
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
          client_id?: string | null
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
          client_id?: string | null
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
        Relationships: [
          {
            foreignKeyName: "calendar_events_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_calls: {
        Row: {
          call_date: string | null
          call_link: string | null
          call_number: number
          client_id: string
          created_at: string
          csat_comment: string | null
          csat_score: number | null
          id: string
          tldv_meeting_id: string | null
          updated_at: string
        }
        Insert: {
          call_date?: string | null
          call_link?: string | null
          call_number: number
          client_id: string
          created_at?: string
          csat_comment?: string | null
          csat_score?: number | null
          id?: string
          tldv_meeting_id?: string | null
          updated_at?: string
        }
        Update: {
          call_date?: string | null
          call_link?: string | null
          call_number?: number
          client_id?: string
          created_at?: string
          csat_comment?: string | null
          csat_score?: number | null
          id?: string
          tldv_meeting_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_calls_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_calls_tldv_meeting_id_fkey"
            columns: ["tldv_meeting_id"]
            isOneToOne: false
            referencedRelation: "tldv_meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      client_health_scores: {
        Row: {
          calculated_at: string | null
          client_id: string
          csat_avg: number | null
          days_since_contact: number | null
          engagement_score: number | null
          id: string
          overall_score: number | null
          response_time_score: number | null
          risk_level: string | null
        }
        Insert: {
          calculated_at?: string | null
          client_id: string
          csat_avg?: number | null
          days_since_contact?: number | null
          engagement_score?: number | null
          id?: string
          overall_score?: number | null
          response_time_score?: number | null
          risk_level?: string | null
        }
        Update: {
          calculated_at?: string | null
          client_id?: string
          csat_avg?: number | null
          days_since_contact?: number | null
          engagement_score?: number | null
          id?: string
          overall_score?: number | null
          response_time_score?: number | null
          risk_level?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_health_scores_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "client_profiles"
            referencedColumns: ["id"]
          },
        ]
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
          tldv_link: string | null
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
          tldv_link?: string | null
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
          tldv_link?: string | null
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
          source_type: string
          tldv_meeting_id: string | null
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
          source_type?: string
          tldv_meeting_id?: string | null
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
          source_type?: string
          tldv_meeting_id?: string | null
          tone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_embeddings_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversation_embeddings_tldv_meeting_id_fkey"
            columns: ["tldv_meeting_id"]
            isOneToOne: false
            referencedRelation: "tldv_meetings"
            referencedColumns: ["id"]
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
            foreignKeyName: "conversations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      message_templates: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
          usage_count: number | null
          variables: string[] | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
          usage_count?: number | null
          variables?: string[] | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          usage_count?: number | null
          variables?: string[] | null
        }
        Relationships: []
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
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      meus_clientes: {
        Row: {
          client_id: string
          created_at: string
          etapa_negocio: string | null
          id: string
          tldv_link: string | null
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          etapa_negocio?: string | null
          id?: string
          tldv_link?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          etapa_negocio?: string | null
          id?: string
          tldv_link?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meus_clientes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "client_profiles"
            referencedColumns: ["id"]
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
            foreignKeyName: "suggestions_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suggestions_matched_rule_id_fkey"
            columns: ["matched_rule_id"]
            isOneToOne: false
            referencedRelation: "autonomous_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      tldv_meetings: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          match_status: string | null
          matched_email: string | null
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
          match_status?: string | null
          matched_email?: string | null
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
          match_status?: string | null
          matched_email?: string | null
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
            foreignKeyName: "tldv_meetings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_profiles"
            referencedColumns: ["id"]
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
      webhook_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          event_type: string | null
          id: string
          payload: Json | null
          processing_status: string | null
          processing_time_ms: number | null
          source: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          event_type?: string | null
          id?: string
          payload?: Json | null
          processing_status?: string | null
          processing_time_ms?: number | null
          source: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          event_type?: string | null
          id?: string
          payload?: Json | null
          processing_status?: string | null
          processing_time_ms?: number | null
          source?: string
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
      match_tldv_to_client: {
        Args: { p_participant_emails: string[]; p_tldv_meeting_id: string }
        Returns: string
      }
      search_conversations: {
        Args: {
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          conversation_id: string
          phone_number: string
          similarity: number
          summary: string
        }[]
      }
      search_embeddings: {
        Args: {
          match_count?: number
          min_score?: number
          query_embedding: string
          source_filter?: string
        }
        Returns: {
          conversation_id: string
          conversation_summary: string
          conversation_theme: string
          id: string
          quality_score: number
          similarity: number
          source_type: string
          tldv_meeting_id: string
          tone: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const


// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: ai_prompts
//   id: uuid (not null, default: gen_random_uuid())
//   prompt_name: text (not null)
//   prompt_content: text (not null)
//   version: text (nullable)
//   is_active: boolean (nullable, default: true)
//   performance_notes: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: autonomous_rules
//   id: uuid (not null, default: gen_random_uuid())
//   rule_name: text (not null)
//   description: text (nullable)
//   trigger_patterns: _text (nullable)
//   response_template: text (nullable)
//   is_active: boolean (nullable, default: true)
//   priority: integer (nullable, default: 1)
//   auto_send: boolean (nullable, default: false)
//   should_close: boolean (nullable, default: false)
//   usage_count: integer (nullable, default: 0)
//   last_used_at: timestamp with time zone (nullable)
//   created_by: uuid (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: calendar_events
//   id: uuid (not null, default: gen_random_uuid())
//   google_event_id: text (not null)
//   title: text (nullable)
//   description: text (nullable)
//   start_at: timestamp with time zone (not null)
//   end_at: timestamp with time zone (nullable)
//   meet_link: text (nullable)
//   attendees: jsonb (nullable, default: '[]'::jsonb)
//   client_phone: text (nullable)
//   client_email: text (nullable)
//   status: text (nullable, default: 'confirmed'::text)
//   synced_at: timestamp with time zone (nullable, default: now())
//   created_at: timestamp with time zone (nullable, default: now())
//   reschedule_link: text (nullable)
//   client_id: uuid (nullable)
// Table: chart_ai_performance
//   date: date (nullable)
//   approved: bigint (nullable)
//   edited: bigint (nullable)
// Table: chart_conversations_per_day
//   date: date (nullable)
//   count: bigint (nullable)
// Table: chart_status_distribution
//   status: text (nullable)
//   count: bigint (nullable)
// Table: client_calls
//   id: uuid (not null, default: gen_random_uuid())
//   client_id: uuid (not null)
//   call_number: integer (not null)
//   call_date: date (nullable)
//   call_link: text (nullable)
//   csat_score: numeric (nullable)
//   csat_comment: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   tldv_meeting_id: uuid (nullable)
// Table: client_health_scores
//   id: uuid (not null, default: gen_random_uuid())
//   client_id: uuid (not null)
//   overall_score: numeric (nullable)
//   engagement_score: numeric (nullable)
//   response_time_score: numeric (nullable)
//   csat_avg: numeric (nullable)
//   days_since_contact: integer (nullable)
//   risk_level: text (nullable, default: 'healthy'::text)
//   calculated_at: timestamp with time zone (nullable, default: now())
// Table: client_profiles
//   id: uuid (not null, default: gen_random_uuid())
//   phone_number: text (not null)
//   contact_name: text (nullable)
//   email: text (nullable)
//   tipos: _text (nullable, default: '{}'::text[])
//   tags: _text (nullable, default: '{}'::text[])
//   observations: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   propriedade: boolean (not null, default: false)
//   next_meeting_at: timestamp with time zone (nullable)
//   next_meeting_link: text (nullable)
//   emails_alternativos: _text (nullable, default: '{}'::text[])
//   tldv_link: text (nullable)
// Table: conversation_embeddings
//   id: uuid (not null, default: gen_random_uuid())
//   phone_number: text (nullable)
//   conversation_summary: text (nullable)
//   conversation_theme: text (nullable)
//   outcome: text (nullable)
//   tone: text (nullable)
//   quality_score: numeric (nullable)
//   message_count: integer (nullable)
//   embedding: vector (nullable)
//   conversation_date: date (nullable, default: CURRENT_DATE)
//   created_at: timestamp with time zone (nullable, default: now())
//   conversation_id: uuid (nullable)
//   source_type: text (not null, default: 'conversation'::text)
//   tldv_meeting_id: uuid (nullable)
// Table: conversation_finalizers
//   id: uuid (not null, default: gen_random_uuid())
//   keyword: text (not null)
//   is_active: boolean (nullable, default: true)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: conversation_status
//   phone_number: text (nullable)
//   contact_name: text (nullable)
//   last_message_at: timestamp with time zone (nullable)
//   last_message_text: text (nullable)
//   last_sender: text (nullable)
//   unread_count: integer (nullable)
//   status: text (nullable)
//   status_color: text (nullable)
// Table: conversations
//   phone_number: text (not null)
//   contact_name: text (nullable)
//   last_message_text: text (nullable)
//   last_message_at: timestamp with time zone (nullable)
//   last_sender: text (nullable)
//   manually_closed: boolean (nullable, default: false)
//   unread_count: integer (nullable, default: 0)
//   notes: text (nullable)
//   tags: _text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   last_execution_id: text (nullable)
//   remote_jid: text (nullable)
//   id: uuid (not null, default: gen_random_uuid())
//   client_id: uuid (nullable)
// Table: dashboard_kpis
//   avg_response_time: numeric (nullable)
//   active_conversations: bigint (nullable)
//   pending_suggestions: bigint (nullable)
//   ai_approval_rate: numeric (nullable)
//   messages_today: bigint (nullable)
//   rules_today: bigint (nullable)
// Table: message_templates
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   category: text (nullable)
//   content: text (not null)
//   variables: _text (nullable)
//   usage_count: integer (nullable, default: 0)
//   is_active: boolean (nullable, default: true)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: messages
//   id: uuid (not null, default: gen_random_uuid())
//   phone_number: text (nullable)
//   sender: text (not null)
//   message_text: text (nullable)
//   message_type: text (nullable, default: 'text'::text)
//   is_audio: boolean (nullable, default: false)
//   audio_url: text (nullable)
//   transcription: text (nullable)
//   media_url: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   message_hash: text (nullable)
//   remote_jid: text (nullable)
//   conversation_id: uuid (nullable)
// Table: meus_clientes
//   id: uuid (not null, default: gen_random_uuid())
//   client_id: uuid (not null)
//   tldv_link: text (nullable)
//   etapa_negocio: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: suggestions
//   id: uuid (not null, default: gen_random_uuid())
//   phone_number: text (nullable)
//   context_messages: jsonb (nullable)
//   suggestion_text: text (not null)
//   sent_text: text (nullable)
//   was_edited: boolean (nullable, default: false)
//   edit_diff: text (nullable)
//   approved_at: timestamp with time zone (nullable)
//   quality_rating: integer (nullable)
//   use_for_training: boolean (nullable, default: true)
//   created_at: timestamp with time zone (nullable, default: now())
//   auto_send: boolean (nullable, default: false)
//   matched_rule_id: uuid (nullable)
//   matched_rule_name: text (nullable)
//   is_gold_standard: boolean (nullable, default: false)
//   status: text (nullable, default: 'pending'::text)
//   conversation_id: uuid (nullable)
// Table: tldv_meetings
//   id: uuid (not null, default: gen_random_uuid())
//   phone_number: text (nullable)
//   meeting_title: text (nullable)
//   tldv_link: text (not null)
//   transcript: text (nullable)
//   summary: text (nullable)
//   participant_emails: _text (nullable, default: '{}'::text[])
//   meeting_date: timestamp with time zone (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   client_id: uuid (nullable)
//   match_status: text (nullable, default: 'matched'::text)
//   matched_email: text (nullable)
// Table: training_feedback
//   id: uuid (not null, default: gen_random_uuid())
//   feedback_type: text (nullable)
//   title: text (nullable)
//   description: text (nullable)
//   current_value: text (nullable)
//   suggested_value: text (nullable)
//   evidence: jsonb (nullable)
//   status: text (nullable, default: 'pending'::text)
//   reviewed_at: timestamp with time zone (nullable)
//   reviewed_notes: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: webhook_logs
//   id: uuid (not null, default: gen_random_uuid())
//   source: text (not null)
//   event_type: text (nullable)
//   payload: jsonb (nullable)
//   processing_status: text (nullable, default: 'received'::text)
//   error_message: text (nullable)
//   processing_time_ms: integer (nullable)
//   created_at: timestamp with time zone (nullable, default: now())

// --- CONSTRAINTS ---
// Table: ai_prompts
//   PRIMARY KEY ai_prompts_pkey: PRIMARY KEY (id)
// Table: autonomous_rules
//   FOREIGN KEY autonomous_rules_created_by_fkey: FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL
//   PRIMARY KEY autonomous_rules_pkey: PRIMARY KEY (id)
//   UNIQUE autonomous_rules_rule_name_key: UNIQUE (rule_name)
// Table: calendar_events
//   FOREIGN KEY calendar_events_client_id_fkey: FOREIGN KEY (client_id) REFERENCES client_profiles(id)
//   UNIQUE calendar_events_google_event_id_key: UNIQUE (google_event_id)
//   PRIMARY KEY calendar_events_pkey: PRIMARY KEY (id)
// Table: client_calls
//   CHECK client_calls_call_number_check: CHECK (((call_number >= 1) AND (call_number <= 99)))
//   FOREIGN KEY client_calls_client_id_fkey: FOREIGN KEY (client_id) REFERENCES client_profiles(id) ON DELETE CASCADE
//   PRIMARY KEY client_calls_pkey: PRIMARY KEY (id)
//   FOREIGN KEY client_calls_tldv_meeting_id_fkey: FOREIGN KEY (tldv_meeting_id) REFERENCES tldv_meetings(id) ON DELETE SET NULL
//   UNIQUE client_calls_unique_per_client: UNIQUE (client_id, call_number)
// Table: client_health_scores
//   FOREIGN KEY client_health_scores_client_id_fkey: FOREIGN KEY (client_id) REFERENCES client_profiles(id) ON DELETE CASCADE
//   UNIQUE client_health_scores_client_id_key: UNIQUE (client_id)
//   PRIMARY KEY client_health_scores_pkey: PRIMARY KEY (id)
// Table: client_profiles
//   UNIQUE client_profiles_phone_number_key: UNIQUE (phone_number)
//   PRIMARY KEY client_profiles_pkey: PRIMARY KEY (id)
// Table: conversation_embeddings
//   FOREIGN KEY conversation_embeddings_conversation_id_fkey: FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
//   PRIMARY KEY conversation_embeddings_pkey: PRIMARY KEY (id)
//   CHECK conversation_embeddings_source_type_check: CHECK ((source_type = ANY (ARRAY['conversation'::text, 'tldv_transcript'::text])))
//   FOREIGN KEY conversation_embeddings_tldv_meeting_id_fkey: FOREIGN KEY (tldv_meeting_id) REFERENCES tldv_meetings(id)
// Table: conversation_finalizers
//   UNIQUE conversation_finalizers_keyword_key: UNIQUE (keyword)
//   PRIMARY KEY conversation_finalizers_pkey: PRIMARY KEY (id)
// Table: conversations
//   FOREIGN KEY conversations_client_id_fkey: FOREIGN KEY (client_id) REFERENCES client_profiles(id) ON DELETE SET NULL
//   UNIQUE conversations_phone_number_key: UNIQUE (phone_number)
//   PRIMARY KEY conversations_pkey: PRIMARY KEY (id)
// Table: message_templates
//   PRIMARY KEY message_templates_pkey: PRIMARY KEY (id)
// Table: messages
//   FOREIGN KEY messages_conversation_id_fkey: FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
//   UNIQUE messages_message_hash_unique: UNIQUE (message_hash)
//   PRIMARY KEY messages_pkey: PRIMARY KEY (id)
// Table: meus_clientes
//   FOREIGN KEY meus_clientes_client_id_fkey: FOREIGN KEY (client_id) REFERENCES client_profiles(id) ON DELETE CASCADE
//   UNIQUE meus_clientes_client_id_key: UNIQUE (client_id)
//   PRIMARY KEY meus_clientes_pkey: PRIMARY KEY (id)
// Table: suggestions
//   FOREIGN KEY suggestions_conversation_id_fkey: FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
//   FOREIGN KEY suggestions_matched_rule_id_fkey: FOREIGN KEY (matched_rule_id) REFERENCES autonomous_rules(id)
//   PRIMARY KEY suggestions_pkey: PRIMARY KEY (id)
// Table: tldv_meetings
//   FOREIGN KEY tldv_meetings_client_id_fkey: FOREIGN KEY (client_id) REFERENCES client_profiles(id) ON DELETE CASCADE
//   CHECK tldv_meetings_match_status_check: CHECK ((match_status = ANY (ARRAY['matched'::text, 'pending_review'::text, 'manually_matched'::text])))
//   PRIMARY KEY tldv_meetings_pkey: PRIMARY KEY (id)
//   UNIQUE tldv_meetings_tldv_link_key: UNIQUE (tldv_link)
// Table: training_feedback
//   PRIMARY KEY training_feedback_pkey: PRIMARY KEY (id)
// Table: webhook_logs
//   PRIMARY KEY webhook_logs_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: ai_prompts
//   Policy "Enable all access for authenticated users on ai_prompts" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)
//     WITH CHECK: (auth.role() = 'authenticated'::text)
//   Policy "authenticated_full_access" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: autonomous_rules
//   Policy "Enable all access for authenticated users on autonomous_rules" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)
//     WITH CHECK: (auth.role() = 'authenticated'::text)
//   Policy "authenticated_full_access" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: calendar_events
//   Policy "authenticated_full_access" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: client_calls
//   Policy "authenticated_full_access" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: client_profiles
//   Policy "auth_only" (ALL, PERMISSIVE) roles={public}
//     USING: (( SELECT auth.role() AS role) = 'authenticated'::text)
//   Policy "authenticated_full_access" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: conversation_embeddings
//   Policy "Enable all access for authenticated users on conversation_embed" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)
//     WITH CHECK: (auth.role() = 'authenticated'::text)
//   Policy "authenticated_full_access" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: conversation_finalizers
//   Policy "authenticated_full_access" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: conversations
//   Policy "Enable all access for authenticated users on conversations" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)
//     WITH CHECK: (auth.role() = 'authenticated'::text)
//   Policy "authenticated_full_access" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: messages
//   Policy "Enable all access for authenticated users on messages" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)
//     WITH CHECK: (auth.role() = 'authenticated'::text)
//   Policy "authenticated_full_access" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: meus_clientes
//   Policy "authenticated_full_access" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: suggestions
//   Policy "Enable all access for authenticated users on suggestions" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)
//     WITH CHECK: (auth.role() = 'authenticated'::text)
//   Policy "authenticated_full_access" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: tldv_meetings
//   Policy "authenticated_full_access" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: training_feedback
//   Policy "Enable all access for authenticated users on training_feedback" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)
//     WITH CHECK: (auth.role() = 'authenticated'::text)
//   Policy "authenticated_full_access" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true

// --- DATABASE FUNCTIONS ---
// FUNCTION auto_create_client_profile()
//   CREATE OR REPLACE FUNCTION public.auto_create_client_profile()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SET search_path TO ''
//   AS $function$
//   DECLARE
//     normalized TEXT;
//   BEGIN
//     normalized := split_part(NEW.phone_number, '@', 1);
//   
//     IF normalized !~ '^[0-9]{10,15}
 THEN
//       RETURN NEW;
//     END IF;
//   
//     INSERT INTO public.client_profiles (phone_number, contact_name)
//     VALUES (normalized, NEW.contact_name)
//     ON CONFLICT (phone_number) DO UPDATE
//       SET contact_name = COALESCE(public.client_profiles.contact_name, EXCLUDED.contact_name),
//           updated_at = NOW()
//     WHERE public.client_profiles.contact_name IS NULL;
//   
//     RETURN NEW;
//   END;
//   $function$
//   
// FUNCTION calculate_business_seconds(timestamp with time zone, timestamp with time zone)
//   CREATE OR REPLACE FUNCTION public.calculate_business_seconds(start_ts timestamp with time zone, end_ts timestamp with time zone)
//    RETURNS numeric
//    LANGUAGE plpgsql
//    IMMUTABLE
//    SET search_path TO ''
//   AS $function$
//   DECLARE
//       total_seconds numeric := 0;
//       current_day date;
//       end_day date;
//       day_start timestamptz;
//       day_end timestamptz;
//   BEGIN
//       IF start_ts >= end_ts THEN
//           RETURN 0;
//       END IF;
//   
//       current_day := (start_ts AT TIME ZONE 'America/Sao_Paulo')::date;
//       end_day := (end_ts AT TIME ZONE 'America/Sao_Paulo')::date;
//   
//       WHILE current_day <= end_day LOOP
//           IF EXTRACT(ISODOW FROM current_day) < 6 THEN
//               day_start := GREATEST(start_ts, ((current_day + time '09:00:00') AT TIME ZONE 'America/Sao_Paulo'));
//               day_end := LEAST(end_ts, ((current_day + time '18:00:00') AT TIME ZONE 'America/Sao_Paulo'));
//               
//               IF day_start < day_end THEN
//                   total_seconds := total_seconds + EXTRACT(EPOCH FROM (day_end - day_start));
//               END IF;
//           END IF;
//   
//           current_day := current_day + 1;
//       END LOOP;
//   
//       RETURN total_seconds;
//   END;
//   $function$
//   
// FUNCTION get_chart_ai_performance(timestamp with time zone, timestamp with time zone)
//   CREATE OR REPLACE FUNCTION public.get_chart_ai_performance(p_start_date timestamp with time zone, p_end_date timestamp with time zone)
//    RETURNS TABLE(date date, approved bigint, edited bigint)
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO ''
//   AS $function$
//   BEGIN
//     RETURN QUERY
//     SELECT 
//       (s.created_at AT TIME ZONE 'America/Sao_Paulo')::date AS date,
//       COUNT(*) FILTER (WHERE s.was_edited = false) AS approved,
//       COUNT(*) FILTER (WHERE s.was_edited = true) AS edited
//     FROM public.suggestions s
//     WHERE s.sent_text IS NOT NULL 
//       AND s.created_at >= p_start_date 
//       AND s.created_at <= p_end_date
//     GROUP BY (s.created_at AT TIME ZONE 'America/Sao_Paulo')::date
//     ORDER BY (s.created_at AT TIME ZONE 'America/Sao_Paulo')::date ASC;
//   END;
//   $function$
//   
// FUNCTION get_chart_conversations_per_day(timestamp with time zone, timestamp with time zone)
//   CREATE OR REPLACE FUNCTION public.get_chart_conversations_per_day(p_start_date timestamp with time zone, p_end_date timestamp with time zone)
//    RETURNS TABLE(date date, count bigint)
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO ''
//   AS $function$
//   BEGIN
//     RETURN QUERY
//     SELECT 
//       (m.created_at AT TIME ZONE 'America/Sao_Paulo')::date AS date,
//       COUNT(DISTINCT m.phone_number) AS count
//     FROM public.messages m
//     WHERE m.created_at >= p_start_date
//       AND m.created_at <= p_end_date
//     GROUP BY (m.created_at AT TIME ZONE 'America/Sao_Paulo')::date
//     ORDER BY (m.created_at AT TIME ZONE 'America/Sao_Paulo')::date ASC;
//   END;
//   $function$
//   
// FUNCTION get_dashboard_stats(timestamp with time zone, timestamp with time zone)
//   CREATE OR REPLACE FUNCTION public.get_dashboard_stats(p_start_date timestamp with time zone, p_end_date timestamp with time zone)
//    RETURNS TABLE(avg_response_time numeric, active_conversations bigint, pending_suggestions bigint, ai_approval_rate numeric, messages_received bigint, clients_served bigint)
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO ''
//   AS $function$
//   BEGIN
//     RETURN QUERY
//     SELECT
//       (
//         SELECT COALESCE(AVG(public.calculate_business_seconds(incoming_time, reply_time)), 0)::numeric
//         FROM (
//           SELECT 
//             m1.created_at AS incoming_time,
//             MIN(m2.created_at) AS reply_time
//           FROM public.messages m1
//           JOIN public.messages m2 
//             ON m1.phone_number = m2.phone_number 
//             AND m2.sender = 'me' 
//             AND m2.created_at > m1.created_at
//           WHERE m1.sender != 'me' 
//             AND m1.created_at >= p_start_date
//             AND m1.created_at <= p_end_date
//           GROUP BY m1.id, m1.created_at
//         ) sub
//       ) AS avg_response_time,
//       
//       (SELECT COUNT(*) FROM public.conversations WHERE manually_closed = false) AS active_conversations,
//       
//       (SELECT COUNT(*) FROM public.suggestions WHERE approved_at IS NULL) AS pending_suggestions,
//       
//       (SELECT 
//          COALESCE(
//            (COUNT(*) FILTER (WHERE was_edited = false)::numeric / NULLIF(COUNT(*), 0)) * 100, 
//            0
//          )
//        FROM public.suggestions 
//        WHERE sent_text IS NOT NULL 
//          AND created_at >= p_start_date 
//          AND created_at <= p_end_date
//       ) AS ai_approval_rate,
//   
//       (SELECT COUNT(*) FROM public.messages 
//        WHERE sender != 'me' 
//          AND created_at >= p_start_date 
//          AND created_at <= p_end_date
//       ) AS messages_received,
//   
//       (SELECT COUNT(DISTINCT phone_number) FROM public.messages 
//        WHERE created_at >= p_start_date 
//          AND created_at <= p_end_date
//       ) AS clients_served;
//   END;
//   $function$
//   
// FUNCTION increment_usage_count()
//   CREATE OR REPLACE FUNCTION public.increment_usage_count()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SET search_path TO ''
//   AS $function$ BEGIN NEW.usage_count = OLD.usage_count + 1; NEW.last_used_at = NOW(); RETURN NEW; END; $function$
//   
// FUNCTION match_tldv_to_client(uuid, text[])
//   CREATE OR REPLACE FUNCTION public.match_tldv_to_client(p_tldv_meeting_id uuid, p_participant_emails text[])
//    RETURNS uuid
//    LANGUAGE plpgsql
//    SET search_path TO ''
//   AS $function$ 
//   DECLARE 
//     v_client_id uuid; 
//     v_phone_number text;
//     v_email text; 
//     v_tldv_link text;
//   BEGIN 
//     FOREACH v_email IN ARRAY p_participant_emails LOOP 
//       -- Procura case-insensitive no email principal ou emails alternativos, sem filtrar por propriedade
//       SELECT id, phone_number INTO v_client_id, v_phone_number
//       FROM public.client_profiles 
//       WHERE LOWER(email) = LOWER(v_email) 
//          OR LOWER(v_email) = ANY(SELECT LOWER(e) FROM unnest(COALESCE(emails_alternativos, '{}'::text[])) e)
//       LIMIT 1; 
//   
//       IF v_client_id IS NOT NULL THEN 
//         SELECT tldv_link INTO v_tldv_link FROM public.tldv_meetings WHERE id = p_tldv_meeting_id;
//         
//         -- Atualiza tldv_meetings com o ID, telefone e status
//         UPDATE public.tldv_meetings 
//         SET client_id = v_client_id, 
//             phone_number = v_phone_number,
//             match_status = 'matched', 
//             matched_email = v_email 
//         WHERE id = p_tldv_meeting_id; 
//         
//         -- Atualiza o tldv_link no perfil do cliente
//         UPDATE public.client_profiles
//         SET tldv_link = v_tldv_link, updated_at = NOW()
//         WHERE id = v_client_id;
//         
//         RETURN v_client_id; 
//       END IF; 
//     END LOOP; 
//   
//     -- Se não encontrar nenhum match
//     UPDATE public.tldv_meetings 
//     SET match_status = 'pending_review', client_id = NULL, phone_number = NULL, matched_email = NULL 
//     WHERE id = p_tldv_meeting_id; 
//     
//     RETURN NULL; 
//   END; 
//   $function$
//   
// FUNCTION rematch_tldv_on_email_update()
//   CREATE OR REPLACE FUNCTION public.rematch_tldv_on_email_update()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SET search_path TO ''
//   AS $function$ DECLARE v_new_emails text[]; v_email text; BEGIN v_new_emails := ARRAY(SELECT unnest(NEW.emails_alternativos) EXCEPT SELECT unnest(COALESCE(OLD.emails_alternativos, '{}'::text[]))); IF array_length(v_new_emails, 1) > 0 THEN FOREACH v_email IN ARRAY v_new_emails LOOP UPDATE public.tldv_meetings SET client_id = NEW.id, match_status = 'manually_matched', matched_email = v_email WHERE match_status = 'pending_review' AND v_email = ANY(participant_emails); END LOOP; END IF; RETURN NEW; END; $function$
//   
// FUNCTION search_conversations(vector, double precision, integer)
//   CREATE OR REPLACE FUNCTION public.search_conversations(query_embedding vector, match_threshold double precision DEFAULT 0.78, match_count integer DEFAULT 10)
//    RETURNS TABLE(conversation_id uuid, phone_number text, summary text, similarity double precision)
//    LANGUAGE plpgsql
//   AS $function$
//   BEGIN
//     RETURN QUERY
//     SELECT
//       ce.conversation_id,
//       ce.phone_number,
//       ce.conversation_summary,
//       1 - (ce.embedding <=> query_embedding) AS similarity
//     FROM public.conversation_embeddings ce
//     WHERE 1 - (ce.embedding <=> query_embedding) > match_threshold
//     ORDER BY similarity DESC
//     LIMIT match_count;
//   END;
//   $function$
//   
// FUNCTION search_embeddings(vector, text, integer, double precision)
//   CREATE OR REPLACE FUNCTION public.search_embeddings(query_embedding vector, source_filter text DEFAULT NULL::text, match_count integer DEFAULT 5, min_score double precision DEFAULT 0.5)
//    RETURNS TABLE(id uuid, conversation_id uuid, tldv_meeting_id uuid, source_type text, conversation_summary text, conversation_theme text, tone text, quality_score numeric, similarity double precision)
//    LANGUAGE sql
//    STABLE
//    SET search_path TO ''
//   AS $function$ SELECT ce.id, ce.conversation_id, ce.tldv_meeting_id, ce.source_type, ce.conversation_summary, ce.conversation_theme, ce.tone, ce.quality_score, 1 - (ce.embedding <=> query_embedding) AS similarity FROM public.conversation_embeddings ce WHERE ce.embedding IS NOT NULL AND (source_filter IS NULL OR ce.source_type = source_filter) AND 1 - (ce.embedding <=> query_embedding) > min_score ORDER BY ce.embedding <=> query_embedding LIMIT match_count; $function$
//   
// FUNCTION set_updated_at()
//   CREATE OR REPLACE FUNCTION public.set_updated_at()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SET search_path TO ''
//   AS $function$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $function$
//   
// FUNCTION sync_conversation_contact_name()
//   CREATE OR REPLACE FUNCTION public.sync_conversation_contact_name()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SET search_path TO ''
//   AS $function$ BEGIN IF NEW.contact_name IS DISTINCT FROM OLD.contact_name THEN UPDATE public.conversations SET contact_name = NEW.contact_name WHERE client_id = NEW.id; END IF; RETURN NEW; END; $function$
//   

// --- TRIGGERS ---
// Table: autonomous_rules
//   trg_updated_at_autonomous_rules: CREATE TRIGGER trg_updated_at_autonomous_rules BEFORE UPDATE ON public.autonomous_rules FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: client_calls
//   trg_updated_at_client_calls: CREATE TRIGGER trg_updated_at_client_calls BEFORE UPDATE ON public.client_calls FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: client_profiles
//   set_updated_at: CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.client_profiles FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at')
//   trg_rematch_tldv_on_email: CREATE TRIGGER trg_rematch_tldv_on_email AFTER UPDATE OF emails_alternativos ON public.client_profiles FOR EACH ROW EXECUTE FUNCTION rematch_tldv_on_email_update()
//   trg_sync_contact_name: CREATE TRIGGER trg_sync_contact_name AFTER UPDATE OF contact_name ON public.client_profiles FOR EACH ROW EXECUTE FUNCTION sync_conversation_contact_name()
//   trg_updated_at_client_profiles: CREATE TRIGGER trg_updated_at_client_profiles BEFORE UPDATE ON public.client_profiles FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: conversations
//   trg_auto_client_profile: CREATE TRIGGER trg_auto_client_profile AFTER INSERT ON public.conversations FOR EACH ROW EXECUTE FUNCTION auto_create_client_profile()
//   trg_updated_at_conversations: CREATE TRIGGER trg_updated_at_conversations BEFORE UPDATE ON public.conversations FOR EACH ROW EXECUTE FUNCTION set_updated_at()
// Table: meus_clientes
//   trg_updated_at_meus_clientes: CREATE TRIGGER trg_updated_at_meus_clientes BEFORE UPDATE ON public.meus_clientes FOR EACH ROW EXECUTE FUNCTION set_updated_at()

// --- INDEXES ---
// Table: autonomous_rules
//   CREATE UNIQUE INDEX autonomous_rules_rule_name_key ON public.autonomous_rules USING btree (rule_name)
//   CREATE INDEX idx_rules_active_priority ON public.autonomous_rules USING btree (is_active, priority DESC)
//   CREATE INDEX idx_rules_trigger_patterns ON public.autonomous_rules USING gin (trigger_patterns)
// Table: calendar_events
//   CREATE UNIQUE INDEX calendar_events_google_event_id_key ON public.calendar_events USING btree (google_event_id)
//   CREATE INDEX idx_calendar_client_id ON public.calendar_events USING btree (client_id)
//   CREATE INDEX idx_calendar_client_phone ON public.calendar_events USING btree (client_phone)
//   CREATE INDEX idx_calendar_start_at ON public.calendar_events USING btree (start_at)
// Table: client_calls
//   CREATE UNIQUE INDEX client_calls_unique_per_client ON public.client_calls USING btree (client_id, call_number)
//   CREATE INDEX idx_client_calls_client_date ON public.client_calls USING btree (client_id, call_date DESC)
//   CREATE INDEX idx_client_calls_client_id ON public.client_calls USING btree (client_id)
//   CREATE INDEX idx_client_calls_date ON public.client_calls USING btree (call_date DESC)
//   CREATE INDEX idx_client_calls_tldv_meeting_id ON public.client_calls USING btree (tldv_meeting_id)
// Table: client_health_scores
//   CREATE UNIQUE INDEX client_health_scores_client_id_key ON public.client_health_scores USING btree (client_id)
// Table: client_profiles
//   CREATE UNIQUE INDEX client_profiles_phone_number_key ON public.client_profiles USING btree (phone_number)
//   CREATE INDEX idx_client_emails_alternativos ON public.client_profiles USING gin (emails_alternativos)
//   CREATE INDEX idx_client_profiles_phone ON public.client_profiles USING btree (phone_number)
// Table: conversation_embeddings
//   CREATE INDEX idx_embeddings_conversation_id ON public.conversation_embeddings USING btree (conversation_id)
//   CREATE INDEX idx_embeddings_hnsw_cosine ON public.conversation_embeddings USING hnsw (embedding vector_cosine_ops) WITH (m='16', ef_construction='64')
//   CREATE INDEX idx_embeddings_phone ON public.conversation_embeddings USING btree (phone_number)
//   CREATE INDEX idx_embeddings_source_type ON public.conversation_embeddings USING btree (source_type)
//   CREATE INDEX idx_embeddings_tldv_id ON public.conversation_embeddings USING btree (tldv_meeting_id)
// Table: conversation_finalizers
//   CREATE UNIQUE INDEX conversation_finalizers_keyword_key ON public.conversation_finalizers USING btree (keyword)
// Table: conversations
//   CREATE UNIQUE INDEX conversations_phone_number_key ON public.conversations USING btree (phone_number)
//   CREATE UNIQUE INDEX conversations_remote_jid_unique ON public.conversations USING btree (remote_jid) WHERE (remote_jid IS NOT NULL)
//   CREATE INDEX idx_conversations_client_id ON public.conversations USING btree (client_id)
//   CREATE INDEX idx_conversations_last_message ON public.conversations USING btree (last_message_at DESC)
//   CREATE INDEX idx_conversations_manually_closed ON public.conversations USING btree (manually_closed)
//   CREATE INDEX idx_conversations_phone ON public.conversations USING btree (phone_number)
// Table: messages
//   CREATE INDEX idx_messages_conversation_id ON public.messages USING btree (conversation_id)
//   CREATE INDEX idx_messages_created_at_brin ON public.messages USING brin (created_at) WITH (pages_per_range='128')
//   CREATE UNIQUE INDEX idx_messages_hash ON public.messages USING btree (message_hash)
//   CREATE INDEX idx_messages_is_audio ON public.messages USING btree (id) WHERE (is_audio = true)
//   CREATE INDEX idx_messages_phone_created ON public.messages USING btree (phone_number, created_at DESC)
//   CREATE INDEX idx_messages_phone_number ON public.messages USING btree (phone_number)
//   CREATE UNIQUE INDEX messages_message_hash_unique ON public.messages USING btree (message_hash)
//   CREATE INDEX messages_remote_jid_index ON public.messages USING btree (remote_jid)
// Table: meus_clientes
//   CREATE INDEX idx_meus_clientes_client_id ON public.meus_clientes USING btree (client_id)
//   CREATE INDEX idx_meus_clientes_etapa ON public.meus_clientes USING btree (etapa_negocio)
//   CREATE UNIQUE INDEX meus_clientes_client_id_key ON public.meus_clientes USING btree (client_id)
// Table: suggestions
//   CREATE INDEX idx_suggestions_approved ON public.suggestions USING btree (was_edited, use_for_training) WHERE ((sent_text IS NOT NULL) AND (was_edited = false))
//   CREATE INDEX idx_suggestions_conversation_id ON public.suggestions USING btree (conversation_id)
//   CREATE INDEX idx_suggestions_gold_standard ON public.suggestions USING btree (is_gold_standard) WHERE (is_gold_standard = true)
//   CREATE INDEX idx_suggestions_matched_rule ON public.suggestions USING btree (matched_rule_id)
//   CREATE INDEX idx_suggestions_status ON public.suggestions USING btree (status)
// Table: tldv_meetings
//   CREATE INDEX idx_tldv_client_id ON public.tldv_meetings USING btree (client_id)
//   CREATE INDEX idx_tldv_meeting_date ON public.tldv_meetings USING btree (meeting_date DESC)
//   CREATE INDEX idx_tldv_phone_number ON public.tldv_meetings USING btree (phone_number)
//   CREATE UNIQUE INDEX tldv_meetings_tldv_link_key ON public.tldv_meetings USING btree (tldv_link)
// Table: webhook_logs
//   CREATE INDEX idx_webhook_logs_created_at ON public.webhook_logs USING brin (created_at)
//   CREATE INDEX idx_webhook_logs_source ON public.webhook_logs USING btree (source)

