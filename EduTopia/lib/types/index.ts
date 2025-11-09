import type { Address } from "viem"

// Session Types
export interface Session {
  id: string
  student: Address
  tutor: Address
  amount: bigint
  startTime: number
  duration: number
  status: "Pending" | "Active" | "Completed" | "Disputed" | "Cancelled" | "Refunded"
  completedAt?: number
  paymentReleased: boolean
  subject: string
  description: string
}

// Tutor Profile
export interface TutorProfile {
  address: Address
  isRegistered: boolean
  subjects: string[]
  hourlyRate: bigint
  totalSessions: number
  averageRating: number
  ratingCount: number
  bio?: string
}

// Dispute
export interface Dispute {
  id: string
  sessionId: string
  raisedBy: Address
  reason: string
  evidence: string
  status: "Open" | "UnderReview" | "Resolved"
  outcome: "Pending" | "RefundStudent" | "PayTutor" | "Split"
  createdAt: number
  resolvedAt?: number
}

// Certificate NFT
export interface Certificate {
  tokenId: string
  sessionId: string
  student: Address
  tutor: Address
  subject: string
  completedAt: number
  metadataURI: string
  imageURL?: string
}

// User Role
export type UserRole = "student" | "tutor" | null
