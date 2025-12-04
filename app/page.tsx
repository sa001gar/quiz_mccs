"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Clock,
  Sparkles,
  Users,
  Zap,
  Brain,
  Shield,
  Globe,
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ChevronRight,
  Monitor,
  CheckCircle,
  FileCheck,
  Percent,
  ArrowRight,
  Code2,
  Cpu,
  Layers,
  Database,
  HelpCircle,
  ChevronDown
} from "lucide-react"

// --- SUB-COMPONENTS ---

// 1. Infinite Topic Ticker (Marquee Effect)
function TopicTicker() {
  const topics = [
    "Literature", "Geopolitics", "History", "Philosophy", "Environment",
    "Arts", "Sociology", "Psychology", "Economics", "Anthropology",
    "Linguistics", "Archaeology", "Geography", "Political Science", "Ethics",
    "Mythology", "Folklore", "Religion", "Societal Trends", "Current Events"
  ]

  return (
    <div className="w-full bg-indigo-900 border-y border-indigo-800 overflow-hidden py-3 relative z-20">
      <div className="flex animate-scroll whitespace-nowrap gap-8">
        {[...topics, ...topics].map((topic, i) => (
          <div key={i} className="flex items-center gap-2 text-indigo-200 text-sm font-mono uppercase tracking-widest">
            <Sparkles className="h-3 w-3 text-fuchsia-400" />
            {topic}
          </div>
        ))}
      </div>
      <style jsx>{`
        .animate-scroll { animation: scroll 30s linear infinite; }
        @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </div>
  )
}

// 2. Countdown Timer
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    // UPDATED DATE
    const targetDate = new Date("2025-12-15T06:00:00+05:30")

    const updateTimer = () => {
      const now = new Date().getTime()
      const difference = targetDate.getTime() - now
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      }
    }
    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl w-full max-w-7xl mx-auto">
      {/* Decorative Gradients */}
      <div className="absolute -top-32 -right-32 w-64 md:w-96 h-64 md:h-96 bg-fuchsia-500/20 rounded-full blur-[80px]" />
      <div className="absolute -bottom-32 -left-32 w-64 md:w-96 h-64 md:h-96 bg-indigo-500/20 rounded-full blur-[80px]" />

      <div className="relative z-10 flex flex-col items-center text-center">
        <Badge className="mb-6 md:mb-8 bg-gradient-to-r from-indigo-500 to-fuchsia-600 text-white hover:brightness-110 border-0 px-4 py-1 md:px-6 md:py-2 text-xs md:text-sm font-bold shadow-lg shadow-indigo-500/20 rounded-full uppercase tracking-wider">
          <Sparkles className="mr-2 h-3 w-3 md:h-4 md:w-4 text-yellow-300" />
          5th National Level Event
        </Badge>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-4 drop-shadow-xl leading-none">
          MCCS<span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-amber-300">-QUIZZARDS</span>
        </h1>

        <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3 mb-8 md:mb-12 text-indigo-100/90 font-medium text-sm md:text-xl border border-white/10 bg-black/20 px-4 py-2 md:px-6 md:py-3 rounded-full backdrop-blur-md">
          <GraduationCap className="hidden md:block md:h-6 md:w-6 text-fuchsia-400" />
          <span>Department of Computer Science, Mankar College</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 w-full max-w-4xl mb-8 md:mb-12">
          {[
            { label: "Days", value: timeLeft.days },
            { label: "Hours", value: timeLeft.hours },
            { label: "Minutes", value: timeLeft.minutes },
            { label: "Seconds", value: timeLeft.seconds },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center justify-center bg-black/20 border border-white/10 rounded-2xl p-3 md:p-6 backdrop-blur-md hover:bg-white/5 transition-colors">
              <span className="text-3xl md:text-6xl font-black text-white font-mono tracking-tight">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-[10px] md:text-sm font-bold text-indigo-200 uppercase tracking-widest mt-1 md:mt-2">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0">
          <Link href="/auth/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto h-12 md:h-14 px-8 md:px-10 text-base md:text-lg rounded-xl md:rounded-2xl bg-white text-indigo-900 hover:bg-indigo-50 font-extrabold shadow-[0_0_30px_-5px_rgba(255,255,255,0.4)] hover:scale-105 transition-all duration-300">
              <Users className="mr-2 h-5 w-5" />
              Register Now
            </Button>
          </Link>
          <Link href="#certification" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 md:h-14 px-8 md:px-10 text-base md:text-lg rounded-xl md:rounded-2xl border-white/30 text-white bg-transparent hover:bg-white/10 font-bold backdrop-blur-md transition-all duration-300">
              <FileCheck className="mr-2 h-5 w-5" />
              Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

// 3. Syllabus Card
function SyllabusCard({ icon: Icon, title, topics, color }: { icon: any, title: string, topics: string[], color: string }) {
  const styles: Record<string, string> = {
    indigo: "border-indigo-200 bg-indigo-50 hover:border-indigo-500",
    fuchsia: "border-fuchsia-200 bg-fuchsia-50 hover:border-fuchsia-500",
    amber: "border-amber-200 bg-amber-50 hover:border-amber-500",
  }
  const iconColor: Record<string, string> = {
    indigo: "bg-indigo-600 text-white",
    fuchsia: "bg-fuchsia-600 text-white",
    amber: "bg-amber-600 text-white",
  }

  return (
    <div className={`p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${styles[color]}`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-md ${iconColor[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-4">{title}</h3>
      <ul className="space-y-2">
        {topics.map((t, i) => (
          <li key={i} className="flex items-center gap-2 text-slate-600 text-sm md:text-base font-medium">
            <div className={`w-1.5 h-1.5 rounded-full ${color === 'indigo' ? 'bg-indigo-400' : color === 'fuchsia' ? 'bg-fuchsia-400' : 'bg-amber-400'}`} />
            {t}
          </li>
        ))}
      </ul>
    </div>
  )
}

// 4. FAQ Item
function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div className="border border-slate-800 rounded-xl bg-slate-900/50 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left text-slate-100 hover:bg-slate-800/50 transition-colors"
      >
        <span className="font-semibold text-lg">{question}</span>
        <ChevronDown className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-5 pt-0 text-slate-400 leading-relaxed border-t border-slate-800/50">
          {answer}
        </div>
      </div>
    </div>
  )
}

// --- MAIN PAGE SECTIONS ---

// Header
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = ['Home', 'About', 'Topics', 'Certification', 'Guide']

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-2 bg-slate-950/90 backdrop-blur-xl border-b border-white/10 shadow-lg' : 'py-4 md:py-6 bg-transparent'}`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="p-2 md:p-2.5 bg-gradient-to-br from-fuchsia-500 to-indigo-600 rounded-xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
              <GraduationCap className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg md:text-xl text-white tracking-tight leading-none">Mankar College</h1>
              <p className="text-indigo-200 text-[10px] md:text-xs font-semibold tracking-wide hidden sm:block">Computer Science Dept.</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-md">
            {navItems.map((item) => (
              <Link key={item} href={`#${item.toLowerCase()}`} className="px-5 py-2 rounded-full text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white transition-all">
                {item}
              </Link>
            ))}
            <Link href="/auth/register">
              <Button className="rounded-full px-6 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold ml-2 shadow-lg shadow-fuchsia-500/20">
                Register
              </Button>
            </Link>
          </nav>

          {/* Mobile Toggle */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white p-2 bg-white/10 rounded-lg">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-slate-950 border-b border-white/10 p-4 flex flex-col gap-2 shadow-2xl md:hidden animate-in slide-in-from-top-5">
          {navItems.map((item) => (
            <Link key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMenuOpen(false)} className="p-4 rounded-xl text-white font-semibold hover:bg-white/5 flex justify-between items-center">
              {item}
              <ChevronRight size={16} className="text-slate-600" />
            </Link>
          ))}
          <Link href="/auth/register" onClick={() => setIsMenuOpen(false)}>
            <Button className="w-full mt-2 bg-fuchsia-600 font-bold h-12">Register Now</Button>
          </Link>
        </div>
      )}
    </header>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-fuchsia-500/30 selection:text-fuchsia-900 overflow-x-hidden font-sans scroll-smooth">
      <Header />

      {/* HERO SECTION */}
      <section id="home" className="relative min-h-[90vh] md:min-h-screen pt-28 pb-20 flex flex-col items-center justify-center overflow-hidden bg-[#0F172A]">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#0F172A] to-[#0F172A]" />
          <svg className="absolute inset-0 w-full h-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="white" strokeWidth="1" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 w-full">
          <CountdownTimer />
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 animate-bounce hidden md:block">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest">Scroll Down</span>
            <ChevronDown />
          </div>
        </div>
      </section>

      <TopicTicker />

      {/* ABOUT SECTION (New) */}
      <section id="about" className="py-20 md:py-32 bg-white relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-6 border-fuchsia-200 text-fuchsia-700 bg-fuchsia-50 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide">
                About The Event
              </Badge>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 leading-tight">
                Igniting the <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-indigo-600">Tech Spark</span>
              </h2>
              <p className="text-lg md:text-xl text-slate-600 mb-6 leading-relaxed">
                MCCS-QUIZZARDS is not just a quiz; it is a celebration of logic, code, and innovation. Organized by the Department of Computer Science, this national-level event aims to bring together the brightest minds to test their technical mettle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Users className="text-fuchsia-600 h-6 w-6" />
                  <div>
                    <div className="font-bold text-slate-900">Open For All</div>
                    <div className="text-sm text-slate-500">UG/PG Students</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Monitor className="text-indigo-600 h-6 w-6" />
                  <div>
                    <div className="font-bold text-slate-900">Virtual Mode</div>
                    <div className="text-sm text-slate-500">Participate from anywhere</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Representation of Code */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-indigo-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl">
                <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-4 text-xs font-mono text-slate-500">quiz_logic.py</span>
                </div>
                <div className="font-mono text-sm md:text-base space-y-2 text-slate-300">
                  <p><span className="text-fuchsia-400">class</span> <span className="text-yellow-300">Quizzard</span>:</p>
                  <p className="pl-4"><span className="text-indigo-400">def</span> <span className="text-blue-300">__init__</span>(self, participant):</p>
                  <p className="pl-8">self.participant = participant</p>
                  <p className="pl-8">self.skills = [<span className="text-green-400">"Logic"</span>, <span className="text-green-400">"Code"</span>]</p>
                  <br />
                  <p className="pl-4"><span className="text-indigo-400">def</span> <span className="text-blue-300">evaluate</span>(self):</p>
                  <p className="pl-8"><span className="text-fuchsia-400">if</span> self.score {'>'} 60:</p>
                  <p className="pl-12"><span className="text-fuchsia-400">return</span> <span className="text-green-400">"Certified Excellence"</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SYLLABUS / TOPICS SECTION (New) */}
      <section id="topics" className="py-20 md:py-32 bg-slate-50 border-y border-slate-200">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <Badge variant="outline" className="mb-4 border-indigo-200 text-indigo-700 bg-indigo-50 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide">
              The Challenge
            </Badge>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">
              What to <span className="text-indigo-600">Expect?</span>
            </h2>
            <p className="text-slate-600 text-lg">
              The quiz is designed to test holistic computer science knowledge.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <SyllabusCard
              icon={Brain}
              title="Core Logic & Aptitude"
              topics={["Pattern Recognition", "Logical Reasoning", "Data Interpretation", "Computational Thinking"]}
              color="indigo"
            />
            <SyllabusCard
              icon={Code2}
              title="Programming Concepts"
              topics={["C/C++ / Python Syntax", "Object Oriented Programming", "Data Structures", "Algorithm Analysis"]}
              color="fuchsia"
            />
            <SyllabusCard
              icon={Cpu}
              title="Technical GK & Trends"
              topics={["Current Tech Trends", "AI & ML Basics", "Computer Hardware", "Famous Tech Personalities"]}
              color="amber"
            />
          </div>
        </div>
      </section>

      {/* CERTIFICATION SECTION */}
      <section id="certification" className="py-20 md:py-32 bg-[#0F172A] relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Visual Side */}
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[2.5rem] blur-lg opacity-30" />
              <div className="relative bg-slate-900 border border-slate-700 rounded-[2rem] p-6 md:p-12 overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
                {/* Mock Certificate Visual */}
                <div className="flex flex-col items-center text-center border-4 border-double border-slate-700 p-6 md:p-10 rounded-xl bg-slate-800/50">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20">
                    <FileCheck className="h-8 w-8 md:h-10 md:w-10 text-amber-600" />
                  </div>
                  <h3 className="text-xl md:text-3xl font-serif text-amber-100 mb-2">Certificate of Achievement</h3>
                  <p className="text-slate-400 mb-6 md:mb-8 text-sm md:text-base">Presented to <span className="text-white font-bold border-b border-slate-600 pb-1">You</span></p>
                  <div className="w-full bg-slate-700/50 rounded-full h-12 md:h-14 flex items-center justify-between px-6 mb-4">
                    <span className="text-slate-300 font-mono text-xs md:text-sm tracking-widest">CRITERIA</span>
                    <span className="text-emerald-400 font-bold font-mono text-lg md:text-2xl">&gt; 60%</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest">Verified by Mankar College</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="order-1 lg:order-2">
              <Badge className="mb-6 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 font-bold uppercase tracking-wide">
                Certification Criteria
              </Badge>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                Earn Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">National Level</span> Credential
              </h2>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                Recognition is key to professional growth. Every participant who demonstrates proficiency by clearing the qualifying threshold will be awarded a verifiable E-Certificate.
              </p>

              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-1 shrink-0">
                    <Percent className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">Score Above 60%</h4>
                    <p className="text-slate-400">You must secure a minimum score of 60% in the quiz to automatically qualify for the certificate.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-1 shrink-0">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-1">Instant Generation</h4>
                    <p className="text-slate-400">Qualified participants can download their certificate instantly from the dashboard upon submission.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION (New) */}
      <section id="faq" className="py-20 md:py-32 bg-[#0B1120] border-t border-white/5">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-400">Everything you need to know about MCCS-QUIZZARDS</p>
          </div>

          <div className="space-y-4">
            <FAQItem
              question="Is there a registration fee?"
              answer="No, MCCS-QUIZZARDS is completely free for all students. Our goal is to promote technical learning."
            />
            <FAQItem
              question="Who is eligible to participate?"
              answer="Any student currently pursuing an undergraduate or postgraduate degree in any stream (B.Tech, BCA, B.Sc, MCA, etc.) can participate."
            />
            <FAQItem
              question="Can I take the quiz on my mobile?"
              answer="Yes! The platform is fully responsive and optimized for mobile devices, tablets, and desktops."
            />
            <FAQItem
              question="What happens if my internet disconnects?"
              answer="Don't worry. Your answers are auto-saved. You can resume exactly where you left off within the allotted time window."
            />
          </div>
        </div>
      </section>

      {/* GUIDE SECTION */}
      <section id="guide" className="py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">

            {/* Left Content */}
            <div className="lg:w-1/3 text-center lg:text-left">
              <Badge className="mb-6 bg-fuchsia-100 text-fuchsia-700 hover:bg-fuchsia-200 border-none px-4 py-1.5 font-bold">Process</Badge>
              <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">
                Simple Steps to <br /><span className="text-fuchsia-600">Get Certified</span>
              </h2>
              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                We have kept the process frictionless so you can focus entirely on your preparation.
              </p>
              <Link href="/auth/register">
                <Button size="lg" className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 shadow-xl w-full sm:w-auto">
                  Start Registration <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Right Steps Grid */}
            <div className="lg:w-2/3 grid sm:grid-cols-2 gap-6 w-full">
              {[
                { n: "01", t: "Register", d: "Create account with valid college ID.", i: Users },
                { n: "02", t: "Log In", d: "Access dashboard on Dec 15.", i: Globe },
                { n: "03", t: "Compete", d: "Answer questions & cross 60%.", i: Zap },
                { n: "04", t: "Download", d: "Get your certificate instantly.", i: FileCheck },
              ].map((step, idx) => (
                <div key={idx} className="flex gap-5 p-6 rounded-2xl border border-slate-100 bg-white shadow-lg shadow-slate-200/50 hover:shadow-xl hover:border-indigo-100 transition-all">
                  <div className="flex-shrink-0">
                    <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-lg border border-indigo-100">
                      {step.n}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-800 mb-1">{step.t}</h4>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-slate-950 text-slate-300 pt-24 pb-8 border-t border-slate-900">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-600 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">Mankar College</span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-8 max-w-sm text-sm">
                Empowering the next generation of tech leaders through innovation, competition, and academic excellence.
              </p>
              <div className="flex gap-4">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" className="p-3 bg-slate-900 rounded-full hover:bg-indigo-600 hover:text-white transition-all duration-300 border border-slate-800">
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-6">Quick Links</h4>
              <ul className="space-y-4 text-sm">
                {['Home', 'About', 'Topics', 'Certification', 'Register'].map((item) => (
                  <li key={item}>
                    <Link href={`#${item.toLowerCase()}`} className="hover:text-fuchsia-400 transition-colors flex items-center gap-2">
                      <ChevronRight className="h-3 w-3" /> {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-6">Contact Us</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-indigo-500 mt-1 shrink-0" />
                  <span>Mankar, Purba Barddhaman<br />West Bengal, 713144</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-indigo-500 shrink-0" />
                  <span>+91 76998 76839</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-indigo-500 shrink-0" />
                  <span>deptcs@mankarcollege.ac.in</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-900 pt-8 text-center text-xs md:text-sm text-slate-600">
            <p>&copy; 2025 Mankar College Department of Computer Science. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}