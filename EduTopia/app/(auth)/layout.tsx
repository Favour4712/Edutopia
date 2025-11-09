import type React from "react"
import { WalletGuard } from "@/components/web3/wallet-guard"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <WalletGuard>{children}</WalletGuard>
}
