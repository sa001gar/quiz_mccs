"use client"

import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Clock,
  FileText,
  Award,
  Calendar,
  Play,
  CheckCircle,
  AlertCircle,
  Timer,
  BookOpen,
  Star,
  Target,
  Zap,
  ChevronRight,
  Users
} from "lucide-react"

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
  quiz_id: string
  status: string
  score?: number
  total_marks?: number
  passed?: boolean
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null)
  const [attempts, setAttempts] = useState<Attempt[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: 0,
    totalTimeSpent: 0
  })

  useEffect(() => {
    let isMounted = true
    const supabase = createClient()

    async function fetchData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        const [quizzesRes, attemptsRes, statsRes] = await Promise.all([
          supabase
            .from("quizzes")
            .select("*")
            .eq("is_active", true)
            .order("created_at", { ascending: false }),
          user
            ? supabase.from("quiz_attempts").select("quiz_id, status, score, total_marks, passed").eq("student_id", user.id)
            : Promise.resolve({ data: null }),
          user
            ? supabase.from("quiz_attempts").select("score, total_marks, time_taken_seconds").eq("student_id", user.id).eq("status", "submitted")
            : Promise.resolve({ data: null })
        ])

        if (!isMounted) return

        const quizzesData = (quizzesRes as any).data || []
        const attemptsData = (attemptsRes as any).data || []
        const statsData = (statsRes as any).data || []

        setQuizzes(quizzesData)
        setAttempts(attemptsData)

        // Calculate stats
        const completedQuizzes = attemptsData.filter((a: { status: string }) => a.status === "submitted").length
        const averageScore = statsData.length > 0
          ? Math.round(
            statsData.reduce(
              (sum: number, attempt: { score?: number; total_marks?: number }) =>
                sum + ((attempt.score ?? 0) / (attempt.total_marks ?? 1) * 100),
              0
            ) / statsData.length
          )
          : 0
        const totalTimeSpent = statsData.reduce(
          (sum: number, attempt: { time_taken_seconds?: number }) => sum + (attempt.time_taken_seconds ?? 0),
          0
        )

        setStats({
          totalQuizzes: quizzesData.length,
          completedQuizzes,
          averageScore,
          totalTimeSpent
        })
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchData()
    return () => {
      isMounted = false
    }
  }, [])

  const attemptMap = useMemo(() => new Map((attempts || []).map((a) => [a.quiz_id, a])), [attempts])
  const now = useMemo(() => new Date(), [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quizzes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative z-10 pb-20 sm:pb-8">
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">
                  Available Quizzes
                </h1>
                <p className="text-muted-foreground text-lg">
                  Test your knowledge and earn certificates
                </p>
              </div>
              <div className="flex gap-3">
                <Link href="/dashboard/results">
                  <Button variant="outline" className="border-primary/20 text-foreground hover:bg-primary/10">
                    <Award className="mr-2 h-4 w-4" />
                    View Results
                  </Button>
                </Link>
                <Link href="/dashboard/certificates">
                  <Button variant="outline" className="border-primary/20 text-foreground hover:bg-primary/10">
                    <Award className="mr-2 h-4 w-4" />
                    Certificates
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-card border-border/50 shadow-lg">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">Total Quizzes</p>
                    <p className="text-3xl font-heading font-bold text-foreground">{stats.totalQuizzes}</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-xl">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50 shadow-lg">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">Completed</p>
                    <p className="text-3xl font-heading font-bold text-foreground">{stats.completedQuizzes}</p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-xl">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50 shadow-lg">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">Avg Score</p>
                    <p className="text-3xl font-heading font-bold text-foreground">{stats.averageScore}%</p>
                  </div>
                  <div className="p-3 bg-yellow-500/10 rounded-xl">
                    <Target className="h-5 w-5 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50 shadow-lg">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">Time Spent</p>
                    <p className="text-3xl font-heading font-bold text-foreground">{formatTime(stats.totalTimeSpent)}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Timer className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quizzes Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzes && quizzes.length > 0 ? (
              quizzes.map((quiz) => {
                const attempt = attemptMap.get(quiz.id)
                const isCompleted = attempt?.status === "submitted"
                const isInProgress = attempt?.status === "in_progress"

                const isScheduled = !!(quiz.scheduled_start || quiz.scheduled_end)
                const hasStarted = quiz.scheduled_start ? new Date(quiz.scheduled_start) <= now : true
                const hasEnded = quiz.scheduled_end ? new Date(quiz.scheduled_end) <= now : false
                const isAvailable = !isScheduled || (hasStarted && !hasEnded)

                return (
                  <Card key={quiz.id} className="bg-card border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 group flex flex-col">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <CardTitle className="font-heading text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                            {quiz.title}
                          </CardTitle>
                          <CardDescription className="text-muted-foreground line-clamp-2">
                            {quiz.description || "Test your knowledge with this comprehensive quiz."}
                          </CardDescription>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {isCompleted && (
                            <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Completed
                            </Badge>
                          )}
                          {isInProgress && (
                            <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                              <Clock className="mr-1 h-3 w-3" />
                              In Progress
                            </Badge>
                          )}
                          {isScheduled && !hasStarted && (
                            <Badge variant="outline" className="border-blue-500/20 text-blue-600">
                              <Calendar className="mr-1 h-3 w-3" />
                              Scheduled
                            </Badge>
                          )}
                          {hasEnded && (
                            <Badge className="bg-destructive/10 text-destructive border-destructive/20">
                              <AlertCircle className="mr-1 h-3 w-3" />
                              Ended
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 flex-1 flex flex-col">
                      {/* Quiz Details */}
                      <div className="space-y-3 flex-1">
                        {isScheduled && quiz.scheduled_start && (
                          <div className="flex items-center justify-between text-sm p-3 bg-secondary/30 rounded-lg border border-border/50">
                            <span className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              {hasStarted ? "Closes" : "Opens"}
                            </span>
                            <span className="font-semibold text-foreground">
                              {hasStarted && quiz.scheduled_end
                                ? new Date(quiz.scheduled_end).toLocaleDateString()
                                : new Date(quiz.scheduled_start).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-sm p-2 bg-secondary/20 rounded-lg">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Duration</span>
                            <span className="font-semibold text-foreground">{quiz.duration_minutes}m</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm p-2 bg-secondary/20 rounded-lg">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Marks</span>
                            <span className="font-semibold text-foreground">{quiz.total_marks}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm p-3 bg-yellow-500/5 rounded-lg border border-yellow-500/10">
                          <span className="flex items-center gap-2 text-muted-foreground">
                            <Award className="h-4 w-4" />
                            Passing Score
                          </span>
                          <span className="font-bold text-foreground">{quiz.passing_score} marks</span>
                        </div>

                        {isCompleted && attempt && (
                          <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-green-600 font-medium">Your Score</span>
                              <span className="text-lg font-bold text-green-700">
                                {attempt.score}/{attempt.total_marks}
                              </span>
                            </div>
                            {attempt.passed && (
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span className="text-sm text-green-600">Certificate earned!</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <Link href={`/dashboard/quizzes/${quiz.id}`} className="block mt-auto">
                        <Button
                          className={`w-full font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg ${isCompleted
                              ? "bg-green-600 hover:bg-green-700 text-white shadow-green-600/20"
                              : hasEnded
                                ? "bg-destructive hover:bg-destructive/90 text-white shadow-destructive/20"
                                : !isAvailable
                                  ? "bg-muted text-muted-foreground cursor-not-allowed shadow-none"
                                  : isInProgress
                                    ? "bg-yellow-500 hover:bg-yellow-600 text-white shadow-yellow-500/20"
                                    : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
                            }`}
                          disabled={isCompleted || hasEnded || !isAvailable}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              View Results
                            </>
                          ) : hasEnded ? (
                            <>
                              <AlertCircle className="mr-2 h-4 w-4" />
                              Quiz Ended
                            </>
                          ) : !isAvailable ? (
                            <>
                              <Clock className="mr-2 h-4 w-4" />
                              Not Yet Available
                            </>
                          ) : isInProgress ? (
                            <>
                              <Play className="mr-2 h-4 w-4" />
                              Continue Quiz
                            </>
                          ) : (
                            <>
                              <Play className="mr-2 h-4 w-4" />
                              Start Quiz
                            </>
                          )}
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <Card className="col-span-full bg-card border-border/50 shadow-xl">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="p-4 bg-primary/10 rounded-full mb-6">
                    <BookOpen className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">No quizzes available</h3>
                  <p className="text-muted-foreground text-center mb-6 max-w-md">
                    Check back later for new quizzes. The competition will begin on October 25, 2025.
                  </p>
                  <div className="flex gap-3">
                    <Link href="/dashboard">
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                        <ChevronRight className="mr-2 h-4 w-4" />
                        Back to Dashboard
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Competition Info */}
          <Card className="mt-8 bg-card border-border/50 shadow-xl">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold text-foreground font-heading">MCCS-QUIZZARDS 2025</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  5th National Level Quiz Competition • October 25-26, 2025
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
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