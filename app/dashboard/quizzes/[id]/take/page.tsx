"use client"

import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useParams, useRouter } from "next/navigation"
import { QuizInterface } from "@/components/student/quiz-interface"

type Quiz = any
type Question = any

export default function TakeQuizPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [existingAnswers, setExistingAnswers] = useState<Map<string, string>>(new Map())
  const [startedAt, setStartedAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const supabase = createClient()
    async function load() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        const { data: quizData } = await supabase
          .from("quizzes")
          .select("*")
          .eq("id", params.id)
          .eq("is_active", true)
          .single()

        if (!quizData) {
          router.replace(`/dashboard/quizzes/${params.id}`)
          return
        }

        const { data: attempt } = await supabase
          .from("quiz_attempts")
          .select("*")
          .eq("quiz_id", params.id)
          .eq("student_id", user?.id)
          .single()

        if (!attempt) {
          router.replace(`/dashboard/quizzes/${params.id}`)
          return
        }

        if (attempt.status === "submitted") {
          router.replace("/dashboard/results")
          return
        }

        const [{ data: questionsData }, { data: answers }] = await Promise.all([
          supabase
            .from("questions")
            .select(`*, options(*)`)
            .eq("quiz_id", params.id)
            .order("order_number", { ascending: true }),
          supabase.from("answers").select("*").eq("attempt_id", attempt.id),
        ])

        if (!isMounted) return
        setQuiz(quizData)
        setQuestions(questionsData || [])
        setAttemptId(attempt.id)
        setStartedAt(attempt.started_at)
        setExistingAnswers(new Map((answers || []).map((a: any) => [a.question_id, a.selected_option_id])))
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [params.id, router])

  if (loading || !quiz || !attemptId || !startedAt) return null

  return (
    <QuizInterface
      quiz={quiz}
      questions={questions}
      attemptId={attemptId}
      existingAnswers={existingAnswers}
      startedAt={startedAt}
    />
  )
}
