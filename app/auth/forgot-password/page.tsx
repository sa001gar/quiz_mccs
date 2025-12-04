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
import { CheckCircle, Sparkles, Calendar, Clock, Phone, ArrowLeft, GraduationCap } from "lucide-react"
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

      {/* Right Column - Forgot Password Form */}
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
              <h2 className="font-heading text-3xl font-bold text-foreground">Forgot password?</h2>
            </div>
            <p className="text-muted-foreground">
              Remember your password?{" "}
              <Link href="/auth/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
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
                    <h3 className="text-xl font-heading font-bold text-foreground mb-2">Check your email</h3>
                    <p className="text-muted-foreground mb-4">
                      We've sent a password reset link to <strong className="text-foreground">{email}</strong>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Didn't receive the email? Check your spam folder or try again.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={() => {
                        setSuccess(false)
                        setEmail("")
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Try another email
                    </Button>
                    <Link href="/auth/login" className="w-full">
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        Back to Sign In
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 bg-secondary/20 border-border/50 focus:border-primary focus:ring-primary/20"
                    />
                    <p className="text-xs text-muted-foreground">
                      We'll send you a secure link to reset your password
                    </p>
                  </div>

                  {error && (
                    <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-medium shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending reset link..." : "Send Reset Link"}
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
