import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, Award, TrendingUp } from "lucide-react"

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch statistics
  const { count: quizzesCount } = await supabase.from("quizzes").select("*", { count: "exact", head: true })

  const { count: studentsCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "student")

  const { count: attemptsCount } = await supabase.from("quiz_attempts").select("*", { count: "exact", head: true })

  const { count: certificatesCount } = await supabase.from("certificates").select("*", { count: "exact", head: true })

  // Fetch recent attempts
  const { data: recentAttempts } = await supabase
    .from("quiz_attempts")
    .select(
      `
      *,
      quiz:quizzes(title),
      student:profiles(full_name, roll_number)
    `,
    )
    .order("started_at", { ascending: false })
    .limit(5)

  const stats = [
    {
      title: "Total Quizzes",
      value: quizzesCount || 0,
      icon: FileText,
      description: "Active and inactive quizzes",
    },
    {
      title: "Total Students",
      value: studentsCount || 0,
      icon: Users,
      description: "Registered students",
    },
    {
      title: "Quiz Attempts",
      value: attemptsCount || 0,
      icon: TrendingUp,
      description: "All time attempts",
    },
    {
      title: "Certificates Issued",
      value: certificatesCount || 0,
      icon: Award,
      description: "Successful completions",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the admin portal</p>
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
          <CardTitle>Recent Quiz Attempts</CardTitle>
        </CardHeader>
        <CardContent>
          {recentAttempts && recentAttempts.length > 0 ? (
            <div className="space-y-4">
              {recentAttempts.map((attempt: any) => (
                <div key={attempt.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium">{attempt.student?.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {attempt.student?.roll_number} • {attempt.quiz?.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {attempt.status === "submitted"
                        ? `${attempt.score}/${attempt.total_marks}`
                        : attempt.status.replace("_", " ").toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(attempt.started_at).toLocaleDateString()}</p>
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
