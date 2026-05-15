export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      documents: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          file_name: string;
          file_size: number;
          file_type: string;
          storage_path: string;
          status: "processing" | "ready" | "error";
          page_count: number | null;
          word_count: number | null;
          error_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          file_name: string;
          file_size: number;
          file_type: string;
          storage_path: string;
          status?: "processing" | "ready" | "error";
          page_count?: number | null;
          word_count?: number | null;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          file_name?: string;
          file_size?: number;
          file_type?: string;
          storage_path?: string;
          status?: "processing" | "ready" | "error";
          page_count?: number | null;
          word_count?: number | null;
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      document_chunks: {
        Row: {
          id: string;
          document_id: string;
          user_id: string;
          chunk_index: number;
          content: string;
          token_count: number | null;
          page_number: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          document_id: string;
          user_id: string;
          chunk_index: number;
          content: string;
          token_count?: number | null;
          page_number?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          document_id?: string;
          user_id?: string;
          chunk_index?: number;
          content?: string;
          token_count?: number | null;
          page_number?: number | null;
        };
        Relationships: [];
      };
      chat_sessions: {
        Row: {
          id: string;
          user_id: string;
          document_id: string | null;
          feature: string;
          title: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          document_id?: string | null;
          feature?: string;
          title?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          document_id?: string | null;
          feature?: string;
          title?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      chat_messages: {
        Row: {
          id: string;
          session_id: string;
          user_id: string;
          role: "user" | "assistant";
          content: string;
          input_tokens: number | null;
          output_tokens: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          user_id: string;
          role: "user" | "assistant";
          content: string;
          input_tokens?: number | null;
          output_tokens?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          user_id?: string;
          role?: "user" | "assistant";
          content?: string;
          input_tokens?: number | null;
          output_tokens?: number | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]?: never;
    };
    Functions: {
      [_ in never]?: never;
    };
    Enums: {
      [_ in never]?: never;
    };
    CompositeTypes: {
      [_ in never]?: never;
    };
  };
}
