"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Home, 
  BookOpen, 
  Trophy, 
  BarChart3, 
  User,
  Menu,
  X
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Quizzes",
    href: "/dashboard/quizzes",
    icon: BookOpen,
  },
  {
    name: "Results",
    href: "/dashboard/results",
    icon: BarChart3,
  },
  {
    name: "Certificates",
    href: "/dashboard/certificates",
    icon: Trophy,
  },
]

export function StudentNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Desktop Navigation - Top */}
      <nav className="hidden lg:block bg-gradient-to-r from-purple-200/80 via-indigo-200/80 to-cyan-200/80 backdrop-blur-sm border-b border-purple-300/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg">
                <span className="text-lg font-bold">MC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">MCCS-QUIZZARDS 2025</h1>
                <p className="text-slate-600 text-sm">Student Portal</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      pathname === item.href
                        ? "bg-purple-600 text-white shadow-lg"
                        : "text-slate-600 hover:bg-purple-100 hover:text-slate-800"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom Fixed */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600/95 via-indigo-600/95 to-cyan-600/95 backdrop-blur-md border-t border-white/20 shadow-2xl">
        <div className="flex items-center justify-around py-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-0 flex-1",
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-purple-200 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "scale-110")} />
                <span className="text-xs font-medium truncate">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Mobile Header with Menu */}
      <div className="lg:hidden bg-gradient-to-r from-purple-200/80 via-indigo-200/80 to-cyan-200/80 backdrop-blur-sm border-b border-purple-300/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg">
              <span className="text-sm font-bold">MC</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">MCCS-QUIZZARDS</h1>
              <p className="text-slate-600 text-xs">Student Portal</p>
            </div>
          </div>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-slate-800 hover:bg-purple-100">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-gradient-to-br from-slate-100 via-purple-100 to-indigo-200 border-l border-purple-300/50">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg">
                    <span className="text-lg font-bold">MC</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">MCCS-QUIZZARDS 2025</h2>
                    <p className="text-slate-600 text-sm">Student Portal</p>
                  </div>
                </div>
                
                <div className="flex-1 space-y-2">
                  {navigationItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                          pathname === item.href
                            ? "bg-purple-600 text-white shadow-lg"
                            : "text-slate-600 hover:bg-purple-100 hover:text-slate-800"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
                
                <div className="pt-4 border-t border-purple-300/50">
                  <div className="text-center">
                    <p className="text-slate-600 text-sm">5th National Level Quiz Competition</p>
                    <p className="text-slate-500 text-xs">October 25-26, 2025</p>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  )
}