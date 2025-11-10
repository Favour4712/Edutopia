"use client";

import { useEffect } from "react";
import { CheckCircle2, Wallet } from "lucide-react";
import { useAccount } from "wagmi";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  useUsdcBalance,
  useUsdcFaucet,
} from "@/lib/web3/hooks";
import { formatUsdc, truncateHash } from "@/lib/web3/utils";

export function UsdcBalanceCard() {
  const { address } = useAccount();
  const { toast } = useToast();

  const balanceQuery = useUsdcBalance();
  const faucet = useUsdcFaucet();

  useEffect(() => {
    if (faucet.isConfirmed) {
      toast({
        title: "Faucet claimed",
        description: "Demo USDC has been transferred to your wallet.",
      });
      balanceQuery.refetch?.();
      faucet.reset();
    }
  }, [faucet, balanceQuery, toast]);

  useEffect(() => {
    if (faucet.error) {
      toast({
        title: "Faucet claim failed",
        description: faucet.error.message,
        variant: "destructive",
      });
    }
  }, [faucet.error, toast]);

  if (!address) {
    return null;
  }

  return (
    <Card className="mb-8 flex flex-col gap-6 border border-primary/20 bg-primary/5 p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/20">
          <Wallet className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Connected wallet</p>
          <p className="font-semibold">{truncateHash(address)}</p>
        </div>
      </div>

      <div className="rounded-xl border border-primary/30 bg-background p-5 shadow-inner">
        <p className="text-sm text-muted-foreground">Testnet balance</p>
        <p className="mt-1 text-3xl font-bold tracking-tight">
          {balanceQuery.isFetching
            ? "…"
            : formatUsdc(balanceQuery.data as bigint | undefined)}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          You’ll need mUSDC to set your hourly rate and accept bookings during testing.
        </p>
      </div>

      <Button
        onClick={() => faucet.claim().catch(() => undefined)}
        disabled={faucet.isSubmitting || faucet.isConfirming}
        className="w-full bg-primary py-5 text-base font-semibold"
      >
        {faucet.isSubmitting || faucet.isConfirming ? (
          <>
            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Claiming faucet…
          </>
        ) : (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Claim 1,000 test mUSDC
          </>
        )}
      </Button>
    </Card>
  );
}


