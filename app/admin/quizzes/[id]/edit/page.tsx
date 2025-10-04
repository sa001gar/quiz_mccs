import { createClient } from "@/lib/supabase/server"
import { QuizForm } from "@/components/admin/quiz-form"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function EditQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: quiz } = await supabase.from("quizzes").select("*").eq("id", resolvedParams.id).single()

  if (!quiz) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/quizzes/${resolvedParams.id}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Quiz</h1>
        <p className="text-muted-foreground">Update quiz details</p>
      </div>

      <QuizForm quiz={quiz} />
    </div>
  )
}
