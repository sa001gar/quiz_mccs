import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-6">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-30">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/40 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 px-6 py-2 text-sm font-bold shadow-sm backdrop-blur-md">
            <Sparkles className="mr-2 h-4 w-4" />
            MCCS-QUIZZARDS 2025
          </Badge>
        </div>

        <Card className="border-border/50 shadow-xl bg-card">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Mail className="h-10 w-10" />
            </div>
            <CardTitle className="font-heading text-3xl font-bold text-foreground">Check Your Email</CardTitle>
            <CardDescription className="text-lg mt-2">We&apos;ve sent you a confirmation link</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pt-6">
            <p className="text-center text-muted-foreground leading-relaxed">
              Please check your email and click the confirmation link to activate your account. Once confirmed, you can
              log in to access the quiz system.
            </p>
            <Link href="/auth/login" className="block">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-base font-medium shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                Back to Login
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
