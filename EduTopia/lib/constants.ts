// Smart Contract Addresses (update with actual deployed addresses)
export const CONTRACT_ADDRESSES = {
  TUTOR_REGISTRY: process.env.NEXT_PUBLIC_TUTOR_REGISTRY_ADDRESS || "0x0000000000000000000000000000000000000000",
  SESSION_ESCROW: process.env.NEXT_PUBLIC_SESSION_ESCROW_ADDRESS || "0x0000000000000000000000000000000000000000",
  DISPUTE_RESOLVER: process.env.NEXT_PUBLIC_DISPUTE_RESOLVER_ADDRESS || "0x0000000000000000000000000000000000000000",
  CERTIFICATE_NFT: process.env.NEXT_PUBLIC_CERTIFICATE_NFT_ADDRESS || "0x0000000000000000000000000000000000000000",
}

// Subject Categories
export const SUBJECTS = [
  "Smart Contract Development",
  "Solidity Fundamentals",
  "Rust for Solana",
  "Move Language on Sui",
  "Zero-Knowledge Proofs",
  "Layer 2 Scaling",
  "DeFi Strategy",
  "Tokenomics",
  "DAO Governance",
  "Blockchain Security",
  "Smart Contract Auditing",
  "MEV Research",
  "Cross-Chain Bridges",
  "NFT Product Design",
  "Web3 Frontend",
  "Crypto Community Management",
  "Validator Operations",
  "Privacy Protocols",
  "Crypto Legal & Compliance",
  "GameFi Design",
]

// Platform Fees (in basis points, e.g., 500 = 5%)
export const PLATFORM_FEE_BP = 500

// Session Durations (in hours)
export const SESSION_DURATIONS = [1, 1.5, 2, 3]

// Dispute Resolution Window (in hours)
export const DISPUTE_WINDOW_HOURS = 24
