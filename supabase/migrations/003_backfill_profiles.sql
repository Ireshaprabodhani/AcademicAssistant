-- ============================================================
-- AI Academic Assistant — Backfill missing profiles
-- Run this in: Supabase Dashboard > SQL Editor
--
-- Fixes: "documents_user_id_fkey" FK violation caused by users
-- who signed up before the handle_new_user trigger was active.
-- ============================================================

INSERT INTO public.profiles (id, email, full_name, avatar_url)
SELECT
  id,
  email,
  raw_user_meta_data->>'full_name',
  raw_user_meta_data->>'avatar_url'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;
