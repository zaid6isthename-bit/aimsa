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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achieved_on: string | null
          category: string
          competition: string | null
          created_at: string
          description: string
          evidence_url: string | null
          id: string
          image_url: string | null
          participants: string[]
          position: string | null
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
          year: string | null
        }
        Insert: {
          achieved_on?: string | null
          category?: string
          competition?: string | null
          created_at?: string
          description?: string
          evidence_url?: string | null
          id?: string
          image_url?: string | null
          participants?: string[]
          position?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
          year?: string | null
        }
        Update: {
          achieved_on?: string | null
          category?: string
          competition?: string | null
          created_at?: string
          description?: string
          evidence_url?: string | null
          id?: string
          image_url?: string | null
          participants?: string[]
          position?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
          year?: string | null
        }
        Relationships: []
      }
      activity_log: {
        Row: {
          action: string
          actor_id: string | null
          actor_name: string
          created_at: string
          entity: string
          entity_id: string | null
          entity_label: string | null
          id: string
        }
        Insert: {
          action: string
          actor_id?: string | null
          actor_name?: string
          created_at?: string
          entity: string
          entity_id?: string | null
          entity_label?: string | null
          id?: string
        }
        Update: {
          action?: string
          actor_id?: string | null
          actor_name?: string
          created_at?: string
          entity?: string
          entity_id?: string | null
          entity_label?: string | null
          id?: string
        }
        Relationships: []
      }
      admin_profiles: {
        Row: {
          active: boolean
          admin_id: string
          created_at: string
          email: string
          id: string
          last_login: string | null
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          admin_id: string
          created_at?: string
          email: string
          id: string
          last_login?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          admin_id?: string
          created_at?: string
          email?: string
          id?: string
          last_login?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      announcements: {
        Row: {
          body: string
          category: string
          created_at: string
          created_by: string | null
          cta_href: string | null
          cta_label: string | null
          expires_at: string | null
          id: string
          image_url: string | null
          pinned: boolean
          publish_at: string | null
          status: Database["public"]["Enums"]["content_status"]
          summary: string
          title: string
          updated_at: string
        }
        Insert: {
          body?: string
          category?: string
          created_at?: string
          created_by?: string | null
          cta_href?: string | null
          cta_label?: string | null
          expires_at?: string | null
          id?: string
          image_url?: string | null
          pinned?: boolean
          publish_at?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          category?: string
          created_at?: string
          created_by?: string | null
          cta_href?: string | null
          cta_label?: string | null
          expires_at?: string | null
          id?: string
          image_url?: string | null
          pinned?: boolean
          publish_at?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_results: {
        Row: {
          certificate_url: string | null
          created_at: string
          detail: string | null
          event_id: string
          id: string
          participant: string
          position: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          certificate_url?: string | null
          created_at?: string
          detail?: string | null
          event_id: string
          id?: string
          participant: string
          position: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          certificate_url?: string | null
          created_at?: string
          detail?: string | null
          event_id?: string
          id?: string
          participant?: string
          position?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_results_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          agenda: Json
          banner_url: string | null
          category: string
          created_at: string
          created_by: string | null
          description: string
          eligibility: string[]
          end_date: string | null
          featured: boolean
          format: string
          gallery: Json
          id: string
          organizers: string[]
          poster_url: string | null
          publish_at: string | null
          registration_deadline: string | null
          registration_url: string | null
          resources: Json
          rules: string[]
          slug: string
          start_date: string | null
          state: Database["public"]["Enums"]["event_state"]
          status: Database["public"]["Enums"]["content_status"]
          summary: string
          title: string
          updated_at: string
          venue: string | null
        }
        Insert: {
          agenda?: Json
          banner_url?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string
          eligibility?: string[]
          end_date?: string | null
          featured?: boolean
          format?: string
          gallery?: Json
          id?: string
          organizers?: string[]
          poster_url?: string | null
          publish_at?: string | null
          registration_deadline?: string | null
          registration_url?: string | null
          resources?: Json
          rules?: string[]
          slug: string
          start_date?: string | null
          state?: Database["public"]["Enums"]["event_state"]
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string
          title: string
          updated_at?: string
          venue?: string | null
        }
        Update: {
          agenda?: Json
          banner_url?: string | null
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string
          eligibility?: string[]
          end_date?: string | null
          featured?: boolean
          format?: string
          gallery?: Json
          id?: string
          organizers?: string[]
          poster_url?: string | null
          publish_at?: string | null
          registration_deadline?: string | null
          registration_url?: string | null
          resources?: Json
          rules?: string[]
          slug?: string
          start_date?: string | null
          state?: Database["public"]["Enums"]["event_state"]
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string
          title?: string
          updated_at?: string
          venue?: string | null
        }
        Relationships: []
      }
      gallery_albums: {
        Row: {
          category: string
          cover_url: string | null
          created_at: string
          description: string | null
          id: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string
          year: string | null
        }
        Insert: {
          category?: string
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string
          year?: string | null
        }
        Update: {
          category?: string
          cover_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string
          year?: string | null
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          album_id: string
          alt_text: string
          caption: string | null
          created_at: string
          featured: boolean
          id: string
          sort_order: number
          updated_at: string
          url: string
        }
        Insert: {
          album_id: string
          alt_text?: string
          caption?: string | null
          created_at?: string
          featured?: boolean
          id?: string
          sort_order?: number
          updated_at?: string
          url: string
        }
        Update: {
          album_id?: string
          alt_text?: string
          caption?: string | null
          created_at?: string
          featured?: boolean
          id?: string
          sort_order?: number
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_images_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "gallery_albums"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          alt_text: string | null
          category: string
          created_at: string
          file_name: string
          id: string
          mime_type: string | null
          path: string
          size_bytes: number | null
          updated_at: string
          uploaded_by: string | null
          url: string
        }
        Insert: {
          alt_text?: string | null
          category?: string
          created_at?: string
          file_name: string
          id?: string
          mime_type?: string | null
          path: string
          size_bytes?: number | null
          updated_at?: string
          uploaded_by?: string | null
          url: string
        }
        Update: {
          alt_text?: string | null
          category?: string
          created_at?: string
          file_name?: string
          id?: string
          mime_type?: string | null
          path?: string
          size_bytes?: number | null
          updated_at?: string
          uploaded_by?: string | null
          url?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          builders: string[]
          created_at: string
          demo_url: string | null
          description: string | null
          domain: string
          featured: boolean
          id: string
          image_url: string | null
          repo_url: string | null
          stack: string[]
          stage: string
          status: Database["public"]["Enums"]["content_status"]
          summary: string
          title: string
          updated_at: string
          writeup_url: string | null
          year: string | null
        }
        Insert: {
          builders?: string[]
          created_at?: string
          demo_url?: string | null
          description?: string | null
          domain?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          repo_url?: string | null
          stack?: string[]
          stage?: string
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string
          title: string
          updated_at?: string
          writeup_url?: string | null
          year?: string | null
        }
        Update: {
          builders?: string[]
          created_at?: string
          demo_url?: string | null
          description?: string | null
          domain?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          repo_url?: string | null
          stack?: string[]
          stage?: string
          status?: Database["public"]["Enums"]["content_status"]
          summary?: string
          title?: string
          updated_at?: string
          writeup_url?: string | null
          year?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      team_members: {
        Row: {
          academic_year: string | null
          active: boolean
          bio: string | null
          created_at: string
          department: string | null
          email: string | null
          github: string | null
          group_name: string
          id: string
          linkedin: string | null
          name: string
          photo_url: string | null
          position: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
        }
        Insert: {
          academic_year?: string | null
          active?: boolean
          bio?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          github?: string | null
          group_name?: string
          id?: string
          linkedin?: string | null
          name: string
          photo_url?: string | null
          position: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Update: {
          academic_year?: string | null
          active?: boolean
          bio?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          github?: string | null
          group_name?: string
          id?: string
          linkedin?: string | null
          name?: string
          photo_url?: string | null
          position?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_manage_content: { Args: { _user_id: string }; Returns: boolean }
      can_manage_events: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_active_admin: { Args: { _user_id: string }; Returns: boolean }
      is_super_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "super_admin" | "content_admin" | "event_admin"
      content_status: "draft" | "published" | "scheduled" | "archived"
      event_state: "upcoming" | "ongoing" | "completed" | "cancelled"
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
    Enums: {
      app_role: ["super_admin", "content_admin", "event_admin"],
      content_status: ["draft", "published", "scheduled", "archived"],
      event_state: ["upcoming", "ongoing", "completed", "cancelled"],
    },
  },
} as const
