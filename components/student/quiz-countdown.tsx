"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface QuizCountdownProps {
  scheduledStart: string
  scheduledEnd?: string | null
}

export function QuizCountdown({ scheduledStart, scheduledEnd }: QuizCountdownProps) {
  const [timeUntilStart, setTimeUntilStart] = useState<string>("")
  const [isAvailable, setIsAvailable] = useState(false)
  const [hasEnded, setHasEnded] = useState(false)

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime()
      const start = new Date(scheduledStart).getTime()
      const end = scheduledEnd ? new Date(scheduledEnd).getTime() : null

      // Check if quiz has ended
      if (end && now > end) {
        setHasEnded(true)
        setIsAvailable(false)
        return
      }

      // Check if quiz is available
      if (now >= start) {
        setIsAvailable(true)
        setTimeUntilStart("")
        return
      }

      // Calculate time until start
      const distance = start - now

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      let timeString = ""
      if (days > 0) {
        timeString = `${days}d ${hours}h ${minutes}m ${seconds}s`
      } else if (hours > 0) {
        timeString = `${hours}h ${minutes}m ${seconds}s`
      } else if (minutes > 0) {
        timeString = `${minutes}m ${seconds}s`
      } else {
        timeString = `${seconds}s`
      }

      setTimeUntilStart(timeString)
      setIsAvailable(false)
    }

    calculateTime()
    const interval = setInterval(calculateTime, 1000)

    return () => clearInterval(interval)
  }, [scheduledStart, scheduledEnd])

  if (hasEnded) {
    return (
      <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
        <CardContent className="flex items-center gap-3 pt-6">
          <Clock className="h-5 w-5 text-red-600 dark:text-red-400" />
          <div>
            <p className="font-medium text-red-900 dark:text-red-100">Quiz Has Ended</p>
            <p className="text-sm text-red-800 dark:text-red-200">
              This quiz is no longer available. The deadline has passed.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isAvailable) {
    return (
      <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
        <CardContent className="flex items-center gap-3 pt-6">
          <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
          <div>
            <p className="font-medium text-green-900 dark:text-green-100">Quiz is Now Available</p>
            <p className="text-sm text-green-800 dark:text-green-200">
              {scheduledEnd
                ? `You can start the quiz now. Closes on ${new Date(scheduledEnd).toLocaleString()}`
                : "You can start the quiz now"}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
      <CardContent className="flex items-center gap-3 pt-6">
        <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <div className="flex-1">
          <p className="font-medium text-blue-900 dark:text-blue-100">Quiz Starts In</p>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">{timeUntilStart}</p>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Scheduled for {new Date(scheduledStart).toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
