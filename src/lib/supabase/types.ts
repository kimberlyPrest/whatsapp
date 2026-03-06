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
            foreignKeyName: "conversation_embeddings_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
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
            foreignKeyName: "tldv_meetings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tldv_meetings_phone_number_fkey"
            columns: ["phone_number"]
            isOneToOne: false
            referencedRelation: "client_profiles"
            referencedColumns: ["phone_number"]
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
// Table: conversation_embeddings
//   id: uuid (not null, default: gen_random_uuid())
//   phone_number: text (nullable)
//   conversation_summary: text (nullable)
//   conversation_theme: text (nullable)
//   outcome: text (nullable)
//   tone: text (nullable)
//   quality_score: double precision (nullable)
//   message_count: integer (nullable)
//   embedding: vector (nullable)
//   conversation_date: date (nullable, default: CURRENT_DATE)
//   created_at: timestamp with time zone (nullable, default: now())
//   conversation_id: uuid (nullable)
// Table: conversation_finalizers
//   id: uuid (not null, default: gen_random_uuid())
//   keyword: text (not null)
//   is_active: boolean (nullable, default: true)
//   created_at: timestamp without time zone (nullable, default: now())
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
//   call_1_date: date (nullable)
//   call_2_date: date (nullable)
//   call_3_date: date (nullable)
//   call_4_date: date (nullable)
//   call_5_date: date (nullable)
//   call_6_date: date (nullable)
//   call_7_date: date (nullable)
//   call_8_date: date (nullable)
//   call_9_date: date (nullable)
//   call_10_date: date (nullable)
//   call_11_date: date (nullable)
//   call_12_date: date (nullable)
//   csat_1: numeric (nullable)
//   csat_2: numeric (nullable)
//   csat_3: numeric (nullable)
//   csat_4: numeric (nullable)
//   csat_5: numeric (nullable)
//   csat_6: numeric (nullable)
//   csat_7: numeric (nullable)
//   csat_8: numeric (nullable)
//   csat_9: numeric (nullable)
//   csat_10: numeric (nullable)
//   csat_11: numeric (nullable)
//   csat_12: numeric (nullable)
//   csat_comment_1: text (nullable)
//   csat_comment_2: text (nullable)
//   csat_comment_3: text (nullable)
//   csat_comment_4: text (nullable)
//   csat_comment_5: text (nullable)
//   csat_comment_6: text (nullable)
//   csat_comment_7: text (nullable)
//   csat_comment_8: text (nullable)
//   csat_comment_9: text (nullable)
//   csat_comment_10: text (nullable)
//   csat_comment_11: text (nullable)
//   csat_comment_12: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
//   call_1_link: text (nullable)
//   call_2_link: text (nullable)
//   call_3_link: text (nullable)
//   call_4_link: text (nullable)
//   call_5_link: text (nullable)
//   call_6_link: text (nullable)
//   call_7_link: text (nullable)
//   call_8_link: text (nullable)
//   call_9_link: text (nullable)
//   call_10_link: text (nullable)
//   call_11_link: text (nullable)
//   call_12_link: text (nullable)
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

// --- CONSTRAINTS ---
// Table: ai_prompts
//   PRIMARY KEY ai_prompts_pkey: PRIMARY KEY (id)
// Table: autonomous_rules
//   PRIMARY KEY autonomous_rules_pkey: PRIMARY KEY (id)
//   UNIQUE autonomous_rules_rule_name_key: UNIQUE (rule_name)
// Table: calendar_events
//   UNIQUE calendar_events_google_event_id_key: UNIQUE (google_event_id)
//   PRIMARY KEY calendar_events_pkey: PRIMARY KEY (id)
// Table: client_profiles
//   UNIQUE client_profiles_phone_number_key: UNIQUE (phone_number)
//   PRIMARY KEY client_profiles_pkey: PRIMARY KEY (id)
// Table: conversation_embeddings
//   FOREIGN KEY conversation_embeddings_conversation_id_fkey: FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
//   PRIMARY KEY conversation_embeddings_pkey: PRIMARY KEY (id)
// Table: conversation_finalizers
//   UNIQUE conversation_finalizers_keyword_key: UNIQUE (keyword)
//   PRIMARY KEY conversation_finalizers_pkey: PRIMARY KEY (id)
// Table: conversations
//   FOREIGN KEY conversations_client_id_fkey: FOREIGN KEY (client_id) REFERENCES client_profiles(id) ON DELETE SET NULL
//   UNIQUE conversations_phone_number_key: UNIQUE (phone_number)
//   PRIMARY KEY conversations_pkey: PRIMARY KEY (id)
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
//   FOREIGN KEY tldv_meetings_phone_number_fkey: FOREIGN KEY (phone_number) REFERENCES client_profiles(phone_number) ON DELETE SET NULL
//   PRIMARY KEY tldv_meetings_pkey: PRIMARY KEY (id)
//   UNIQUE tldv_meetings_tldv_link_key: UNIQUE (tldv_link)
// Table: training_feedback
//   PRIMARY KEY training_feedback_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: ai_prompts
//   Policy "Enable all access for authenticated users on ai_prompts" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)
//     WITH CHECK: (auth.role() = 'authenticated'::text)
// Table: autonomous_rules
//   Policy "Enable all access for authenticated users on autonomous_rules" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)
//     WITH CHECK: (auth.role() = 'authenticated'::text)
// Table: calendar_events
//   Policy "auth users full access" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: client_profiles
//   Policy "auth users full access" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: conversation_embeddings
//   Policy "Enable all access for authenticated users on conversation_embed" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)
//     WITH CHECK: (auth.role() = 'authenticated'::text)
// Table: conversations
//   Policy "Enable all access for authenticated users on conversations" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)
//     WITH CHECK: (auth.role() = 'authenticated'::text)
// Table: messages
//   Policy "Enable all access for authenticated users on messages" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)
//     WITH CHECK: (auth.role() = 'authenticated'::text)
// Table: meus_clientes
//   Policy "auth users full access" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: suggestions
//   Policy "Enable all access for authenticated users on suggestions" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)
//     WITH CHECK: (auth.role() = 'authenticated'::text)
// Table: tldv_meetings
//   Policy "auth users full access" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: training_feedback
//   Policy "Enable all access for authenticated users on training_feedback" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)
//     WITH CHECK: (auth.role() = 'authenticated'::text)

// --- DATABASE FUNCTIONS ---
// FUNCTION auto_create_client_profile()
//   CREATE OR REPLACE FUNCTION public.auto_create_client_profile()
//    RETURNS trigger
//    LANGUAGE plpgsql
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
//     INSERT INTO client_profiles (phone_number, contact_name)
//     VALUES (normalized, NEW.contact_name)
//     ON CONFLICT (phone_number) DO UPDATE
//       SET contact_name = COALESCE(client_profiles.contact_name, EXCLUDED.contact_name),
//           updated_at = NOW()
//     WHERE client_profiles.contact_name IS NULL;
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

// --- TRIGGERS ---
// Table: conversations
//   trg_auto_client_profile: CREATE TRIGGER trg_auto_client_profile AFTER INSERT ON public.conversations FOR EACH ROW EXECUTE FUNCTION auto_create_client_profile()

// --- INDEXES ---
// Table: autonomous_rules
//   CREATE UNIQUE INDEX autonomous_rules_rule_name_key ON public.autonomous_rules USING btree (rule_name)
// Table: calendar_events
//   CREATE UNIQUE INDEX calendar_events_google_event_id_key ON public.calendar_events USING btree (google_event_id)
//   CREATE INDEX idx_calendar_events_client ON public.calendar_events USING btree (client_phone)
//   CREATE INDEX idx_calendar_events_start ON public.calendar_events USING btree (start_at)
// Table: client_profiles
//   CREATE UNIQUE INDEX client_profiles_phone_number_key ON public.client_profiles USING btree (phone_number)
//   CREATE INDEX idx_client_profiles_phone ON public.client_profiles USING btree (phone_number)
// Table: conversation_embeddings
//   CREATE INDEX idx_conversation_embeddings_conversation_id ON public.conversation_embeddings USING btree (conversation_id)
// Table: conversation_finalizers
//   CREATE UNIQUE INDEX conversation_finalizers_keyword_key ON public.conversation_finalizers USING btree (keyword)
// Table: conversations
//   CREATE UNIQUE INDEX conversations_phone_number_key ON public.conversations USING btree (phone_number)
//   CREATE UNIQUE INDEX conversations_remote_jid_unique ON public.conversations USING btree (remote_jid) WHERE (remote_jid IS NOT NULL)
//   CREATE INDEX idx_conversations_client_id ON public.conversations USING btree (client_id)
//   CREATE INDEX idx_conversations_last_message_at ON public.conversations USING btree (last_message_at DESC)
//   CREATE INDEX idx_conversations_phone ON public.conversations USING btree (phone_number)
// Table: messages
//   CREATE INDEX idx_messages_conversation_id ON public.messages USING btree (conversation_id)
//   CREATE INDEX idx_messages_created_at ON public.messages USING btree (created_at)
//   CREATE UNIQUE INDEX idx_messages_hash ON public.messages USING btree (message_hash)
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
// Table: tldv_meetings
//   CREATE INDEX idx_tldv_meetings_client_id ON public.tldv_meetings USING btree (client_id)
//   CREATE INDEX idx_tldv_meetings_date ON public.tldv_meetings USING btree (meeting_date DESC)
//   CREATE UNIQUE INDEX tldv_meetings_tldv_link_key ON public.tldv_meetings USING btree (tldv_link)

