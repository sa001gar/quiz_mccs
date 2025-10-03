export interface Profile {
  id: string
  email: string
  full_name: string
  roll_number: string | null
  department: string
  college: string
  role: "student" | "admin"
  created_at: string
  updated_at: string
}

export interface Quiz {
  id: string
  title: string
  description: string | null
  duration_minutes: number
  passing_score: number
  total_marks: number
  is_active: boolean
  created_by: string | null
  created_at: string
  updated_at: string
  scheduled_start?: string | null
  scheduled_end?: string | null
}

export interface Question {
  id: string
  quiz_id: string
  question_text: string
  question_type: "multiple_choice" | "true_false"
  marks: number
  order_number: number
  created_at: string
  options?: Option[]
}

export interface Option {
  id: string
  question_id: string
  option_text: string
  is_correct: boolean
  order_number: number
  created_at: string
}

export interface QuizAttempt {
  id: string
  quiz_id: string
  student_id: string
  started_at: string
  submitted_at: string | null
  score: number | null
  total_marks: number
  passing_score: number
  passed: boolean | null
  time_taken_seconds: number | null
  status: "in_progress" | "submitted" | "abandoned"
}

export interface Answer {
  id: string
  attempt_id: string
  question_id: string
  selected_option_id: string | null
  is_correct: boolean | null
  answered_at: string
}

export interface Certificate {
  id: string
  attempt_id: string
  student_id: string
  quiz_id: string
  certificate_number: string
  issued_at: string
}
