import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types (will be generated from Supabase later)
export type Database = {
  public: {
    Tables: {
      calls: {
        Row: {
          id: string;
          caller_number: string;
          duration_seconds: number;
          intent: string | null;
          confidence: number | null;
          status: 'active' | 'on-hold' | 'transferring' | 'completed' | 'missed';
          created_at: string;
          updated_at: string;
          ended_at: string | null;
        };
        Insert: {
          id?: string;
          caller_number: string;
          duration_seconds?: number;
          intent?: string | null;
          confidence?: number | null;
          status?: 'active' | 'on-hold' | 'transferring' | 'completed' | 'missed';
          created_at?: string;
          updated_at?: string;
          ended_at?: string | null;
        };
        Update: {
          id?: string;
          caller_number?: string;
          duration_seconds?: number;
          intent?: string | null;
          confidence?: number | null;
          status?: 'active' | 'on-hold' | 'transferring' | 'completed' | 'missed';
          created_at?: string;
          updated_at?: string;
          ended_at?: string | null;
        };
      };
      call_history: {
        Row: {
          id: string;
          call_id: string;
          caller_number: string;
          intent: string | null;
          outcome: 'resolved' | 'transferred' | 'voicemail' | 'missed';
          duration_seconds: number;
          transcript: string | null;
          summary: string | null;
          audio_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          call_id: string;
          caller_number: string;
          intent?: string | null;
          outcome?: 'resolved' | 'transferred' | 'voicemail' | 'missed';
          duration_seconds: number;
          transcript?: string | null;
          summary?: string | null;
          audio_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          call_id?: string;
          caller_number?: string;
          intent?: string | null;
          outcome?: 'resolved' | 'transferred' | 'voicemail' | 'missed';
          duration_seconds?: number;
          transcript?: string | null;
          summary?: string | null;
          audio_url?: string | null;
          created_at?: string;
        };
      };
    };
  };
};

