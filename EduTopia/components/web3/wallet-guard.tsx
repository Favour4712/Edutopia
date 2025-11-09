"use client";

import type React from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface WalletGuardProps {
  children: React.ReactNode;
  requiredRole?: "student" | "tutor";
}

/**
 * Wallet guard component to protect routes requiring web3 connection
 * Redirects to home if wallet is not connected
 */
export function WalletGuard({ children }: WalletGuardProps) {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-lg font-semibold">
            Please connect your wallet to continue
          </p>
          <p className="text-muted-foreground">
            Use the connect button in the navigation bar
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
