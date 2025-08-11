export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          slug: string
          content: string
          excerpt: string
          featured_image: string
          author_id: string
          published: boolean
          category_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          slug: string
          content: string
          excerpt: string
          featured_image?: string
          author_id: string
          published?: boolean
          category_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string
          featured_image?: string
          author_id?: string
          published?: boolean
          category_id?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
      }
      authors: {
        Row: {
          id: string
          name: string
          bio: string
          avatar_url: string
        }
        Insert: {
          id?: string
          name: string
          bio?: string
          avatar_url?: string
        }
        Update: {
          id?: string
          name?: string
          bio?: string
          avatar_url?: string
        }
      }
      events: {
        Row: {
          id: string
          created_at: string
          title: string
          date: string
          location: string
          description: string
          speaker: string
          image: string
          registration_link: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          date: string
          location: string
          description: string
          speaker: string
          image?: string
          registration_link?: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          date?: string
          location?: string
          description?: string
          speaker?: string
          image?: string
          registration_link?: string
        }
      }
      domains: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          slug: string
          icon_name: string
          content: string
          order_index: number
          published: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          slug: string
          icon_name: string
          content: string
          order_index?: number
          published?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          slug?: string
          icon_name?: string
          content?: string
          order_index?: number
          published?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

