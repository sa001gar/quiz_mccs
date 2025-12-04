"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Home,
  BookOpen,
  Trophy,
  BarChart3,
  Menu,
  Sparkles
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"

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
      <nav className="hidden lg:block bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
                <span className="text-lg font-bold font-heading">MC</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground font-heading">MCCS-QUIZZARDS <span className="text-primary">2025</span></h1>
                <p className="text-muted-foreground text-sm">Student Portal</p>
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
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
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
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border/50 shadow-2xl pb-safe">
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
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className={cn("p-1.5 rounded-lg transition-all", isActive ? "bg-primary/10" : "")}>
                  <Icon className={cn("h-5 w-5", isActive && "scale-110")} />
                </div>
                <span className={cn("text-[10px] font-medium truncate", isActive ? "font-bold" : "")}>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Mobile Header with Menu */}
      <div className="lg:hidden bg-background/80 backdrop-blur-md border-b border-border/50 p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-sm">
              <span className="text-sm font-bold font-heading">MC</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground font-heading">MCCS-QUIZZARDS</h1>
              <p className="text-muted-foreground text-xs">Student Portal</p>
            </div>
          </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="text-foreground hover:bg-secondary">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-l border-border/50 w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-3 mb-8 mt-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-sm">
                    <span className="text-xl font-bold font-heading">MC</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground font-heading">MCCS-QUIZZARDS</h2>
                    <p className="text-muted-foreground text-sm">Student Portal</p>
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
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>

                <div className="pt-6 border-t border-border/50">
                  <div className="text-center">
                    <Badge className="mb-3 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                      <Sparkles className="mr-1 h-3 w-3" />
                      5th National Level
                    </Badge>
                    <p className="text-foreground text-sm font-medium">Quiz Competition</p>
                    <p className="text-muted-foreground text-xs mt-1">October 25-26, 2025</p>
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