"use client";

import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";
import { Calendar, Clock, CheckCircle2, Info } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useTutorProfile,
  useTutorSessions,
} from "@/lib/web3/hooks";
import { formatUsdc } from "@/lib/web3/utils";

const STATUS_TABS = [
  { key: "upcoming", label: "Upcoming" },
  { key: "completed", label: "Completed" },
  { key: "disputed", label: "Disputed" },
] as const;

function SessionsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, idx) => (
        <Card key={idx} className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-24" />
          </div>
        </Card>
      ))}
    </div>
  );
}

export default function TutorSessionsPage() {
  const { address } = useAccount();
  const profile = useTutorProfile(address);
  const [activeStatus, setActiveStatus] = useState<(typeof STATUS_TABS)[number]["key"]>("upcoming");

  const query = useTutorSessions({ tutor: address });

  const filteredSessions = useMemo(() => {
    if (!query.data) return [];
    return query.data.filter((session) => {
      if (activeStatus === "disputed") {
        return session.status === "Disputed";
      }
      return session.status.toLowerCase() === activeStatus;
    });
  }, [query.data, activeStatus]);

  if (!address) {
    return (
      <div className="w-full p-6">
        <Card className="p-8 text-center space-y-4 border border-primary/30 bg-primary/10">
          <h2 className="text-2xl font-semibold">Connect wallet to view sessions</h2>
          <p className="text-muted-foreground">
            Sign in with the tutor wallet you used to register. Once connected, your on-chain session schedule will
            appear here.
          </p>
        </Card>
      </div>
    );
  }

  if (!profile.isRegistered) {
    return (
      <div className="w-full p-6">
        <Card className="p-8 text-center space-y-4 border border-secondary/30 bg-secondary/10">
          <h2 className="text-2xl font-semibold">No tutor profile yet</h2>
          <p className="text-muted-foreground">
            Sessions are only available to registered mentors. Create your on-chain tutor profile to start accepting
            bookings.
          </p>
          <div className="flex justify-center">
            <Button asChild>
              <Link href="/tutor/register">Register as a tutor</Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold mb-6">My Sessions</h1>

      <div className="flex gap-4 mb-6 border-b border-border">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveStatus(tab.key)}
            className={`pb-3 px-4 font-medium border-b-2 transition-colors ${
              activeStatus === tab.key
                ? "border-secondary text-secondary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {query.isLoading ? (
        <SessionsSkeleton />
      ) : filteredSessions.length > 0 ? (
        <div className="space-y-4">
          {filteredSessions.map((session) => (
            <Card key={session.id} className="p-6 space-y-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-lg">{session.studentLabel}</h3>
                  <p className="text-sm text-muted-foreground">
                    {session.subject} • Session #{session.id.toString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-semibold text-secondary">
                    {formatUsdc(session.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">{session.status.toLowerCase()}</p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {session.dateLabel}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {session.timeLabel}
                </div>
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  {session.durationLabel}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {session.actions.map((action) => (
                  <Button
                    key={action.label}
                    variant={action.variant ?? "default"}
                    onClick={action.onClick}
                    className={action.variant === "secondary" ? "bg-secondary" : undefined}
                    disabled={action.disabled}
                  >
                    {action.icon === "check" && <CheckCircle2 className="w-4 h-4 mr-2" />}
                    {action.label}
                  </Button>
                ))}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-16 text-center space-y-4">
          <p className="text-muted-foreground">
            No {activeStatus} sessions found.
          </p>
          <p className="text-sm text-muted-foreground">
            As students book time with you, the sessions will appear in the relevant tab.
          </p>
        </Card>
      )}
    </div>
  );
}
