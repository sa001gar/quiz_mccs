"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Plus, Trash2, Upload, Download } from "lucide-react"
import { bulkAddQuestions } from "@/lib/actions/admin"
import { useRouter } from "next/navigation"
import * as XLSX from "xlsx"
import { Loader2 } from "lucide-react"

interface QuestionData {
  id: string
  question_text: string
  question_type: "multiple_choice" | "true_false"
  marks: number
  options: Array<{ option_text: string; is_correct: boolean }>
  correctOptionIndex: number
}

interface BulkQuestionFormProps {
  quizId: string
}

export function BulkQuestionForm({ quizId }: BulkQuestionFormProps) {
  const router = useRouter()
  const [questions, setQuestions] = useState<QuestionData[]>([
    {
      id: crypto.randomUUID(),
      question_text: "",
      question_type: "multiple_choice",
      marks: 1,
      options: [
        { option_text: "", is_correct: false },
        { option_text: "", is_correct: false },
      ],
      correctOptionIndex: 0,
    },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: crypto.randomUUID(),
        question_text: "",
        question_type: "multiple_choice",
        marks: 1,
        options: [
          { option_text: "", is_correct: false },
          { option_text: "", is_correct: false },
        ],
        correctOptionIndex: 0,
      },
    ])
  }

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== id))
    }
  }

  const updateQuestion = (id: string, updates: Partial<QuestionData>) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  }

  const addOption = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId)
    if (question) {
      updateQuestion(questionId, {
        options: [...question.options, { option_text: "", is_correct: false }],
      })
    }
  }

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = questions.find((q) => q.id === questionId)
    if (question && question.options.length > 2) {
      const newOptions = question.options.filter((_, i) => i !== optionIndex)
      updateQuestion(questionId, {
        options: newOptions,
        correctOptionIndex:
          question.correctOptionIndex === optionIndex
            ? 0
            : question.correctOptionIndex > optionIndex
              ? question.correctOptionIndex - 1
              : question.correctOptionIndex,
      })
    }
  }

  const updateOptionText = (questionId: string, optionIndex: number, text: string) => {
    const question = questions.find((q) => q.id === questionId)
    if (question) {
      const newOptions = [...question.options]
      newOptions[optionIndex].option_text = text
      updateQuestion(questionId, { options: newOptions })
    }
  }

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[]

        const importedQuestions: QuestionData[] = jsonData.map((row) => {
          const options = []
          let correctIndex = 0

          // Parse options (assuming columns: Option1, Option2, Option3, Option4, CorrectOption)
          for (let i = 1; i <= 4; i++) {
            const optionText = row[`Option${i}`]
            if (optionText) {
              options.push({ option_text: optionText, is_correct: false })
              if (row.CorrectOption === i) {
                correctIndex = i - 1
              }
            }
          }

          return {
            id: crypto.randomUUID(),
            question_text: row.Question || "",
            question_type: row.Type === "true_false" ? "true_false" : "multiple_choice",
            marks: Number(row.Marks) || 1,
            options:
              options.length > 0
                ? options
                : [
                    { option_text: "", is_correct: false },
                    { option_text: "", is_correct: false },
                  ],
            correctOptionIndex: correctIndex,
          }
        })

        setQuestions(importedQuestions)
      } catch (err) {
        setError("Failed to import Excel file. Please check the format.")
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const handleExportTemplate = () => {
    const template = [
      {
        Question: "What is 2 + 2?",
        Type: "multiple_choice",
        Marks: 1,
        Option1: "3",
        Option2: "4",
        Option3: "5",
        Option4: "6",
        CorrectOption: 2,
      },
      {
        Question: "The sky is blue",
        Type: "true_false",
        Marks: 1,
        Option1: "True",
        Option2: "False",
        Option3: "",
        Option4: "",
        CorrectOption: 1,
      },
    ]

    const worksheet = XLSX.utils.json_to_sheet(template)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Questions")

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "quiz_questions_template.xlsx"
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const finalQuestions = questions.map((question) => {
        const finalOptions = question.options.map((opt, index) => ({
          option_text: opt.option_text,
          is_correct: index === question.correctOptionIndex,
        }))

        return {
          question_text: question.question_text,
          question_type: question.question_type,
          marks: question.marks,
          options: finalOptions,
        }
      })

      await bulkAddQuestions(quizId, finalQuestions)

      router.push(`/admin/quizzes/${quizId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create questions")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Bulk Add Questions</CardTitle>
              <CardDescription>Add multiple questions at once or import from Excel</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleExportTemplate}
                className="gap-2 bg-transparent"
              >
                <Download className="h-4 w-4" />
                Download Template
              </Button>
              <Label htmlFor="excel-import" className="cursor-pointer">
                <Button type="button" variant="outline" size="sm" className="gap-2 bg-transparent" asChild>
                  <span>
                    <Upload className="h-4 w-4" />
                    Import Excel
                  </span>
                </Button>
                <Input
                  id="excel-import"
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={handleImportExcel}
                />
              </Label>
            </div>
          </div>
        </CardHeader>
      </Card>

      {questions.map((question, qIndex) => (
        <Card key={question.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Question {qIndex + 1}</CardTitle>
              {questions.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQuestion(question.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Question Text</Label>
              <Textarea
                value={question.question_text}
                onChange={(e) => updateQuestion(question.id, { question_text: e.target.value })}
                placeholder="Enter your question here..."
                required
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Question Type</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={question.question_type}
                  onChange={(e) =>
                    updateQuestion(question.id, {
                      question_type: e.target.value as "multiple_choice" | "true_false",
                    })
                  }
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="true_false">True/False</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Marks</Label>
                <Input
                  type="number"
                  min="1"
                  value={question.marks}
                  onChange={(e) => updateQuestion(question.id, { marks: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Answer Options</Label>
                {question.question_type === "multiple_choice" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addOption(question.id)}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Option
                  </Button>
                )}
              </div>

              <RadioGroup
                value={question.correctOptionIndex.toString()}
                onValueChange={(val) => updateQuestion(question.id, { correctOptionIndex: Number(val) })}
              >
                <div className="space-y-3">
                  {question.question_type === "true_false" ? (
                    <>
                      <div className="flex items-center gap-3 rounded-lg border p-4">
                        <RadioGroupItem value="0" id={`${question.id}-true`} />
                        <Label htmlFor={`${question.id}-true`} className="flex-1 cursor-pointer font-normal">
                          True
                        </Label>
                      </div>
                      <div className="flex items-center gap-3 rounded-lg border p-4">
                        <RadioGroupItem value="1" id={`${question.id}-false`} />
                        <Label htmlFor={`${question.id}-false`} className="flex-1 cursor-pointer font-normal">
                          False
                        </Label>
                      </div>
                    </>
                  ) : (
                    question.options.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-3 rounded-lg border p-4">
                        <RadioGroupItem value={optIndex.toString()} id={`${question.id}-option-${optIndex}`} />
                        <Input
                          placeholder={`Option ${optIndex + 1}`}
                          value={option.option_text}
                          onChange={(e) => updateOptionText(question.id, optIndex, e.target.value)}
                          required
                          className="flex-1"
                        />
                        {question.options.length > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeOption(question.id, optIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={addQuestion} className="gap-2 bg-transparent">
          <Plus className="h-4 w-4" />
          Add Another Question
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            `Create ${questions.length} Question${questions.length > 1 ? "s" : ""}`
          )}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </form>
  )
}
