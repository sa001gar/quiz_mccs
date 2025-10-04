import { StudentNav } from "@/components/student/student-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-100 to-indigo-200">
      <StudentNav />
      <main className="lg:pt-0">
        {children}
      </main>
    </div>
  )
}