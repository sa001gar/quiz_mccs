"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { randomBytes } from "crypto"

export async function startQuiz(quizId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Check if quiz exists and is active
  const { data: quiz } = await supabase.from("quizzes").select("*").eq("id", quizId).eq("is_active", true).single()

  if (!quiz) throw new Error("Quiz not found or inactive")

  // Check if student already has an attempt
  const { data: existingAttempt } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("quiz_id", quizId)
    .eq("student_id", user.id)
    .single()

  if (existingAttempt) {
    // If attempt is in progress, return it
    if (existingAttempt.status === "in_progress") {
      return { attemptId: existingAttempt.id, alreadyStarted: true }
    }
    // If already submitted, don't allow retake
    throw new Error("You have already completed this quiz")
  }

  // Create new attempt with current timestamp
  const now = new Date().toISOString()
  const { data: attempt, error: attemptError } = await supabase
    .from("quiz_attempts")
    .insert({
      quiz_id: quizId,
      student_id: user.id,
      total_marks: quiz.total_marks,
      passing_score: quiz.passing_score,
      status: "in_progress",
      started_at: now,
    })
    .select()
    .single()

  if (attemptError) throw attemptError

  // Create session token
  const sessionToken = randomBytes(32).toString("hex")

  // Create active session
  const { error: sessionError } = await supabase.from("active_sessions").insert({
    student_id: user.id,
    quiz_id: quizId,
    attempt_id: attempt.id,
    session_token: sessionToken,
    is_active: true,
  })

  if (sessionError) throw sessionError

  revalidatePath("/dashboard/quizzes")
  return { attemptId: attempt.id, sessionToken, alreadyStarted: false }
}

export async function submitAnswer(attemptId: string, questionId: string, selectedOptionId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Verify attempt belongs to user and is in progress
  const { data: attempt } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("id", attemptId)
    .eq("student_id", user.id)
    .eq("status", "in_progress")
    .single()

  if (!attempt) throw new Error("Invalid attempt")

  // Get the correct answer
  const { data: option } = await supabase.from("options").select("*").eq("id", selectedOptionId).single()

  if (!option) throw new Error("Invalid option")

  // Get question marks
  const { data: question } = await supabase.from("questions").select("marks").eq("id", questionId).single()

  // Upsert answer
  const { error } = await supabase
    .from("answers")
    .upsert(
      {
        attempt_id: attemptId,
        question_id: questionId,
        selected_option_id: selectedOptionId,
        is_correct: option.is_correct,
      },
      {
        onConflict: "attempt_id,question_id",
      },
    )
    .select()
    .single()

  if (error) throw error

  // Update session last activity
  await supabase
    .from("active_sessions")
    .update({ last_activity: new Date().toISOString() })
    .eq("attempt_id", attemptId)
    .eq("student_id", user.id)

  return { success: true }
}

export async function submitQuiz(attemptId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Verify attempt belongs to user and is in progress
  const { data: attempt } = await supabase
    .from("quiz_attempts")
    .select("*, quiz:quizzes(*)")
    .eq("id", attemptId)
    .eq("student_id", user.id)
    .eq("status", "in_progress")
    .single()

  if (!attempt) throw new Error("Invalid attempt")

  // Calculate score
  const { data: answers } = await supabase
    .from("answers")
    .select("*, question:questions(marks)")
    .eq("attempt_id", attemptId)

  let score = 0
  if (answers) {
    for (const answer of answers) {
      if (answer.is_correct) {
        score += (answer.question as any).marks
      }
    }
  }

  // Enforce 60% pass criteria irrespective of stored passing_score
  const requiredToPass = Math.ceil((attempt.total_marks * 60) / 100)
  const passed = score >= requiredToPass
  const timeTaken = Math.floor((new Date().getTime() - new Date(attempt.started_at).getTime()) / 1000)

  // Update attempt
  const { error: updateError } = await supabase
    .from("quiz_attempts")
    .update({
      status: "submitted",
      submitted_at: new Date().toISOString(),
      score,
      passed,
      time_taken_seconds: timeTaken,
    })
    .eq("id", attemptId)

  if (updateError) throw updateError

  // Deactivate session
  await supabase.from("active_sessions").update({ is_active: false }).eq("attempt_id", attemptId)

  // Generate certificate if passed (60% or higher)
  if (passed) {
    const { data: existingCert } = await supabase.from("certificates").select("*").eq("attempt_id", attemptId).single()

    if (!existingCert) {
      // Generate unique unguessable certificate number
      const certId = randomBytes(16).toString('hex').toUpperCase()
      const year = new Date().getFullYear()
      const certNumber = `MCCS-QUIZ-${year}-${certId}`

      await supabase.from("certificates").insert({
        attempt_id: attemptId,
        student_id: user.id,
        quiz_id: (attempt.quiz as any).id,
        certificate_number: certNumber,
        score: score,
        total_marks: attempt.total_marks,
        percentage: Math.round((score / attempt.total_marks) * 100),
        generated_at: new Date().toISOString(),
      })
    }
  }

  revalidatePath("/dashboard/results")
  return { score, passed, totalMarks: attempt.total_marks }
}

export async function validateSession(attemptId: string, sessionToken: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: session } = await supabase
    .from("active_sessions")
    .select("*")
    .eq("attempt_id", attemptId)
    .eq("student_id", user.id)
    .eq("session_token", sessionToken)
    .eq("is_active", true)
    .single()

  if (!session) {
    return { valid: false, message: "Invalid or expired session" }
  }

  return { valid: true }
}
