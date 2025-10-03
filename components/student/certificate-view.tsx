"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRef } from "react"

interface CertificateViewProps {
  certificate: any
}

export function CertificateView({ certificate }: CertificateViewProps) {
  const certificateRef = useRef<HTMLDivElement>(null)

  const handleDownload = () => {
    if (typeof window !== "undefined" && certificateRef.current) {
      // In a real implementation, you would use a library like html2canvas or jsPDF
      // For now, we'll use the browser's print functionality
      window.print()
    }
  }

  const issuedDate = new Date(certificate.issued_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/results">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Results
          </Button>
        </Link>
        <Button onClick={handleDownload} className="gap-2">
          <Download className="h-4 w-4" />
          Download Certificate
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div
          ref={certificateRef}
          className="relative aspect-[1.414/1] bg-gradient-to-br from-background via-background to-muted p-12 print:bg-white"
        >
          {/* Decorative border */}
          <div className="absolute inset-4 border-4 border-primary/20" />
          <div className="absolute inset-6 border border-primary/40" />

          {/* Content */}
          <div className="relative flex h-full flex-col items-center justify-center space-y-6 text-center">
            {/* Header */}
            <div className="space-y-2">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="text-3xl font-bold">MC</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight">Certificate of Achievement</h1>
              <p className="text-lg text-muted-foreground">Mankar College</p>
              <p className="text-sm text-muted-foreground">Department of Computer Science</p>
            </div>

            {/* Divider */}
            <div className="h-px w-32 bg-primary/20" />

            {/* Main content */}
            <div className="space-y-4">
              <p className="text-lg">This is to certify that</p>
              <h2 className="text-3xl font-bold text-primary">{certificate.student.full_name}</h2>
              <p className="text-muted-foreground">Roll Number: {certificate.student.roll_number}</p>
              <p className="text-lg">has successfully completed</p>
              <h3 className="text-2xl font-semibold">{certificate.quiz.title}</h3>
              <p className="text-lg">
                with a score of <span className="font-bold">{certificate.attempt.score}</span> out of{" "}
                <span className="font-bold">{certificate.quiz.total_marks}</span>
              </p>
            </div>

            {/* Footer */}
            <div className="mt-auto space-y-4">
              <div className="h-px w-32 bg-primary/20" />
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Certificate Number</p>
                  <p className="text-xs text-muted-foreground">{certificate.certificate_number}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Date of Issue</p>
                  <p className="text-xs text-muted-foreground">{issuedDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          ${certificateRef.current ? `#certificate-content, #certificate-content *` : ""} {
            visibility: visible;
          }
          ${certificateRef.current ? `#certificate-content` : ""} {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
