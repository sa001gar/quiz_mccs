"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Calendar,
  Clock,
  Phone,
  Sparkles,
  Award,
  Users,
  BookOpen,
  Target,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Trophy,
  Brain,
  Code,
  Gamepad2,
  Timer,
  Shield,
  Globe,
  ChevronRight,
  Play,
  Download,
  Info,
  Menu,
  X,
  Mail,
  MapPin,
  ExternalLink,
  GraduationCap,
  Building,
  Quote,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react"

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
    <div className="relative overflow-hidden rounded-3xl  p-8 shadow-2xl border border-purple-500/20">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-indigo-500/10 to-cyan-500/10" />
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full blur-2xl animate-pulse delay-1000" />

      <div className="relative z-10">
        <div className="mb-8 text-center">
          <Badge className="mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-6 py-2 text-sm font-bold shadow-lg">
            <Sparkles className="mr-2 h-4 w-4" />
            5th National Level Quiz Competition
          </Badge>
          <h1 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl mb-4">
            MCCS-QUIZZARDS 2025
          </h1>
          <p className="text-lg text-purple-100 max-w-2xl mx-auto">
            Organized by Department of Computer Science, Mankar College, Mankar, Purba Barddhaman Pin - 713144
          </p>
        </div>

        <div className="mb-8 text-center">
          <div className="mb-6 flex items-center justify-center gap-3 text-xl font-bold text-purple-100">
            <Calendar className="h-6 w-6 text-yellow-400" />
            October 25-26, 2025
          </div>
          <div className="flex items-center justify-center gap-3 text-lg text-purple-200">
            <Clock className="h-5 w-5 text-cyan-400" />
            6 AM (25th Oct) to 12 AM (26th Oct)
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
          <div className="rounded-2xl bg-white/10 backdrop-blur-md p-6 text-center border border-white/20">
            <div className="text-3xl font-bold text-yellow-400 sm:text-4xl mb-2">{timeLeft.days}</div>
            <div className="text-sm font-semibold text-purple-100">Days</div>
          </div>
          <div className="rounded-2xl bg-white/10 backdrop-blur-md p-6 text-center border border-white/20">
            <div className="text-3xl font-bold text-cyan-400 sm:text-4xl mb-2">{timeLeft.hours}</div>
            <div className="text-sm font-semibold text-purple-100">Hours</div>
          </div>
          <div className="rounded-2xl bg-white/10 backdrop-blur-md p-6 text-center border border-white/20">
            <div className="text-3xl font-bold text-pink-400 sm:text-4xl mb-2">{timeLeft.minutes}</div>
            <div className="text-sm font-semibold text-purple-100">Minutes</div>
          </div>
          <div className="rounded-2xl bg-white/10 backdrop-blur-md p-6 text-center border border-white/20">
            <div className="text-3xl font-bold text-green-400 sm:text-4xl mb-2">{timeLeft.seconds}</div>
            <div className="text-sm font-semibold text-purple-100">Seconds</div>
          </div>
        </div>

        <div className="text-center">
          <div className="mb-4 flex items-center justify-center gap-3 text-lg text-purple-100">
            <Phone className="h-5 w-5 text-yellow-400" />
            Contact: +91 76998 76839 | +91 86299 97123
          </div>
          <p className="text-sm text-purple-200 mb-6">
            Visit: quiz.computersciencemancoll.in
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black px-8 py-3 rounded-xl shadow-lg font-bold">
                <Users className="mr-2 h-5 w-5" />
                Register Now
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="border-white/30 text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:bg-purple-800 hover:text-white px-8 py-3 rounded-xl font-semibold backdrop-blur-md transition-all">
                <Info className="mr-2 h-5 w-5" />
                Know More
              </Button>
            </Link>
            {/* <Link href="/auth/login">
              <Button size="lg" variant="outline" className="border-white/30 text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 hover:bg-white/10 px-8 py-3 rounded-xl font-semibold backdrop-blur-md">
                <BookOpen className="mr-2 h-5 w-5" />
                Login to Dashboard
              </Button>
            </Link> */}

          </div>
        </div>
      </div>
    </div>
  )
}

// Feature Card Component
function FeatureCard({ icon: Icon, title, description, color }: {
  icon: any,
  title: string,
  description: string,
  color: string
}) {
  return (
    <Card className={`border-2 ${color} bg-gradient-to-br from-white/80 to-gray-50/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-opacity-80`}>
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${color.includes('purple') ? 'from-purple-500 to-purple-600' : color.includes('indigo') ? 'from-indigo-500 to-indigo-600' : color.includes('cyan') ? 'from-cyan-500 to-cyan-600' : 'from-pink-500 to-pink-600'} text-white shadow-lg mb-4`}>
            <Icon className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}

// Step Component
function StepCard({ number, title, description, icon: Icon, color }: {
  number: number,
  title: string,
  description: string,
  icon: any,
  color: string
}) {
  return (
    <Card className={`border-2 ${color} bg-gradient-to-br from-white/80 to-gray-50/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-opacity-80`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color.includes('purple') ? 'from-purple-500 to-purple-600' : color.includes('indigo') ? 'from-indigo-500 to-indigo-600' : color.includes('cyan') ? 'from-cyan-500 to-cyan-600' : color.includes('pink') ? 'from-pink-500 to-pink-600' : color.includes('rose') ? 'from-rose-500 to-rose-600' : 'from-orange-500 to-orange-600'} text-white shadow-lg`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${color.includes('purple') ? 'from-purple-500 to-purple-600' : color.includes('indigo') ? 'from-indigo-500 to-indigo-600' : color.includes('cyan') ? 'from-cyan-500 to-cyan-600' : color.includes('pink') ? 'from-pink-500 to-pink-600' : color.includes('rose') ? 'from-rose-500 to-rose-600' : 'from-orange-500 to-orange-600'} text-white text-sm font-bold`}>
                {number}
              </div>
              <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Header Component
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-purple-500/20 shadow-lg">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Department Info */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-lg">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Mankar College</h1>
                <p className="text-sm text-purple-200">Department of Computer Science</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#home" className="text-purple-200 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="#features" className="text-purple-200 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#testimonials" className="text-purple-200 hover:text-white transition-colors">
              Testimonials
            </Link>
            <Link href="#contact" className="text-purple-200 hover:text-white transition-colors">
              Contact
            </Link>
            <Link href="/auth/register">
              <Button className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black px-6 py-2 rounded-lg font-semibold">
                Register Now
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white hover:text-purple-200 transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-purple-500/20">
            <nav className="flex flex-col gap-4">
              <Link href="#home" className="text-purple-200 hover:text-white transition-colors">
                Home
              </Link>
              <Link href="#features" className="text-purple-200 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#testimonials" className="text-purple-200 hover:text-white transition-colors">
                Testimonials
              </Link>
              <Link href="#contact" className="text-purple-200 hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/auth/register" className="mt-4">
                <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-black px-6 py-2 rounded-lg font-semibold">
                  Register Now
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

// Testimonial Component
function TestimonialCard({ name, role, company, content, rating, avatar, isLarge = false }: {
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar: string
  isLarge?: boolean
}) {
  return (
    <Card className={`bg-white/90 backdrop-blur-md border-purple-200/50 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 ${isLarge ? 'md:col-span-2' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {name.charAt(0)}
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {[...Array(rating)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-slate-700 mb-4 leading-relaxed">"{content}"</p>
            <div>
              <p className="font-semibold text-slate-800">{name}</p>
              <p className="text-sm text-slate-600">{role}, {company}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Testimonials Section
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Dr. Priya Sharma",
      role: "Professor",
      company: "IIT Delhi",
      content: "The MCCS-QUIZZARDS platform is incredibly well-designed and user-friendly. The questions are comprehensive and the real-time feedback system is excellent for student learning.",
      rating: 5,
      isLarge: true
    },
    {
      name: "Rajesh Kumar",
      role: "Student",
      company: "Jadavpur University",
      content: "Amazing experience! The quiz interface is smooth and the certificate generation feature is fantastic. Highly recommend to all students.",
      rating: 5
    },
    {
      name: "Dr. Anjali Singh",
      role: "HOD Computer Science",
      company: "Calcutta University",
      content: "Outstanding platform for academic competitions. The anti-cheating measures and professional UI make it a reliable choice for educational institutions.",
      rating: 5
    },
    {
      name: "Sourav Das",
      role: "Software Engineer",
      company: "TCS",
      content: "The quiz system is robust and the results are instant. Great work by the Mankar College team in creating such a professional platform.",
      rating: 5
    },
    {
      name: "Dr. Meera Patel",
      role: "Research Scholar",
      company: "ISI Kolkata",
      content: "Excellent user experience with comprehensive question coverage. The platform demonstrates high-quality software development practices.",
      rating: 5
    },
    {
      name: "Amit Verma",
      role: "Student",
      company: "VIT University",
      content: "The countdown timer and progress tracking features are very helpful. The overall design is modern and engaging.",
      rating: 5
    }
  ]

  return (
    <section id="testimonials" className="py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
            What People Say
          </h2>
          <p className="text-lg text-purple-200 max-w-2xl mx-auto">
            Hear from students, professors, and professionals who have experienced our quiz platform
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              role={testimonial.role}
              company={testimonial.company}
              content={testimonial.content}
              rating={testimonial.rating}
              avatar=""
              isLarge={testimonial.isLarge}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Header */}
      <Header />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl animate-float delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-48 h-48 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl animate-float delay-2000" />
        <div className="absolute bottom-40 right-1/3 w-36 h-36 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-full blur-2xl animate-float delay-3000" />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-full blur-xl animate-pulse-glow" />
      </div>

      {/* Main Quiz Announcement */}
      <section id="home" className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 pt-24">
        <CountdownTimer />
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
            Competition Features
          </h2>
          <p className="text-lg text-purple-200">
            What makes this quiz competition special
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={Timer}
            title="42-Hour Window"
            description="Flexible timing from 6 AM to 12 AM for maximum participation"
            color="border-purple-100"
          />
          <FeatureCard
            icon={Award}
            title="Certificates"
            description="Download certificates for 60%+ scores to showcase your achievement"
            color="border-indigo-100"
          />
          <FeatureCard
            icon={Zap}
            title="Instant Results"
            description="Get immediate feedback on your performance with detailed analytics"
            color="border-cyan-100"
          />
          <FeatureCard
            icon={Brain}
            title="Diverse Questions"
            description="Questions from General Knowledge, Literature, History and many more subjects"
            color="border-pink-100"
          />
        </div>
      </section>

      {/* How to Participate */}
      <section className="bg-gradient-to-r from-purple-800/20 via-indigo-800/20 to-cyan-800/20 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
              How to Participate
            </h2>
            <p className="text-lg text-purple-200 max-w-2xl mx-auto">
              Follow these simple steps to join the 5th National Level Quiz Competition
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <StepCard
              number={1}
              title="Log on to the Platform"
              description="Visit quiz.computersciencemancoll.in from 25th Oct 6:00AM to 26th Oct 11:59PM"
              icon={Globe}
              color="border-purple-100"
            />
            <StepCard
              number={2}
              title="Register Yourself"
              description="Create your account with valid credentials and complete your profile"
              icon={Users}
              color="border-indigo-100"
            />
            <StepCard
              number={3}
              title="Start the Quiz"
              description="On the dashboard, click start quiz to begin the single comprehensive quiz"
              icon={BookOpen}
              color="border-cyan-100"
            />
            <StepCard
              number={4}
              title="Complete the Quiz"
              description="Don't close the quiz window or change tabs before finishing to avoid auto-submission"
              icon={Shield}
              color="border-pink-100"
            />
            <StepCard
              number={5}
              title="Check Results"
              description="View your results from the result section on your dashboard after completion"
              icon={Trophy}
              color="border-rose-100"
            />
            <StepCard
              number={6}
              title="Download Certificate"
              description="Get your certificate from the result section if you score 60% or above marks"
              icon={Download}
              color="border-orange-100"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Department Showcase Section */}
      <section className="bg-gradient-to-r from-purple-800/20 via-indigo-800/20 to-cyan-800/20 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
              About Our Department
            </h2>
            <p className="text-lg text-purple-200 max-w-2xl mx-auto">
              Empowering students with cutting-edge computer science education and innovative learning experiences
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-white/90 backdrop-blur-md border-purple-200/50 shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl w-fit mx-auto mb-4">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Excellence in Education</h3>
                <p className="text-slate-600">Providing world-class computer science education with modern curriculum and experienced faculty.</p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-md border-purple-200/50 shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-xl w-fit mx-auto mb-4">
                  <Code className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Innovation & Technology</h3>
                <p className="text-slate-600">Embracing latest technologies and fostering innovation through hands-on learning experiences.</p>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-md border-purple-200/50 shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="p-3 bg-gradient-to-br from-green-600 to-teal-600 rounded-xl w-fit mx-auto mb-4">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Student Success</h3>
                <p className="text-slate-600">Committed to student success with comprehensive support and career guidance programs.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-purple-500/20 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
        <div className="container mx-auto px-4 py-12 sm:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Department Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-lg">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Mankar College</h3>
                  <p className="text-purple-200">Department of Computer Science</p>
                </div>
              </div>
              <p className="text-purple-200 mb-4 max-w-md">
                Empowering students with cutting-edge computer science education and fostering innovation through technology.
              </p>
              <div className="flex gap-4">
                <a href="#" className="p-2 bg-purple-600/20 rounded-lg hover:bg-purple-600/30 transition-colors">
                  <Facebook className="h-5 w-5 text-purple-200" />
                </a>
                <a href="#" className="p-2 bg-purple-600/20 rounded-lg hover:bg-purple-600/30 transition-colors">
                  <Twitter className="h-5 w-5 text-purple-200" />
                </a>
                <a href="#" className="p-2 bg-purple-600/20 rounded-lg hover:bg-purple-600/30 transition-colors">
                  <Instagram className="h-5 w-5 text-purple-200" />
                </a>
                <a href="#" className="p-2 bg-purple-600/20 rounded-lg hover:bg-purple-600/30 transition-colors">
                  <Linkedin className="h-5 w-5 text-purple-200" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="#home" className="text-purple-200 hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/know-more" className="text-purple-200 hover:text-white transition-colors">Know More</Link></li>
                <li><Link href="#testimonials" className="text-purple-200 hover:text-white transition-colors">Testimonials</Link></li>
                <li><Link href="/auth/register" className="text-purple-200 hover:text-white transition-colors">Register</Link></li>
                <li><Link href="/auth/login" className="text-purple-200 hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact Info</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-purple-400" />
                  <span className="text-purple-200 text-sm">Mankar, Purba Barddhaman<br />Pin - 713144, West Bengal</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-purple-400" />
                  <span className="text-purple-200 text-sm">+91 76998 76839</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-purple-400" />
                  <span className="text-purple-200 text-sm">support@computersciencemancoll.in</span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-purple-400" />
                  <a href="https://quiz.computersciencemancoll.in" className="text-purple-200 text-sm hover:text-white transition-colors flex items-center gap-1">
                    quiz.computersciencemancoll.in
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-purple-500/20 pt-8 text-center text-sm text-purple-300">
            <p>&copy; 2025 Mankar College - Department of Computer Science. All rights reserved.</p>
            <p className="mt-2">MCCS-QUIZZARDS 2025 - 5th National Level Quiz Competition</p>
          </div>
        </div>
      </footer>
    </div>
  )
}