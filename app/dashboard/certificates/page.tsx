"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Award, FileText, Download, Calendar, ChevronRight } from "lucide-react"

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const supabase = createClient()
    async function load() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        const { data } = await supabase
          .from("certificates")
          .select(`*, quiz:quizzes(title), attempt:quiz_attempts(score, submitted_at)`)
          .eq("student_id", user?.id)
          .order("issued_at", { ascending: false })
        if (!isMounted) return
        setCertificates(data || [])
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
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">My Certificates</h1>
            <p className="text-muted-foreground text-lg">Download certificates for your passed quizzes</p>
          </div>

          <div className="space-y-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="border-border/50 shadow-md">
                  <CardHeader>
                    <div className="h-6 w-1/3 animate-pulse rounded bg-secondary" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-12 w-full animate-pulse rounded bg-secondary/50" />
                  </CardContent>
                </Card>
              ))
            ) : certificates && certificates.length > 0 ? (
              certificates.map((cert) => (
                <Card key={cert.id} className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-yellow-400 to-yellow-600" />
                  <CardHeader className="bg-secondary/20 border-b border-border/50 pb-4 pl-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1">
                        <CardTitle className="font-heading text-xl font-bold text-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
                          <Award className="h-5 w-5 text-yellow-500" />
                          {cert.quiz?.title}
                        </CardTitle>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            Issued on {new Date(cert.issued_at).toLocaleDateString()}
                          </span>
                          <span className="hidden sm:inline">•</span>
                          <span className="font-mono text-xs bg-secondary px-2 py-0.5 rounded">
                            {cert.certificate_number}
                          </span>
                        </div>
                      </div>
                      <Link href={`/dashboard/certificates/${cert.certificate_number}`}>
                        <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 pl-6">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/30 border border-border/50">
                        <span className="font-medium text-foreground">Score:</span>
                        <span className="font-bold text-primary">{cert.attempt?.score}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/30 border border-border/50">
                        <span className="font-medium text-foreground">Attempted:</span>
                        <span>{cert.attempt?.submitted_at ? new Date(cert.attempt.submitted_at).toLocaleDateString() : "N/A"}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-border/50 shadow-lg">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <div className="p-4 bg-secondary/30 rounded-full mb-4">
                    <Award className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-foreground mb-2">No certificates yet</h3>
                  <p className="text-muted-foreground text-center mb-6">Pass a quiz to generate your first certificate</p>
                  <Link href="/dashboard/quizzes">
                    <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/5">
                      <ChevronRight className="mr-2 h-4 w-4" />
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
