"use client"

import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Lock, Award, Shield, Star } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-4 py-20 md:py-32 overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 dark:opacity-10"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-20 dark:opacity-10"></div>
          </div>

          <div className="container mx-auto max-w-4xl">
            <div className="text-center space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Welcome to the Future of Learning</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-balance">
                Learn Smarter with{" "}
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Blockchain-Powered Tutoring
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
                Connect with expert tutors. Pay securely with escrow. Earn verified certificates as NFTs. Transparent,
                trustworthy, and empowering peer learning.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="/browse">
                    Find a Tutor <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/become-tutor">Become a Tutor</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-20 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Edutopia?</h2>
              <p className="text-lg text-muted-foreground">Everything you need for secure, verified peer learning</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature: Escrow Payments */}
              <div className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
                <Lock className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Secure Escrow Payments</h3>
                <p className="text-sm text-muted-foreground">
                  Funds locked securely until session completion, protecting both students and tutors.
                </p>
              </div>

              {/* Feature: NFT Certificates */}
              <div className="p-6 rounded-lg bg-card border border-border hover:border-secondary/50 transition-colors">
                <Award className="w-12 h-12 text-secondary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Verified NFT Certificates</h3>
                <p className="text-sm text-muted-foreground">
                  Earn permanent, verifiable certificates for completed sessions on the blockchain.
                </p>
              </div>

              {/* Feature: Dispute Resolution */}
              <div className="p-6 rounded-lg bg-card border border-border hover:border-accent/50 transition-colors">
                <Shield className="w-12 h-12 text-accent mb-4" />
                <h3 className="font-semibold text-lg mb-2">Dispute Resolution</h3>
                <p className="text-sm text-muted-foreground">
                  Fair, transparent process for addressing any concerns during or after sessions.
                </p>
              </div>

              {/* Feature: Expert Tutors */}
              <div className="p-6 rounded-lg bg-card border border-border hover:border-primary/50 transition-colors">
                <Star className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Expert Tutors</h3>
                <p className="text-sm text-muted-foreground">
                  Verified tutors with ratings and reviews to help you find the perfect match.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="px-4 py-20">
          <div className="container mx-auto max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground">Simple, transparent peer learning</p>
            </div>

            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <div className="w-1 h-20 bg-border mt-2 md:h-32"></div>
                </div>
                <div className="pb-8">
                  <h3 className="text-xl font-bold mb-2">Connect Your Wallet</h3>
                  <p className="text-muted-foreground">
                    Securely connect using MetaMask, WalletConnect, Coinbase Wallet, or other Web3 wallets.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <div className="w-1 h-20 bg-border mt-2 md:h-32"></div>
                </div>
                <div className="pb-8">
                  <h3 className="text-xl font-bold mb-2">Browse & Book</h3>
                  <p className="text-muted-foreground">
                    Find tutors by subject, rate, or availability. Book sessions and pay securely through escrow.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                  <div className="w-1 h-20 bg-border mt-2 md:h-32"></div>
                </div>
                <div className="pb-8">
                  <h3 className="text-xl font-bold mb-2">Join & Learn</h3>
                  <p className="text-muted-foreground">
                    Attend live sessions with video, chat, and session timer. Track your progress in real-time.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 md:gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Earn & Verify</h3>
                  <p className="text-muted-foreground">
                    Upon completion, mint a verified NFT certificate and build your learning portfolio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="px-4 py-20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">2,547</div>
                <p className="text-muted-foreground">Sessions Completed</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-secondary mb-2">342</div>
                <p className="text-muted-foreground">Active Tutors</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">1,823</div>
                <p className="text-muted-foreground">Certificates Issued</p>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">$487K</div>
                <p className="text-muted-foreground">Total Value Locked</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-20">
          <div className="container mx-auto max-w-2xl text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Learning?</h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of students and tutors in the Edutopia community today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link href="/browse">Find a Tutor</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/become-tutor">Start Teaching</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

import { Sparkles } from "lucide-react"
