"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createQuiz(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const quiz: any = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    duration_minutes: Number.parseInt(formData.get("duration_minutes") as string),
    passing_score: Number.parseInt(formData.get("passing_score") as string),
    total_marks: Number.parseInt(formData.get("total_marks") as string),
    is_active: formData.get("is_active") === "true",
    created_by: user.id,
  }

  const scheduledStart = formData.get("scheduled_start") as string
  const scheduledEnd = formData.get("scheduled_end") as string

  if (scheduledStart) {
    quiz.scheduled_start = new Date(scheduledStart).toISOString()
  }
  if (scheduledEnd) {
    quiz.scheduled_end = new Date(scheduledEnd).toISOString()
  }

  const { data, error } = await supabase.from("quizzes").insert(quiz).select().single()

  if (error) throw error

  revalidatePath("/admin/quizzes")
  return data
}

export async function updateQuiz(quizId: string, formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const quiz: any = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    duration_minutes: Number.parseInt(formData.get("duration_minutes") as string),
    passing_score: Number.parseInt(formData.get("passing_score") as string),
    total_marks: Number.parseInt(formData.get("total_marks") as string),
    is_active: formData.get("is_active") === "true",
    updated_at: new Date().toISOString(),
  }

  const scheduledStart = formData.get("scheduled_start") as string
  const scheduledEnd = formData.get("scheduled_end") as string

  if (scheduledStart) {
    quiz.scheduled_start = new Date(scheduledStart).toISOString()
  } else {
    quiz.scheduled_start = null
  }

  if (scheduledEnd) {
    quiz.scheduled_end = new Date(scheduledEnd).toISOString()
  } else {
    quiz.scheduled_end = null
  }

  const { error } = await supabase.from("quizzes").update(quiz).eq("id", quizId)

  if (error) throw error

  revalidatePath("/admin/quizzes")
  revalidatePath(`/admin/quizzes/${quizId}`)
}

export async function deleteQuiz(quizId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const { error } = await supabase.from("quizzes").delete().eq("id", quizId)

  if (error) throw error

  revalidatePath("/admin/quizzes")
}

export async function createQuestion(quizId: string, questionData: any) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") throw new Error("Unauthorized")

  // Get the next order number
  const { data: questions } = await supabase
    .from("questions")
    .select("order_number")
    .eq("quiz_id", quizId)
    .order("order_number", { ascending: false })
    .limit(1)

  const nextOrder = questions && questions.length > 0 ? questions[0].order_number + 1 : 1

  const question = {
    quiz_id: quizId,
    question_text: questionData.question_text,
    question_type: questionData.question_type,
    marks: questionData.marks,
    order_number: nextOrder,
  }

  const { data: newQuestion, error: questionError } = await supabase
    .from("questions")
    .insert(question)
    .select()
    .single()

  if (questionError) throw questionError

  // Insert options
  if (questionData.options && questionData.options.length > 0) {
    const options = questionData.options.map((opt: any, index: number) => ({
      question_id: newQuestion.id,
      option_text: opt.option_text,
      is_correct: opt.is_correct,
      order_number: index + 1,
    }))

    const { error: optionsError } = await supabase.from("options").insert(options)

    if (optionsError) throw optionsError
  }

  revalidatePath(`/admin/quizzes/${quizId}`)
  return newQuestion
}

export async function updateQuestion(questionId: string, quizId: string, questionData: any) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const question = {
    question_text: questionData.question_text,
    question_type: questionData.question_type,
    marks: questionData.marks,
    updated_at: new Date().toISOString(),
  }

  const { error: questionError } = await supabase.from("questions").update(question).eq("id", questionId)

  if (questionError) throw questionError

  // Delete existing options
  await supabase.from("options").delete().eq("question_id", questionId)

  // Insert new options
  if (questionData.options && questionData.options.length > 0) {
    const options = questionData.options.map((opt: any, index: number) => ({
      question_id: questionId,
      option_text: opt.option_text,
      is_correct: opt.is_correct,
      order_number: index + 1,
    }))

    const { error: optionsError } = await supabase.from("options").insert(options)

    if (optionsError) throw optionsError
  }

  revalidatePath(`/admin/quizzes/${quizId}`)
}

export async function deleteQuestion(questionId: string, quizId: string) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") throw new Error("Unauthorized")

  const { error } = await supabase.from("questions").delete().eq("id", questionId)

  if (error) throw error

  revalidatePath(`/admin/quizzes/${quizId}`)
}

export async function bulkAddQuestions(quizId: string, questionsData: any[]) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "admin") throw new Error("Unauthorized")

  // Get the next order number
  const { data: existingQuestions } = await supabase
    .from("questions")
    .select("order_number")
    .eq("quiz_id", quizId)
    .order("order_number", { ascending: false })
    .limit(1)

  let nextOrder = existingQuestions && existingQuestions.length > 0 ? existingQuestions[0].order_number + 1 : 1

  // Process each question
  for (const questionData of questionsData) {
    const question = {
      quiz_id: quizId,
      question_text: questionData.question_text,
      question_type: questionData.question_type,
      marks: questionData.marks,
      order_number: nextOrder,
    }

    const { data: newQuestion, error: questionError } = await supabase
      .from("questions")
      .insert(question)
      .select()
      .single()

    if (questionError) throw questionError

    // Insert options for this question
    if (questionData.options && questionData.options.length > 0) {
      const options = questionData.options.map((opt: any, index: number) => ({
        question_id: newQuestion.id,
        option_text: opt.option_text,
        is_correct: opt.is_correct,
        order_number: index + 1,
      }))

      const { error: optionsError } = await supabase.from("options").insert(options)

      if (optionsError) throw optionsError
    }

    nextOrder++
  }

  revalidatePath(`/admin/quizzes/${quizId}`)
}
