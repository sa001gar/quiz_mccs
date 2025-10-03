import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Edit, Plus, ArrowLeft } from "lucide-react"
import { QuestionsList } from "@/components/admin/questions-list"
import { notFound, redirect } from "next/navigation"

export default async function QuizDetailPage({ params }: { params: { id: string } }) {
  if (params.id === "new") {
    redirect("/admin/quizzes/new")
  }

  const supabase = await createClient()

  const { data: quiz } = await supabase.from("quizzes").select("*").eq("id", params.id).single()

  if (!quiz) {
    notFound()
  }

  const { data: questions } = await supabase
    .from("questions")
    .select(
      `
      *,
      options(*)
    `,
    )
    .eq("quiz_id", params.id)
    .order("order_number", { ascending: true })

  const { count: attemptsCount } = await supabase
    .from("quiz_attempts")
    .select("*", { count: "exact", head: true })
    .eq("quiz_id", params.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/quizzes">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{quiz.title}</h1>
            <Badge variant={quiz.is_active ? "default" : "secondary"}>{quiz.is_active ? "Active" : "Inactive"}</Badge>
          </div>
          <p className="text-muted-foreground">{quiz.description}</p>
        </div>
        <Link href={`/admin/quizzes/${quiz.id}/edit`}>
          <Button variant="outline" className="w-full gap-2 bg-transparent sm:w-auto">
            <Edit className="h-4 w-4" />
            Edit Quiz
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quiz.duration_minutes} mins</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Marks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quiz.total_marks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Passing Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quiz.passing_score}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attemptsCount || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Questions</CardTitle>
              <CardDescription>Manage questions for this quiz</CardDescription>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Link href={`/admin/quizzes/${quiz.id}/questions/bulk`} className="w-full sm:w-auto">
                <Button variant="outline" className="w-full gap-2 bg-transparent sm:w-auto">
                  <Plus className="h-4 w-4" />
                  Bulk Add Questions
                </Button>
              </Link>
              <Link href={`/admin/quizzes/${quiz.id}/questions/new`} className="w-full sm:w-auto">
                <Button className="w-full gap-2 sm:w-auto">
                  <Plus className="h-4 w-4" />
                  Add Question
                </Button>
              </Link>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <QuestionsList questions={questions || []} quizId={quiz.id} />
        </CardContent>
      </Card>
    </div>
  )
}
