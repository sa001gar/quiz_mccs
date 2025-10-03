import { createClient } from "@/lib/supabase/server"
import { QuestionForm } from "@/components/admin/question-form"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function NewQuestionPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: quiz } = await supabase.from("quizzes").select("*").eq("id", params.id).single()

  if (!quiz) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/quizzes/${params.id}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Quiz
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Question</h1>
        <p className="text-muted-foreground">Create a new question for {quiz.title}</p>
      </div>

      <QuestionForm quizId={params.id} />
    </div>
  )
}
