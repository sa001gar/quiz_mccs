"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import { Eye, EyeOff, CheckCircle, Zap, Shield, Calendar, Clock, Phone, Sparkles, Lock, ArrowLeft, GraduationCap } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Component that uses useSearchParams
function ResetPasswordForm() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isValidSession, setIsValidSession] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        setIsValidSession(true)
      } else {
        // If no session, redirect to login
        router.push("/auth/login")
      }
    }

    checkSession()
  }, [router])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      setSuccess(true)

      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isValidSession) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying your session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex">
      {/* Left Column - MCCS QUIZWARDS Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary/30 border-r border-border/50 min-h-screen flex-col justify-center relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/40 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
        </div>

        {/* Content */}
        <div className="relative z-10 p-12 flex flex-col justify-center min-h-screen">
          <div className="max-w-lg mx-auto">
            <div className="mb-8">
              <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 px-6 py-2 text-sm font-bold shadow-sm backdrop-blur-md">
                <Sparkles className="mr-2 h-4 w-4" />
                5th National Level Quiz Competition
              </Badge>
              <h1 className="font-heading text-5xl font-bold text-foreground mb-4 leading-tight">
                MCCS-QUIZZARDS <span className="text-primary">2025</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed font-light">
                Organized by Department of Computer Science, Mankar College, Mankar, Purba Barddhaman Pin - 713144
              </p>
            </div>

            <div className="mb-8 space-y-4">
              <div className="flex items-center gap-4 text-xl font-medium text-foreground/80">
                <div className="p-2 rounded-lg bg-secondary text-primary">
                  <Calendar className="h-6 w-6" />
                </div>
                October 25-26, 2025
              </div>
              <div className="flex items-center gap-4 text-lg text-muted-foreground">
                <div className="p-2 rounded-lg bg-secondary text-primary">
                  <Clock className="h-5 w-5" />
                </div>
                6 AM (25th Oct) to 12 AM (26th Oct)
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Lock className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-foreground">Set New Password</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Create a strong, secure password to protect your account and continue your quiz journey.
                </p>
              </div>

              <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-foreground">Secure & Protected</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Your new password will be encrypted and protected with industry-standard security measures.
                </p>
              </div>

              <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-foreground">Quick Access</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Once you set your new password, you'll be redirected to your dashboard to continue learning.
                </p>
              </div>
            </div>

            <div className="mt-8 bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3 text-lg text-foreground font-medium">
                <Phone className="h-5 w-5 text-primary" />
                Contact: +91 76998 76839
              </div>
              <p className="text-muted-foreground">
                Visit: quiz.computersciencemancoll.in
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Reset Password Form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:text-left">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-xl mb-6 lg:hidden">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
              <Link href="/auth/login" className="text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h2 className="font-heading text-3xl font-bold text-foreground">Set new password</h2>
            </div>
            <p className="text-muted-foreground">
              Create a strong password for your account
            </p>
          </div>

          <Card className="border-border/50 shadow-xl bg-card">
            <CardContent className="p-8">
              {success ? (
                <div className="text-center space-y-6">
                  <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-heading font-bold text-foreground mb-2">Password updated successfully!</h3>
                    <p className="text-muted-foreground mb-4">
                      Your password has been updated. You'll be redirected to your dashboard shortly.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Link href="/dashboard" className="flex-1">
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        Go to Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground">New Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter new password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-11 bg-secondary/20 border-border/50 focus:border-primary focus:ring-primary/20 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm new password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="h-11 bg-secondary/20 border-border/50 focus:border-primary focus:ring-primary/20 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                      {error}
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    Password must be at least 6 characters long
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-medium shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                    disabled={isLoading}
                  >
                    {isLoading ? "Updating password..." : "Update Password"}
                  </Button>
                </form>
              )}

              <div className="mt-8 text-center">
                <p className="text-xs text-muted-foreground">
                  Need help? Contact us at{" "}
                  <a href="mailto:support@computersciencemancoll.in" className="text-primary hover:underline">
                    support@computersciencemancoll.in
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Loading component for Suspense fallback
function ResetPasswordLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading reset password form...</p>
      </div>
    </div>
  )
}

// Main page component with Suspense boundary
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordForm />
    </Suspense>
  )
}
