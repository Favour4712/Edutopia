"use client"

import { useState } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WalletGuard } from "@/components/web3/wallet-guard"
import { Clock, CheckCircle2, AlertCircle, User, MessageSquare, FileText, Download, ChevronRight } from "lucide-react"

// Mock dispute data
const MOCK_DISPUTE = {
  id: "DISPUTE#001",
  sessionId: "SESSION#123",
  studentName: "Noah Patel",
  tutorName: "Amina Farooq",
  subject: "Smart Contract Auditing",
  status: "under-review" as const,
  reason: "Critical checks skipped",
  createdAt: new Date(Date.now() - 86400000),
  amount: 0.55,
  timeline: [
    {
      status: "dispute-raised",
      label: "Dispute Raised",
      time: new Date(Date.now() - 86400000),
      description: "Student flagged missing reentrancy tests in the audit walkthrough",
      actor: "Learner",
    },
    {
      status: "under-review",
      label: "Under Review",
      time: new Date(Date.now() - 43200000),
      description: "Edutopia core team is validating the shared GitHub evidence",
      actor: "Edutopia Team",
    },
    {
      status: "evidence-requested",
      label: "Awaiting Tutor Response",
      time: null,
      description: "Tutor to upload audit checklist and trace overview",
      actor: "System",
    },
  ],
  studentEvidence: {
    description:
      "Screenshare recording shows the audit skipped the reentrancy checklist and state-diff review for the lending pool.",
    attachments: [
      { id: "1", name: "audit-session-notes.pdf", size: "2.4 MB", uploadedAt: new Date(Date.now() - 86400000) },
    ],
  },
  tutorEvidence: null,
}

export default function DisputePage({ params }: { params: { id: string } }) {
  const [selectedTab, setSelectedTab] = useState<"timeline" | "evidence">("timeline")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "dispute-raised":
        return "bg-destructive/10 text-destructive"
      case "under-review":
        return "bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-100"
      case "resolved":
        return "bg-success/10 text-success"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "dispute-raised":
        return <AlertCircle className="w-5 h-5" />
      case "under-review":
        return <Clock className="w-5 h-5 animate-spin" />
      case "resolved":
        return <CheckCircle2 className="w-5 h-5" />
      default:
        return <ChevronRight className="w-5 h-5" />
    }
  }

  return (
    <WalletGuard>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />

        <main className="flex-1 px-4 py-6">
          <div className="container mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Dispute ID: {MOCK_DISPUTE.id}</p>
                  <h1 className="text-3xl font-bold mb-2">{MOCK_DISPUTE.subject} Session Dispute</h1>
                  <p className="text-muted-foreground">
                    Session between {MOCK_DISPUTE.studentName} and {MOCK_DISPUTE.tutorName}
                  </p>
                </div>
                <div className={`px-4 py-2 rounded-lg font-medium ${getStatusColor(MOCK_DISPUTE.status)}`}>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(MOCK_DISPUTE.status)}
                    <span>{MOCK_DISPUTE.status.replace("-", " ").toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Session Info */}
            <Card className="p-6 mb-6">
              <h2 className="font-bold text-lg mb-4">Session Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Student</p>
                  <p className="font-medium">{MOCK_DISPUTE.studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Tutor</p>
                  <p className="font-medium">{MOCK_DISPUTE.tutorName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Dispute Reason</p>
                  <p className="font-medium">{MOCK_DISPUTE.reason}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Amount In Escrow</p>
                  <p className="font-mono font-bold text-primary">{MOCK_DISPUTE.amount} ETH</p>
                </div>
              </div>
            </Card>

            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-border">
              {["timeline", "evidence"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab as any)}
                  className={`pb-3 px-4 font-medium border-b-2 transition-colors ${
                    selectedTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "timeline" ? "Dispute Timeline" : "Evidence & Documentation"}
                </button>
              ))}
            </div>

            {/* Timeline View */}
            {selectedTab === "timeline" && (
              <div className="space-y-6 mb-8">
                {MOCK_DISPUTE.timeline.map((event, index) => (
                  <div key={event.status} className="flex gap-4">
                    {/* Timeline Line */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${getStatusColor(
                          event.status,
                        )}`}
                      >
                        {getStatusIcon(event.status)}
                      </div>
                      {index < MOCK_DISPUTE.timeline.length - 1 && <div className="w-1 h-20 bg-border mt-2"></div>}
                    </div>

                    {/* Event Content */}
                    <Card className="flex-1 p-6 mt-2">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold">{event.label}</h3>
                        {event.time && (
                          <span className="text-sm text-muted-foreground">
                            {event.time.toLocaleDateString()} {event.time.toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                      <p className="text-xs font-medium text-primary">By {event.actor}</p>
                    </Card>
                  </div>
                ))}
              </div>
            )}

            {/* Evidence View */}
            {selectedTab === "evidence" && (
              <div className="space-y-6 mb-8">
                {/* Student Evidence */}
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold">Student Evidence</h3>
                      <p className="text-sm text-muted-foreground">{MOCK_DISPUTE.studentName}</p>
                    </div>
                  </div>

                  {MOCK_DISPUTE.studentEvidence ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm">{MOCK_DISPUTE.studentEvidence.description}</p>
                      </div>

                      {MOCK_DISPUTE.studentEvidence.attachments.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mb-3">Attachments</p>
                          <div className="space-y-2">
                            {MOCK_DISPUTE.studentEvidence.attachments.map((attachment) => (
                              <div
                                key={attachment.id}
                                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <FileText className="w-5 h-5 text-primary" />
                                  <div>
                                    <p className="text-sm font-medium">{attachment.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {attachment.size} • {attachment.uploadedAt.toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No evidence provided</p>
                  )}
                </Card>

                {/* Tutor Evidence */}
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <h3 className="font-bold">Tutor Evidence</h3>
                      <p className="text-sm text-muted-foreground">{MOCK_DISPUTE.tutorName}</p>
                    </div>
                  </div>

                  {MOCK_DISPUTE.tutorEvidence ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm">{MOCK_DISPUTE.tutorEvidence.description}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900">
                      <p className="text-sm text-amber-900 dark:text-amber-100">
                        Tutor has not yet responded to this dispute. They have 24 hours to provide their account.
                      </p>
                    </div>
                  )}
                </Card>
              </div>
            )}

            {/* Resolution Info */}
            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className="flex gap-4">
                <MessageSquare className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-primary mb-1">How disputes are resolved</p>
                  <p className="text-muted-foreground mb-2">
                    Our team carefully reviews all evidence from both parties within 48 hours. We consider the session
                    details, evidence provided, and participant history to ensure fair resolution.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Funds remain in escrow until a decision is reached. You'll be notified of the outcome via email.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </WalletGuard>
  )
}
