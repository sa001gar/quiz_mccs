"use client"

import type { Question } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, CheckCircle2, XCircle, Pencil } from "lucide-react"
import { deleteQuestion } from "@/lib/actions/admin"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface QuestionsListProps {
  questions: Question[]
  quizId: string
}

export function QuestionsList({ questions, quizId }: QuestionsListProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (questionId: string) => {
    setDeletingId(questionId)
    try {
      await deleteQuestion(questionId, quizId)
    } catch (error) {
      console.error("Failed to delete question:", error)
    } finally {
      setDeletingId(null)
    }
  }

  if (questions.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No questions added yet. Create your first question to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {questions.map((question, index) => (
        <Card key={question.id} className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Q{index + 1}</Badge>
                  <Badge variant="secondary">{question.question_type.replace("_", " ")}</Badge>
                  <span className="text-sm text-muted-foreground">{question.marks} marks</span>
                </div>
                <p className="font-medium">{question.question_text}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={() => router.push(`/admin/quizzes/${quizId}/questions/${question.id}/edit`)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Question?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this question and all its options.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(question.id)}
                        disabled={deletingId === question.id}
                      >
                        {deletingId === question.id ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {question.options && question.options.length > 0 && (
              <div className="space-y-2 pl-4">
                {question.options
                  .sort((a, b) => a.order_number - b.order_number)
                  .map((option) => (
                    <div key={option.id} className="flex items-center gap-2 text-sm">
                      {option.is_correct ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={option.is_correct ? "font-medium text-green-600" : "text-muted-foreground"}>
                        {option.option_text}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
