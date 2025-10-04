"use client"

import { useEffect, useMemo, useState } from "react"
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
  Timer,
  Star,
  Shield,
  Zap,
  ChevronLeft,
  Play,
  CheckCircle,
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
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-100 to-indigo-200 flex items-center justify-center">
        <div className="text-slate-800 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-800 border-t-transparent mx-auto mb-4"></div>
          <p>Loading quiz details...</p>
        </div>
      </div>
    )
  }

  if (!quiz) return null

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
            <div className="flex items-center justify-between gap-4 mb-6">
              <Link href="/dashboard/quizzes">
                <Button variant="outline" className="border-purple-300 text-slate-700 hover:bg-purple-100">
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
            <Card className="bg-gradient-to-r from-purple-200/80 via-indigo-200/80 to-cyan-200/80 backdrop-blur-md border-purple-300/50 shadow-xl mb-8">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-lg">
                        <BookOpen className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
                          {quiz.title}
                        </h1>
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1">
                          <Sparkles className="mr-2 h-3 w-3" />
                          Active Quiz
                        </Badge>
                      </div>
                    </div>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      {quiz.description || "Test your knowledge with this comprehensive quiz and earn your certificate."}
                    </p>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="lg:ml-8">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-white/50 rounded-xl border border-white/30">
                        <div className="text-2xl font-bold text-slate-800">{quiz.duration_minutes}</div>
                        <div className="text-sm text-slate-600">Minutes</div>
                      </div>
                      <div className="text-center p-4 bg-white/50 rounded-xl border border-white/30">
                        <div className="text-2xl font-bold text-slate-800">{questionCount}</div>
                        <div className="text-sm text-slate-600">Questions</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quiz Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white/80 backdrop-blur-md border-purple-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl w-fit mx-auto mb-4">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Duration</h3>
                <p className="text-3xl font-bold text-slate-800">{quiz.duration_minutes}</p>
                <p className="text-sm text-slate-600">minutes</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-md border-purple-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl w-fit mx-auto mb-4">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Questions</h3>
                <p className="text-3xl font-bold text-slate-800">{questionCount || 0}</p>
                <p className="text-sm text-slate-600">total questions</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-md border-purple-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl w-fit mx-auto mb-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Total Marks</h3>
                <p className="text-3xl font-bold text-slate-800">{quiz.total_marks}</p>
                <p className="text-sm text-slate-600">maximum score</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-md border-purple-200/50 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl w-fit mx-auto mb-4">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Passing Score</h3>
                <p className="text-3xl font-bold text-slate-800">{quiz.passing_score}</p>
                <p className="text-sm text-slate-600">marks required</p>
              </CardContent>
            </Card>
          </div>

          {/* Countdown Timer */}
          {isScheduled && startMs && (
            <Card className="bg-gradient-to-r from-purple-200/80 via-indigo-200/80 to-cyan-200/80 backdrop-blur-md border-purple-300/50 shadow-xl mb-8">
              <CardContent className="p-6">
                <QuizCountdown 
                  scheduledStart={quiz.scheduled_start as string} 
                  scheduledEnd={quiz.scheduled_end || null} 
                />
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          <Card className="bg-gradient-to-r from-orange-100/80 to-yellow-100/80 backdrop-blur-md border-orange-300/50 shadow-xl mb-8">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-800">Important Instructions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-orange-200 rounded-full mt-1">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    </div>
                    <p className="text-slate-700">You can only attempt this quiz once</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-orange-200 rounded-full mt-1">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    </div>
                    <p className="text-slate-700">The timer will start as soon as you begin</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-orange-200 rounded-full mt-1">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    </div>
                    <p className="text-slate-700">You cannot pause or restart the quiz</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-orange-200 rounded-full mt-1">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    </div>
                    <p className="text-slate-700">Ensure stable internet connection throughout</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-orange-200 rounded-full mt-1">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    </div>
                    <p className="text-slate-700">Do not refresh or close the browser during the quiz</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-1 bg-orange-200 rounded-full mt-1">
                      <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    </div>
                    <p className="text-slate-700">Single session enforcement is active</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features & Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-green-100/80 to-emerald-100/80 backdrop-blur-md border-green-300/50 shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl w-fit mx-auto mb-4">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Earn Certificate</h3>
                <p className="text-slate-600 text-sm">Get a digital certificate for scores above {quiz.passing_score} marks</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-100/80 to-cyan-100/80 backdrop-blur-md border-blue-300/50 shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl w-fit mx-auto mb-4">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Test Knowledge</h3>
                <p className="text-slate-600 text-sm">Challenge yourself with {questionCount} carefully crafted questions</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-100/80 to-pink-100/80 backdrop-blur-md border-purple-300/50 shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl w-fit mx-auto mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Secure & Fair</h3>
                <p className="text-slate-600 text-sm">Advanced security measures ensure fair evaluation</p>
              </CardContent>
            </Card>
          </div>

          {/* Status Section */}
          <Card className="bg-gradient-to-r from-purple-200/80 via-indigo-200/80 to-cyan-200/80 backdrop-blur-md border-purple-300/50 shadow-xl">
            <CardContent className="p-8 text-center">
              {isAvailable ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Zap className="h-6 w-6 text-purple-600" />
                    <h3 className="text-2xl font-bold text-slate-800">Ready to Start?</h3>
                  </div>
                  <p className="text-slate-600 text-lg">
                    You have {quiz.duration_minutes} minutes to complete {questionCount} questions. 
                    Good luck!
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                    <Shield className="h-4 w-4" />
                    <span>Your progress is automatically saved</span>
                  </div>
                </div>
              ) : hasEnded ? (
                <div className="space-y-4">
                  <div className="p-4 bg-red-100 rounded-xl border border-red-200">
                    <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <h3 className="text-xl font-bold text-red-800 mb-2">Quiz Ended</h3>
                    <p className="text-red-600">This quiz is no longer available</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-100 rounded-xl border border-yellow-200">
                    <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                    <h3 className="text-xl font-bold text-yellow-800 mb-2">Quiz Not Started</h3>
                    <p className="text-yellow-600">Please wait for the quiz to start</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Competition Info */}
          <Card className="mt-8 bg-gradient-to-r from-purple-200/80 via-indigo-200/80 to-cyan-200/80 backdrop-blur-md border-purple-300/50 shadow-xl">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-slate-800">MCCS-QUIZZARDS 2025</h3>
                </div>
                <p className="text-slate-700 mb-4">
                  5th National Level Quiz Competition • October 25-26, 2025
                </p>
                <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-600">
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