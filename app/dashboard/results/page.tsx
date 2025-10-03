import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Award, FileText, Download } from "lucide-react"

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ score?: string; total?: string; passed?: string }>
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Await searchParams
  const params = await searchParams

  // Get all attempts
  const { data: attempts } = await supabase
    .from("quiz_attempts")
    .select(
      `
      *,
      quiz:quizzes(title, total_marks, passing_score),
      certificate:certificates(certificate_number, issued_at)
    `,
    )
    .eq("student_id", user?.id)
    .order("submitted_at", { ascending: false })

  // Show success message if just completed
  const showSuccess = params.score && params.total && params.passed

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Results</h1>
        <p className="text-muted-foreground">View your quiz attempts and certificates</p>
      </div>

      {showSuccess && (
        <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
          <CardContent>
            <div>
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                {params.passed === "true" ? "Congratulations!" : "Quiz Completed"}
              </h3>
              <p className="text-sm text-green-800 dark:text-green-200">
                You scored {params.score} out of {params.total} marks.{" "}
                {params.passed === "true" && "A certificate has been generated for you!"}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {attempts && attempts.length > 0 ? (
          attempts.map((attempt: any) => {
            const isPassed = attempt.passed
            const hasCertificate = attempt.certificate && attempt.certificate.length > 0

            return (
              <Card key={attempt.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{attempt.quiz?.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {attempt.submitted_at
                          ? `Completed on ${new Date(attempt.submitted_at).toLocaleString()}`
                          : "In Progress"}
                      </p>
                    </div>
                    <Badge variant={isPassed ? "default" : "destructive"}>{isPassed ? "Passed" : "Failed"}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Score</p>
                        <p className="text-2xl font-bold">
                          {attempt.score}/{attempt.total_marks}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Passing Score</p>
                        <p className="text-2xl font-bold">{attempt.passing_score}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Time Taken</p>
                        <p className="text-2xl font-bold">
                          {attempt.time_taken_seconds
                            ? `${Math.floor(attempt.time_taken_seconds / 60)}:${(attempt.time_taken_seconds % 60).toString().padStart(2, "0")}`
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    {hasCertificate && (
                      <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-4">
                        <Award className="h-5 w-5 text-primary" />
                        <div className="flex-1">
                          <p className="font-medium">Certificate Available</p>
                          <p className="text-sm text-muted-foreground">
                            Certificate No: {attempt.certificate[0].certificate_number}
                          </p>
                        </div>
                        <Link href={`/dashboard/certificates/${attempt.certificate[0].certificate_number}`}>
                          <Button size="sm" className="gap-2">
                            <Download className="h-4 w-4" />
                            View
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">No quiz attempts yet</p>
              <p className="text-sm text-muted-foreground">Start taking quizzes to see your results here</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
