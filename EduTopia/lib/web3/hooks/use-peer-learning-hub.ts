"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import type { Address, Hash } from "viem";
import type { ExtractAbiFunctionNames } from "viem";

import {
  peerLearningHubContract,
  tutorRegistryContract,
} from "@/lib/web3/contracts";
import { fromUsdcUnits, hoursToSeconds, toUsdcUnits } from "@/lib/web3/utils";

export type TutorProfile = {
  isRegistered: boolean;
  subjects: string[];
  hourlyRate: bigint;
  totalSessions: bigint;
  totalRating: bigint;
  ratingCount: bigint;
  registeredAt: bigint;
};

export type TutorDirectoryEntry = {
  address: Address;
  subjects: string[];
  hourlyRate: number;
  totalSessions: number;
  averageRating: number;
  ratingCount: number;
  registeredAt: number;
  raw: TutorProfile;
};

export function useTutorProfile(tutorAddress?: Address) {
  const { address } = useAccount();
  const target = tutorAddress ?? address;

  const query = useReadContract({
    ...peerLearningHubContract,
    functionName: "getTutorProfile",
    args: target ? [target] : undefined,
    query: {
      enabled: Boolean(target),
      refetchInterval: 15_000,
    },
  });

  return useMemo(() => {
    const raw = query.data as TutorProfile | undefined;
    if (!raw) {
      return {
        isRegistered: false,
        subjects: [] as string[],
        hourlyRate: 0,
        totalSessions: 0,
        averageRating: 0,
        registeredAt: 0,
        raw: undefined,
        query,
      };
    }

    const averageRating =
      raw.ratingCount > 0n
        ? Number(raw.totalRating) / Number(raw.ratingCount)
        : 0;

    return {
      isRegistered: raw.isRegistered,
      subjects: raw.subjects,
      hourlyRate: fromUsdcUnits(raw.hourlyRate),
      totalSessions: Number(raw.totalSessions),
      averageRating,
      registeredAt: Number(raw.registeredAt),
      raw,
      query,
    };
  }, [query]);
}

export function useRegisterTutor() {
  const { writeContractAsync, isPending } = useWriteContract();
  const [hash, setHash] = useState<Hash | undefined>();

  const waitForReceipt = useWaitForTransactionReceipt({
    hash,
    chainId: peerLearningHubContract.chainId,
    query: {
      enabled: Boolean(hash),
    },
  });

  const registerTutor = async (subjects: string[], hourlyRate: number) => {
    const rateInUnits = toUsdcUnits(hourlyRate);

    const txHash = await writeContractAsync({
      ...peerLearningHubContract,
      functionName: "registerAsTutor",
      args: [subjects, rateInUnits],
    });

    setHash(txHash);
    return txHash;
  };

  return {
    registerTutor,
    transactionHash: hash,
    isSubmitting: isPending,
    isConfirming: waitForReceipt.isLoading,
    isConfirmed: waitForReceipt.isSuccess,
    error: waitForReceipt.error,
    reset: () => setHash(undefined),
  };
}

export function usePlatformStats() {
  return useReadContract({
    ...peerLearningHubContract,
    functionName: "getPlatformStats",
    query: {
      refetchInterval: 20_000,
    },
  });
}

type HubFunctionName = ExtractAbiFunctionNames<
  typeof peerLearningHubContract.abi
>;

function useHubWrite(functionName: HubFunctionName) {
  const { writeContractAsync, isPending } = useWriteContract();
  const [hash, setHash] = useState<Hash | undefined>();

  const waitForReceipt = useWaitForTransactionReceipt({
    hash,
    chainId: peerLearningHubContract.chainId,
    query: {
      enabled: Boolean(hash),
    },
  });

  const write = async (...args: readonly unknown[]) => {
    const txHash = await writeContractAsync({
      ...peerLearningHubContract,
      functionName,
      args,
    } as never);

    setHash(txHash);
    return txHash;
  };

  return {
    write,
    transactionHash: hash,
    isSubmitting: isPending,
    isConfirming: waitForReceipt.isLoading,
    isConfirmed: waitForReceipt.isSuccess,
    error: waitForReceipt.error,
    reset: () => setHash(undefined),
  };
}

export function useBookSession() {
  const mutation = useHubWrite("bookSession");

  const bookSession = async (params: {
    tutor: Address;
    durationHours: number;
    subject: string;
    description: string;
  }) => {
    const txHash = await mutation.write(
      params.tutor,
      hoursToSeconds(params.durationHours),
      params.subject,
      params.description ?? ""
    );
    return txHash;
  };

  return {
    ...mutation,
    bookSession,
  };
}

export function useCompleteSession() {
  const mutation = useHubWrite("completeSession");

  const completeSession = async (sessionId: bigint | number | string) => {
    const id = BigInt(sessionId);
    return mutation.write(id);
  };

  return {
    ...mutation,
    completeSession,
  };
}

export function useCancelSession() {
  const mutation = useHubWrite("cancelSession");

  const cancelSession = async (sessionId: bigint | number | string) => {
    const id = BigInt(sessionId);
    return mutation.write(id);
  };

  return {
    ...mutation,
    cancelSession,
  };
}

export function useReleasePayment() {
  const mutation = useHubWrite("releasePayment");

  const releasePayment = async (sessionId: bigint | number | string) => {
    const id = BigInt(sessionId);
    return mutation.write(id);
  };

  return {
    ...mutation,
    releasePayment,
  };
}

export function useTutorDirectory() {
  const client = usePublicClient({ chainId: peerLearningHubContract.chainId });
  const [entries, setEntries] = useState<TutorDirectoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    if (!client) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const totalTutors = (await client.readContract({
        ...peerLearningHubContract,
        functionName: "getTutorCount",
      })) as bigint;

      if (totalTutors === 0n) {
        setEntries([]);
        setIsLoading(false);
        return;
      }

      const tutorAddresses = (await client.readContract({
        ...peerLearningHubContract,
        functionName: "getTutorAddresses",
        args: [0n, totalTutors],
      })) as Address[];

      const directory = await Promise.all(
        tutorAddresses.map(async (address) => {
          const profile = (await client.readContract({
            ...peerLearningHubContract,
            functionName: "getTutorProfile",
            args: [address],
          })) as TutorProfile;

          if (!profile?.isRegistered) {
            return null;
          }

          const hourlyRate = fromUsdcUnits(profile.hourlyRate);
          const totalSessions = Number(profile.totalSessions);
          const ratingCount = Number(profile.ratingCount);
          const totalRating = Number(profile.totalRating);
          const averageRating = ratingCount > 0 ? totalRating / ratingCount : 0;
          const registeredAt = Number(profile.registeredAt);

          return {
            address,
            subjects: profile.subjects,
            hourlyRate,
            totalSessions,
            averageRating,
            ratingCount,
            registeredAt,
            raw: profile,
          } satisfies TutorDirectoryEntry;
        })
      );

      setEntries(directory.filter(Boolean) as TutorDirectoryEntry[]);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  useEffect(() => {
    if (!client) {
      return;
    }

    let cancelled = false;
    refresh();

    const unwatch = client.watchContractEvent({
      address: tutorRegistryContract.address,
      abi: tutorRegistryContract.abi,
      eventName: "TutorRegistered",
      onLogs: () => {
        if (!cancelled) {
          refresh();
        }
      },
    });

    return () => {
      cancelled = true;
      unwatch?.();
    };
  }, [client, refresh]);

  return {
    tutors: entries,
    isLoading,
    error,
    refetch: refresh,
  };
}
