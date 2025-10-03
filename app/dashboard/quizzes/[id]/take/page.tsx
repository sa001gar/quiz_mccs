import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { QuizInterface } from "@/components/student/quiz-interface"

export default async function TakeQuizPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get quiz
  const { data: quiz } = await supabase.from("quizzes").select("*").eq("id", params.id).eq("is_active", true).single()

  if (!quiz) {
    notFound()
  }

  // Get student's attempt
  const { data: attempt } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("quiz_id", params.id)
    .eq("student_id", user?.id)
    .single()

  if (!attempt) {
    redirect(`/dashboard/quizzes/${params.id}`)
  }

  // If already submitted, redirect to results
  if (attempt.status === "submitted") {
    redirect("/dashboard/results")
  }

  // Get questions with options
  const { data: questions } = await supabase
    .from("questions")
    .select(
      `
      *,
      options(*)
    `,
    )
    .eq("quiz_id", params.id)
    .order("order_number", { ascending: true })

  // Get existing answers
  const { data: answers } = await supabase.from("answers").select("*").eq("attempt_id", attempt.id)

  const answerMap = new Map(answers?.map((a) => [a.question_id, a.selected_option_id]) || [])

  return (
    <QuizInterface
      quiz={quiz}
      questions={questions || []}
      attemptId={attempt.id}
      existingAnswers={answerMap}
      startedAt={attempt.started_at}
    />
  )
}
