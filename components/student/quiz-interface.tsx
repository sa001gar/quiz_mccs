"use client"
import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { submitAnswer, submitQuiz, validateSession } from "@/lib/actions/quiz"
import { useRouter } from "next/navigation"
import { Clock, AlertCircle } from "lucide-react"
import type { Quiz, Question } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface QuizInterfaceProps {
  quiz: Quiz
  questions: Question[]
  attemptId: string
  existingAnswers: Map<string, string>
  startedAt: string
}

export function QuizInterface({ quiz, questions, attemptId, existingAnswers, startedAt }: QuizInterfaceProps) {
  const router = useRouter()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Map<string, string>>(existingAnswers)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [sessionValid, setSessionValid] = useState(true)

  const currentQuestion = questions[currentQuestionIndex]

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true)
    try {
      const result = await submitQuiz(attemptId)
      sessionStorage.removeItem(`quiz_session_${attemptId}`)
      router.push(`/dashboard/results?score=${result.score}&total=${result.totalMarks}&passed=${result.passed}`)
    } catch (error) {
      console.error("Failed to submit quiz:", error)
    } finally {
      setIsSubmitting(false)
    }
  }, [attemptId, router])

  useEffect(() => {
    const startTime = new Date(startedAt).getTime()
    const endTime = startTime + quiz.duration_minutes * 60 * 1000

    const updateTimer = () => {
      const now = Date.now()
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000))
      setTimeRemaining(remaining)

      if (remaining === 0) {
        handleSubmit()
      }
    }

    // Set initial time immediately
    updateTimer()

    // Update every second
    const timer = setInterval(updateTimer, 1000)

    return () => clearInterval(timer)
  }, [startedAt, quiz.duration_minutes, handleSubmit])

  // Validate session on mount
  useEffect(() => {
    const sessionToken = sessionStorage.getItem(`quiz_session_${attemptId}`)
    if (!sessionToken) {
      setSessionValid(false)
      return
    }

    validateSession(attemptId, sessionToken).then((result) => {
      if (!result.valid) {
        setSessionValid(false)
      }
    })
  }, [attemptId])

  // Prevent navigation away
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [])

  const handleAnswerChange = async (optionId: string) => {
    const newAnswers = new Map(answers)
    newAnswers.set(currentQuestion.id, optionId)
    setAnswers(newAnswers)

    // Submit answer to server
    try {
      await submitAnswer(attemptId, currentQuestion.id, optionId)
    } catch (error) {
      console.error("Failed to save answer:", error)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const answeredCount = answers.size
  const totalQuestions = questions.length

  if (!sessionValid) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="flex flex-col items-center gap-4 pt-6">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <div className="text-center">
              <h2 className="text-xl font-bold">Session Invalid</h2>
              <p className="text-sm text-muted-foreground">
                Your quiz session is invalid or has been opened in another tab. Please contact your instructor.
              </p>
            </div>
            <Button onClick={() => router.push("/dashboard/quizzes")}>Back to Quizzes</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold">{quiz.title}</h1>
            <p className="text-sm text-muted-foreground">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Answered</p>
              <p className="text-lg font-bold">
                {answeredCount}/{totalQuestions}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border px-4 py-2">
              <Clock className="h-5 w-5" />
              <span className={`text-lg font-bold ${timeRemaining < 60 ? "text-red-500" : ""}`}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge>Question {currentQuestionIndex + 1}</Badge>
                <Badge variant="secondary">{currentQuestion.marks} marks</Badge>
              </div>
              <CardTitle className="text-lg">{currentQuestion.question_text}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={answers.get(currentQuestion.id) || ""}
            onValueChange={handleAnswerChange}
            className="space-y-3"
          >
            {currentQuestion.options
              ?.sort((a, b) => a.order_number - b.order_number)
              .map((option) => (
                <div key={option.id} className="flex items-center gap-3 rounded-lg border p-4">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer font-normal">
                    {option.option_text}
                  </Label>
                </div>
              ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {currentQuestionIndex === totalQuestions - 1 ? (
            <Button onClick={() => setShowSubmitDialog(true)} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </Button>
          ) : (
            <Button onClick={() => setCurrentQuestionIndex(Math.min(totalQuestions - 1, currentQuestionIndex + 1))}>
              Next
            </Button>
          )}
        </div>
      </div>

      {/* Question Navigator */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Question Navigator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
            {questions.map((q, index) => (
              <Button
                key={q.id}
                variant={index === currentQuestionIndex ? "default" : answers.has(q.id) ? "secondary" : "outline"}
                size="sm"
                onClick={() => setCurrentQuestionIndex(index)}
                className="h-10 w-full p-0"
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {answeredCount} out of {totalQuestions} questions. Are you sure you want to submit? You
              cannot change your answers after submission.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
