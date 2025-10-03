import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Award, TrendingUp, Clock } from "lucide-react"

export default async function StudentDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user?.id).single()

  // Fetch student statistics
  const { count: attemptsCount } = await supabase
    .from("quiz_attempts")
    .select("*", { count: "exact", head: true })
    .eq("student_id", user?.id)

  const { count: passedCount } = await supabase
    .from("quiz_attempts")
    .select("*", { count: "exact", head: true })
    .eq("student_id", user?.id)
    .eq("passed", true)

  const { count: certificatesCount } = await supabase
    .from("certificates")
    .select("*", { count: "exact", head: true })
    .eq("student_id", user?.id)

  const { count: availableQuizzes } = await supabase
    .from("quizzes")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true)

  // Fetch recent attempts
  const { data: recentAttempts } = await supabase
    .from("quiz_attempts")
    .select(
      `
      *,
      quiz:quizzes(title)
    `,
    )
    .eq("student_id", user?.id)
    .order("started_at", { ascending: false })
    .limit(5)

  const stats = [
    {
      title: "Available Quizzes",
      value: availableQuizzes || 0,
      icon: FileText,
      description: "Active quizzes",
    },
    {
      title: "Attempts",
      value: attemptsCount || 0,
      icon: TrendingUp,
      description: "Total attempts",
    },
    {
      title: "Passed",
      value: passedCount || 0,
      icon: Award,
      description: "Successful completions",
    },
    {
      title: "Certificates",
      value: certificatesCount || 0,
      icon: Award,
      description: "Earned certificates",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {profile?.full_name}!</h1>
        <p className="text-muted-foreground">
          Roll Number: {profile?.roll_number} • {profile?.department}
        </p>
      </div>

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

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentAttempts && recentAttempts.length > 0 ? (
            <div className="space-y-4">
              {recentAttempts.map((attempt: any) => (
                <div key={attempt.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium">{attempt.quiz?.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {attempt.status === "submitted"
                        ? `Score: ${attempt.score}/${attempt.total_marks}`
                        : attempt.status.replace("_", " ").toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {attempt.passed === true ? "Passed" : attempt.passed === false ? "Failed" : "In Progress"}
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(attempt.started_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Clock className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">No activity yet</p>
              <p className="text-sm text-muted-foreground">Start taking quizzes to see your progress here</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
