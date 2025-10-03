import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Edit, Eye } from "lucide-react"
import { DeleteQuizButton } from "@/components/admin/delete-quiz-button"
import { FileText } from "lucide-react"

export default async function QuizzesPage() {
  const supabase = await createClient()

  const { data: quizzes } = await supabase.from("quizzes").select("*").order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Quizzes</h1>
          <p className="text-muted-foreground">Manage your quizzes and questions</p>
        </div>
        <Link href="/admin/quizzes/new" className="w-full sm:w-auto">
          <Button className="w-full gap-2 sm:w-auto">
            <Plus className="h-4 w-4" />
            Create Quiz
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {quizzes && quizzes.length > 0 ? (
          quizzes.map((quiz) => (
            <Card key={quiz.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
                  </div>
                  <Badge variant={quiz.is_active ? "default" : "secondary"}>
                    {quiz.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">{quiz.duration_minutes} mins</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Marks</span>
                    <span className="font-medium">{quiz.total_marks}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Passing Score</span>
                    <span className="font-medium">{quiz.passing_score}</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Link href={`/admin/quizzes/${quiz.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/admin/quizzes/${quiz.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
                        <Edit className="h-3 w-3" />
                        Edit
                      </Button>
                    </Link>
                    <DeleteQuizButton quizId={quiz.id} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">No quizzes yet</p>
              <p className="text-sm text-muted-foreground">Create your first quiz to get started</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
