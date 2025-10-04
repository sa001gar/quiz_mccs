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
  TrendingUp,
  Users,
  Target,
  Zap,
  ChevronRight,
  Eye,
  Download
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
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-100 to-indigo-200 flex items-center justify-center">
        <div className="text-slate-800 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-800 border-t-transparent mx-auto mb-4"></div>
          <p>Loading quizzes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-100 to-indigo-200 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-2xl animate-float delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full blur-3xl animate-float delay-2000" />
        <div className="absolute bottom-40 right-1/3 w-36 h-36 bg-gradient-to-br from-green-200/30 to-teal-200/30 rounded-full blur-2xl animate-float delay-3000" />
      </div>

      <div className="relative z-10 pb-20 sm:pb-8">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
                  Available Quizzes
                </h1>
                <p className="text-slate-600 text-lg">
                  Test your knowledge and earn certificates
                </p>
              </div>
              <div className="flex gap-3">
                <Link href="/dashboard/results">
                  <Button variant="outline" className="border-purple-300 text-slate-700 hover:bg-purple-100">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Results
                  </Button>
                </Link>
                <Link href="/dashboard/certificates">
                  <Button variant="outline" className="border-green-300 text-slate-700 hover:bg-green-100">
                    <Award className="mr-2 h-4 w-4" />
                    Certificates
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white/80 backdrop-blur-md border-purple-200/50 shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-xs font-medium">Total Quizzes</p>
                    <p className="text-2xl font-bold text-slate-800">{stats.totalQuizzes}</p>
                  </div>
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-md border-purple-200/50 shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-xs font-medium">Completed</p>
                    <p className="text-2xl font-bold text-slate-800">{stats.completedQuizzes}</p>
                  </div>
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-md border-purple-200/50 shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-xs font-medium">Avg Score</p>
                    <p className="text-2xl font-bold text-slate-800">{stats.averageScore}%</p>
                  </div>
                  <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-md border-purple-200/50 shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-xs font-medium">Time Spent</p>
                    <p className="text-2xl font-bold text-slate-800">{formatTime(stats.totalTimeSpent)}</p>
                  </div>
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                    <Timer className="h-4 w-4 text-white" />
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
                  <Card key={quiz.id} className="bg-white/80 backdrop-blur-md border-purple-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <CardTitle className="text-xl font-bold text-slate-800 mb-2 group-hover:text-purple-700 transition-colors">
                            {quiz.title}
                          </CardTitle>
                          <CardDescription className="text-slate-600 line-clamp-2">
                            {quiz.description || "Test your knowledge with this comprehensive quiz."}
                          </CardDescription>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {isCompleted && (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Completed
                            </Badge>
                          )}
                          {isInProgress && (
                            <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                              <Clock className="mr-1 h-3 w-3" />
                              In Progress
                            </Badge>
                          )}
                          {isScheduled && !hasStarted && (
                            <Badge variant="outline" className="border-blue-300 text-blue-700">
                              <Calendar className="mr-1 h-3 w-3" />
                              Scheduled
                            </Badge>
                          )}
                          {hasEnded && (
                            <Badge className="bg-red-100 text-red-700 border-red-200">
                              <AlertCircle className="mr-1 h-3 w-3" />
                              Ended
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Quiz Details */}
                      <div className="space-y-3">
                        {isScheduled && quiz.scheduled_start && (
                          <div className="flex items-center justify-between text-sm p-3 bg-purple-50/50 rounded-lg border border-purple-100">
                            <span className="flex items-center gap-2 text-slate-600">
                              <Calendar className="h-4 w-4" />
                              {hasStarted ? "Closes" : "Opens"}
                            </span>
                            <span className="font-semibold text-slate-800">
                              {hasStarted && quiz.scheduled_end
                                ? new Date(quiz.scheduled_end).toLocaleDateString()
                                : new Date(quiz.scheduled_start).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-sm p-2 bg-slate-50 rounded-lg">
                            <Clock className="h-4 w-4 text-slate-600" />
                            <span className="text-slate-600">Duration</span>
                            <span className="font-semibold text-slate-800">{quiz.duration_minutes}m</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm p-2 bg-slate-50 rounded-lg">
                            <FileText className="h-4 w-4 text-slate-600" />
                            <span className="text-slate-600">Marks</span>
                            <span className="font-semibold text-slate-800">{quiz.total_marks}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                          <span className="flex items-center gap-2 text-slate-600">
                            <Award className="h-4 w-4" />
                            Passing Score
                          </span>
                          <span className="font-bold text-slate-800">{quiz.passing_score} marks</span>
                        </div>

                        {isCompleted && attempt && (
                          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-green-700 font-medium">Your Score</span>
                              <span className="text-lg font-bold text-green-800">
                                {attempt.score}/{attempt.total_marks}
                              </span>
                            </div>
                            {attempt.passed && (
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <span className="text-sm text-green-700">Certificate earned!</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <Link href={`/dashboard/quizzes/${quiz.id}`} className="block">
                        <Button 
                          className={`w-full font-semibold py-3 rounded-lg transition-all duration-300 ${
                            isCompleted
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : hasEnded
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : !isAvailable
                                  ? "bg-gray-400 text-white cursor-not-allowed"
                                  : isInProgress
                                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                                    : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
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
              <Card className="col-span-full bg-white/80 backdrop-blur-md border-purple-200/50 shadow-xl">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="p-4 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full mb-6">
                    <BookOpen className="h-12 w-12 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">No quizzes available</h3>
                  <p className="text-slate-600 text-center mb-6 max-w-md">
                    Check back later for new quizzes. The competition will begin on October 25, 2025.
                  </p>
                  <div className="flex gap-3">
                    <Link href="/dashboard">
                      <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
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
          <Card className="mt-8 bg-gradient-to-r from-purple-200/80 via-indigo-200/80 to-cyan-200/80 backdrop-blur-md border-purple-300/50 shadow-xl">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Zap className="h-6 w-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-slate-800">MCCS-QUIZZARDS 2025</h3>
                </div>
                <p className="text-slate-700 mb-4">
                  5th National Level Quiz Competition • October 25-26, 2025
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
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