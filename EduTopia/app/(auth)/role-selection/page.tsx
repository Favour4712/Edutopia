"use client";

import { useRouter } from "next/navigation";
import { useUserRole } from "@/lib/hooks/use-user-role";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BookOpen, Briefcase, ArrowRight, Wallet } from "lucide-react";

export default function RoleSelectionPage() {
  const router = useRouter();
  const { setRole } = useUserRole();

  const handleRoleSelect = (role: "student" | "tutor") => {
    setRole(role);

    if (role === "student") {
      router.push("/student/browse");
    } else {
      router.push("/tutor/register");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Role</h1>
            <p className="text-lg text-muted-foreground">
              Select whether you'd like to learn from expert mentors or teach and earn.
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Student Card */}
            <button
              onClick={() => handleRoleSelect("student")}
              className="group p-8 rounded-xl border-2 border-border hover:border-primary transition-all duration-300 bg-card hover:bg-accent/5 text-left"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-primary/10 mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>

              <h2 className="text-2xl font-bold mb-2">I Want to Learn</h2>
              <p className="text-muted-foreground mb-6">
                Browse our community of expert mentors, book sessions, and earn verified credentials for your achievements.
              </p>

              <ul className="space-y-2 mb-8 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  Find specialists by protocol and tooling
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  Book sessions securely with escrow
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  Earn NFT certificates on completion
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  Track your on-chain learning journey
                </li>
              </ul>

              <div className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            {/* Tutor Card */}
            <button
              onClick={() => handleRoleSelect("tutor")}
              className="group p-8 rounded-xl border-2 border-border hover:border-secondary transition-all duration-300 bg-card hover:bg-secondary/5 text-left"
            >
              <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-secondary/10 mb-6 group-hover:scale-110 transition-transform">
                <Briefcase className="w-8 h-8 text-secondary" />
              </div>

              <h2 className="text-2xl font-bold mb-2">I Want to Teach</h2>
              <p className="text-muted-foreground mb-6">
                Share your expertise with builders worldwide, set your own rates, and grow your reputation with ratings and reviews.
              </p>

              <ul className="space-y-2 mb-8 text-sm">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                  Set your own hourly rates in ETH
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                  Manage availability and workflows
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                  Build your reputation with ratings
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                  Earn through verified escrow sessions
                </li>
              </ul>

              <div className="inline-flex items-center gap-2 text-secondary font-semibold group-hover:gap-3 transition-all">
                Start Teaching
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>
          </div>

          {/* Wallet Info */}
          <div className="mt-12 flex flex-col items-center gap-4 rounded-lg border border-border bg-muted/30 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Wallet className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Wallet Connection
              </p>
              <p className="text-sm text-muted-foreground">
                Wallet auth is disabled in this demo build. The “Connect Wallet” button in the header is static.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
