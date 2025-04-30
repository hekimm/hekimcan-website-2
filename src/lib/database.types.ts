export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      code_snippets: {
        Row: {
          id: number
          content: string
          language: string
          order_number: number
          active: boolean
          created_at: string
        }
        Insert: {
          id?: number
          content: string
          language?: string
          order_number?: number
          active?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          content?: string
          language?: string
          order_number?: number
          active?: boolean
          created_at?: string
        }
      }
      // ... (rest of the existing types)
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}