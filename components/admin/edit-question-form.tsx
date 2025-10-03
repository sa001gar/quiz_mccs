"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { updateQuestion } from "@/lib/actions/admin"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"
import type { Question } from "@/lib/types"

interface EditQuestionFormProps {
  question: Question
  quizId: string
}

interface Option {
  id?: string
  option_text: string
  is_correct: boolean
}

export function EditQuestionForm({ question, quizId }: EditQuestionFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [questionType, setQuestionType] = useState<"multiple_choice" | "true_false">(question.question_type)
  const [options, setOptions] = useState<Option[]>(
    question.options?.map((opt) => ({
      id: opt.id,
      option_text: opt.option_text,
      is_correct: opt.is_correct,
    })) || [
      { option_text: "", is_correct: false },
      { option_text: "", is_correct: false },
    ],
  )
  const [correctOptionIndex, setCorrectOptionIndex] = useState<number>(options.findIndex((opt) => opt.is_correct) || 0)
  const [questionText, setQuestionText] = useState(question.question_text)
  const [marks, setMarks] = useState(question.marks)

  const addOption = () => {
    setOptions([...options, { option_text: "", is_correct: false }])
  }

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
      if (correctOptionIndex === index) {
        setCorrectOptionIndex(0)
      } else if (correctOptionIndex > index) {
        setCorrectOptionIndex(correctOptionIndex - 1)
      }
    }
  }

  const updateOptionText = (index: number, text: string) => {
    const newOptions = [...options]
    newOptions[index].option_text = text
    setOptions(newOptions)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const finalOptions = options.map((opt, index) => ({
      option_text: opt.option_text,
      is_correct: index === correctOptionIndex,
    }))

    const questionData = {
      question_text: questionText,
      question_type: questionType,
      marks: marks,
      options: finalOptions,
    }

    try {
      await updateQuestion(question.id, quizId, questionData)
      router.push(`/admin/quizzes/${quizId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update question")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Edit Question</CardTitle>
          <CardDescription>Update the question and answer options</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question_text">Question Text</Label>
            <Textarea
              id="question_text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter your question here..."
              required
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="question_type">Question Type</Label>
              <select
                id="question_type"
                name="question_type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value as "multiple_choice" | "true_false")}
              >
                <option value="multiple_choice">Multiple Choice</option>
                <option value="true_false">True/False</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="marks">Marks</Label>
              <Input
                id="marks"
                name="marks"
                type="number"
                min="1"
                value={marks}
                onChange={(e) => setMarks(Number.parseInt(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Answer Options</Label>
              {questionType === "multiple_choice" && (
                <Button type="button" variant="outline" size="sm" onClick={addOption} className="gap-2 bg-transparent">
                  <Plus className="h-4 w-4" />
                  Add Option
                </Button>
              )}
            </div>

            <RadioGroup
              value={correctOptionIndex.toString()}
              onValueChange={(val) => setCorrectOptionIndex(Number.parseInt(val))}
            >
              <div className="space-y-3">
                {questionType === "true_false" ? (
                  <>
                    <div className="flex items-center gap-3 rounded-lg border p-4">
                      <RadioGroupItem value="0" id="true" />
                      <Label htmlFor="true" className="flex-1 cursor-pointer font-normal">
                        True
                      </Label>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border p-4">
                      <RadioGroupItem value="1" id="false" />
                      <Label htmlFor="false" className="flex-1 cursor-pointer font-normal">
                        False
                      </Label>
                    </div>
                  </>
                ) : (
                  options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3 rounded-lg border p-4">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option.option_text}
                        onChange={(e) => updateOptionText(index, e.target.value)}
                        required
                        className="flex-1"
                      />
                      {options.length > 2 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeOption(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </RadioGroup>
            <p className="text-sm text-muted-foreground">Select the correct answer by clicking the radio button</p>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Question"}
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
