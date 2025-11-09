"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2 } from "lucide-react"

interface CompleteSessionButtonProps {
  sessionId: string
  tutorName: string
  onComplete?: () => void
}

export function CompleteSessionButton({ sessionId, tutorName, onComplete }: CompleteSessionButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [rating, setRating] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // TODO: Call smart contract to complete session
      console.log("Completing session:", { sessionId, feedback, rating })
      setIsOpen(false)
      onComplete?.()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="bg-success text-success-foreground">
        <CheckCircle2 className="w-4 h-4 mr-2" />
        Complete Session
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Session</DialogTitle>
            <DialogDescription>Mark this session as complete and leave feedback for {tutorName}</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-3">How would you rate this session?</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`px-4 py-2 rounded font-medium transition-colors ${
                      star <= rating ? "bg-accent text-accent-foreground" : "bg-muted hover:bg-muted/80"
                    }`}
                  >
                    {star}★
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback */}
            <div>
              <label className="block text-sm font-medium mb-2">Feedback (optional)</label>
              <Textarea
                placeholder="Share your experience with this tutor..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 bg-success">
                {isSubmitting ? "Completing..." : "Complete & Pay Tutor"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
