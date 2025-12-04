"use client"

import { useEffect, useMemo, useState, Suspense } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Award, FileText, Download, CheckCircle, XCircle, Clock, Target, Calendar } from "lucide-react"
import { useSearchParams } from "next/navigation"

// Component that uses useSearchParams
function ResultsContent() {
  const searchParams = useSearchParams()
  const [attempts, setAttempts] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)

  const showSuccess = useMemo(() => {
    const score = searchParams.get("score")
    const total = searchParams.get("total")
    const passed = searchParams.get("passed")
    return !!(score && total && passed)
  }, [searchParams])

  useEffect(() => {
    let isMounted = true
    const supabase = createClient()
    async function load() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        const { data } = await supabase
          .from("quiz_attempts")
          .select(`*, quiz:quizzes(title, total_marks, passing_score), certificate:certificates(certificate_number, issued_at)`)
          .eq("student_id", user?.id)
          .order("submitted_at", { ascending: false })
        if (!isMounted) return
        setAttempts(data || [])
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative z-10 pb-20 sm:pb-8">
        <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-8">
          <div>
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">My Results</h1>
            <p className="text-muted-foreground text-lg">View your quiz attempts and certificates</p>
          </div>

          {showSuccess && (
            <Card className="border-green-500/20 bg-green-500/5 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-green-500/10 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-green-700 mb-1">
                      {searchParams.get("passed") === "true" ? "Congratulations!" : "Quiz Completed"}
                    </h3>
                    <p className="text-green-800/80">
                      You scored <span className="font-bold">{searchParams.get("score")}</span> out of <span className="font-bold">{searchParams.get("total")}</span> marks.
                      {searchParams.get("passed") === "true" && " A certificate has been generated for you!"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="border-border/50 shadow-md">
                  <CardHeader>
                    <div className="h-6 w-1/3 animate-pulse rounded bg-secondary" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-24 w-full animate-pulse rounded bg-secondary/50" />
                  </CardContent>
                </Card>
              ))
            ) : attempts && attempts.length > 0 ? (
              attempts.map((attempt: any) => {
                const isPassed = attempt.passed
                const hasCertificate = attempt.certificate && attempt.certificate.length > 0
                const passingScore = Math.ceil((attempt.total_marks * 60) / 100)

                return (
                  <Card key={attempt.id} className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <CardHeader className="bg-secondary/20 border-b border-border/50 pb-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <CardTitle className="font-heading text-xl font-bold text-foreground">{attempt.quiz?.title}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            {attempt.submitted_at
                              ? `Completed on ${new Date(attempt.submitted_at).toLocaleString()}`
                              : "In Progress"}
                          </div>
                        </div>
                        <Badge
                          className={
                            isPassed
                              ? "bg-green-500/10 text-green-600 border-green-500/20 px-3 py-1 text-sm"
                              : "bg-destructive/10 text-destructive border-destructive/20 px-3 py-1 text-sm"
                          }
                        >
                          {isPassed ? (
                            <span className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5" /> Passed</span>
                          ) : (
                            <span className="flex items-center gap-1"><XCircle className="h-3.5 w-3.5" /> Failed</span>
                          )}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-3">
                          <div className="p-4 rounded-xl bg-secondary/20 border border-border/50 flex flex-col items-center text-center">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Score</p>
                            <p className="text-3xl font-heading font-bold text-primary">
                              {attempt.score}<span className="text-lg text-muted-foreground font-normal">/{attempt.total_marks}</span>
                            </p>
                          </div>
                          <div className="p-4 rounded-xl bg-secondary/20 border border-border/50 flex flex-col items-center text-center">
                            <div className="flex items-center gap-1 mb-1">
                              <Target className="h-3 w-3 text-muted-foreground" />
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Passing Score</p>
                            </div>
                            <p className="text-2xl font-heading font-bold text-foreground">{passingScore}</p>
                          </div>
                          <div className="p-4 rounded-xl bg-secondary/20 border border-border/50 flex flex-col items-center text-center">
                            <div className="flex items-center gap-1 mb-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Time Taken</p>
                            </div>
                            <p className="text-2xl font-heading font-bold text-foreground">
                              {attempt.time_taken_seconds
                                ? `${Math.floor(attempt.time_taken_seconds / 60)}:${(attempt.time_taken_seconds % 60).toString().padStart(2, "0")}`
                                : "N/A"}
                            </p>
                          </div>
                        </div>

                        {hasCertificate && (
                          <div className="flex flex-col sm:flex-row items-center gap-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
                            <div className="p-2 bg-yellow-500/10 rounded-full">
                              <Award className="h-6 w-6 text-yellow-600" />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                              <p className="font-heading font-bold text-foreground">Certificate Earned</p>
                              <p className="text-sm text-muted-foreground">
                                Certificate No: <span className="font-mono text-xs">{attempt.certificate[0].certificate_number}</span>
                              </p>
                            </div>
                            <Link href={`/dashboard/certificates/${attempt.certificate[0].certificate_number}`}>
                              <Button className="bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg shadow-yellow-600/20">
                                <Download className="mr-2 h-4 w-4" />
                                Download
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
              <Card className="border-border/50 shadow-lg">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="p-4 bg-secondary/30 rounded-full mb-4">
                    <FileText className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">No quiz attempts yet</h3>
                  <p className="text-muted-foreground text-center mb-6">Start taking quizzes to see your results here</p>
                  <Link href="/dashboard/quizzes">
                    <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/5">
                      Browse Quizzes
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading component for Suspense fallback
function ResultsLoading() {
  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">My Results</h1>
          <p className="text-muted-foreground text-lg">View your quiz attempts and certificates</p>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-border/50 shadow-md">
              <CardHeader>
                <div className="h-6 w-1/3 animate-pulse rounded bg-secondary" />
              </CardHeader>
              <CardContent>
                <div className="h-24 w-full animate-pulse rounded bg-secondary/50" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default function ResultsPage() {
  return (
    <Suspense fallback={<ResultsLoading />}>
      <ResultsContent />
    </Suspense>
  )
}
