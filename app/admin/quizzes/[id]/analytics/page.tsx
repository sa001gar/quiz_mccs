import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, TrendingUp, Users, Clock, Award } from "lucide-react"

export default async function QuizAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const supabase = await createClient()

  const { data: quiz } = await supabase.from("quizzes").select("*").eq("id", resolvedParams.id).single()

  if (!quiz) {
    notFound()
  }

  // Get all attempts for this quiz
  const { data: attempts } = await supabase
    .from("quiz_attempts")
    .select(
      `
      *,
      student:profiles(full_name, roll_number)
    `,
    )
    .eq("quiz_id", resolvedParams.id)
    .eq("status", "submitted")

  // Calculate statistics
  const totalAttempts = attempts?.length || 0
  const passedAttempts = attempts?.filter((a) => a.passed).length || 0
  const passRate = totalAttempts > 0 ? ((passedAttempts / totalAttempts) * 100).toFixed(1) : 0

  const avgScore = totalAttempts > 0 ? (attempts?.reduce((sum, a) => sum + (a.score || 0), 0) || 0) / totalAttempts : 0

  const avgTime =
    totalAttempts > 0 ? (attempts?.reduce((sum, a) => sum + (a.time_taken_seconds || 0), 0) || 0) / totalAttempts : 0

  // Get question-level analytics
  const { data: questions } = await supabase
    .from("questions")
    .select("id, question_text, marks")
    .eq("quiz_id", resolvedParams.id)
    .order("order_number")

  const questionAnalytics = await Promise.all(
    (questions || []).map(async (question) => {
      const { data: answers } = await supabase
        .from("answers")
        .select("is_correct")
        .eq("question_id", question.id)
        .not("is_correct", "is", null)

      const totalAnswers = answers?.length || 0
      const correctAnswers = answers?.filter((a) => a.is_correct).length || 0
      const correctRate = totalAnswers > 0 ? ((correctAnswers / totalAnswers) * 100).toFixed(1) : 0

      return {
        ...question,
        totalAnswers,
        correctAnswers,
        correctRate,
      }
    }),
  )

  const stats = [
    {
      title: "Total Attempts",
      value: totalAttempts,
      icon: Users,
      description: "Students attempted",
    },
    {
      title: "Pass Rate",
      value: `${passRate}%`,
      icon: Award,
      description: `${passedAttempts} passed`,
    },
    {
      title: "Average Score",
      value: avgScore.toFixed(1),
      icon: TrendingUp,
      description: `Out of ${quiz.total_marks}`,
    },
    {
      title: "Average Time",
      value: `${Math.floor(avgTime / 60)}m`,
      icon: Clock,
      description: `${Math.floor(avgTime % 60)}s`,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/quizzes/${resolvedParams.id}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{quiz.title}</h1>
          <p className="text-muted-foreground">Quiz Analytics & Performance</p>
        </div>
        <Badge variant={quiz.is_active ? "default" : "secondary"}>{quiz.is_active ? "Active" : "Inactive"}</Badge>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Question Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Question-Level Analytics</CardTitle>
          <CardDescription>Performance breakdown by question</CardDescription>
        </CardHeader>
        <CardContent>
          {questionAnalytics.length > 0 ? (
            <div className="space-y-4">
              {questionAnalytics.map((question, index) => (
                <div key={question.id} className="space-y-2 border-b pb-4 last:border-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Q{index + 1}</Badge>
                        <span className="text-sm text-muted-foreground">{question.marks} marks</span>
                      </div>
                      <p className="mt-1 text-sm">{question.question_text}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{question.correctRate}%</p>
                      <p className="text-xs text-muted-foreground">
                        {question.correctAnswers}/{question.totalAnswers} correct
                      </p>
                    </div>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary transition-all" style={{ width: `${question.correctRate}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No data available</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Attempts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attempts</CardTitle>
        </CardHeader>
        <CardContent>
          {attempts && attempts.length > 0 ? (
            <div className="space-y-4">
              {attempts.slice(0, 10).map((attempt: any) => (
                <div key={attempt.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="space-y-1">
                    <p className="font-medium">{attempt.student?.full_name}</p>
                    <p className="text-sm text-muted-foreground">{attempt.student?.roll_number}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold">
                        {attempt.score}/{attempt.total_marks}
                      </span>
                      <Badge variant={attempt.passed ? "default" : "destructive"}>
                        {attempt.passed ? "Passed" : "Failed"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(attempt.submitted_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No attempts yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
