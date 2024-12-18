export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analysis: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          session_id: string | null
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          session_id?: string | null
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          session_id?: string | null
        }
        Relationships: []
      }
      answers: {
        Row: {
          answers: Json | null
          id: string
          session_id: string | null
          submitted_at: string | null
          user_id: string | null
        }
        Insert: {
          answers?: Json | null
          id?: string
          session_id?: string | null
          submitted_at?: string | null
          user_id?: string | null
        }
        Update: {
          answers?: Json | null
          id?: string
          session_id?: string | null
          submitted_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "answers_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      combined_analysis: {
        Row: {
          answers: Json | null
          group_id: string | null
          id: string
          keywords: Json | null
          participation: Json | null
          perspectives: Json | null
          popular_opinions: Json | null
          session_id: string | null
          topics: Json | null
          unique_opinions: Json | null
          updated_at: string | null
        }
        Insert: {
          answers?: Json | null
          group_id?: string | null
          id?: string
          keywords?: Json | null
          participation?: Json | null
          perspectives?: Json | null
          popular_opinions?: Json | null
          session_id?: string | null
          topics?: Json | null
          unique_opinions?: Json | null
          updated_at?: string | null
        }
        Update: {
          answers?: Json | null
          group_id?: string | null
          id?: string
          keywords?: Json | null
          participation?: Json | null
          perspectives?: Json | null
          popular_opinions?: Json | null
          session_id?: string | null
          topics?: Json | null
          unique_opinions?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "combined_analysis_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "combined_analysis_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      ethical_perspectives: {
        Row: {
          diversity_score: number | null
          group_id: string | null
          id: string
          main_perspectives: Json | null
          perspectives: Json | null
          session_id: string | null
          updated_at: string | null
        }
        Insert: {
          diversity_score?: number | null
          group_id?: string | null
          id?: string
          main_perspectives?: Json | null
          perspectives?: Json | null
          session_id?: string | null
          updated_at?: string | null
        }
        Update: {
          diversity_score?: number | null
          group_id?: string | null
          id?: string
          main_perspectives?: Json | null
          perspectives?: Json | null
          session_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ethical_perspectives_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ethical_perspectives_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      group_answers: {
        Row: {
          answers: Json | null
          completeness_score: number | null
          group_id: string | null
          id: string
          quality_metrics: Json | null
          session_id: string | null
          updated_at: string | null
        }
        Insert: {
          answers?: Json | null
          completeness_score?: number | null
          group_id?: string | null
          id?: string
          quality_metrics?: Json | null
          session_id?: string | null
          updated_at?: string | null
        }
        Update: {
          answers?: Json | null
          completeness_score?: number | null
          group_id?: string | null
          id?: string
          quality_metrics?: Json | null
          session_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_answers_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_answers_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string
          current_occupancy: number | null
          id: string
          max_occupancy: number | null
          name: string
          number: number
          session_id: string | null
          user_list: string[] | null
        }
        Insert: {
          created_at?: string
          current_occupancy?: number | null
          id?: string
          max_occupancy?: number | null
          name: string
          number: number
          session_id?: string | null
          user_list?: string[] | null
        }
        Update: {
          created_at?: string
          current_occupancy?: number | null
          id?: string
          max_occupancy?: number | null
          name?: string
          number?: number
          session_id?: string | null
          user_list?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      keyword_trends: {
        Row: {
          group_id: string | null
          id: string
          keywords: Json | null
          session_id: string | null
          trending_down: Json | null
          trending_up: Json | null
          updated_at: string | null
        }
        Insert: {
          group_id?: string | null
          id?: string
          keywords?: Json | null
          session_id?: string | null
          trending_down?: Json | null
          trending_up?: Json | null
          updated_at?: string | null
        }
        Update: {
          group_id?: string | null
          id?: string
          keywords?: Json | null
          session_id?: string | null
          trending_down?: Json | null
          trending_up?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "keyword_trends_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "keyword_trends_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          audio_url: string | null
          content: string
          created_at: string
          emotion_data: Json | null
          group_id: string | null
          id: string
          sentiment_data: Json | null
          session_id: string | null
          user_id: string
          username: string | null
        }
        Insert: {
          audio_url?: string | null
          content: string
          created_at?: string
          emotion_data?: Json | null
          group_id?: string | null
          id?: string
          sentiment_data?: Json | null
          session_id?: string | null
          user_id: string
          username?: string | null
        }
        Update: {
          audio_url?: string | null
          content?: string
          created_at?: string
          emotion_data?: Json | null
          group_id?: string | null
          id?: string
          sentiment_data?: Json | null
          session_id?: string | null
          user_id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      participation_rates: {
        Row: {
          active_participants: Json | null
          group_id: string | null
          id: string
          message_counts: Json | null
          participation_percentage: number | null
          session_id: string | null
          updated_at: string | null
        }
        Insert: {
          active_participants?: Json | null
          group_id?: string | null
          id?: string
          message_counts?: Json | null
          participation_percentage?: number | null
          session_id?: string | null
          updated_at?: string | null
        }
        Update: {
          active_participants?: Json | null
          group_id?: string | null
          id?: string
          message_counts?: Json | null
          participation_percentage?: number | null
          session_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "participation_rates_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participation_rates_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      popular_opinions: {
        Row: {
          controversy_score: number | null
          group_id: string | null
          id: string
          opinions: Json | null
          session_id: string | null
          top_opinions: Json | null
          updated_at: string | null
        }
        Insert: {
          controversy_score?: number | null
          group_id?: string | null
          id?: string
          opinions?: Json | null
          session_id?: string | null
          top_opinions?: Json | null
          updated_at?: string | null
        }
        Update: {
          controversy_score?: number | null
          group_id?: string | null
          id?: string
          opinions?: Json | null
          session_id?: string | null
          top_opinions?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "popular_opinions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "popular_opinions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      question_coverage: {
        Row: {
          coverage_percentage: number | null
          covered_topics: Json | null
          group_id: string | null
          id: string
          remaining_topics: Json | null
          session_id: string | null
          updated_at: string | null
        }
        Insert: {
          coverage_percentage?: number | null
          covered_topics?: Json | null
          group_id?: string | null
          id?: string
          remaining_topics?: Json | null
          session_id?: string | null
          updated_at?: string | null
        }
        Update: {
          coverage_percentage?: number | null
          covered_topics?: Json | null
          group_id?: string | null
          id?: string
          remaining_topics?: Json | null
          session_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "question_coverage_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_coverage_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          created_at: string
          created_by: string | null
          discussion_points: Json | null
          end_date: string | null
          id: string
          number: number
          participant_count: number | null
          preferred_group_size: number | null
          scenario: string | null
          status: string | null
          task: string | null
          time_left: number | null
          title: string
          total_perspective_participants: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          discussion_points?: Json | null
          end_date?: string | null
          id?: string
          number?: number
          participant_count?: number | null
          preferred_group_size?: number | null
          scenario?: string | null
          status?: string | null
          task?: string | null
          time_left?: number | null
          title: string
          total_perspective_participants?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          discussion_points?: Json | null
          end_date?: string | null
          id?: string
          number?: number
          participant_count?: number | null
          preferred_group_size?: number | null
          scenario?: string | null
          status?: string | null
          task?: string | null
          time_left?: number | null
          title?: string
          total_perspective_participants?: number | null
        }
        Relationships: []
      }
      shared_answers: {
        Row: {
          answers: Json | null
          group_id: string | null
          id: string
          last_updated: string | null
          session_id: string | null
        }
        Insert: {
          answers?: Json | null
          group_id?: string | null
          id?: string
          last_updated?: string | null
          session_id?: string | null
        }
        Update: {
          answers?: Json | null
          group_id?: string | null
          id?: string
          last_updated?: string | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shared_answers_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_answers_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_analysis: {
        Row: {
          current_topics: Json | null
          group_id: string | null
          id: string
          session_id: string | null
          topic_frequency: Json | null
          topic_sentiment: Json | null
          updated_at: string | null
        }
        Insert: {
          current_topics?: Json | null
          group_id?: string | null
          id?: string
          session_id?: string | null
          topic_frequency?: Json | null
          topic_sentiment?: Json | null
          updated_at?: string | null
        }
        Update: {
          current_topics?: Json | null
          group_id?: string | null
          id?: string
          session_id?: string | null
          topic_frequency?: Json | null
          topic_sentiment?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "topic_analysis_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topic_analysis_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      unique_opinions: {
        Row: {
          group_id: string | null
          id: string
          notable_insights: Json | null
          opinions: Json | null
          session_id: string | null
          uniqueness_score: number | null
          updated_at: string | null
        }
        Insert: {
          group_id?: string | null
          id?: string
          notable_insights?: Json | null
          opinions?: Json | null
          session_id?: string | null
          uniqueness_score?: number | null
          updated_at?: string | null
        }
        Update: {
          group_id?: string | null
          id?: string
          notable_insights?: Json | null
          opinions?: Json | null
          session_id?: string | null
          uniqueness_score?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "unique_opinions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "unique_opinions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          clerk_id: string
          created_at: string
          has_consented: boolean | null
          id: string
          is_active: boolean | null
          last_active: string | null
          role: string
          session_id: string | null
          temp_password: string | null
          username: string
        }
        Insert: {
          clerk_id: string
          created_at?: string
          has_consented?: boolean | null
          id?: string
          is_active?: boolean | null
          last_active?: string | null
          role?: string
          session_id?: string | null
          temp_password?: string | null
          username: string
        }
        Update: {
          clerk_id?: string
          created_at?: string
          has_consented?: boolean | null
          id?: string
          is_active?: boolean | null
          last_active?: string | null
          role?: string
          session_id?: string | null
          temp_password?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      join_group_and_update_session: {
        Args: {
          p_group_id: string
          p_user_id: string
          p_session_id: string
        }
        Returns: undefined
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
