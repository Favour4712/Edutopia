"use client"

import { useState, useRef, useEffect } from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { SessionTimer } from "@/components/session/session-timer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { WalletGuard } from "@/components/web3/wallet-guard"
import { VideoOff, MessageCircle, Clock, MapPin, FileText, AlertCircle, Send } from "lucide-react"

interface Message {
  id: string
  sender: string
  text: string
  timestamp: number
}

// Mock session data
const MOCK_SESSION = {
  id: "1",
  studentName: "Noah Patel",
  tutorName: "Amina Farooq",
  subject: "Smart Contract Auditing",
  topic: "Threat modeling a DeFi lending pool",
  startTime: Math.floor(Date.now() / 1000) + 60, // 1 minute from now
  duration: 3600, // 1 hour
  status: "upcoming" as const,
  amount: 0.55,
  description: "Deep dive into audit methodology for EVM lending protocols and test case design",
}

export default function SessionDetailPage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "Amina Farooq",
      text: "Drop your repo link and audit checklist so we can jump straight into threat modeling.",
      timestamp: Date.now() - 3600000,
    },
  ])
  const [messageInput, setMessageInput] = useState("")
  const [showChat, setShowChat] = useState(true)
  const [sessionStatus, setSessionStatus] = useState(MOCK_SESSION.status)
  const messageEndRef = useRef<HTMLDivElement>(null)
  const now = Date.now() / 1000

  // Simulate session status changes based on time
  useEffect(() => {
    if (now < MOCK_SESSION.startTime) {
      setSessionStatus("upcoming")
    } else if (now < MOCK_SESSION.startTime + MOCK_SESSION.duration) {
      setSessionStatus("active")
    } else {
      setSessionStatus("completed")
    }
  }, [now])

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessages([
        ...messages,
        {
          id: String(messages.length + 1),
          sender: "You",
          text: messageInput,
          timestamp: Date.now(),
        },
      ])
      setMessageInput("")
    }
  }

  const canJoinSession = sessionStatus === "active" && now >= MOCK_SESSION.startTime - 300
  const sessionNotStarted = now < MOCK_SESSION.startTime
  const sessionEnded = now >= MOCK_SESSION.startTime + MOCK_SESSION.duration

  return (
    <WalletGuard>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />

        <main className="flex-1 px-4 py-6">
          <div className="container mx-auto max-w-6xl">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">{MOCK_SESSION.subject}</h1>
              <div className="flex flex-col md:flex-row gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{MOCK_SESSION.tutorName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(MOCK_SESSION.startTime * 1000).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>{MOCK_SESSION.topic}</span>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Video/Main Section */}
              <div className="lg:col-span-2">
                {/* Video Placeholder */}
                <Card className="bg-muted aspect-video mb-6 flex items-center justify-center rounded-lg overflow-hidden">
                  {sessionStatus === "upcoming" && (
                    <div className="text-center">
                      <VideoOff className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">Session starts in</p>
                      <p className="text-2xl font-bold">{Math.ceil((MOCK_SESSION.startTime - now) / 60)} minutes</p>
                    </div>
                  )}
                  {sessionStatus === "active" && (
                    <div className="text-center">
                      <p className="text-primary font-bold animate-pulse">● LIVE</p>
                    </div>
                  )}
                  {sessionStatus === "completed" && (
                    <div className="text-center">
                      <VideoOff className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Session Completed</p>
                    </div>
                  )}
                </Card>

                {/* Timer */}
                {sessionStatus !== "upcoming" && (
                  <SessionTimer startTime={MOCK_SESSION.startTime} duration={MOCK_SESSION.duration} />
                )}

                {/* Session Info */}
                <Card className="p-6 mt-6">
                  <h3 className="font-bold text-lg mb-4">Session Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Student</span>
                      <span className="font-medium">{MOCK_SESSION.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tutor</span>
                      <span className="font-medium">{MOCK_SESSION.tutorName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">{MOCK_SESSION.duration / 3600} hour(s)</span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-mono font-bold text-primary">{MOCK_SESSION.amount} ETH</span>
                    </div>
                  </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  {canJoinSession && <Button className="flex-1 bg-primary text-lg py-6">Join Video Session</Button>}
                  {sessionNotStarted && (
                    <Button disabled className="flex-1 text-lg py-6">
                      Waiting for Session Start
                    </Button>
                  )}
                  {sessionEnded && (
                    <>
                      <Button asChild variant="outline" className="flex-1 bg-transparent">
                        <a href="/student/sessions">Back to Sessions</a>
                      </Button>
                      <Button asChild className="flex-1 bg-accent text-accent-foreground">
                        <a href="/student/certificates">Mint Certificate</a>
                      </Button>
                    </>
                  )}
                </div>

                {/* Dispute Alert */}
                {sessionStatus === "completed" && (
                  <Card className="p-4 mt-6 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-amber-900 dark:text-amber-100">
                          You have 24 hours to raise a dispute if there are any issues.
                        </p>
                        <p className="text-amber-800 dark:text-amber-200 mt-1">
                          After that, payment will be automatically released to the tutor.
                        </p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              {/* Chat Sidebar */}
              <div className="lg:col-span-1">
                <Card className="p-6 flex flex-col h-[600px]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      Session Chat
                    </h3>
                    <button
                      onClick={() => setShowChat(!showChat)}
                      className="text-muted-foreground hover:text-foreground lg:hidden"
                    >
                      ×
                    </button>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs rounded-lg px-3 py-2 ${
                            message.sender === "You" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <p className="text-xs opacity-75 mb-1">{message.sender}</p>
                          <p className="text-sm">{message.text}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messageEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage} size="sm" className="bg-primary">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </WalletGuard>
  )
}
