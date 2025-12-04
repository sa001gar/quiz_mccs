-- Fix RLS infinite recursion by using a security definer function

-- 1. Create a helper function to check if user is admin
-- This function runs with the privileges of the creator (SECURITY DEFINER)
-- bypassing RLS on the profiles table to avoid recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 2. Update Profiles policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (is_admin());

-- 3. Update Quizzes policies
DROP POLICY IF EXISTS "Admins can manage quizzes" ON public.quizzes;
CREATE POLICY "Admins can manage quizzes"
  ON public.quizzes FOR ALL
  USING (is_admin());

-- 4. Update Questions policies
DROP POLICY IF EXISTS "Admins can manage questions" ON public.questions;
CREATE POLICY "Admins can manage questions"
  ON public.questions FOR ALL
  USING (is_admin());

-- 5. Update Options policies
DROP POLICY IF EXISTS "Admins can manage options" ON public.options;
CREATE POLICY "Admins can manage options"
  ON public.options FOR ALL
  USING (is_admin());

-- 6. Update Quiz attempts policies
DROP POLICY IF EXISTS "Admins can view all attempts" ON public.quiz_attempts;
CREATE POLICY "Admins can view all attempts"
  ON public.quiz_attempts FOR SELECT
  USING (is_admin());

-- 7. Update Answers policies
DROP POLICY IF EXISTS "Admins can view all answers" ON public.answers;
CREATE POLICY "Admins can view all answers"
  ON public.answers FOR SELECT
  USING (is_admin());

-- 8. Update Active sessions policies
DROP POLICY IF EXISTS "Admins can view all sessions" ON public.active_sessions;
CREATE POLICY "Admins can view all sessions"
  ON public.active_sessions FOR SELECT
  USING (is_admin());

-- 9. Update Certificates policies
DROP POLICY IF EXISTS "Admins can manage certificates" ON public.certificates;
CREATE POLICY "Admins can manage certificates"
  ON public.certificates FOR ALL
  USING (is_admin());
