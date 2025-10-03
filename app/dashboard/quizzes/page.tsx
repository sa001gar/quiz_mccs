"use client"

import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Clock, FileText, Award, Calendar } from "lucide-react"

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
  quiz_id: string
  status: string
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null)
  const [attempts, setAttempts] = useState<Attempt[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const supabase = createClient()
    async function fetchData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        const [quizzesRes, attemptsRes] = await Promise.all([
          supabase
            .from("quizzes")
            .select("*")
            .eq("is_active", true)
            .order("created_at", { ascending: false }),
          user
            ? supabase.from("quiz_attempts").select("quiz_id, status").eq("student_id", user.id)
            : Promise.resolve({ data: null }),
        ])

        if (!isMounted) return
        setQuizzes((quizzesRes as any).data || [])
        setAttempts((attemptsRes as any).data || [])
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchData()
    return () => {
      isMounted = false
    }
  }, [])

  const attemptMap = useMemo(() => new Map((attempts || []).map((a) => [a.quiz_id, a.status])), [attempts])
  const now = useMemo(() => new Date(), [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Available Quizzes</h1>
        <p className="text-muted-foreground">Browse and take quizzes</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="space-y-2">
                  <div className="h-5 w-1/2 animate-pulse rounded bg-muted" />
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 w-full animate-pulse rounded bg-muted" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : quizzes && quizzes.length > 0 ? (
          quizzes.map((quiz) => {
            const attemptStatus = attemptMap.get(quiz.id)
            const isCompleted = attemptStatus === "submitted"
            const isInProgress = attemptStatus === "in_progress"

            const isScheduled = !!(quiz.scheduled_start || quiz.scheduled_end)
            const hasStarted = quiz.scheduled_start ? new Date(quiz.scheduled_start) <= now : true
            const hasEnded = quiz.scheduled_end ? new Date(quiz.scheduled_end) <= now : false
            const isAvailable = !isScheduled || (hasStarted && !hasEnded)

            return (
              <Card key={quiz.id}>
                <CardHeader>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      <div className="flex flex-wrap gap-1">
                        {isCompleted && <Badge variant="secondary">Completed</Badge>}
                        {isInProgress && <Badge>In Progress</Badge>}
                        {isScheduled && !hasStarted && <Badge variant="outline">Scheduled</Badge>}
                        {hasEnded && <Badge variant="destructive">Ended</Badge>}
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {isScheduled && quiz.scheduled_start && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {hasStarted ? "Closes" : "Opens"}
                          </span>
                          <span className="font-medium text-xs">
                            {hasStarted && quiz.scheduled_end
                              ? new Date(quiz.scheduled_end).toLocaleDateString()
                              : new Date(quiz.scheduled_start).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          Duration
                        </span>
                        <span className="font-medium">{quiz.duration_minutes} mins</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          Total Marks
                        </span>
                        <span className="font-medium">{quiz.total_marks}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Award className="h-4 w-4" />
                          Passing Score
                        </span>
                        <span className="font-medium">{quiz.passing_score}</span>
                      </div>
                    </div>

                    <Link href={`/dashboard/quizzes/${quiz.id}`} className="block">
                      <Button className="w-full" disabled={isCompleted || hasEnded || !isAvailable}>
                        {isCompleted
                          ? "Already Completed"
                          : hasEnded
                            ? "Quiz Ended"
                            : !isAvailable
                              ? "Not Yet Available"
                              : isInProgress
                                ? "Continue Quiz"
                                : "Start Quiz"}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">No quizzes available</p>
              <p className="text-sm text-muted-foreground">Check back later for new quizzes</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
