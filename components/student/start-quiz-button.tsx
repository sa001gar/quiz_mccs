"use client"

import { Button } from "@/components/ui/button"
import { startQuiz } from "@/lib/actions/quiz"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Play } from "lucide-react"

export function StartQuizButton({ quizId }: { quizId: string }) {
  const router = useRouter()
  const [isStarting, setIsStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleStart = async () => {
    setIsStarting(true)
    setError(null)

    try {
      const result = await startQuiz(quizId)
      // Store session token in sessionStorage
      if (result.sessionToken) {
        sessionStorage.setItem(`quiz_session_${result.attemptId}`, result.sessionToken)
      }
      router.push(`/dashboard/quizzes/${quizId}/take`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start quiz")
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button onClick={handleStart} disabled={isStarting} size="lg" className="w-full gap-2">
        <Play className="h-4 w-4" />
        {isStarting ? "Starting Quiz..." : "Start Quiz"}
      </Button>
    </div>
  )
}
