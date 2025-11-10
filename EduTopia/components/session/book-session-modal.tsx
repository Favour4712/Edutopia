"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { SESSION_DURATIONS, SUBJECTS } from "@/lib/constants"
import { Calendar, Clock, Loader2, ShieldCheck } from "lucide-react"
import { useAccount } from "wagmi"

import { useToast } from "@/hooks/use-toast"
import {
  useBookSession,
  type TutorDirectoryEntry,
} from "@/lib/web3/hooks"
import {
  useUsdcAllowance,
  useUsdcApprove,
  useUsdcBalance,
} from "@/lib/web3/hooks/use-usdc"
import { sessionEscrowContract } from "@/lib/web3/contracts"
import { formatUsdc, toUsdcUnits, truncateHash } from "@/lib/web3/utils"

const bookSessionSchema = z.object({
  date: z.string().optional(),
  time: z.string().optional(),
  duration: z.number().min(1, "Duration is required"),
  subject: z.string().min(1, "Subject is required"),
  description: z.string().optional(),
})

type BookSessionFormData = z.infer<typeof bookSessionSchema>

interface BookSessionModalProps {
  isOpen: boolean
  onClose: () => void
  tutor: {
    data: TutorDirectoryEntry
    name?: string
    bio?: string
  }
}

export function BookSessionModal({ isOpen, onClose, tutor }: BookSessionModalProps) {
  const [selectedDuration, setSelectedDuration] = useState(SESSION_DURATIONS[0])
  const { address, isConnected } = useAccount()
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset: resetForm,
  } = useForm<BookSessionFormData>({
    resolver: zodResolver(bookSessionSchema),
    defaultValues: {
      duration: SESSION_DURATIONS[0],
      subject: tutor.data.subjects[0] ?? "",
    },
  })

  const duration = watch("duration") ?? selectedDuration

  const totalCost = useMemo(() => {
    return tutor.data.hourlyRate * duration
  }, [tutor.data.hourlyRate, duration])

  const usdcBalance = useUsdcBalance(address)
  const allowance = useUsdcAllowance(sessionEscrowContract.address)
  const {
    approve,
    transactionHash: approveHash,
    isSubmitting: isApproving,
    isConfirming: isApproveConfirming,
    isConfirmed: isApproveConfirmed,
    error: approveError,
    reset: resetApprove,
  } = useUsdcApprove(sessionEscrowContract.address)

  const {
    bookSession,
    transactionHash,
    isSubmitting,
    isConfirming,
    isConfirmed,
    error,
    reset,
  } = useBookSession()

  const allowanceEnough = useMemo(() => {
    const currentAllowance = allowance.data ?? 0n
    return currentAllowance >= toUsdcUnits(totalCost)
  }, [allowance.data, totalCost])

  const balanceEnough = useMemo(() => {
    const balance = usdcBalance.data ?? 0n
    return balance >= toUsdcUnits(totalCost)
  }, [usdcBalance.data, totalCost])

  const isProcessing = isSubmitting || isConfirming
  const needsApproval = !allowanceEnough && totalCost > 0

  const onSubmit = useCallback(
    async (data: BookSessionFormData) => {
      if (!isConnected || !address) {
        toast({
          title: "Connect wallet",
          description: "Please connect your wallet to book a session.",
        })
        return
      }

      if (!balanceEnough) {
        toast({
          title: "Insufficient USDC",
          description: "Top up your wallet from the faucet before booking.",
          variant: "destructive",
        })
        return
      }

      if (needsApproval) {
        toast({
          title: "USDC approval required",
          description: "Approve the escrow contract before booking.",
        })
        return
      }

      const descriptionWithSchedule = [
        data.description?.trim(),
        data.date ? `Preferred date: ${data.date}` : undefined,
        data.time ? `Preferred time: ${data.time}` : undefined,
      ]
        .filter(Boolean)
        .join(" • ")

      await bookSession({
        tutor: tutor.data.address,
        durationHours: duration,
        subject: data.subject,
        description: descriptionWithSchedule,
      })
    },
    [
      address,
      balanceEnough,
      bookSession,
      duration,
      isConnected,
      needsApproval,
      toast,
      tutor.data.address,
    ],
  )

  const handleApprove = useCallback(async () => {
    try {
      await approve(toUsdcUnits(totalCost))
    } catch (err) {
      console.error(err)
    }
  }, [approve, totalCost])

  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Session booked",
        description: transactionHash
          ? `Transaction: ${truncateHash(transactionHash)}`
          : "Your tutoring session is confirmed on-chain.",
      })
      allowance.refetch?.()
      reset()
      resetForm()
      onClose()
    }
  }, [isConfirmed, transactionHash, toast, allowance, reset, onClose, resetForm])

  useEffect(() => {
    if (error) {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      })
      reset()
    }
  }, [error, toast, reset])

  useEffect(() => {
    if (isApproveConfirmed) {
      toast({
        title: "USDC approved",
        description: approveHash
          ? `Transaction: ${truncateHash(approveHash)}`
          : "Escrow contract can now transfer your USDC.",
      })
      allowance.refetch?.()
      resetApprove()
    }
  }, [isApproveConfirmed, approveHash, toast, allowance, resetApprove])

  useEffect(() => {
    if (approveError) {
      toast({
        title: "Approval failed",
        description: approveError.message,
        variant: "destructive",
      })
      resetApprove()
    }
  }, [approveError, toast, resetApprove])

  useEffect(() => {
    setValue("duration", selectedDuration)
  }, [selectedDuration, setValue])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Book a Session with {tutor.name}</DialogTitle>
          <DialogDescription>Secure payment using Mock USDC on Base Sepolia</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-2">Preferred Date</label>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <Input type="date" {...register("date")} className="flex-1" />
            </div>
            {errors.date && <p className="text-sm text-destructive mt-1">{errors.date.message}</p>}
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium mb-2">Preferred Time</label>
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
              {tutor.data.subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
              {SUBJECTS.filter((subject) => !tutor.data.subjects.includes(subject)).map((subject) => (
                <option key={`global-${subject}`} value={subject}>
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
              placeholder="Share learning goals or context for the tutor."
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Cost Summary */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border space-y-3 text-sm">
            <div className="flex justify-between">
              <span>
                {tutor.data.hourlyRate.toFixed(2)} USDC/hr × {selectedDuration}h
              </span>
              <span className="font-semibold">{totalCost.toFixed(2)} USDC</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Your balance</span>
              <span>{formatUsdc(usdcBalance.data)}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4" />
              Payments are held in escrow until the tutor completes the session.
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            {needsApproval ? (
              <Button
                type="button"
                onClick={handleApprove}
                disabled={isApproving || isApproveConfirming}
                className="flex-1 bg-secondary text-secondary-foreground"
              >
                {isApproving || isApproveConfirming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Approving…
                  </>
                ) : (
                  "Approve USDC"
                )}
              </Button>
            ) : (
              <Button type="submit" disabled={isProcessing} className="flex-1 bg-primary">
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Confirming…
                  </>
                ) : (
                  "Book & Pay"
                )}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
