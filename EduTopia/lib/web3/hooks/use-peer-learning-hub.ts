"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import type { Address, Hash } from "viem";
import { parseAbiItem } from "viem";
import type { ExtractAbiFunctionNames } from "viem";

import {
  peerLearningHubContract,
  tutorRegistryContract,
} from "@/lib/web3/contracts";
import {
  fromUsdcUnits,
  hoursToSeconds,
  toUsdcUnits,
} from "@/lib/web3/utils";

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
      params.description ?? "",
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

const tutorRegisteredEvent = parseAbiItem(
  "event TutorRegistered(address indexed tutor, string[] subjects, uint256 hourlyRate)",
);

export function useTutorDirectory() {
  const client = usePublicClient({ chainId: tutorRegistryContract.chainId });
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

      const latestBlock = await client.getBlockNumber();
      const deploymentBlockEnv = process.env.NEXT_PUBLIC_TUTOR_REGISTRY_DEPLOYMENT_BLOCK;
      const deploymentBlock = deploymentBlockEnv ? BigInt(deploymentBlockEnv) : 0n;
      const chunkSize = 5_000n;

      type LogsResult = Awaited<ReturnType<typeof client.getLogs>>;
      let currentFrom = deploymentBlock;
      const aggregatedLogs: LogsResult = [];

      while (currentFrom <= latestBlock) {
        const currentTo = currentFrom + chunkSize;
        const toBlock = currentTo > latestBlock ? latestBlock : currentTo;

        const slice = await client.getLogs({
          address: tutorRegistryContract.address,
          event: tutorRegisteredEvent,
          fromBlock: currentFrom,
          toBlock,
        });

        aggregatedLogs.push(...slice);

        if (toBlock === latestBlock) {
          break;
        }

        currentFrom = toBlock + 1n;
      }

      const logs = aggregatedLogs;

      const uniqueAddresses = Array.from(
        new Set(
          logs
            .map((log) => log.args?.tutor as Address | undefined)
            .filter((address): address is Address => Boolean(address)),
        ),
      );

      if (uniqueAddresses.length === 0) {
        setEntries([]);
        setIsLoading(false);
        return;
      }

      const directory = await Promise.all(
        uniqueAddresses.map(async (address) => {
          const profile = (await client.readContract({
            ...tutorRegistryContract,
            functionName: "getTutorProfile",
            args: [address],
          })) as TutorProfile;

          if (!profile?.isRegistered) {
            return null;
          }

          const ratingRaw = (await client.readContract({
            ...tutorRegistryContract,
            functionName: "getTutorRating",
            args: [address],
          })) as bigint;

          const hourlyRate = fromUsdcUnits(profile.hourlyRate);
          const totalSessions = Number(profile.totalSessions);
          const ratingCount = Number(profile.ratingCount);
          const averageRating =
            ratingCount > 0 ? Number(ratingRaw) / 100 : 0;
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
        }),
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
