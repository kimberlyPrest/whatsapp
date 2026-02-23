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
      conversation_embeddings: {
        Row: {
          conversation_date: string | null
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
            foreignKeyName: "conversation_embeddings_phone_number_fkey"
            columns: ["phone_number"]
            isOneToOne: false
            referencedRelation: "conversation_status"
            referencedColumns: ["phone_number"]
          },
          {
            foreignKeyName: "conversation_embeddings_phone_number_fkey"
            columns: ["phone_number"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["phone_number"]
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
          contact_name: string | null
          created_at: string | null
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
          contact_name?: string | null
          created_at?: string | null
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
          contact_name?: string | null
          created_at?: string | null
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
        Relationships: []
      }
      messages: {
        Row: {
          audio_url: string | null
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
            foreignKeyName: "messages_phone_number_fkey"
            columns: ["phone_number"]
            isOneToOne: false
            referencedRelation: "conversation_status"
            referencedColumns: ["phone_number"]
          },
          {
            foreignKeyName: "messages_phone_number_fkey"
            columns: ["phone_number"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["phone_number"]
          },
        ]
      }
      suggestions: {
        Row: {
          approved_at: string | null
          auto_send: boolean | null
          context_messages: Json | null
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
            foreignKeyName: "suggestions_matched_rule_id_fkey"
            columns: ["matched_rule_id"]
            isOneToOne: false
            referencedRelation: "autonomous_rules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suggestions_phone_number_fkey"
            columns: ["phone_number"]
            isOneToOne: false
            referencedRelation: "conversation_status"
            referencedColumns: ["phone_number"]
          },
          {
            foreignKeyName: "suggestions_phone_number_fkey"
            columns: ["phone_number"]
            isOneToOne: false
            referencedRelation: "conversations"
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
      [_ in never]: never
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
// This section contains constraints, RLS policies, functions, triggers,
// indexes and materialized views not present in the type definitions above.

// --- CONSTRAINTS ---
// Table: ai_prompts
//   PRIMARY KEY ai_prompts_pkey: PRIMARY KEY (id)
// Table: autonomous_rules
//   PRIMARY KEY autonomous_rules_pkey: PRIMARY KEY (id)
//   UNIQUE autonomous_rules_rule_name_key: UNIQUE (rule_name)
// Table: conversation_embeddings
//   FOREIGN KEY conversation_embeddings_phone_number_fkey: FOREIGN KEY (phone_number) REFERENCES conversations(phone_number) ON DELETE CASCADE
//   PRIMARY KEY conversation_embeddings_pkey: PRIMARY KEY (id)
// Table: conversation_finalizers
//   UNIQUE conversation_finalizers_keyword_key: UNIQUE (keyword)
//   PRIMARY KEY conversation_finalizers_pkey: PRIMARY KEY (id)
// Table: conversations
//   PRIMARY KEY conversations_pkey: PRIMARY KEY (phone_number)
// Table: messages
//   UNIQUE messages_message_hash_unique: UNIQUE (message_hash)
//   FOREIGN KEY messages_phone_number_fkey: FOREIGN KEY (phone_number) REFERENCES conversations(phone_number) ON DELETE CASCADE
//   PRIMARY KEY messages_pkey: PRIMARY KEY (id)
// Table: suggestions
//   FOREIGN KEY suggestions_matched_rule_id_fkey: FOREIGN KEY (matched_rule_id) REFERENCES autonomous_rules(id)
//   FOREIGN KEY suggestions_phone_number_fkey: FOREIGN KEY (phone_number) REFERENCES conversations(phone_number) ON DELETE CASCADE
//   PRIMARY KEY suggestions_pkey: PRIMARY KEY (id)
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
// Table: suggestions
//   Policy "Enable all access for authenticated users on suggestions" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)
//     WITH CHECK: (auth.role() = 'authenticated'::text)
// Table: training_feedback
//   Policy "Enable all access for authenticated users on training_feedback" (ALL, PERMISSIVE) roles={public}
//     USING: (auth.role() = 'authenticated'::text)
//     WITH CHECK: (auth.role() = 'authenticated'::text)

// --- INDEXES ---
// Table: autonomous_rules
//   CREATE UNIQUE INDEX autonomous_rules_rule_name_key ON public.autonomous_rules USING btree (rule_name)
// Table: conversation_finalizers
//   CREATE UNIQUE INDEX conversation_finalizers_keyword_key ON public.conversation_finalizers USING btree (keyword)
// Table: conversations
//   CREATE UNIQUE INDEX conversations_remote_jid_unique ON public.conversations USING btree (remote_jid) WHERE (remote_jid IS NOT NULL)
// Table: messages
//   CREATE INDEX idx_messages_created_at ON public.messages USING btree (created_at)
//   CREATE UNIQUE INDEX idx_messages_hash ON public.messages USING btree (message_hash)
//   CREATE INDEX idx_messages_phone_created ON public.messages USING btree (phone_number, created_at DESC)
//   CREATE INDEX idx_messages_phone_number ON public.messages USING btree (phone_number)
//   CREATE UNIQUE INDEX messages_message_hash_unique ON public.messages USING btree (message_hash)
//   CREATE INDEX messages_remote_jid_index ON public.messages USING btree (remote_jid)
// Table: suggestions
//   CREATE INDEX idx_suggestions_approved ON public.suggestions USING btree (was_edited, use_for_training) WHERE ((sent_text IS NOT NULL) AND (was_edited = false))
//   CREATE INDEX idx_suggestions_gold_standard ON public.suggestions USING btree (is_gold_standard) WHERE (is_gold_standard = true)

