"use client";

import type React from "react";

interface WalletGuardProps {
  children: React.ReactNode;
  requiredRole?: "student" | "tutor";
}

/**
 * Placeholder wallet guard. With wallet connectivity disabled, this simply renders its children.
 */
export function WalletGuard({ children }: WalletGuardProps) {
  return <>{children}</>;
}
