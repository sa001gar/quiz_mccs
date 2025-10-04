"use client"

import { useEffect, useRef } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Button } from '@/components/ui/button'
import { Download, Award, Calendar, User, BookOpen } from 'lucide-react'

interface CertificateData {
  certificateNumber: string
  studentName: string
  quizTitle: string
  score: number
  totalMarks: number
  percentage: number
  completedDate: string
  college: string
}

interface CertificatePDFProps {
  certificateData: CertificateData
  onDownload?: () => void
}

export function CertificatePDF({ certificateData, onDownload }: CertificatePDFProps) {
  const certificateRef = useRef<HTMLDivElement>(null)

  const downloadPDF = async () => {
    if (!certificateRef.current) return

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('landscape', 'mm', 'a4')
      
      const imgWidth = 297 // A4 landscape width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`certificate-${certificateData.certificateNumber}.pdf`)
      
      if (onDownload) {
        onDownload()
      }
    } catch (error) {
      console.error('Error generating PDF:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Certificate Preview */}
      <div 
        ref={certificateRef}
        className="bg-gradient-to-br from-slate-50 to-purple-50 border-2 border-purple-200 rounded-lg p-8 shadow-xl"
        style={{ width: '842px', height: '595px' }} // A4 landscape dimensions in pixels
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-800">Certificate of Achievement</h1>
          </div>
          <p className="text-lg text-slate-600">MCCS-QUIZZARDS 2025</p>
        </div>

        {/* Main Content */}
        <div className="text-center mb-8">
          <p className="text-xl text-slate-700 mb-6">This is to certify that</p>
          <h2 className="text-3xl font-bold text-purple-800 mb-2">{certificateData.studentName}</h2>
          <p className="text-lg text-slate-600 mb-6">{certificateData.college}</p>
          
          <div className="bg-white/80 rounded-lg p-6 mb-6 border border-purple-200">
            <p className="text-lg text-slate-700 mb-4">
              has successfully completed the quiz
            </p>
            <h3 className="text-2xl font-bold text-purple-800 mb-4">{certificateData.quizTitle}</h3>
            
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-sm text-slate-600 mb-1">Score</p>
                <p className="text-2xl font-bold text-green-600">{certificateData.score}/{certificateData.totalMarks}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Percentage</p>
                <p className="text-2xl font-bold text-blue-600">{certificateData.percentage}%</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Status</p>
                <p className="text-2xl font-bold text-green-600">PASSED</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-end">
          <div className="text-center">
            <div className="w-32 h-20 border-2 border-slate-300 rounded mb-2"></div>
            <p className="text-sm text-slate-600">Authorized Signature</p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-slate-600 mb-2">Certificate Number</p>
            <p className="text-lg font-mono font-bold text-purple-800">{certificateData.certificateNumber}</p>
            <div className="flex items-center justify-center gap-2 mt-2 text-sm text-slate-600">
              <Calendar className="h-4 w-4" />
              <span>{new Date(certificateData.completedDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="text-center">
        <Button 
          onClick={downloadPDF}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 text-lg"
        >
          <Download className="mr-2 h-5 w-5" />
          Download Certificate as PDF
        </Button>
      </div>
    </div>
  )
}
