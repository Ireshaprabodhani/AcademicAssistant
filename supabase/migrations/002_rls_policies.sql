-- ============================================================
-- AI Academic Assistant — Row Level Security Policies
-- Run this AFTER 001_initial_schema.sql
-- ============================================================

-- ─── Enable RLS on all tables ───────────────────────────────
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- ─── profiles ───────────────────────────────────────────────
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- ─── documents ──────────────────────────────────────────────
CREATE POLICY "documents_select_own" ON public.documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "documents_insert_own" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "documents_update_own" ON public.documents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "documents_delete_own" ON public.documents
  FOR DELETE USING (auth.uid() = user_id);

-- ─── document_chunks ────────────────────────────────────────
CREATE POLICY "chunks_select_own" ON public.document_chunks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "chunks_insert_own" ON public.document_chunks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "chunks_delete_own" ON public.document_chunks
  FOR DELETE USING (auth.uid() = user_id);

-- ─── chat_sessions ──────────────────────────────────────────
CREATE POLICY "sessions_select_own" ON public.chat_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "sessions_insert_own" ON public.chat_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "sessions_update_own" ON public.chat_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "sessions_delete_own" ON public.chat_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- ─── chat_messages ──────────────────────────────────────────
CREATE POLICY "messages_select_own" ON public.chat_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "messages_insert_own" ON public.chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ─── Storage: documents bucket ──────────────────────────────
-- BEFORE running these policies, create the bucket in the Supabase Dashboard:
--   Storage > New Bucket > Name: documents | Public: OFF

DROP POLICY IF EXISTS "documents_upload_own" ON storage.objects;
DROP POLICY IF EXISTS "documents_read_own" ON storage.objects;
DROP POLICY IF EXISTS "documents_delete_own" ON storage.objects;

-- Allow authenticated users to upload to their own user-id folder
CREATE POLICY "documents_upload_own" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow authenticated users to read their own files
CREATE POLICY "documents_read_own" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow authenticated users to delete their own files
CREATE POLICY "documents_delete_own" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
