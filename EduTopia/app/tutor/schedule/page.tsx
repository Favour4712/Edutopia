"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus } from "lucide-react"

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const TIME_SLOTS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"]

export default function SchedulePage() {
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const [showRecurring, setShowRecurring] = useState(true)

  const toggleSlot = (day: string, time: string) => {
    const slot = `${day}-${time}`
    setSelectedSlots((prev) => (prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]))
  }

  return (
    <div className="w-full p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Your Schedule</h1>
        <p className="text-muted-foreground">Set your availability for students to book sessions</p>
      </div>

      {/* Recurring Toggle */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Recurring Weekly Schedule</h3>
            <p className="text-sm text-muted-foreground">These hours will repeat every week</p>
          </div>
          <Checkbox checked={showRecurring} onCheckedChange={setShowRecurring} />
        </div>
      </Card>

      {/* Schedule Grid */}
      {showRecurring && (
        <Card className="p-6 mb-6 overflow-x-auto">
          <div className="min-w-full">
            {/* Header */}
            <div className="grid grid-cols-[100px_repeat(7,1fr)] gap-2 mb-4">
              <div className="font-semibold text-sm">Time</div>
              {DAYS.map((day) => (
                <div key={day} className="font-semibold text-sm text-center">
                  {day.slice(0, 3)}
                </div>
              ))}
            </div>

            {/* Time Slots */}
            <div className="space-y-2">
              {TIME_SLOTS.map((time) => (
                <div key={time} className="grid grid-cols-[100px_repeat(7,1fr)] gap-2">
                  <div className="text-sm font-mono text-muted-foreground text-center py-2">{time}</div>
                  {DAYS.map((day) => (
                    <button
                      key={`${day}-${time}`}
                      onClick={() => toggleSlot(day, time)}
                      className={`p-3 rounded border-2 transition-all ${
                        selectedSlots.includes(`${day}-${time}`)
                          ? "border-secondary bg-secondary/10"
                          : "border-border hover:border-secondary/50"
                      }`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Button asChild variant="outline" className="flex-1 bg-transparent">
          <a href="/tutor">Cancel</a>
        </Button>
        <Button className="flex-1 bg-secondary">
          <Plus className="w-4 h-4 mr-2" />
          Save Schedule
        </Button>
      </div>
    </div>
  )
}
