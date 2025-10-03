import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import {
  BookOpen,
  Award,
  Clock,
  Shield,
  CheckCircle,
  TrendingUp,
  Users,
  BarChart,
  Zap,
  Target,
  GraduationCap,
  FileCheck,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-auto min-h-16 flex-col items-start gap-3 px-4 py-3 sm:h-16 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-0">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-lg font-bold">MC</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-none">Mankar College</span>
              <span className="text-xs text-muted-foreground">Computer Science Dept.</span>
            </div>
          </div>
          <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-4">
            <Link href="/auth/login" className="flex-1 sm:flex-none">
              <Button variant="ghost" className="w-full sm:w-auto">
                Login
              </Button>
            </Link>
            <Link href="/auth/register" className="flex-1 sm:flex-none">
              <Button className="w-full sm:w-auto">Register</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center sm:px-6 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm">
            <Zap className="h-4 w-4 text-primary" />
            <span>Next-Generation Quiz Platform</span>
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl">
            Master Computer Science Through{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Smart Assessments
            </span>
          </h1>
          <p className="text-pretty text-lg text-muted-foreground sm:text-xl lg:text-2xl">
            A comprehensive online quiz platform designed exclusively for Mankar College Computer Science students. Take
            quizzes, track progress, earn certificates, and excel in your studies.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row">
            <Link href="/auth/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full gap-2 text-base sm:w-auto">
                <GraduationCap className="h-5 w-5" />
                Get Started Free
              </Button>
            </Link>
            <Link href="/auth/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full gap-2 bg-transparent text-base sm:w-auto">
                Login to Dashboard
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Secure & Fair</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Instant Results</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Certificate Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/50">
        <div className="container mx-auto px-4 py-12 sm:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">100+</div>
              <div className="mt-2 text-sm text-muted-foreground">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">50+</div>
              <div className="mt-2 text-sm text-muted-foreground">Quiz Topics</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">500+</div>
              <div className="mt-2 text-sm text-muted-foreground">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">95%</div>
              <div className="mt-2 text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything You Need to Excel</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful features designed to enhance your learning experience and track your progress effectively
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-2 transition-all hover:border-primary hover:shadow-lg">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <BookOpen className="h-7 w-7 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Interactive Quizzes</h3>
                <p className="text-sm text-muted-foreground">
                  Engage with well-designed multiple choice and true/false questions covering all CS topics
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 transition-all hover:border-primary hover:shadow-lg">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Clock className="h-7 w-7 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Timed Assessments</h3>
                <p className="text-sm text-muted-foreground">
                  Practice under real exam conditions with countdown timers and scheduled quiz availability
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 transition-all hover:border-primary hover:shadow-lg">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Award className="h-7 w-7 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Earn Certificates</h3>
                <p className="text-sm text-muted-foreground">
                  Receive downloadable certificates upon successful completion to showcase your achievements
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 transition-all hover:border-primary hover:shadow-lg">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Secure Platform</h3>
                <p className="text-sm text-muted-foreground">
                  Single-session enforcement and anti-cheating measures ensure fair and honest assessment
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 transition-all hover:border-primary hover:shadow-lg">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <TrendingUp className="h-7 w-7 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Progress Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor your performance with detailed analytics and track improvement over time
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 transition-all hover:border-primary hover:shadow-lg">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <BarChart className="h-7 w-7 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Instant Results</h3>
                <p className="text-sm text-muted-foreground">
                  Get immediate feedback on your performance with detailed score breakdowns and explanations
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 transition-all hover:border-primary hover:shadow-lg">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Target className="h-7 w-7 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Scheduled Quizzes</h3>
                <p className="text-sm text-muted-foreground">
                  Countdown timers for upcoming quizzes with automatic availability windows
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 transition-all hover:border-primary hover:shadow-lg">
            <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <FileCheck className="h-7 w-7 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Point-Based Scoring</h3>
                <p className="text-sm text-muted-foreground">
                  Each question has assigned marks for accurate assessment and fair grading
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-y bg-muted/50">
        <div className="container mx-auto px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-lg text-muted-foreground">Get started in three simple steps</p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="mt-6 text-xl font-semibold">Create Your Account</h3>
                <p className="mt-3 text-muted-foreground">
                  Register with your college email and complete your profile with department and roll number
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="mt-6 text-xl font-semibold">Browse & Start Quizzes</h3>
                <p className="mt-3 text-muted-foreground">
                  Explore available quizzes, check schedules, and start taking assessments at your convenience
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="mt-6 text-xl font-semibold">Track & Improve</h3>
                <p className="mt-3 text-muted-foreground">
                  View your results, download certificates, and monitor your progress over time
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why Choose Our Platform?</h2>
            <p className="text-lg text-muted-foreground">
              Built specifically for Mankar College Computer Science students with features that matter most for your
              academic success.
            </p>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Department-Specific Content</h3>
                  <p className="text-sm text-muted-foreground">
                    Quizzes tailored to your CS curriculum and course requirements
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Fair Assessment</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced security measures prevent cheating and ensure honest evaluation
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Lightning Fast</h3>
                  <p className="text-sm text-muted-foreground">
                    Optimized performance ensures smooth quiz-taking experience without lag
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Recognition & Rewards</h3>
                  <p className="text-sm text-muted-foreground">
                    Earn certificates and build your academic portfolio with verified achievements
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Card className="w-full max-w-md border-2">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                      <GraduationCap className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">Ready to Start?</h3>
                    <p className="mt-2 text-muted-foreground">Join your fellow students today</p>
                  </div>
                  <div className="space-y-3">
                    <Link href="/auth/register" className="block">
                      <Button size="lg" className="w-full">
                        Create Free Account
                      </Button>
                    </Link>
                    <Link href="/auth/login" className="block">
                      <Button size="lg" variant="outline" className="w-full bg-transparent">
                        Login to Existing Account
                      </Button>
                    </Link>
                  </div>
                  <p className="text-center text-xs text-muted-foreground">
                    No credit card required. Start taking quizzes immediately.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-y bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-16 text-center sm:px-6 sm:py-20">
          <div className="mx-auto max-w-3xl space-y-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Start Your Learning Journey Today</h2>
            <p className="text-lg text-primary-foreground/90">
              Join hundreds of students already using our platform to excel in their Computer Science studies
            </p>
            <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
              <Link href="/auth/register" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full gap-2 text-base sm:w-auto">
                  <GraduationCap className="h-5 w-5" />
                  Register Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-12 sm:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <span className="text-lg font-bold">MC</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold leading-none">Mankar College</span>
                  <span className="text-xs text-muted-foreground">Computer Science Dept.</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering Computer Science students with modern assessment tools and comprehensive learning resources.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/auth/login" className="hover:text-foreground">
                    Student Login
                  </Link>
                </li>
                <li>
                  <Link href="/auth/register" className="hover:text-foreground">
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-foreground">
                    Admin Portal
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Interactive Quizzes</li>
                <li>Timed Assessments</li>
                <li>Certificate Generation</li>
                <li>Progress Tracking</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Mankar College - Department of Computer Science. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
