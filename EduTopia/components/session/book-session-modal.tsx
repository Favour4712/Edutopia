"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SESSION_DURATIONS, SUBJECTS } from "@/lib/constants"
import { Calendar, Clock } from "lucide-react"

const bookSessionSchema = z.object({
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  duration: z.number().min(1, "Duration is required"),
  subject: z.string().min(1, "Subject is required"),
  description: z.string().optional(),
})

type BookSessionFormData = z.infer<typeof bookSessionSchema>

interface BookSessionModalProps {
  isOpen: boolean
  onClose: () => void
  tutor: {
    id: string
    name: string
    hourlyRate: number
  }
}

export function BookSessionModal({ isOpen, onClose, tutor }: BookSessionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedDuration, setSelectedDuration] = useState(1)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BookSessionFormData>({
    resolver: zodResolver(bookSessionSchema),
    defaultValues: {
      duration: 1,
    },
  })

  const duration = watch("duration")
  const totalCost = tutor.hourlyRate * (duration || 1)

  const onSubmit = async (data: BookSessionFormData) => {
    setIsSubmitting(true)
    try {
      // TODO: Implement smart contract call to create session
      console.log("Booking session:", { ...data, tutor: tutor.id })
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Book a Session with {tutor.name}</DialogTitle>
          <DialogDescription>Schedule a learning session and pay securely through escrow</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-2">Session Date</label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <Input type="date" {...register("date")} className="flex-1" />
            </div>
            {errors.date && <p className="text-sm text-destructive mt-1">{errors.date.message}</p>}
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium mb-2">Start Time</label>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <Input type="time" {...register("time")} className="flex-1" />
            </div>
            {errors.time && <p className="text-sm text-destructive mt-1">{errors.time.message}</p>}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium mb-2">Duration (hours)</label>
            <div className="grid grid-cols-2 gap-2">
              {SESSION_DURATIONS.map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => {
                    setSelectedDuration(dur)
                  }}
                  className={`py-2 rounded border transition-colors ${
                    selectedDuration === dur
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {dur}h
                </button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <select {...register("subject")} className="w-full px-3 py-2 rounded-md border border-border bg-background">
              <option value="">Select a subject</option>
              {SUBJECTS.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
            {errors.subject && <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>}
          </div>

          {/* Learning Objectives */}
          <div>
            <label className="block text-sm font-medium mb-2">Learning Objectives (optional)</label>
            <Textarea
              {...register("description")}
              placeholder="What would you like to learn in this session?"
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Cost Summary */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>
                  {tutor.hourlyRate} ETH/hr × {selectedDuration}h
                </span>
                <span className="font-medium">{totalCost.toFixed(4)} ETH</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-primary">
              {isSubmitting ? "Booking..." : "Book & Pay"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
