import { baseSepolia } from "viem/chains";
import type { Address } from "viem";

import {
  CERTIFICATE_NFT_ADDRESS,
  DISPUTE_RESOLVER_ADDRESS,
  MOCK_USDC_ADDRESS,
  PEER_LEARNING_HUB_ADDRESS,
  SESSION_ESCROW_ADDRESS,
  TUTOR_REGISTRY_ADDRESS,
} from "@/lib/address";
import { certificateNFTAbi } from "@/lib/abi/certificate-nft";
import { disputeResolverAbi } from "@/lib/abi/dispute-resolver";
import { mockUSDCAbi } from "@/lib/abi/mock-usdc";
import { peerLearningHubAbi } from "@/lib/abi/peer-learning-hub";
import { sessionEscrowAbi } from "@/lib/abi/session-escrow";
import { tutorRegistryAbi } from "@/lib/abi/tutor-registry";

export const APP_CHAIN = baseSepolia;

const asAddress = (value: string) => value as Address;

export const peerLearningHubContract = {
  address: asAddress(PEER_LEARNING_HUB_ADDRESS),
  abi: peerLearningHubAbi,
  chainId: APP_CHAIN.id,
} as const;

export const tutorRegistryContract = {
  address: asAddress(TUTOR_REGISTRY_ADDRESS),
  abi: tutorRegistryAbi,
  chainId: APP_CHAIN.id,
} as const;

export const sessionEscrowContract = {
  address: asAddress(SESSION_ESCROW_ADDRESS),
  abi: sessionEscrowAbi,
  chainId: APP_CHAIN.id,
} as const;

export const disputeResolverContract = {
  address: asAddress(DISPUTE_RESOLVER_ADDRESS),
  abi: disputeResolverAbi,
  chainId: APP_CHAIN.id,
} as const;

export const certificateNftContract = {
  address: asAddress(CERTIFICATE_NFT_ADDRESS),
  abi: certificateNFTAbi,
  chainId: APP_CHAIN.id,
} as const;

export const mockUsdcContract = {
  address: asAddress(MOCK_USDC_ADDRESS),
  abi: mockUSDCAbi,
  chainId: APP_CHAIN.id,
} as const;


