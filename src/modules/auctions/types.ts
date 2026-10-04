export const auctionStatuses = [
  "DRAFT", "PENDING_APPROVAL", "SCHEDULED", "REGISTRATION_OPEN", "WAITING_ROOM", "LIVE", "ENDING", "ENDED",
  "SETTLEMENT", "COMPLETED", "PAUSED", "SUSPENDED", "CANCELLED", "DISPUTED", "RESERVE_NOT_MET",
] as const;
export type AuctionStatus = (typeof auctionStatuses)[number];

export interface AntiSnipingRules {
  enabled: boolean;
  windowSeconds: number;
  durationSeconds: number;
  /** null explicitly means unlimited; zero means no extensions. */
  maxExtensions: number | null;
}

export interface IncrementTier { fromMinor: bigint; incrementMinor: bigint }
export type IncrementRules =
  | { mode: "FIXED"; minimumMinor: bigint }
  | { mode: "TIERED"; tiers: readonly IncrementTier[] };

export interface AuctionState {
  id: string;
  ownerId: string;
  status: AuctionStatus;
  startingPriceMinor: bigint;
  currentPriceMinor: bigint;
  reservePriceMinor: bigint | null;
  highestBidderId: string | null;
  highestBidId: string | null;
  sequence: number;
  version: number;
  startAt: number;
  effectiveEndAt: number;
  extensions: number;
  antiSniping: AntiSnipingRules;
  increment: IncrementRules;
  allowCustomBids: boolean;
  depositRequired: boolean;
  depositAmountMinor: bigint;
  pausedRemainingMs: number | null;
  finalizedAt: number | null;
}

export interface BidderEligibility {
  userId: string;
  accountActive: boolean;
  registration: "PENDING" | "PAYMENT_PENDING" | "AUTHORIZED" | "QUALIFIED" | "REJECTED" | "CANCELLED" | "EXPIRED" | "SUSPENDED" | null;
  deposit: { status: string; amountMinor: bigint; expiresAt: number | null } | null;
}

export interface BidCommand {
  auctionId: string;
  bidRequestId: string;
  amountMinor: bigint;
  expectedSequence?: number;
}

export interface AcceptedBid {
  id: string;
  auctionId: string;
  userId: string;
  amountMinor: bigint;
  sequence: number;
  bidRequestId: string;
  acceptedAt: number;
}

export interface AuctionResult {
  auctionId: string;
  outcome: "SOLD" | "NO_BIDS" | "RESERVE_NOT_MET";
  winnerId: string | null;
  winningBidId: string | null;
  winningAmountMinor: bigint | null;
  finalizedAt: number;
}
