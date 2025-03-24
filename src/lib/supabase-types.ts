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
      profiles: {
        Row: {
          id: string
          name: string
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          owner_id: string
          bpm: number
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          owner_id: string
          bpm?: number
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          owner_id?: string
          bpm?: number
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      project_collaborators: {
        Row: {
          project_id: string
          user_id: string
          role: string
          created_at: string
        }
        Insert: {
          project_id: string
          user_id: string
          role?: string
          created_at?: string
        }
        Update: {
          project_id?: string
          user_id?: string
          role?: string
          created_at?: string
        }
      }
      tracks: {
        Row: {
          id: string
          project_id: string
          name: string
          type: 'midi' | 'audio'
          content: Json
          settings: {
            volume: number
            pan: number
            muted: boolean
            solo: boolean
          }
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          type: 'midi' | 'audio'
          content?: Json
          settings?: {
            volume?: number
            pan?: number
            muted?: boolean
            solo?: boolean
          }
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          type?: 'midi' | 'audio'
          content?: Json
          settings?: {
            volume?: number
            pan?: number
            muted?: boolean
            solo?: boolean
          }
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}