"use client";

import { useState } from "react";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import type { Address, Hash } from "viem";

import { mockUsdcContract, peerLearningHubContract } from "@/lib/web3/contracts";
import { fromUsdcUnits } from "@/lib/web3/utils";

export function useUsdcBalance(addressOverride?: Address) {
  const { address } = useAccount();
  const owner = addressOverride ?? address;

  const query = useReadContract({
    ...mockUsdcContract,
    functionName: "balanceOf",
    args: owner ? [owner] : undefined,
    query: {
      enabled: Boolean(owner),
      refetchInterval: 12_000,
    },
  });

  return {
    ...query,
    formatted: fromUsdcUnits(query.data as bigint | undefined),
  };
}

export function useUsdcAllowance(spender: Address) {
  const { address } = useAccount();

  const query = useReadContract({
    ...mockUsdcContract,
    functionName: "allowance",
    args: address ? [address, spender] : undefined,
    query: {
      enabled: Boolean(address && spender),
      refetchInterval: 12_000,
    },
  });

  return {
    ...query,
    formatted: fromUsdcUnits(query.data as bigint | undefined),
  };
}

export function useUsdcApprove(spender: Address) {
  const { writeContractAsync, isPending } = useWriteContract();
  const [hash, setHash] = useState<Hash | undefined>();

  const waitForReceipt = useWaitForTransactionReceipt({
    hash,
    chainId: mockUsdcContract.chainId,
    query: {
      enabled: Boolean(hash),
    },
  });

  const approve = async (amount: bigint) => {
    const txHash = await writeContractAsync({
      ...mockUsdcContract,
      functionName: "approve",
      args: [spender, amount],
    });

    setHash(txHash);
    return txHash;
  };

  return {
    approve,
    transactionHash: hash,
    isSubmitting: isPending,
    isConfirming: waitForReceipt.isLoading,
    isConfirmed: waitForReceipt.isSuccess,
    error: waitForReceipt.error,
    reset: () => setHash(undefined),
  };
}

export function useUsdcFaucet() {
  const { writeContractAsync, isPending } = useWriteContract();
  const [hash, setHash] = useState<Hash | undefined>();

  const waitForReceipt = useWaitForTransactionReceipt({
    hash,
    chainId: mockUsdcContract.chainId,
    query: {
      enabled: Boolean(hash),
    },
  });

  const claim = async () => {
    const txHash = await writeContractAsync({
      ...mockUsdcContract,
      functionName: "claimFaucet",
    });
    setHash(txHash);
    return txHash;
  };

  return {
    claim,
    transactionHash: hash,
    isSubmitting: isPending,
    isConfirming: waitForReceipt.isLoading,
    isConfirmed: waitForReceipt.isSuccess,
    error: waitForReceipt.error,
    reset: () => setHash(undefined),
  };
}

export function useDefaultUsdcAllowance() {
  return useUsdcAllowance(peerLearningHubContract.address);
}


