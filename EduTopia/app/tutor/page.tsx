"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { TrendingUp, Users, DollarSign, Star } from "lucide-react"

const EARNINGS_DATA = [
  { name: "Week 1", earnings: 3.2 },
  { name: "Week 2", earnings: 4.5 },
  { name: "Week 3", earnings: 5.1 },
  { name: "Week 4", earnings: 6.8 },
  { name: "Week 5", earnings: 5.5 },
]

export default function TutorDashboardPage() {
  return (
    <div className="w-full p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your teaching overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {/* Total Sessions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-muted-foreground">Total Sessions</h3>
            <Users className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-3xl font-bold">127</p>
          <p className="text-sm text-muted-foreground mt-2">+12 this month</p>
        </Card>

        {/* Total Earnings */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-muted-foreground">Total Earnings</h3>
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">24.8 ETH</p>
          <p className="text-sm text-muted-foreground mt-2">~$62,000 USD</p>
        </Card>

        {/* Avg Rating */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-muted-foreground">Avg Rating</h3>
            <Star className="w-5 h-5 text-accent" />
          </div>
          <p className="text-3xl font-bold">4.9</p>
          <p className="text-sm text-muted-foreground mt-2">from 98 reviews</p>
        </Card>

        {/* Pending Payouts */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-muted-foreground">Pending Payouts</h3>
            <TrendingUp className="w-5 h-5 text-success" />
          </div>
          <p className="text-3xl font-bold">3.2 ETH</p>
          <p className="text-sm text-muted-foreground mt-2">Available to withdraw</p>
        </Card>
      </div>

      {/* Earnings Chart */}
      <Card className="p-6 mb-8">
        <h2 className="font-bold text-lg mb-4">Earnings Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={EARNINGS_DATA}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `${value.toFixed(2)} ETH`} />
            <Legend />
            <Bar dataKey="earnings" fill="var(--color-secondary)" name="Earnings (ETH)" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Button asChild className="h-auto py-6 bg-secondary text-center flex-col">
          <a href="/tutor/schedule">
            <span className="text-lg font-bold">Set Availability</span>
            <span className="text-sm opacity-90">Update your schedule</span>
          </a>
        </Button>
        <Button asChild className="h-auto py-6 bg-primary text-center flex-col">
          <a href="/tutor/sessions">
            <span className="text-lg font-bold">View Sessions</span>
            <span className="text-sm opacity-90">Manage your bookings</span>
          </a>
        </Button>
        <Button asChild className="h-auto py-6 bg-accent text-center flex-col">
          <a href="/tutor/profile">
            <span className="text-lg font-bold">Edit Profile</span>
            <span className="text-sm opacity-90">Update your information</span>
          </a>
        </Button>
      </div>
    </div>
  )
}
