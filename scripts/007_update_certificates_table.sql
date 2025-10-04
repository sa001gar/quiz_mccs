-- Update certificates table to include additional fields for better certificate generation
ALTER TABLE public.certificates 
ADD COLUMN IF NOT EXISTS score INTEGER,
ADD COLUMN IF NOT EXISTS total_marks INTEGER,
ADD COLUMN IF NOT EXISTS percentage INTEGER,
ADD COLUMN IF NOT EXISTS generated_at TIMESTAMPTZ DEFAULT NOW();

-- Update the issued_at column to be more descriptive
COMMENT ON COLUMN public.certificates.issued_at IS 'Legacy field - use generated_at instead';
COMMENT ON COLUMN public.certificates.generated_at IS 'When the certificate was generated';
COMMENT ON COLUMN public.certificates.score IS 'Score achieved by the student';
COMMENT ON COLUMN public.certificates.total_marks IS 'Total marks for the quiz';
COMMENT ON COLUMN public.certificates.percentage IS 'Percentage score achieved';
