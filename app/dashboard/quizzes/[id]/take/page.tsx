"use client"

import { useEffect, useMemo, useState, useCallback, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Clock, 
  CheckCircle, 
  Circle, 
  AlertTriangle, 
  Eye, 
  EyeOff,
  Play,
  Pause,
  RotateCcw,
  Shield,
  Zap,
  Target,
  BookOpen,
  Timer,
  ChevronLeft,
  ChevronRight,
  Flag,
  Check,
  X
} from "lucide-react"

type Quiz = {
  id: string
  title: string
  duration_minutes: number
  total_marks: number
  passing_score: number
}

type Question = {
  id: string
  question_text: string
  marks: number
  options: {
    id: string
    option_text: string
    is_correct: boolean
  }[]
}

type Attempt = {
  id: string
  status: string
  started_at: string
}

export default function TakeQuizPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Map<string, string>>(new Map())
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [tabSwitchCount, setTabSwitchCount] = useState(0)
  const [showWarning, setShowWarning] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showReview, setShowReview] = useState(false)
  
  const startTimeRef = useRef<number>(Date.now())
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  
  // Anti-cheating measures
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount(prev => prev + 1)
        setShowWarning(true)
        
        if (tabSwitchCount >= 2) {
          handleAutoSubmit()
        } else {
          warningTimeoutRef.current = setTimeout(() => {
            setShowWarning(false)
          }, 3000)
        }
      }
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = "Are you sure you want to leave? Your progress will be lost."
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent common cheating shortcuts
      if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'a' || e.key === 'f' || e.key === 'h')) {
        e.preventDefault()
        setTabSwitchCount(prev => prev + 1)
        setShowWarning(true)
      }
      
      // Prevent F12, Ctrl+Shift+I, etc.
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault()
        setTabSwitchCount(prev => prev + 1)
        setShowWarning(true)
      }
    }

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault()
      setTabSwitchCount(prev => prev + 1)
      setShowWarning(true)
    }

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('contextmenu', handleContextMenu)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('contextmenu', handleContextMenu)
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current)
      }
    }
  }, [tabSwitchCount])

  // Timer logic
  useEffect(() => {
    if (!quiz || !attempt?.started_at) return

    const startTime = new Date(attempt.started_at).getTime()
    const durationMs = quiz.duration_minutes * 60 * 1000
    const endTime = startTime + durationMs
    const now = Date.now()

    // If time has already expired, submit immediately
    if (now >= endTime) {
      handleAutoSubmit()
      return
    }

    // Calculate remaining time
    const remainingMs = endTime - now
    const remainingSeconds = Math.floor(remainingMs / 1000)
    setTimeLeft(remainingSeconds)

    // Set up interval to update timer every second
    intervalRef.current = setInterval(() => {
      const currentTime = Date.now()
      const currentRemainingMs = endTime - currentTime
      
      if (currentRemainingMs <= 0) {
        handleAutoSubmit()
      } else {
        const currentRemainingSeconds = Math.floor(currentRemainingMs / 1000)
        setTimeLeft(currentRemainingSeconds)
      }
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [quiz, attempt])

  const handleAutoSubmit = useCallback(async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    
    try {
      // Import and call the server action for proper submission
      const { submitQuiz } = await import('@/lib/actions/quiz')
      if (attemptId) {
        await submitQuiz(attemptId)
      }
      
      router.push('/dashboard/results')
    } catch (error) {
      console.error('Error auto-submitting:', error)
    }
  }, [attemptId, isSubmitting, router])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}` : `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (optionId: string) => {
    const currentQuestion = questions[currentQuestionIndex]
    setAnswers(prev => new Map(prev.set(currentQuestion.id, optionId)))
    
    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1)
      }
    }, 500)
  }

  const handleQuestionNavigation = (index: number) => {
    setCurrentQuestionIndex(index)
    setShowReview(false)
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    
    try {
      const supabase = createClient()
      
      // Save all answers first
      const answerEntries = Array.from(answers.entries()).map(([questionId, optionId]) => ({
        attempt_id: attemptId,
        question_id: questionId,
        selected_option_id: optionId
      }))
      
      await supabase.from('answers').upsert(answerEntries)
      
      // Import and call the server action for proper submission
      const { submitQuiz } = await import('@/lib/actions/quiz')
      if (attemptId) {
        await submitQuiz(attemptId)
      }
      
      router.push('/dashboard/results')
    } catch (error) {
      console.error('Error submitting quiz:', error)
    }
  }

  useEffect(() => {
    let isMounted = true
    const supabase = createClient()
    
    async function load() {
      try {
        // Await params before using
        const resolvedParams = await params
        
        const { data: { user } } = await supabase.auth.getUser()

        const { data: quizData } = await supabase
          .from("quizzes")
          .select("*")
          .eq("id", resolvedParams.id)
          .eq("is_active", true)
          .single()

        if (!quizData) {
          router.replace(`/dashboard/quizzes/${resolvedParams.id}`)
          return
        }

        const { data: attemptData } = await supabase
    .from("quiz_attempts")
    .select("*")
          .eq("quiz_id", resolvedParams.id)
    .eq("student_id", user?.id)
    .single()

        if (!attemptData || attemptData.status !== 'in_progress') {
          router.replace(`/dashboard/quizzes/${resolvedParams.id}`)
          return
        }

        const { data: questionsData } = await supabase
          .from("questions")
          .select(`*, options(*)`)
          .eq("quiz_id", resolvedParams.id)
          .order("order_number", { ascending: true })

        if (!isMounted) return
        setQuiz(quizData)
        setQuestions(questionsData || [])
        setAttemptId(attemptData.id)
        setAttempt(attemptData)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [params, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-100 to-indigo-200 flex items-center justify-center">
        <div className="text-slate-800 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-800 border-t-transparent mx-auto mb-4"></div>
          <p>Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (!quiz || !questions.length) return null

  const currentQuestion = questions[currentQuestionIndex]
  const answeredQuestions = answers.size
  const progress = (answeredQuestions / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-100 to-indigo-200 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-2xl animate-float delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-gradient-to-br from-yellow-200/20 to-orange-200/20 rounded-full blur-3xl animate-float delay-2000" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white/90 backdrop-blur-md border-b border-purple-200/50 shadow-lg">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-slate-800">{quiz.title}</h1>
                  <p className="text-sm text-slate-600">Question {currentQuestionIndex + 1} of {questions.length}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Timer */}
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                  timeLeft < 300 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  <Timer className="h-4 w-4" />
                  <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
                </div>
                
                {/* Progress */}
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-slate-600">{Math.round(progress)}%</span>
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-slate-200 rounded-full h-1">
              <div 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-1 rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4">
          <div className="max-w-4xl mx-auto">
            {showReview ? (
              /* Review Mode */
              <Card className="bg-white/90 backdrop-blur-md border-purple-200/50 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-slate-800">Review Your Answers</CardTitle>
                    <Button 
                      onClick={() => setShowReview(false)}
                      variant="outline"
                      className="border-purple-300 text-slate-700 hover:bg-purple-100"
                    >
                      <EyeOff className="mr-2 h-4 w-4" />
                      Hide Review
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {questions.map((question, index) => {
                      const isAnswered = answers.has(question.id)
                      const isCurrent = index === currentQuestionIndex
                      
                      return (
                        <button
                          key={question.id}
                          onClick={() => handleQuestionNavigation(index)}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                            isCurrent 
                              ? 'border-purple-500 bg-purple-50' 
                              : isAnswered 
                                ? 'border-green-500 bg-green-50' 
                                : 'border-slate-300 bg-white hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-slate-800">Q{index + 1}</span>
                            {isAnswered ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <Circle className="h-5 w-5 text-slate-400" />
                            )}
                          </div>
                          <p className="text-sm text-slate-600 line-clamp-2">{question.question_text}</p>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Question Mode */
              <Card className="bg-white/90 backdrop-blur-md border-purple-200/50 shadow-xl">
                <CardContent className="p-8">
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1">
                        Question {currentQuestionIndex + 1} of {questions.length}
                      </Badge>
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1">
                        {currentQuestion.marks} marks
                      </Badge>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 leading-relaxed">
                      {currentQuestion.question_text}
                    </h2>
                  </div>

                  {/* Options */}
                  <div className="space-y-3">
                    {currentQuestion.options.map((option) => {
                      const isSelected = answers.get(currentQuestion.id) === option.id

  return (
                        <button
                          key={option.id}
                          onClick={() => handleAnswerSelect(option.id)}
                          className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                            isSelected
                              ? 'border-purple-500 bg-purple-50 shadow-lg'
                              : 'border-slate-300 bg-white hover:border-purple-300 hover:bg-purple-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              isSelected 
                                ? 'border-purple-500 bg-purple-500' 
                                : 'border-slate-300'
                            }`}>
                              {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                            </div>
                            <span className="text-slate-800 font-medium">{option.option_text}</span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white/90 backdrop-blur-md border-t border-purple-200/50 shadow-lg">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setShowReview(!showReview)}
                  variant="outline"
                  className="border-purple-300 text-slate-700 hover:bg-purple-100"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  {showReview ? 'Hide Review' : 'Review'}
                </Button>
                
                <div className="text-sm text-slate-600">
                  {answeredQuestions} of {questions.length} answered
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {currentQuestionIndex > 0 && (
                  <Button
                    onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                    variant="outline"
                    className="border-purple-300 text-slate-700 hover:bg-purple-100"
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                )}
                
                {currentQuestionIndex < questions.length - 1 ? (
                  <Button
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Submit Quiz
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-white shadow-2xl max-w-md mx-4">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-red-100 rounded-full w-fit mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Warning!</h3>
              <p className="text-slate-600 mb-4">
                {tabSwitchCount >= 2 
                  ? "You have switched tabs too many times. Your quiz will be auto-submitted."
                  : `You have switched tabs ${tabSwitchCount + 1} times. ${2 - tabSwitchCount} more switches will auto-submit your quiz.`
                }
              </p>
              <Button
                onClick={() => setShowWarning(false)}
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white"
              >
                I Understand
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}