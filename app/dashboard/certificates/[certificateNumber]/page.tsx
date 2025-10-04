"use client"

import { useEffect, useState, Suspense } from "react"
import { createClient } from "@/lib/supabase/client"
import { useParams, useRouter } from "next/navigation"
import { CertificatePDF } from "@/components/student/certificate-pdf"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Award, Calendar, User, BookOpen } from "lucide-react"
import Link from "next/link"

// Component that uses useParams
function CertificateContent() {
  const params = useParams<{ certificateNumber: string }>()
  const router = useRouter()
  const [certificate, setCertificate] = useState<any | null>(null)
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
          .select(`*, student:profiles!certificates_student_id_fkey(full_name, college), quiz:quizzes(title, total_marks), attempt:quiz_attempts(score, submitted_at)`) 
          .eq("certificate_number", params.certificateNumber)
          .eq("student_id", user?.id)
          .single()
        if (!isMounted) return
        if (!data) {
          router.replace("/dashboard/results")
          return
        }
        setCertificate(data)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [params.certificateNumber, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-100 to-indigo-200 flex items-center justify-center">
        <div className="text-slate-800 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-800 border-t-transparent mx-auto mb-4"></div>
          <p>Loading certificate...</p>
        </div>
      </div>
    )
  }

  if (!certificate) return null

  const certificateData = {
    certificateNumber: certificate.certificate_number,
    studentName: certificate.student?.full_name || 'Student',
    quizTitle: certificate.quiz?.title || 'Quiz',
    score: certificate.attempt?.score || certificate.score || 0,
    totalMarks: certificate.quiz?.total_marks || certificate.total_marks || 0,
    percentage: certificate.percentage || Math.round(((certificate.attempt?.score || certificate.score || 0) / (certificate.quiz?.total_marks || certificate.total_marks || 1)) * 100),
    completedDate: certificate.attempt?.submitted_at || certificate.generated_at,
    college: certificate.student?.college || 'Mankar College'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-100 to-indigo-200">
      <div className="container mx-auto p-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/certificates">
            <Button variant="outline" className="border-purple-300 text-slate-700 hover:bg-purple-100 mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Certificates
            </Button>
          </Link>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-lg">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-800">Your Certificate</h1>
            </div>
            <p className="text-slate-600">Congratulations on completing the quiz!</p>
          </div>
        </div>

        {/* Certificate Info Card */}
        <Card className="bg-white/90 backdrop-blur-md border-purple-200/50 shadow-xl mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Student</p>
                  <p className="font-semibold text-slate-800">{certificateData.studentName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Quiz</p>
                  <p className="font-semibold text-slate-800">{certificateData.quizTitle}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Completed</p>
                  <p className="font-semibold text-slate-800">
                    {new Date(certificateData.completedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certificate PDF Component */}
        <div className="flex justify-center">
          <CertificatePDF certificateData={certificateData} />
        </div>
      </div>
    </div>
  )
}

// Loading component for Suspense fallback
function CertificateLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-100 to-indigo-200 flex items-center justify-center">
      <div className="text-slate-800 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-800 border-t-transparent mx-auto mb-4"></div>
        <p>Loading certificate...</p>
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default function CertificatePage() {
  return (
    <Suspense fallback={<CertificateLoading />}>
      <CertificateContent />
    </Suspense>
  )
}
