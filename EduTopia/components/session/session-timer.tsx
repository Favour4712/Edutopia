"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

interface SessionTimerProps {
  startTime: number // Unix timestamp
  duration: number // In seconds
  onSessionEnd?: () => void
}

export function SessionTimer({ startTime, duration, onSessionEnd }: SessionTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now() / 1000
      const remaining = Math.max(0, startTime + duration - now)
      setTimeRemaining(Math.floor(remaining))
      setIsActive(remaining > 0)

      if (remaining <= 0) {
        clearInterval(interval)
        onSessionEnd?.()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime, duration, onSessionEnd])

  const hours = Math.floor(timeRemaining / 3600)
  const minutes = Math.floor((timeRemaining % 3600) / 60)
  const seconds = timeRemaining % 60

  const formatTime = (h: number, m: number, s: number) => {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }

  return (
    <div
      className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 ${
        isActive ? "border-success/50 bg-success/10" : "border-destructive/50 bg-destructive/10"
      }`}
    >
      <Clock className={`w-5 h-5 ${isActive ? "text-success" : "text-destructive"}`} />
      <span className={`font-mono font-bold text-lg ${isActive ? "text-success" : "text-destructive"}`}>
        {formatTime(hours, minutes, seconds)}
      </span>
      {!isActive && <span className="ml-auto text-sm font-medium text-destructive">Session Ended</span>}
    </div>
  )
}
