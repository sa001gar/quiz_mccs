"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { createQuiz, updateQuiz } from "@/lib/actions/admin"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { Quiz } from "@/lib/types"

interface QuizFormProps {
  quiz?: Quiz
}

export function QuizForm({ quiz }: QuizFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isScheduled, setIsScheduled] = useState(!!(quiz?.scheduled_start || quiz?.scheduled_end))

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)

    if (!isScheduled) {
      formData.delete("scheduled_start")
      formData.delete("scheduled_end")
    }

    try {
      if (quiz) {
        await updateQuiz(quiz.id, formData)
        router.push(`/admin/quizzes/${quiz.id}`)
      } else {
        const newQuiz = await createQuiz(formData)
        router.push(`/admin/quizzes/${newQuiz.id}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save quiz")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDateTimeLocal = (date: string | null | undefined) => {
    if (!date) return ""
    return new Date(date).toISOString().slice(0, 16)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Quiz Details</CardTitle>
          <CardDescription>Enter the basic information for your quiz</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Quiz Title</Label>
            <Input
              id="title"
              name="title"
              defaultValue={quiz?.title}
              required
              placeholder="e.g., Data Structures Quiz"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={quiz?.description || ""}
              placeholder="Brief description of the quiz"
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="duration_minutes">Duration (minutes)</Label>
              <Input
                id="duration_minutes"
                name="duration_minutes"
                type="number"
                min="1"
                defaultValue={quiz?.duration_minutes || 30}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="total_marks">Total Marks</Label>
              <Input
                id="total_marks"
                name="total_marks"
                type="number"
                min="1"
                defaultValue={quiz?.total_marks || 100}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passing_score">Passing Score</Label>
              <Input
                id="passing_score"
                name="passing_score"
                type="number"
                min="1"
                defaultValue={quiz?.passing_score || 40}
                required
              />
            </div>
          </div>

          <div className="space-y-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="is_scheduled">Schedule Quiz</Label>
                <p className="text-sm text-muted-foreground">Set specific start and end times for this quiz</p>
              </div>
              <Switch id="is_scheduled" checked={isScheduled} onCheckedChange={setIsScheduled} />
            </div>

            {isScheduled && (
              <div className="grid gap-4 pt-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="scheduled_start">Start Date & Time</Label>
                  <Input
                    id="scheduled_start"
                    name="scheduled_start"
                    type="datetime-local"
                    defaultValue={formatDateTimeLocal(quiz?.scheduled_start)}
                    required={isScheduled}
                  />
                  <p className="text-xs text-muted-foreground">Quiz will be available from this time</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="scheduled_end">End Date & Time</Label>
                  <Input
                    id="scheduled_end"
                    name="scheduled_end"
                    type="datetime-local"
                    defaultValue={formatDateTimeLocal(quiz?.scheduled_end)}
                    required={isScheduled}
                  />
                  <p className="text-xs text-muted-foreground">Quiz will close at this time</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="is_active">Active Status</Label>
              <p className="text-sm text-muted-foreground">Make this quiz available to students</p>
            </div>
            <Switch id="is_active" name="is_active" defaultChecked={quiz?.is_active ?? true} value="true" />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : quiz ? "Update Quiz" : "Create Quiz"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
