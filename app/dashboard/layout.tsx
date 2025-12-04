import { StudentNav } from "@/components/student/student-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <StudentNav />
      <main className="lg:pt-0">
        {children}
      </main>
    </div>
  )
}