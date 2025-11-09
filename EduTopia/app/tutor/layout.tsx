import type React from "react"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { TutorSidebar } from "@/components/layout/tutor-sidebar"
import { WalletGuard } from "@/components/web3/wallet-guard"

export default function TutorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WalletGuard>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex">
          <TutorSidebar />
          <main className="flex-1">{children}</main>
        </div>
        <Footer />
      </div>
    </WalletGuard>
  )
}
