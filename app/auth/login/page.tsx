"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Eye, EyeOff, CheckCircle, Zap, Shield, Brain, ArrowRight, Users, BookOpen, Award, Target, Clock, Calendar, Phone, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const router = useRouter()

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        // Check user role and redirect accordingly
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()
        
        if (profile?.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/dashboard")
        }
      } else {
        setIsCheckingAuth(false)
      }
    }
    
    checkAuth()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error

      // Check user role and redirect accordingly
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

        if (profile?.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/dashboard")
        }
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    )
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

        {/* Right Column - Login Form */}
        <div className="flex-1 lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome back.</h2>
                  <p className="text-gray-600">
                    Don't have an account?{" "}
                    <Link href="/auth/register" className="text-purple-600 hover:text-purple-700 font-medium">
                      Sign up
                    </Link>
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">E-mail address</Label>
                  <Input
                    id="email"
                    type="email"
                      placeholder="E-mail address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                      className="border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                  />
                </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                    <div className="relative">
                  <Input
                    id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                        className="border-gray-200 focus:border-purple-500 focus:ring-purple-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                </div>

                  {error && (
                    <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-200">
                      {error}
              </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      <Link href="/auth/forgot-password" className="text-purple-600 hover:text-purple-700">
                        Forgot your password?
                </Link>
              </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-lg shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
            </form>
          </CardContent>
        </Card>
          </div>
        </div>
      </div>
    </div>
  )
}