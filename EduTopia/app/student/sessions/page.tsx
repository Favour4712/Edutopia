"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock } from "lucide-react"

const MOCK_SESSIONS = [
  {
    id: "1",
    tutorName: "Amina Farooq",
    subject: "Smart Contract Auditing",
    date: "2025-11-15",
    time: "14:00",
    duration: 1,
    status: "upcoming" as const,
    amount: 0.55,
  },
  {
    id: "2",
    tutorName: "Linh Tran",
    subject: "Zero-Knowledge Proofs",
    date: "2025-11-10",
    time: "10:00",
    duration: 1.5,
    status: "completed" as const,
    amount: 0.62,
  },
]

export default function MySessionsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed" | "disputed">("upcoming")

  const filteredSessions = MOCK_SESSIONS.filter((session) => session.status === activeTab || activeTab === "disputed")

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold mb-6">My Sessions</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-border">
        {["upcoming", "completed", "disputed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-3 px-4 font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.length > 0 ? (
          filteredSessions.map((session) => (
            <Card key={session.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">{session.tutorName}</h3>
                  <p className="text-sm text-muted-foreground">{session.subject}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-semibold text-primary">{session.amount} ETH</p>
                  <p className="text-xs text-muted-foreground capitalize">{session.status}</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {session.date}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {session.time} ({session.duration}h)
                </div>
              </div>

              <div className="flex gap-3">
                {session.status === "upcoming" && (
                  <>
                    <Button className="bg-primary">Join Session</Button>
                    <Button variant="outline">Cancel</Button>
                  </>
                )}
                {session.status === "completed" && (
                  <>
                    <Button variant="outline">View Feedback</Button>
                    <Button className="bg-accent text-accent-foreground">Mint Certificate</Button>
                  </>
                )}
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-4">No sessions yet</p>
            <Button asChild className="bg-primary">
              <a href="/student/browse">Browse Tutors</a>
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}
