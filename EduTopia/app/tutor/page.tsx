"use client";

import { useMemo } from "react";
import { Users, Star, BookOpen, ListChecks } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTutorProfile } from "@/lib/web3/hooks";

function DashboardSkeleton() {
  return (
    <div className="w-full p-6 space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Card key={idx} className="p-6 space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-3 w-24" />
          </Card>
        ))}
      </div>
      <Card className="p-6 space-y-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </Card>
    </div>
  );
}

export default function TutorDashboardPage() {
  const profile = useTutorProfile();
  const { isRegistered, totalSessions, averageRating, subjects, hourlyRate } =
    profile;

  const ratingDisplay = useMemo(() => {
    if (averageRating === 0 || Number.isNaN(averageRating)) return "—";
    return averageRating.toFixed(2);
  }, [averageRating]);

  if (profile.query.isLoading) {
    return <DashboardSkeleton />;
  }

  if (!isRegistered) {
    return (
      <div className="w-full p-6">
        <Card className="p-8 border-dashed border-secondary/40 bg-secondary/10 text-center space-y-4">
          <h2 className="text-2xl font-semibold">No tutor profile found</h2>
          <p className="text-muted-foreground">
            Your wallet hasn&apos;t registered as a mentor yet. Create a profile
            to unlock the tutor dashboard and start accepting sessions.
          </p>
          <div className="flex justify-center">
            <Button asChild className="bg-secondary text-secondary-foreground">
              <a href="/tutor/register">Register as a tutor</a>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Your Tutor Console</h1>
        <p className="text-muted-foreground">
          Keep track of your on-chain teaching footprint, sessions, and subjects
          at a glance.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-muted-foreground">
              Total Sessions
            </h3>
            <Users className="w-5 h-5 text-secondary" />
          </div>
          <p className="text-3xl font-bold">{totalSessions}</p>
          <p className="text-sm text-muted-foreground">
            Sessions completed via the Peer Learning Hub smart contracts.
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-muted-foreground">Hourly Rate</h3>
            <ListChecks className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold">{hourlyRate.toFixed(2)} mUSDC</p>
          <p className="text-sm text-muted-foreground">
            Students deposit this amount into escrow for each scheduled hour.
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-muted-foreground">
              Average Rating
            </h3>
            <Star className="w-5 h-5 text-accent" />
          </div>
          <p className="text-3xl font-bold">{ratingDisplay}</p>
          <p className="text-sm text-muted-foreground">
            Calculated from on-chain student feedback across all of your
            sessions.
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-muted-foreground">
              Active Subjects
            </h3>
            <BookOpen className="w-5 h-5 text-success" />
          </div>
          <p className="text-3xl font-bold">{subjects.length}</p>
          <p className="text-sm text-muted-foreground">
            {subjects.length > 0
              ? subjects.join(" • ")
              : "No subjects added yet"}
          </p>
        </Card>
      </div>

      <Card className="p-6 space-y-4">
        <h2 className="font-semibold text-lg">Your subject focus</h2>
        <p className="text-sm text-muted-foreground">
          These are the areas you&apos;ve published on chain. Update them any
          time from your profile to help students discover you.
        </p>
        <div className="flex flex-wrap gap-2">
          {subjects.map((subject) => (
            <span
              key={subject}
              className="rounded-full border border-border bg-muted/60 px-3 py-1 text-sm font-medium text-muted-foreground"
            >
              {subject}
            </span>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Button
          asChild
          className="h-auto py-6 bg-secondary text-center flex-col"
        >
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
  );
}
