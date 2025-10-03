import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { CertificateView } from "@/components/student/certificate-view"

export default async function CertificatePage({ params }: { params: { certificateNumber: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get certificate with related data
  const { data: certificate } = await supabase
    .from("certificates")
    .select(
      `
      *,
      student:profiles!certificates_student_id_fkey(full_name, roll_number, department),
      quiz:quizzes(title, total_marks),
      attempt:quiz_attempts(score, submitted_at)
    `,
    )
    .eq("certificate_number", params.certificateNumber)
    .eq("student_id", user?.id)
    .single()

  if (!certificate) {
    notFound()
  }

  return <CertificateView certificate={certificate} />
}
