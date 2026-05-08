export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      audiences: {
        Row: {
          created_at: string
          id: string
          label: string
          range: string | null
          sort_order: number
        }
        Insert: {
          created_at?: string
          id: string
          label: string
          range?: string | null
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          range?: string | null
          sort_order?: number
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          icon: string | null
          id: string
          label: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          icon?: string | null
          id: string
          label: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          icon?: string | null
          id?: string
          label?: string
          sort_order?: number
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          customer_dni: string | null
          customer_email: string
          customer_name: string
          customer_phone: string | null
          id: string
          items: Json
          notes: string | null
          order_number: string
          payment_id: string | null
          payment_method: string
          payment_status: Database["public"]["Enums"]["payment_status"]
          shipping_address: Json
          shipping_cost: number
          shipping_method: string
          status: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          customer_dni?: string | null
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          id?: string
          items: Json
          notes?: string | null
          order_number: string
          payment_id?: string | null
          payment_method: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          shipping_address?: Json
          shipping_cost?: number
          shipping_method: string
          status?: Database["public"]["Enums"]["order_status"]
          subtotal: number
          total: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          customer_dni?: string | null
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          id?: string
          items?: Json
          notes?: string | null
          order_number?: string
          payment_id?: string | null
          payment_method?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          shipping_address?: Json
          shipping_cost?: number
          shipping_method?: string
          status?: Database["public"]["Enums"]["order_status"]
          subtotal?: number
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean
          audience_id: string
          care: string
          category_id: string
          colors: string[]
          compare_at: number | null
          created_at: string
          description: string
          id: string
          images: string[]
          img: string
          materials: string
          name: string
          price: number
          slug: string
          stock: Json
          tags: string[]
          updated_at: string
        }
        Insert: {
          active?: boolean
          audience_id: string
          care?: string
          category_id: string
          colors?: string[]
          compare_at?: number | null
          created_at?: string
          description?: string
          id: string
          images?: string[]
          img?: string
          materials?: string
          name: string
          price: number
          slug: string
          stock?: Json
          tags?: string[]
          updated_at?: string
        }
        Update: {
          active?: boolean
          audience_id?: string
          care?: string
          category_id?: string
          colors?: string[]
          compare_at?: number | null
          created_at?: string
          description?: string
          id?: string
          images?: string[]
          img?: string
          materials?: string
          name?: string
          price?: number
          slug?: string
          stock?: Json
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          addresses: Json
          created_at: string
          dni: string | null
          email: string | null
          id: string
          is_admin: boolean
          name: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          addresses?: Json
          created_at?: string
          dni?: string | null
          email?: string | null
          id: string
          is_admin?: boolean
          name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          addresses?: Json
          created_at?: string
          dni?: string | null
          email?: string | null
          id?: string
          is_admin?: boolean
          name?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          body: string | null
          created_at: string
          id: string
          product_id: string
          rating: number
          title: string | null
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          product_id: string
          rating: number
          title?: string | null
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          product_id?: string
          rating?: number
          title?: string | null
          user_id?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: {
      order_status:
        | "pendiente-pago"
        | "preparando"
        | "enviado"
        | "entregado"
        | "cancelado"
      payment_status:
        | "pending"
        | "approved"
        | "rejected"
        | "in_process"
        | "cancelled"
    }
    CompositeTypes: { [_ in never]: never }
  }
}
