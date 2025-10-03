"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Award, FileText, Download } from "lucide-react"

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Certificates</h1>
        <p className="text-muted-foreground">Download certificates for your passed quizzes</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="h-5 w-1/2 animate-pulse rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
              </CardContent>
            </Card>
          ))
        ) : certificates && certificates.length > 0 ? (
          certificates.map((cert) => (
            <Card key={cert.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      {cert.quiz?.title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Issued on {new Date(cert.issued_at).toLocaleString()} • Certificate No: {cert.certificate_number}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Score: {cert.attempt?.score} • Attempted: {cert.attempt?.submitted_at ? new Date(cert.attempt.submitted_at).toLocaleString() : "N/A"}
                </div>
                <Link href={`/dashboard/certificates/${cert.certificate_number}`}>
                  <Button size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    View
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">No certificates yet</p>
              <p className="text-sm text-muted-foreground">Pass a quiz to generate your first certificate</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}


