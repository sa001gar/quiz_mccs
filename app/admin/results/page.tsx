import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, TrendingUp, Users, Target } from "lucide-react"

export default async function ResultsPage() {
  const supabase = await createClient()

  // Get all submitted attempts with details
  const { data: attempts } = await supabase
    .from("quiz_attempts")
    .select(
      `
      *,
      quiz:quizzes(title, total_marks, passing_score),
      student:profiles(full_name, roll_number, email)
    `,
    )
    .eq("status", "submitted")
    .order("submitted_at", { ascending: false })

  // Calculate overall statistics
  const totalAttempts = attempts?.length || 0
  const passedAttempts = attempts?.filter((a) => a.passed).length || 0
  const passRate = totalAttempts > 0 ? ((passedAttempts / totalAttempts) * 100).toFixed(1) : 0

  const averageScore =
    totalAttempts > 0 ? (attempts?.reduce((sum, a) => sum + (a.score || 0), 0) || 0) / totalAttempts : 0

  // Get quiz-wise statistics
  const quizStats = new Map()
  attempts?.forEach((attempt: any) => {
    const quizId = attempt.quiz_id
    if (!quizStats.has(quizId)) {
      quizStats.set(quizId, {
        title: attempt.quiz?.title,
        attempts: [],
      })
    }
    quizStats.get(quizId).attempts.push(attempt)
  })

  const quizAnalytics = Array.from(quizStats.entries()).map(([quizId, data]: [string, any]) => {
    const attempts = data.attempts
    const passed = attempts.filter((a: any) => a.passed).length
    const avgScore = attempts.reduce((sum: number, a: any) => sum + (a.score || 0), 0) / attempts.length
    const avgTime = attempts.reduce((sum: number, a: any) => sum + (a.time_taken_seconds || 0), 0) / attempts.length

    return {
      quizId,
      title: data.title,
      totalAttempts: attempts.length,
      passed,
      passRate: ((passed / attempts.length) * 100).toFixed(1),
      avgScore: avgScore.toFixed(1),
      avgTime: Math.floor(avgTime / 60),
    }
  })

  // Get top performers
  const topPerformers = attempts
    ?.filter((a) => a.passed)
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 10)

  const stats = [
    {
      title: "Total Attempts",
      value: totalAttempts,
      icon: TrendingUp,
      description: "All quiz submissions",
    },
    {
      title: "Pass Rate",
      value: `${passRate}%`,
      icon: Target,
      description: `${passedAttempts} passed`,
    },
    {
      title: "Average Score",
      value: averageScore.toFixed(1),
      icon: Award,
      description: "Across all quizzes",
    },
    {
      title: "Unique Students",
      value: new Set(attempts?.map((a) => a.student_id)).size,
      icon: Users,
      description: "Active participants",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Results & Analytics</h1>
        <p className="text-muted-foreground">Comprehensive view of quiz performance and statistics</p>
      </div>

      {/* Overall Statistics */}
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

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Attempts</TabsTrigger>
          <TabsTrigger value="quiz-analytics">Quiz Analytics</TabsTrigger>
          <TabsTrigger value="top-performers">Top Performers</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Quiz Attempts</CardTitle>
              <CardDescription>Complete list of submitted quizzes</CardDescription>
            </CardHeader>
            <CardContent>
              {attempts && attempts.length > 0 ? (
                <div className="space-y-4">
                  {attempts.map((attempt: any) => (
                    <div key={attempt.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                      <div className="space-y-1">
                        <p className="font-medium">{attempt.student?.full_name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{attempt.student?.roll_number}</span>
                          <span>•</span>
                          <span>{attempt.quiz?.title}</span>
                        </div>
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
        </TabsContent>

        <TabsContent value="quiz-analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {quizAnalytics.map((quiz) => (
              <Card key={quiz.quizId}>
                <CardHeader>
                  <CardTitle className="text-lg">{quiz.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Attempts</span>
                      <span className="font-bold">{quiz.totalAttempts}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Pass Rate</span>
                      <span className="font-bold">{quiz.passRate}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Average Score</span>
                      <span className="font-bold">{quiz.avgScore}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Avg. Time</span>
                      <span className="font-bold">{quiz.avgTime} mins</span>
                    </div>
                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div className="h-full bg-primary transition-all" style={{ width: `${quiz.passRate}%` }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="top-performers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Performers</CardTitle>
              <CardDescription>Students with highest scores</CardDescription>
            </CardHeader>
            <CardContent>
              {topPerformers && topPerformers.length > 0 ? (
                <div className="space-y-4">
                  {topPerformers.map((attempt: any, index: number) => (
                    <div key={attempt.id} className="flex items-center gap-4 border-b pb-4 last:border-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">{attempt.student?.full_name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{attempt.student?.roll_number}</span>
                          <span>•</span>
                          <span>{attempt.quiz?.title}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">
                          {attempt.score}/{attempt.total_marks}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {((attempt.score / attempt.total_marks) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
