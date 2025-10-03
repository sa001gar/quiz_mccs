-- Function to calculate quiz score
CREATE OR REPLACE FUNCTION calculate_quiz_score(p_attempt_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  v_score INTEGER;
BEGIN
  SELECT COALESCE(SUM(q.marks), 0)
  INTO v_score
  FROM public.answers a
  JOIN public.questions q ON a.question_id = q.id
  WHERE a.attempt_id = p_attempt_id AND a.is_correct = true;
  
  RETURN v_score;
END;
$$;

-- Function to generate certificate number
CREATE OR REPLACE FUNCTION generate_certificate_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_year TEXT;
  v_sequence TEXT;
BEGIN
  v_year := TO_CHAR(NOW(), 'YYYY');
  v_sequence := LPAD((SELECT COUNT(*) + 1 FROM public.certificates)::TEXT, 6, '0');
  
  RETURN 'MKC-CS-' || v_year || '-' || v_sequence;
END;
$$;

-- Function to invalidate old sessions
CREATE OR REPLACE FUNCTION invalidate_old_sessions()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Deactivate any existing active sessions for this student and quiz
  UPDATE public.active_sessions
  SET is_active = false
  WHERE student_id = NEW.student_id 
    AND quiz_id = NEW.quiz_id 
    AND id != NEW.id
    AND is_active = true;
  
  RETURN NEW;
END;
$$;

-- Trigger to invalidate old sessions when a new one is created
DROP TRIGGER IF EXISTS on_new_session_created ON public.active_sessions;

CREATE TRIGGER on_new_session_created
  AFTER INSERT ON public.active_sessions
  FOR EACH ROW
  EXECUTE FUNCTION invalidate_old_sessions();
