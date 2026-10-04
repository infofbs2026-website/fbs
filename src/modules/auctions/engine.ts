import { DomainError } from "../../lib/errors";
import { addMoney, minorMoney } from "../../lib/money";
import { assertServerTime, incrementCounter } from "./state-machine";
import type { AcceptedBid, AuctionResult, AuctionState, BidCommand, BidderEligibility, IncrementRules } from "./types";

export function minimumIncrement(price: bigint, rules: IncrementRules): bigint {
  minorMoney(price);
  if (rules.mode === "FIXED") {
    if (minorMoney(rules.minimumMinor) === 0n) throw new DomainError("INVALID_INPUT", "Increment must be positive.");
    return rules.minimumMinor;
  }
  if (rules.tiers.length === 0 || rules.tiers[0].fromMinor !== 0n) {
    throw new DomainError("INVALID_INPUT", "Increment tiers must begin at zero.");
  }
  let selected = rules.tiers[0].incrementMinor;
  let previous = -1n;
  for (const tier of rules.tiers) {
    if (minorMoney(tier.fromMinor) <= previous || minorMoney(tier.incrementMinor) === 0n) {
      throw new DomainError("INVALID_INPUT", "Increment tiers must be positive, ordered and non-overlapping.");
    }
    if (price >= tier.fromMinor) selected = tier.incrementMinor;
    previous = tier.fromMinor;
  }
  return selected;
}

export function minimumNextBid(state: AuctionState): bigint {
  return state.sequence === 0 ? minorMoney(state.startingPriceMinor) : addMoney(state.currentPriceMinor, minimumIncrement(state.currentPriceMinor, state.increment));
}

/** Pure policy evaluation. Only the database transaction can authorize a real bid. */
export function extensionForBid(state: AuctionState, now: number): { effectiveEndAt: number; extensions: number } {
  assertServerTime(now);
  const rules = state.antiSniping;
  const unchanged = { effectiveEndAt: state.effectiveEndAt, extensions: state.extensions };
  if (!rules.enabled) return unchanged;
  if (!Number.isSafeInteger(rules.windowSeconds) || rules.windowSeconds <= 0 ||
      !Number.isSafeInteger(rules.durationSeconds) || rules.durationSeconds <= 0 ||
      (rules.maxExtensions !== null && (!Number.isSafeInteger(rules.maxExtensions) || rules.maxExtensions < 0))) {
    throw new DomainError("INVALID_INPUT", "Invalid anti-sniping configuration.");
  }
  const remaining = state.effectiveEndAt - now;
  if (remaining <= 0 || remaining > rules.windowSeconds * 1000 ||
      (rules.maxExtensions !== null && state.extensions >= rules.maxExtensions)) return unchanged;
  const effectiveEndAt = state.effectiveEndAt + rules.durationSeconds * 1000;
  assertServerTime(effectiveEndAt);
  return { effectiveEndAt, extensions: incrementCounter(state.extensions) };
}

export function validateBid(state: AuctionState, bidder: BidderEligibility, command: BidCommand, now: number): void {
  assertServerTime(now);
  minorMoney(command.amountMinor);
  if (command.auctionId !== state.id) throw new DomainError("AUCTION_NOT_FOUND", undefined, {}, 404);
  if (!bidder.accountActive) throw new DomainError("ACCOUNT_SUSPENDED", undefined, {}, 403);
  if (state.ownerId === bidder.userId) throw new DomainError("FORBIDDEN", "لا يمكن لصاحب اللوحة المزايدة عليها.", {}, 403);
  if (state.status === "PAUSED" || state.status === "SUSPENDED") throw new DomainError("AUCTION_PAUSED", undefined, {}, 409);
  if (state.status !== "LIVE") throw new DomainError("AUCTION_NOT_LIVE", undefined, {}, 409);
  if (now < state.startAt) throw new DomainError("AUCTION_NOT_LIVE", undefined, {}, 409);
  if (now >= state.effectiveEndAt) throw new DomainError("AUCTION_ENDED", undefined, {}, 409);
  if (bidder.registration === null) throw new DomainError("REGISTRATION_REQUIRED", undefined, {}, 403);
  if (bidder.registration !== "QUALIFIED") throw new DomainError("NOT_QUALIFIED", undefined, {}, 403);
  const nextEnd = extensionForBid(state, now).effectiveEndAt;
  if (state.depositRequired) {
    if (!bidder.deposit || bidder.deposit.status !== "AUTHORIZED" || bidder.deposit.amountMinor < state.depositAmountMinor) {
      throw new DomainError("DEPOSIT_REQUIRED", undefined, {}, 403);
    }
    if (bidder.deposit.expiresAt === null || bidder.deposit.expiresAt <= nextEnd) {
      throw new DomainError("DEPOSIT_EXPIRED", undefined, {}, 403);
    }
  }
  if (command.expectedSequence !== undefined && command.expectedSequence !== state.sequence) {
    throw new DomainError("STALE_BID", undefined, { currentBid: state.currentPriceMinor.toString(), minimumNextBid: minimumNextBid(state).toString(), sequence: state.sequence }, 409);
  }
  const minimum = minimumNextBid(state);
  if (command.amountMinor < minimum || command.amountMinor <= 0n) {
    throw new DomainError("BID_TOO_LOW", undefined, { minimumNextBid: minimum.toString() }, 409);
  }
  if (!state.allowCustomBids && command.amountMinor !== minimum) {
    throw new DomainError("INVALID_INPUT", "المزاد يسمح بقيمة المزايدة التالية فقط.");
  }
}

/** A deterministic reference implementation, never a process-local production store. */
export function evaluateBid(state: AuctionState, bidder: BidderEligibility, command: BidCommand, now: number, bidId: string): { state: AuctionState; bid: AcceptedBid; extended: boolean } {
  validateBid(state, bidder, command, now);
  const extension = extensionForBid(state, now);
  const sequence = incrementCounter(state.sequence);
  return {
    state: { ...state, ...extension, currentPriceMinor: command.amountMinor, highestBidderId: bidder.userId, highestBidId: bidId, sequence, version: incrementCounter(state.version) },
    bid: { id: bidId, auctionId: state.id, userId: bidder.userId, amountMinor: command.amountMinor, sequence, bidRequestId: command.bidRequestId, acceptedAt: now },
    extended: extension.extensions !== state.extensions,
  };
}

export function assertBidReplay(existing: AcceptedBid, bidderId: string, command: BidCommand): AcceptedBid {
  if (existing.userId !== bidderId || existing.auctionId !== command.auctionId || existing.amountMinor !== command.amountMinor || existing.bidRequestId !== command.bidRequestId) {
    throw new DomainError("IDEMPOTENCY_CONFLICT", undefined, {}, 409);
  }
  return existing;
}

export function finalizeAuction(state: AuctionState, now: number, existing: AuctionResult | null = null): { state: AuctionState; result: AuctionResult } {
  assertServerTime(now);
  if (existing) {
    if (existing.auctionId !== state.id || state.finalizedAt !== existing.finalizedAt) throw new DomainError("SYSTEM_DEGRADED", "Finalization record mismatch.", {}, 503);
    return { state, result: existing };
  }
  if (state.finalizedAt !== null) throw new DomainError("SYSTEM_DEGRADED", "Finalization result missing.", {}, 503);
  if (!["LIVE", "ENDING"].includes(state.status)) throw new DomainError("INVALID_TRANSITION", undefined, {}, 409);
  if (now < state.effectiveEndAt) throw new DomainError("INVALID_TRANSITION", "Auction deadline has not been reached.", {}, 409);
  const hasBids = state.sequence > 0;
  if (hasBids && (!state.highestBidderId || !state.highestBidId)) throw new DomainError("SYSTEM_DEGRADED", "Winning bid is missing.", {}, 503);
  const reserveMet = state.reservePriceMinor === null || state.currentPriceMinor >= state.reservePriceMinor;
  const outcome = !hasBids ? "NO_BIDS" : reserveMet ? "SOLD" : "RESERVE_NOT_MET";
  return {
    state: { ...state, status: outcome === "RESERVE_NOT_MET" ? "RESERVE_NOT_MET" : "ENDED", finalizedAt: now, version: incrementCounter(state.version) },
    result: { auctionId: state.id, outcome, winnerId: outcome === "SOLD" ? state.highestBidderId : null, winningBidId: outcome === "SOLD" ? state.highestBidId : null, winningAmountMinor: outcome === "SOLD" ? state.currentPriceMinor : null, finalizedAt: now },
  };
}
