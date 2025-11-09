import type { Metadata } from "next";
import type { ReactNode } from "react";
import { headers } from "next/headers";

import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import Providers from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Edutopia - Blockchain Learning Platform",
  description: "Decentralized peer-to-peer learning with on-chain credentials",
  generator: "v0.app",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <Providers cookies={cookies}>{children}</Providers>
      </body>
    </html>
  );
}
