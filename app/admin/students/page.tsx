import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"

export default async function StudentsPage() {
  const supabase = await createClient()

  const { data: students } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "student")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Students</h1>
        <p className="text-muted-foreground">View all registered students</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registered Students ({students?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {students && students.length > 0 ? (
            <div className="space-y-4">
              {students.map((student) => (
                <div key={student.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="space-y-1">
                    <p className="font-medium">{student.full_name}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{student.email}</span>
                      {student.roll_number && (
                        <>
                          <span>•</span>
                          <span>Roll: {student.roll_number}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary">{student.department}</Badge>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Joined {new Date(student.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-medium">No students registered yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
