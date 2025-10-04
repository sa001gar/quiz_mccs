"use client"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  FileText, 
  Award, 
  TrendingUp, 
  Clock, 
  Users, 
  Target, 
  Brain, 
  Zap,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  BookOpen,
  Trophy,
  Star,
  ChevronRight,
  Eye,
  Download,
  Phone,
  Sparkles,
  Timer,
  Shield
} from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

// Countdown Timer Component
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const targetDate = new Date("2025-10-25T06:00:00+05:30") // 6 AM IST on Oct 25, 2025
    
    const updateTimer = () => {
      const now = new Date().getTime()
      const target = targetDate.getTime()
      const difference = target - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className="text-center">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 backdrop-blur-md rounded-xl p-3 border border-yellow-300/50 shadow-lg">
          <div className="text-2xl sm:text-3xl font-bold text-black mb-1">{timeLeft.days}</div>
          <div className="text-xs text-black font-medium">Days</div>
        </div>
      </div>
      <div className="text-center">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 backdrop-blur-md rounded-xl p-3 border border-yellow-300/50 shadow-lg">
          <div className="text-2xl sm:text-3xl font-bold text-black mb-1">{timeLeft.hours}</div>
          <div className="text-xs text-black font-medium">Hours</div>
        </div>
      </div>
      <div className="text-center">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 backdrop-blur-md rounded-xl p-3 border border-yellow-300/50 shadow-lg">
          <div className="text-2xl sm:text-3xl font-bold text-black mb-1">{timeLeft.minutes}</div>
          <div className="text-xs text-black font-medium">Minutes</div>
        </div>
      </div>
      <div className="text-center">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 backdrop-blur-md rounded-xl p-3 border border-yellow-300/50 shadow-lg">
          <div className="text-2xl sm:text-3xl font-bold text-black mb-1">{timeLeft.seconds}</div>
          <div className="text-xs text-black font-medium">Seconds</div>
        </div>
      </div>
    </div>
  )
}

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [stats, setStats] = useState({
    attemptsCount: 0,
    passedCount: 0,
    certificatesCount: 0,
    averageScore: 0,
    totalTimeSpent: 0
  })
  const [recentAttempts, setRecentAttempts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      
      try {
        // Get user
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          // Get profile
          const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()
          setProfile(profile)

          // Get statistics
          const [attemptsResult, passedResult, certificatesResult, attemptsData] = await Promise.all([
            supabase.from("quiz_attempts").select("*", { count: "exact", head: true }).eq("student_id", user.id),
            supabase.from("quiz_attempts").select("*", { count: "exact", head: true }).eq("student_id", user.id).eq("passed", true),
            supabase.from("certificates").select("*", { count: "exact", head: true }).eq("student_id", user.id),
            supabase.from("quiz_attempts").select("score, total_marks, time_taken_seconds").eq("student_id", user.id).eq("status", "submitted")
          ])

          // Calculate average score
          const attempts = attemptsData.data || []
          const averageScore = attempts.length > 0 
            ? Math.round(attempts.reduce((sum, attempt) => sum + (attempt.score / attempt.total_marks * 100), 0) / attempts.length)
            : 0

          // Calculate total time spent
          const totalTimeSpent = attempts.reduce((sum, attempt) => sum + (attempt.time_taken_seconds || 0), 0)

          setStats({
            attemptsCount: attemptsResult.count || 0,
            passedCount: passedResult.count || 0,
            certificatesCount: certificatesResult.count || 0,
            averageScore,
            totalTimeSpent
          })

          // Get recent attempts
  const { data: recentAttempts } = await supabase
    .from("quiz_attempts")
            .select(`
      *,
      quiz:quizzes(title)
            `)
            .eq("student_id", user.id)
    .order("started_at", { ascending: false })
    .limit(5)

          setRecentAttempts(recentAttempts || [])
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-100 to-indigo-200 flex items-center justify-center">
        <div className="text-slate-800 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-800 border-t-transparent mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-purple-100 to-indigo-200 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 rounded-full blur-2xl animate-float delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-gradient-to-br from-yellow-200/30 to-orange-200/30 rounded-full blur-3xl animate-float delay-2000" />
        <div className="absolute bottom-40 right-1/3 w-36 h-36 bg-gradient-to-br from-green-200/30 to-teal-200/30 rounded-full blur-2xl animate-float delay-3000" />
      </div>

      <div className="relative z-10 pb-20 sm:pb-8">
        <div className="p-4 sm:p-6">
          {/* Welcome Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
              Welcome back, {profile?.full_name}!
            </h1>
            <p className="text-slate-600">
              {profile?.college}
            </p>
          </div>
          {/* Competition Info */}
          <Card className="bg-gradient-to-r from-purple-300 via-indigo-200 to-cyan-200 backdrop-blur-md border-purple-200/50 shadow-xl mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex-1">
                  <Badge className="mb-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-1 text-sm font-bold">
                    <Sparkles className="mr-2 h-3 w-3" />
                    5th National Level Quiz Competition
                  </Badge>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">MCCS-QUIZZARDS 2025</h2>
                  <p className="text-slate-700 text-sm sm:text-base mb-4">
                    October 25-26, 2025 • 6 AM to 12 AM (42 hours)
                  </p>
                  <div className="flex items-center gap-3 text-slate-600">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">+91 76998 76839</span>
                  </div>
                </div>
                
                {/* Countdown Timer - Right Side */}
                <div className="lg:ml-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Timer className="h-5 w-5 text-yellow-600" />
                    <h3 className="text-lg font-semibold text-slate-800">Competition Starts In:</h3>
                  </div>
                  <CountdownTimer />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white/80 backdrop-blur-md border-purple-200/50 shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-xs font-medium">Attempts</p>
                    <p className="text-2xl font-bold text-slate-800">{stats.attemptsCount}</p>
                  </div>
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-md border-purple-200/50 shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-xs font-medium">Passed</p>
                    <p className="text-2xl font-bold text-slate-800">{stats.passedCount}</p>
                  </div>
                  <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-md border-purple-200/50 shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-xs font-medium">Certificates</p>
                    <p className="text-2xl font-bold text-slate-800">{stats.certificatesCount}</p>
                  </div>
                  <div className="p-2 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg">
                    <Trophy className="h-4 w-4 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-md border-purple-200/50 shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-xs font-medium">Avg Score</p>
                    <p className="text-2xl font-bold text-slate-800">{stats.averageScore}%</p>
                  </div>
                  <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
      </div>

          {/* Recent Activity */}
          <Card className="bg-white/80 backdrop-blur-md border-purple-200/50 shadow-xl mb-6">
        <CardHeader>
              <CardTitle className="text-slate-800 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Quiz Attempts
              </CardTitle>
        </CardHeader>
        <CardContent>
          {recentAttempts && recentAttempts.length > 0 ? (
                <div className="space-y-3">
              {recentAttempts.map((attempt: any) => (
                    <div key={attempt.id} className="flex items-center justify-between p-3 bg-purple-50/50 rounded-lg border border-purple-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg">
                          <BookOpen className="h-4 w-4 text-white" />
                        </div>
                  <div>
                          <p className="text-slate-800 font-medium text-sm">{attempt.quiz?.title}</p>
                          <p className="text-slate-600 text-xs">
                      {attempt.status === "submitted"
                        ? `Score: ${attempt.score}/${attempt.total_marks}`
                        : attempt.status.replace("_", " ").toUpperCase()}
                    </p>
                  </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          className={
                            attempt.passed === true 
                              ? "bg-green-100 text-green-700 border-green-200 text-xs" 
                              : attempt.passed === false 
                              ? "bg-red-100 text-red-700 border-red-200 text-xs"
                              : "bg-yellow-100 text-yellow-700 border-yellow-200 text-xs"
                          }
                        >
                      {attempt.passed === true ? "Passed" : attempt.passed === false ? "Failed" : "In Progress"}
                        </Badge>
                        <p className="text-slate-600 text-xs">
                          {new Date(attempt.started_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full mb-3">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="text-slate-800 font-medium mb-1">No quiz attempts yet</p>
                  <p className="text-slate-600 text-sm text-center mb-4">Start taking quizzes to see your progress here</p>
                  <Link href="/dashboard/quizzes">
                    <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Browse Quizzes
                    </Button>
                  </Link>
            </div>
          )}
        </CardContent>
      </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/dashboard/quizzes">
              <Card className="bg-gradient-to-br from-yellow-100 to-amber-100 backdrop-blur-md border-yellow-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl group-hover:scale-110 transition-transform">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-slate-800 font-semibold text-sm">Browse Quizzes</h3>
                      <p className="text-slate-600 text-xs">Start new challenges</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-500 ml-auto" />
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/certificates">
              <Card className="bg-gradient-to-br from-green-100 to-emerald-100 backdrop-blur-md border-green-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl group-hover:scale-110 transition-transform">
                      <Trophy className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-slate-800 font-semibold text-sm">My Certificates</h3>
                      <p className="text-green-700 text-xs">View achievements</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-green-600 ml-auto" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}