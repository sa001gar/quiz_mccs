import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { EditQuestionForm } from "@/components/admin/edit-question-form"

export default async function EditQuestionPage({ params }: { params: { id: string; questionId: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") {
    redirect("/dashboard")
  }

  // Get question with options
  const { data: question, error } = await supabase
    .from("questions")
    .select(
      `
      *,
      options(*)
    `,
    )
    .eq("id", params.questionId)
    .eq("quiz_id", params.id)
    .single()

  if (error || !question) {
    notFound()
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <EditQuestionForm question={question} quizId={params.id} />
    </div>
  )
}
