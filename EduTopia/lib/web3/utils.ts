import { formatUnits, parseUnits } from "viem";

export const USDC_DECIMALS = 6;

export function toUsdcUnits(value: number | string): bigint {
  const asString = typeof value === "number" ? value.toString() : value;
  return parseUnits(asString, USDC_DECIMALS);
}

export function fromUsdcUnits(value?: bigint | null): number {
  if (!value) {
    return 0;
  }
  return Number(formatUnits(value, USDC_DECIMALS));
}

export function formatUsdc(value?: bigint | null, fractionDigits = 2): string {
  const amount = fromUsdcUnits(value);
  return `${amount.toFixed(fractionDigits)} USDC`;
}

export function hoursToSeconds(hours: number): bigint {
  if (Number.isNaN(hours)) {
    return 0n;
  }
  const seconds = Math.max(hours, 0) * 3600;
  return BigInt(Math.round(seconds));
}

export function truncateHash(hash?: string, length = 6) {
  if (!hash) return "";
  return `${hash.slice(0, length + 2)}…${hash.slice(-length)}`;
}


