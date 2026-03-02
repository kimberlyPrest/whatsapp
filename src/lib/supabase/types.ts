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
      get_chart_ai_performance: {
        Args: { p_time_range?: string }
        Returns: {
          approved: number
          date: string
          edited: number
        }[]
      }
      get_chart_conversations_per_day: {
        Args: { p_time_range?: string }
        Returns: {
          count: number
          date: string
        }[]
      }
      get_dashboard_stats: {
        Args: { p_time_range?: string }
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

// --- DATABASE FUNCTIONS ---
// FUNCTION get_chart_ai_performance(text)
//   CREATE OR REPLACE FUNCTION public.get_chart_ai_performance(p_time_range text DEFAULT 'day'::text)
//    RETURNS TABLE(date date, approved bigint, edited bigint)
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     v_start_date date;
//   BEGIN
//     IF p_time_range = 'month' THEN
//       v_start_date := CURRENT_DATE - INTERVAL '30 days';
//     ELSE
//       v_start_date := CURRENT_DATE - INTERVAL '7 days';
//     END IF;
//   
//     RETURN QUERY
//     SELECT 
//       s.created_at::date AS date,
//       COUNT(*) FILTER (WHERE s.was_edited = false) AS approved,
//       COUNT(*) FILTER (WHERE s.was_edited = true) AS edited
//     FROM public.suggestions s
//     WHERE s.sent_text IS NOT NULL AND s.created_at::date >= v_start_date
//     GROUP BY s.created_at::date
//     ORDER BY s.created_at::date ASC;
//   END;
//   $function$
//   
// FUNCTION get_chart_conversations_per_day(text)
//   CREATE OR REPLACE FUNCTION public.get_chart_conversations_per_day(p_time_range text DEFAULT 'day'::text)
//    RETURNS TABLE(date date, count bigint)
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     v_start_date date;
//   BEGIN
//     IF p_time_range = 'month' THEN
//       v_start_date := CURRENT_DATE - INTERVAL '30 days';
//     ELSE
//       -- For 'day' and 'week', we show 7 days of context
//       v_start_date := CURRENT_DATE - INTERVAL '7 days';
//     END IF;
//   
//     RETURN QUERY
//     SELECT 
//       m.created_at::date AS date,
//       COUNT(DISTINCT m.phone_number) AS count
//     FROM public.messages m
//     WHERE m.created_at::date >= v_start_date
//     GROUP BY m.created_at::date
//     ORDER BY m.created_at::date ASC;
//   END;
//   $function$
//   
// FUNCTION get_dashboard_stats(text)
//   CREATE OR REPLACE FUNCTION public.get_dashboard_stats(p_time_range text DEFAULT 'day'::text)
//    RETURNS TABLE(avg_response_time numeric, active_conversations bigint, pending_suggestions bigint, ai_approval_rate numeric, messages_received bigint, clients_served bigint)
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     v_start_date timestamptz;
//   BEGIN
//     IF p_time_range = 'week' THEN
//       v_start_date := CURRENT_DATE - INTERVAL '7 days';
//     ELSIF p_time_range = 'month' THEN
//       v_start_date := CURRENT_DATE - INTERVAL '30 days';
//     ELSE
//       -- 'day'
//       v_start_date := CURRENT_DATE;
//     END IF;
//   
//     RETURN QUERY
//     SELECT
//       (
//         SELECT COALESCE(EXTRACT(EPOCH FROM AVG(diff)), 0)::numeric
//         FROM (
//           SELECT 
//             m2.created_at - m1.created_at AS diff
//           FROM public.messages m1
//           JOIN public.messages m2 ON m1.phone_number = m2.phone_number 
//             AND m2.sender = 'me' 
//             AND m1.sender != 'me' 
//             AND m2.created_at > m1.created_at
//             AND m2.created_at <= m1.created_at + INTERVAL '1 hour'
//           WHERE m1.created_at >= v_start_date
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
//        WHERE sent_text IS NOT NULL AND created_at >= v_start_date
//       ) AS ai_approval_rate,
//   
//       (SELECT COUNT(*) FROM public.messages WHERE sender != 'me' AND created_at >= v_start_date) AS messages_received,
//   
//       (SELECT COUNT(DISTINCT phone_number) FROM public.messages WHERE created_at >= v_start_date) AS clients_served;
//   END;
//   $function$
//   

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

