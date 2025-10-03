"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useParams, useRouter } from "next/navigation"
import { CertificateView } from "@/components/student/certificate-view"

export default function CertificatePage() {
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
          .select(`*, student:profiles!certificates_student_id_fkey(full_name, roll_number, department), quiz:quizzes(title, total_marks), attempt:quiz_attempts(score, submitted_at)`) 
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

  if (loading || !certificate) return null
  return <CertificateView certificate={certificate} />
}
