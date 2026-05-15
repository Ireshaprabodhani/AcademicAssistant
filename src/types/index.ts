export type DocumentStatus = "processing" | "ready" | "error";

export type Feature =
  | "document_qa"
  | "essay_helper"
  | "summarizer"
  | "explainer"
  | "planner";

export interface Document {
  id: string;
  user_id: string;
  title: string;
  file_name: string;
  file_size: number;
  file_type: string;
  storage_path: string;
  status: DocumentStatus;
  page_count: number | null;
  word_count: number | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  document_id: string | null;
  feature: Feature;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  user_id: string;
  role: "user" | "assistant";
  content: string;
  input_tokens: number | null;
  output_tokens: number | null;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}
