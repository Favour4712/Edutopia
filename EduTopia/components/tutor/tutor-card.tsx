"use client"

import { useState } from "react"
import { BookSessionModal } from "@/components/session/book-session-modal"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Users } from "lucide-react"

interface TutorCardProps {
  tutor: {
    id: string
    name: string
    subjects: string[]
    hourlyRate: number
    rating: number
    ratingCount: number
    totalSessions: number
    bio: string
    avatar: string
  }
}

export function TutorCard({ tutor }: TutorCardProps) {
  const [showBookModal, setShowBookModal] = useState(false)

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-6">
          {/* Avatar & Basic Info */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              <img src={tutor.avatar || "/placeholder.svg"} alt={tutor.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">{tutor.name}</h3>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span className="text-sm font-medium">{tutor.rating}</span>
                <span className="text-xs text-muted-foreground">({tutor.ratingCount})</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tutor.bio}</p>

          {/* Subjects */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {tutor.subjects.slice(0, 3).map((subject) => (
                <span key={subject} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  {subject}
                </span>
              ))}
              {tutor.subjects.length > 3 && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">
                  +{tutor.subjects.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-secondary" />
              <span className="text-muted-foreground">{tutor.totalSessions} sessions</span>
            </div>
          </div>

          {/* Rate & Button */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary">{tutor.hourlyRate}</p>
              <p className="text-xs text-muted-foreground">ETH per hour</p>
            </div>
            <Button onClick={() => setShowBookModal(true)} className="bg-primary hover:bg-primary/90">
              Book Session
            </Button>
          </div>
        </div>
      </Card>

      {/* Book Session Modal */}
      <BookSessionModal isOpen={showBookModal} onClose={() => setShowBookModal(false)} tutor={tutor} />
    </>
  )
}
