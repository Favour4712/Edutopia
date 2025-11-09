"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle } from "lucide-react"

interface RaiseDisputeButtonProps {
  sessionId: string
  tutorName: string
}

const DISPUTE_REASONS = ["Quality Issues", "No-show", "Technical Problems", "Incomplete Session", "Other"]

export function RaiseDisputeButton({ sessionId, tutorName }: RaiseDisputeButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [evidence, setEvidence] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // TODO: Call smart contract to raise dispute
      console.log("Raising dispute:", { sessionId, reason, evidence })
      setIsOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        className="border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
        onClick={() => setIsOpen(true)}
      >
        <AlertCircle className="w-4 h-4 mr-2" />
        Raise Dispute
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Raise a Dispute</DialogTitle>
            <DialogDescription>
              Explain the issue with your session with {tutorName}. Our team will review and resolve it fairly.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Reason */}
            <div>
              <label className="block text-sm font-medium mb-3">Reason for Dispute</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-border bg-background"
              >
                <option value="">Select a reason</option>
                {DISPUTE_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Evidence */}
            <div>
              <label className="block text-sm font-medium mb-2">Description & Evidence</label>
              <Textarea
                placeholder="Provide detailed information about the issue and any evidence..."
                value={evidence}
                onChange={(e) => setEvidence(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Warning */}
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">
                Disputes are reviewed by our team. False claims may result in penalties. Be honest and provide relevant
                evidence.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!reason || !evidence || isSubmitting}
                className="flex-1 bg-destructive"
              >
                {isSubmitting ? "Submitting..." : "Submit Dispute"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
