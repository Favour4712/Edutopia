"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Sparkles className="w-6 h-6 text-primary" />
          <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
            Edutopia
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/browse"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Explore Mentors
          </Link>
          <Link
            href="/become-a-tutor"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Teach On-Chain
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Protocol Vision
          </Link>
        </div>

        {/* Wallet Connection */}
        <div className="flex items-center gap-4">
          <appkit-button />
        </div>
      </div>
    </nav>
  );
}
