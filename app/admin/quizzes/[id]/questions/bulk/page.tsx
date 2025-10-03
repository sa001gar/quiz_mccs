import { BulkQuestionForm } from "@/components/admin/bulk-question-form"

export default function BulkAddQuestionsPage({ params }: { params: { id: string } }) {
  return (
    <div className="mx-auto max-w-4xl space-y-6 py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Multiple Questions</h1>
        <p className="text-muted-foreground">Add questions one by one or import from Excel</p>
      </div>

      <BulkQuestionForm quizId={params.id} />
    </div>
  )
}
