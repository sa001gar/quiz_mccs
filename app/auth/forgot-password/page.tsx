"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Eye, EyeOff, CheckCircle, Zap, Shield, Brain, ArrowRight, Users, BookOpen, Award, Target, Clock, Calendar, Phone, Sparkles, Mail, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      
      if (error) throw error
      
      setSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl animate-float delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl animate-float delay-2000" />
        <div className="absolute bottom-40 right-1/3 w-36 h-36 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-full blur-2xl animate-float delay-3000" />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-full blur-xl animate-pulse-glow" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Column - MCCS QUIZWARDS Info */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600/20 via-indigo-600/20 to-cyan-600/20 backdrop-blur-sm min-h-screen flex-col justify-center relative overflow-hidden">
          {/* Content */}
          <div className="relative z-10 p-12 flex flex-col justify-center min-h-screen">
            <div className="max-w-lg">
              <div className="mb-8">
                <Badge className="mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-6 py-2 text-sm font-bold shadow-lg">
                  <Sparkles className="mr-2 h-4 w-4" />
                  5th National Level Quiz Competition
                </Badge>
                <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
                  MCCS-QUIZZARDS 2025
                </h1>
                <p className="text-xl text-purple-100 leading-relaxed">
                  Organized by Department of Computer Science, Mankar College, Mankar, Purba Barddhaman Pin - 713144
                </p>
              </div>
              
              <div className="mb-8 space-y-4">
                <div className="flex items-center gap-4 text-2xl font-bold text-purple-100">
                  <Calendar className="h-8 w-8 text-yellow-400" />
                  October 25-26, 2025
                </div>
                <div className="flex items-center gap-4 text-xl text-purple-200">
                  <Clock className="h-6 w-6 text-cyan-400" />
                  6 AM (25th Oct) to 12 AM (26th Oct)
                </div>
              </div>

              
              
              <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="mb-4 flex items-center gap-3 text-lg text-purple-100">
                  <Phone className="h-6 w-6 text-yellow-400" />
                  Contact: +91 76998 76839 | +91 86299 97123
                </div>
                <p className="text-lg text-purple-200">
                  Visit: quiz.computersciencemancoll.in
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Forgot Password Form */}
        <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Link href="/auth/login" className="text-purple-600 hover:text-purple-700">
                      <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-800">Forgot your password?</h2>
                  </div>
                  <p className="text-gray-600">
                    Remember your password?{" "}
                    <Link href="/auth/login" className="text-purple-600 hover:text-purple-700 font-medium">
                      Sign in
                    </Link>
                  </p>
                </div>

                {success ? (
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Check your email</h3>
                      <p className="text-gray-600 mb-4">
                        We've sent a password reset link to <strong>{email}</strong>
                      </p>
                      <p className="text-sm text-gray-500">
                        Didn't receive the email? Check your spam folder or try again.
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => {
                          setSuccess(false)
                          setEmail("")
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        Try another email
                      </Button>
                      <Link href="/auth/login" className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                          Back to Sign In
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">E-mail address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                      />
                      <p className="text-xs text-gray-500">
                        We'll send you a secure link to reset your password
                      </p>
                    </div>

                    {error && (
                      <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-200">
                        {error}
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-lg shadow-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending reset link..." : "Send Reset Link"}
                    </Button>
                  </form>
                )}

                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500">
                    Need help? Contact us at{" "}
                    <a href="mailto:support@computersciencemancoll.in" className="text-purple-600 hover:text-purple-700">
                      support@computersciencemancoll.in
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
