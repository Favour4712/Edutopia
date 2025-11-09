"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Wallet, TrendingUp, Calendar } from "lucide-react"

const EARNINGS_DATA = [
  { month: "July", earnings: 12.5 },
  { month: "August", earnings: 18.3 },
  { month: "September", earnings: 16.8 },
  { month: "October", earnings: 24.5 },
]

const RECENT_SESSIONS = [
  { id: "1", studentName: "Noah Patel", subject: "Smart Contract Auditing", date: "2025-11-10", amount: 0.55 },
  { id: "2", studentName: "Ivy Chen", subject: "Zero-Knowledge Proofs", date: "2025-11-09", amount: 0.7 },
  { id: "3", studentName: "Diego Ramos", subject: "Validator Operations", date: "2025-11-08", amount: 0.48 },
]

export default function EarningsPage() {
  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold mb-6">Earnings & Analytics</h1>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-muted-foreground">This Month</h3>
            <TrendingUp className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-3xl font-bold">6.8 ETH</p>
          <p className="text-sm text-muted-foreground mt-2">~$17,000 USD</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-muted-foreground">This Year</h3>
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">72.1 ETH</p>
          <p className="text-sm text-muted-foreground mt-2">~$180,250 USD</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-muted-foreground">Ready to Withdraw</h3>
            <Wallet className="w-5 h-5 text-accent" />
          </div>
          <p className="text-3xl font-bold">3.2 ETH</p>
          <Button className="mt-4 w-full bg-secondary text-sm">Withdraw Funds</Button>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Earnings */}
        <Card className="p-6">
          <h2 className="font-bold text-lg mb-4">Monthly Earnings</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={EARNINGS_DATA}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toFixed(2)} ETH`} />
              <Bar dataKey="earnings" fill="var(--color-secondary)" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Earnings Trend */}
        <Card className="p-6">
          <h2 className="font-bold text-lg mb-4">Earnings Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={EARNINGS_DATA}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toFixed(2)} ETH`} />
              <Line type="monotone" dataKey="earnings" stroke="var(--color-secondary)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Sessions */}
      <Card className="p-6">
        <h2 className="font-bold text-lg mb-4">Recent Completed Sessions</h2>
        <div className="space-y-4">
          {RECENT_SESSIONS.map((session) => (
            <div key={session.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <p className="font-medium">{session.studentName}</p>
                <p className="text-sm text-muted-foreground">
                  {session.subject} • {session.date}
                </p>
              </div>
              <p className="font-mono font-bold text-secondary">{session.amount} ETH</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
