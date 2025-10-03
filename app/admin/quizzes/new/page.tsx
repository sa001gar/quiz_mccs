import { QuizForm } from "@/components/admin/quiz-form"

export default function NewQuizPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Quiz</h1>
        <p className="text-muted-foreground">Fill in the details to create a new quiz</p>
      </div>

      <QuizForm />
    </div>
  )
}
