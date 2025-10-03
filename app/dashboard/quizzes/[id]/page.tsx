import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { notFound, redirect } from "next/navigation"
import { Clock, FileText, Award, AlertCircle } from "lucide-react"
import { StartQuizButton } from "@/components/student/start-quiz-button"
import { QuizCountdown } from "@/components/student/quiz-countdown"

export default async function QuizStartPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: quiz } = await supabase.from("quizzes").select("*").eq("id", params.id).eq("is_active", true).single()

  if (!quiz) {
    notFound()
  }

  const now = new Date()
  const isScheduled = !!(quiz.scheduled_start || quiz.scheduled_end)
  const hasStarted = quiz.scheduled_start ? new Date(quiz.scheduled_start) <= now : true
  const hasEnded = quiz.scheduled_end ? new Date(quiz.scheduled_end) <= now : false
  const isAvailable = !isScheduled || (hasStarted && !hasEnded)

  // Check if student has an attempt
  const { data: attempt } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("quiz_id", params.id)
    .eq("student_id", user?.id)
    .single()

  // If already completed, redirect to results
  if (attempt?.status === "submitted") {
    redirect("/dashboard/results")
  }

  // If in progress, redirect to take quiz
  if (attempt?.status === "in_progress") {
    redirect(`/dashboard/quizzes/${params.id}/take`)
  }

  // Get question count
  const { count: questionCount } = await supabase
    .from("questions")
    .select("*", { count: "exact", head: true })
    .eq("quiz_id", params.id)

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">{quiz.title}</CardTitle>
              <CardDescription>{quiz.description}</CardDescription>
            </div>
            <Badge>Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isScheduled && quiz.scheduled_start && (
            <QuizCountdown scheduledStart={quiz.scheduled_start} scheduledEnd={quiz.scheduled_end} />
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Duration</p>
                <p className="text-2xl font-bold">{quiz.duration_minutes} mins</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Questions</p>
                <p className="text-2xl font-bold">{questionCount || 0}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <Award className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Total Marks</p>
                <p className="text-2xl font-bold">{quiz.total_marks}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <Award className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Passing Score</p>
                <p className="text-2xl font-bold">{quiz.passing_score}</p>
              </div>
            </div>
          </div>

          <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
            <CardContent className="flex gap-3 pt-6">
              <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <div className="space-y-2">
                <p className="font-medium text-orange-900 dark:text-orange-100">Important Instructions</p>
                <ul className="space-y-1 text-sm text-orange-800 dark:text-orange-200">
                  <li>• You can only attempt this quiz once</li>
                  <li>• The timer will start as soon as you begin</li>
                  <li>• You cannot pause or restart the quiz</li>
                  <li>• Ensure stable internet connection throughout</li>
                  <li>• Do not refresh or close the browser during the quiz</li>
                  <li>• Single session enforcement is active - opening in another tab will invalidate your attempt</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {isAvailable ? (
            <StartQuizButton quizId={params.id} />
          ) : hasEnded ? (
            <p className="text-center text-sm text-muted-foreground">This quiz is no longer available</p>
          ) : (
            <p className="text-center text-sm text-muted-foreground">Please wait for the quiz to start</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
