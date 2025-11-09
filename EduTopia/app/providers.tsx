"use client";

import type { ReactNode } from "react";

import { Analytics } from "@vercel/analytics/next";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import { baseSepolia } from "@reown/appkit/networks";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";
import { wagmiAdapter, projectId } from "@/config";

// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("NEXT_PUBLIC_REOWN_PROJECT_ID is not defined");
}

// Set up metadata
const metadata = {
  name: "Edutopia",
  description: "Blockchain-powered peer learning platform",
  url: "https://edutopia.app",
  icons: ["https://edutopia.app/icon.svg"],
};

// Create the modal
createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [baseSepolia],
  defaultNetwork: baseSepolia,
  metadata: metadata,
  features: {
    analytics: true,
  },
});

export function Providers({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <Analytics />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default Providers;
