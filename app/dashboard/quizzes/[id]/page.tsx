"use client"

import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter, useParams } from "next/navigation"
import { Clock, FileText, Award, AlertCircle } from "lucide-react"
import { StartQuizButton } from "@/components/student/start-quiz-button"
import { QuizCountdown } from "@/components/student/quiz-countdown"

// No pre-conversion; pass raw ISO to `QuizCountdown` which formats to IST

type Quiz = {
  id: string
  title: string
  description: string | null
  duration_minutes: number
  total_marks: number
  passing_score: number
  scheduled_start: string | null
  scheduled_end: string | null
  is_active: boolean
}

type Attempt = {
  id: string
  status: "in_progress" | "submitted" | string
  started_at: string | null
}

export default function QuizStartPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questionCount, setQuestionCount] = useState<number>(0)
  const [attempt, setAttempt] = useState<Attempt | null>(null)
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
          router.replace("/dashboard/quizzes")
          return
        }

        const [{ count }, { data: attemptData }] = await Promise.all([
          supabase
            .from("questions")
            .select("*", { count: "exact", head: true })
            .eq("quiz_id", params.id),
          user
            ? supabase
                .from("quiz_attempts")
                .select("id, status, started_at")
                .eq("quiz_id", params.id)
                .eq("student_id", user.id)
                .single()
            : Promise.resolve({ data: null }),
        ])

        if (!isMounted) return
        setQuiz(quizData)
        setQuestionCount(count || 0)
        setAttempt((attemptData as any) || null)

        if (attemptData?.status === "submitted") {
          router.replace("/dashboard/results")
          return
        }
        if (attemptData?.status === "in_progress") {
          router.replace(`/dashboard/quizzes/${params.id}/take`)
          return
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [params.id, router])

  const now = useMemo(() => Date.now(), [])
  const startMs = quiz?.scheduled_start ? new Date(quiz.scheduled_start).getTime() : null
  const endMs = quiz?.scheduled_end ? new Date(quiz.scheduled_end).getTime() : null
  const isScheduled = !!(startMs || endMs)
  const hasStarted = startMs ? startMs <= now : true
  const hasEnded = endMs ? endMs <= now : false
  const isAvailable = !isScheduled || (hasStarted && !hasEnded)

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <div className="h-7 w-1/3 animate-pulse rounded bg-muted" />
          </CardHeader>
          <CardContent>
            <div className="h-4 w-full animate-pulse rounded bg-muted" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!quiz) return null

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{quiz.title}</CardTitle>
              <CardDescription>{quiz.description}</CardDescription>
            </div>
            <Badge>Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isScheduled && startMs && (
            <QuizCountdown 
              scheduledStart={quiz.scheduled_start as string} 
              scheduledEnd={quiz.scheduled_end || null} 
            />
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-2xl font-bold">{quiz.duration_minutes} mins</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Questions</p>
                <p className="text-2xl font-bold">{questionCount || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <Award className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total Marks</p>
                <p className="text-2xl font-bold">{quiz.total_marks}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <Award className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Passing Score</p>
                <p className="text-2xl font-bold">{quiz.passing_score}</p>
              </div>
            </div>
          </div>

          <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
            <CardContent className="flex gap-3 pt-6">
              <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <div className="space-y-2">
                <p className="font-medium text-orange-900 dark:text-orange-100">Important Instructions</p>
                <ul className="space-y-1 text-sm text-orange-800 dark:text-orange-200">
                  <li>• You can only attempt this quiz once</li>
                  <li>• The timer will start as soon as you begin</li>
                  <li>• You cannot pause or restart the quiz</li>
                  <li>• Ensure stable internet connection throughout</li>
                  <li>• Do not refresh or close the browser during the quiz</li>
                  <li>• Single session enforcement is active - opening in another tab will invalidate your attempt</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {isAvailable ? (
            <StartQuizButton quizId={params.id as string} />
          ) : hasEnded ? (
            <p className="text-center text-sm text-muted-foreground">This quiz is no longer available</p>
          ) : (
            <p className="text-center text-sm text-muted-foreground">Please wait for the quiz to start</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
