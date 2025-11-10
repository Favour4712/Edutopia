"use client";

import { useMemo } from "react";
import { useAccount, useReadContract } from "wagmi";
import type { Address } from "viem";

import { peerLearningHubContract } from "@/lib/web3/contracts";
import { formatUsdc } from "@/lib/web3/utils";

type RawSession = {
  id: bigint;
  student: Address;
  tutor: Address;
  amount: bigint;
  startTime: bigint;
  duration: bigint;
  status: number;
  completedAt: bigint;
  paymentReleased: boolean;
  hasDispute: boolean;
};

type RawSessionMetadata = {
  subject: string;
  description: string;
  learningObjectives: string[];
};

const STATUS_MAP = [
  "Pending",
  "Active",
  "Completed",
  "Disputed",
  "Refunded",
  "Cancelled",
] as const;

function mapStatus(status: number, hasDispute: boolean) {
  if (hasDispute) return "Disputed";
  return STATUS_MAP[status] ?? "Unknown";
}

export function useTutorSessions({ tutor }: { tutor?: Address }) {
  const account = useAccount();
  const tutorAddress = tutor ?? account.address;

  const sessionsQuery = useReadContract({
    ...peerLearningHubContract,
    functionName: "getTotalSessions",
    query: {
      enabled: Boolean(tutorAddress),
    },
  });

  const totalSessions = Number(sessionsQuery.data ?? 0n);

  const sessionsData = useMemo(() => {
    if (!tutorAddress || totalSessions === 0) {
      return {
        isLoading: sessionsQuery.isLoading,
        data: [] as ReturnType<typeof mapSessionData>,
      };
    }

    const sessionIds = Array.from({ length: totalSessions }, (_, idx) => BigInt(idx + 1));

    return {
      isLoading: sessionsQuery.isLoading,
      data: sessionIds,
    };
  }, [tutorAddress, totalSessions, sessionsQuery.isLoading]);

  const sessionDetails = useMemo(() => {
    if (!sessionsData.data || sessionsData.data.length === 0) {
      return {
        isLoading: sessionsQuery.isLoading,
        data: [] as Array<ReturnType<typeof mapSessionData>>,
      };
    }

    return {
      isLoading: sessionsQuery.isLoading,
      data: sessionsData.data.map((sessionId) => {
        const sessionQuery = useReadContract({
          ...peerLearningHubContract,
          functionName: "getSession",
          args: [sessionId],
        });

        const metadataQuery = useReadContract({
          ...peerLearningHubContract,
          functionName: "getSessionMetadata",
          args: [sessionId],
        });

        const session = sessionQuery.data as RawSession | undefined;
        const metadata = metadataQuery.data as RawSessionMetadata | undefined;

        return mapSessionData(sessionId, session, metadata, tutorAddress);
      }),
    };
  }, [sessionsData, sessionsQuery.isLoading, tutorAddress]);

  return {
    isLoading: sessionDetails.isLoading,
    data: sessionDetails.data.filter(Boolean),
  };
}

function mapSessionData(
  sessionId: bigint,
  session?: RawSession,
  metadata?: RawSessionMetadata,
  tutorAddress?: Address
) {
  if (!session) return undefined;

  const isTutor = tutorAddress && session.tutor.toLowerCase() === tutorAddress.toLowerCase();
  if (!isTutor) return undefined;

  const start = Number(session.startTime) * 1000;
  const end = start + Number(session.duration);
  const date = new Date(start);

  const subject = metadata?.subject || "Session";

  return {
    id: session.id,
    subject,
    description: metadata?.description ?? "",
    student: session.student,
    tutor: session.tutor,
    studentLabel: formatAddress(session.student),
    tutorLabel: formatAddress(session.tutor),
    amount: session.amount,
    startTime: start,
    endTime: end,
    dateLabel: date.toLocaleDateString(),
    timeLabel: date.toLocaleTimeString(),
    durationLabel: `${Math.round(Number(session.duration) / 3600)}h`,
    status: mapStatus(session.status, session.hasDispute),
    hasDispute: session.hasDispute,
    actions: mapActions(mapStatus(session.status, session.hasDispute)),
  };
}

function formatAddress(address: string) {
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

function mapActions(status: string) {
  switch (status) {
    case "Active":
      return [
        {
          label: "Prepare Session",
          variant: "secondary" as const,
          onClick: () => undefined,
        },
      ];
    case "Completed":
      return [
        {
          label: "Completed",
          icon: "check" as const,
          variant: "outline" as const,
          disabled: true,
          onClick: () => undefined,
        },
        {
          label: "Leave Review",
          variant: "outline" as const,
          onClick: () => undefined,
        },
      ];
    case "Disputed":
      return [
        {
          label: "Awaiting resolution",
          variant: "outline" as const,
          disabled: true,
          onClick: () => undefined,
        },
      ];
    default:
      return [];
  }
}


