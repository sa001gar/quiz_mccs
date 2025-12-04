"use client"

import { useEffect, useMemo, useState, Suspense } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter, useParams } from "next/navigation"
import {
  Clock,
  FileText,
  Award,
  AlertCircle,
  BookOpen,
  Target,
  Shield,
  Zap,
  ChevronLeft,
  Users,
  Brain,
  Trophy,
  Sparkles
} from "lucide-react"
import { StartQuizButton } from "@/components/student/start-quiz-button"
import { QuizCountdown } from "@/components/student/quiz-countdown"
import Link from "next/link"

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
  created_at: string
}

type Attempt = {
  id: string
  status: "in_progress" | "submitted" | string
  started_at: string | null
}

// Component that uses useParams
function QuizStartContent() {
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quiz details...</p>
        </div>
      </div>
    )
  }

  if (!quiz) return null

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative z-10 pb-20 sm:pb-8">
        <div className="p-4 sm:p-6 max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between gap-4 mb-6">
              <Link href="/dashboard/quizzes">
                <Button variant="outline" className="border-primary/20 text-foreground hover:bg-primary/10">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Quizzes
                </Button>
              </Link>

              {/* Start Exam Button - Top Right */}
              {isAvailable && (
                <div className="flex gap-3">
                  <StartQuizButton quizId={params.id as string} />
                </div>
              )}
            </div>

            {/* Quiz Title and Description */}
            <Card className="bg-card border-border/50 shadow-xl mb-8 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <CardContent className="p-8 relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-primary/10 rounded-xl shadow-sm">
                        <BookOpen className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">
                          {quiz.title}
                        </h1>
                        <Badge className="bg-green-500/10 text-green-600 border-green-500/20 px-4 py-1">
                          <Sparkles className="mr-2 h-3 w-3" />
                          Active Quiz
                        </Badge>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                      {quiz.description || "Test your knowledge with this comprehensive quiz and earn your certificate."}
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="lg:ml-8 w-full lg:w-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-secondary/30 rounded-xl border border-border/50">
                        <div className="text-2xl font-bold text-foreground">{quiz.duration_minutes}</div>
                        <div className="text-sm text-muted-foreground">Minutes</div>
                      </div>
                      <div className="text-center p-4 bg-secondary/30 rounded-xl border border-border/50">
                        <div className="text-2xl font-bold text-foreground">{questionCount}</div>
                        <div className="text-sm text-muted-foreground">Questions</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quiz Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-card border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-blue-500/10 rounded-xl w-fit mx-auto mb-4">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">Duration</h3>
                <p className="text-3xl font-heading font-bold text-foreground">{quiz.duration_minutes}</p>
                <p className="text-sm text-muted-foreground">minutes</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-green-500/10 rounded-xl w-fit mx-auto mb-4">
                  <FileText className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">Questions</h3>
                <p className="text-3xl font-heading font-bold text-foreground">{questionCount || 0}</p>
                <p className="text-sm text-muted-foreground">total questions</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-yellow-500/10 rounded-xl w-fit mx-auto mb-4">
                  <Target className="h-6 w-6 text-yellow-500" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">Total Marks</h3>
                <p className="text-3xl font-heading font-bold text-foreground">{quiz.total_marks}</p>
                <p className="text-sm text-muted-foreground">maximum score</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-primary/10 rounded-xl w-fit mx-auto mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">Passing Score</h3>
                <p className="text-3xl font-heading font-bold text-foreground">{quiz.passing_score}</p>
                <p className="text-sm text-muted-foreground">marks required</p>
              </CardContent>
            </Card>
          </div>

          {/* Countdown Timer */}
          {isScheduled && startMs && (
            <Card className="bg-card border-border/50 shadow-xl mb-8">
              <CardContent className="p-6">
                <QuizCountdown
                  scheduledStart={quiz.scheduled_start as string}
                  scheduledEnd={quiz.scheduled_end || null}
                />
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card className="bg-orange-500/5 border-orange-500/20 shadow-xl mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-orange-600" />
                </div>
                <CardTitle className="text-xl font-bold text-foreground">Important Instructions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-orange-500/10 rounded-full mt-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    </div>
                    <p className="text-muted-foreground">You can only attempt this quiz once</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-orange-500/10 rounded-full mt-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    </div>
                    <p className="text-muted-foreground">The timer will start as soon as you begin</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-orange-500/10 rounded-full mt-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    </div>
                    <p className="text-muted-foreground">You cannot pause or restart the quiz</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-orange-500/10 rounded-full mt-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    </div>
                    <p className="text-muted-foreground">Ensure stable internet connection throughout</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-orange-500/10 rounded-full mt-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    </div>
                    <p className="text-muted-foreground">Do not refresh or close the browser during the quiz</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-orange-500/10 rounded-full mt-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    </div>
                    <p className="text-muted-foreground">Single session enforcement is active</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features & Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-card border-border/50 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-green-500/10 rounded-xl w-fit mx-auto mb-4">
                  <Trophy className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Earn Certificate</h3>
                <p className="text-muted-foreground text-sm">Get a digital certificate for scores above {quiz.passing_score} marks</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-blue-500/10 rounded-xl w-fit mx-auto mb-4">
                  <Brain className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Test Knowledge</h3>
                <p className="text-muted-foreground text-sm">Challenge yourself with {questionCount} carefully crafted questions</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-primary/10 rounded-xl w-fit mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Secure & Fair</h3>
                <p className="text-muted-foreground text-sm">Advanced security measures ensure fair evaluation</p>
              </CardContent>
            </Card>
          </div>

          {/* Status Section */}
          <Card className="bg-card border-border/50 shadow-xl">
            <CardContent className="p-8 text-center">
              {isAvailable ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Zap className="h-6 w-6 text-primary" />
                    <h3 className="text-2xl font-bold text-foreground font-heading">Ready to Start?</h3>
                  </div>
                  <p className="text-muted-foreground text-lg">
                    You have {quiz.duration_minutes} minutes to complete {questionCount} questions.
                    Good luck!
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    <span>Your progress is automatically saved</span>
                  </div>
                </div>
              ) : hasEnded ? (
                <div className="space-y-4">
                  <div className="p-4 bg-destructive/10 rounded-xl border border-destructive/20">
                    <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                    <h3 className="text-xl font-bold text-destructive mb-2">Quiz Ended</h3>
                    <p className="text-destructive/80">This quiz is no longer available</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
                    <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <h3 className="text-xl font-bold text-yellow-800 mb-2">Quiz Not Started</h3>
                    <p className="text-yellow-600">Please wait for the quiz to start</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Competition Info */}
          <Card className="mt-8 bg-card border-border/50 shadow-xl">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold text-foreground font-heading">MCCS-QUIZZARDS 2025</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  5th National Level Quiz Competition • October 25-26, 2025
                </p>
                <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>42-hour competition</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    <span>Certificates for 60%+ scores</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <span>Multiple difficulty levels</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Loading component for Suspense fallback
function QuizStartLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading quiz...</p>
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default function QuizStartPage() {
  return (
    <Suspense fallback={<QuizStartLoading />}>
      <QuizStartContent />
    </Suspense>
  )
}