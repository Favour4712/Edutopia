"use client";

import type { ReactNode } from "react";
import { useState } from "react";

import { Analytics } from "@vercel/analytics/next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      <Analytics />
    </>
  );
}

export default Providers;

