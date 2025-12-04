"use client"

import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Award,
  TrendingUp,
  Clock,
  Target,
  BookOpen,
  Trophy,
  ChevronRight,
  Phone,
  Sparkles,
  Timer
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
        <div className="bg-primary/10 backdrop-blur-md rounded-xl p-3 border border-primary/20 shadow-sm">
          <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">{timeLeft.days}</div>
          <div className="text-xs text-muted-foreground font-medium">Days</div>
        </div>
      </div>
      <div className="text-center">
        <div className="bg-primary/10 backdrop-blur-md rounded-xl p-3 border border-primary/20 shadow-sm">
          <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">{timeLeft.hours}</div>
          <div className="text-xs text-muted-foreground font-medium">Hours</div>
        </div>
      </div>
      <div className="text-center">
        <div className="bg-primary/10 backdrop-blur-md rounded-xl p-3 border border-primary/20 shadow-sm">
          <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">{timeLeft.minutes}</div>
          <div className="text-xs text-muted-foreground font-medium">Minutes</div>
        </div>
      </div>
      <div className="text-center">
        <div className="bg-primary/10 backdrop-blur-md rounded-xl p-3 border border-primary/20 shadow-sm">
          <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">{timeLeft.seconds}</div>
          <div className="text-xs text-muted-foreground font-medium">Seconds</div>
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative z-10 pb-20 sm:pb-8">
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Welcome back, <span className="text-primary">{profile?.full_name}</span>!
            </h1>
            <p className="text-muted-foreground text-lg">
              {profile?.college}
            </p>
          </div>

          {/* Competition Info */}
          <Card className="bg-card border-border/50 shadow-xl mb-8 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <CardContent className="p-6 sm:p-8 relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div className="flex-1">
                  <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 px-4 py-1.5 text-sm font-bold shadow-sm">
                    <Sparkles className="mr-2 h-3 w-3" />
                    5th National Level Quiz Competition
                  </Badge>
                  <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-3">MCCS-QUIZZARDS 2025</h2>
                  <p className="text-muted-foreground text-base sm:text-lg mb-6">
                    October 25-26, 2025 • 6 AM to 12 AM (42 hours)
                  </p>
                  <div className="flex items-center gap-3 text-muted-foreground bg-secondary/30 w-fit px-4 py-2 rounded-lg">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">+91 76998 76839</span>
                  </div>
                </div>

                {/* Countdown Timer - Right Side */}
                <div className="lg:ml-8 w-full lg:w-auto">
                  <div className="flex items-center gap-2 mb-4">
                    <Timer className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Competition Starts In:</h3>
                  </div>
                  <CountdownTimer />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-card border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">Attempts</p>
                    <p className="text-3xl font-heading font-bold text-foreground">{stats.attemptsCount}</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-xl">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">Passed</p>
                    <p className="text-3xl font-heading font-bold text-foreground">{stats.passedCount}</p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-xl">
                    <Award className="h-5 w-5 text-green-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">Certificates</p>
                    <p className="text-3xl font-heading font-bold text-foreground">{stats.certificatesCount}</p>
                  </div>
                  <div className="p-3 bg-yellow-500/10 rounded-xl">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">Avg Score</p>
                    <p className="text-3xl font-heading font-bold text-foreground">{stats.averageScore}%</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Target className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-card border-border/50 shadow-xl mb-8">
            <CardHeader className="border-b border-border/50 pb-4">
              <CardTitle className="text-foreground flex items-center gap-2 font-heading text-xl">
                <Clock className="h-5 w-5 text-primary" />
                Recent Quiz Attempts
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {recentAttempts && recentAttempts.length > 0 ? (
                <div className="space-y-3">
                  {recentAttempts.map((attempt: any) => (
                    <div key={attempt.id} className="flex items-center justify-between p-4 bg-secondary/20 rounded-xl border border-border/50 hover:bg-secondary/30 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-primary/10 rounded-lg">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-foreground font-semibold text-sm sm:text-base mb-0.5">{attempt.quiz?.title}</p>
                          <p className="text-muted-foreground text-xs sm:text-sm">
                            {attempt.status === "submitted"
                              ? `Score: ${attempt.score}/${attempt.total_marks}`
                              : attempt.status.replace("_", " ").toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4">
                        <Badge
                          className={
                            attempt.passed === true
                              ? "bg-green-500/10 text-green-600 border-green-500/20"
                              : attempt.passed === false
                                ? "bg-red-500/10 text-red-600 border-red-500/20"
                                : "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                          }
                        >
                          {attempt.passed === true ? "Passed" : attempt.passed === false ? "Failed" : "In Progress"}
                        </Badge>
                        <p className="text-muted-foreground text-xs">
                          {new Date(attempt.started_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="p-4 bg-secondary/30 rounded-full mb-4">
                    <Clock className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-foreground font-medium mb-1 text-lg">No quiz attempts yet</p>
                  <p className="text-muted-foreground text-sm text-center mb-6 max-w-xs">Start taking quizzes to see your progress here</p>
                  <Link href="/dashboard/quizzes">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20">
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
              <Card className="bg-card border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-4 bg-primary/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-foreground font-heading font-bold text-lg mb-1">Browse Quizzes</h3>
                    <p className="text-muted-foreground text-sm">Start new challenges</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto group-hover:translate-x-1 transition-transform" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/dashboard/certificates">
              <Card className="bg-card border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="p-4 bg-yellow-500/10 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="text-foreground font-heading font-bold text-lg mb-1">My Certificates</h3>
                    <p className="text-muted-foreground text-sm">View achievements</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto group-hover:translate-x-1 transition-transform" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}