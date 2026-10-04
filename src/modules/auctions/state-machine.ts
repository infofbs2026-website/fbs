import { DomainError } from "../../lib/errors";
import type { AuctionState, AuctionStatus } from "./types";

const transitions: Record<AuctionStatus, readonly AuctionStatus[]> = {
  DRAFT: ["PENDING_APPROVAL", "CANCELLED"],
  PENDING_APPROVAL: ["DRAFT", "SCHEDULED", "CANCELLED"],
  SCHEDULED: ["REGISTRATION_OPEN", "SUSPENDED", "CANCELLED"],
  REGISTRATION_OPEN: ["WAITING_ROOM", "SUSPENDED", "CANCELLED"],
  WAITING_ROOM: ["LIVE", "SUSPENDED", "CANCELLED"],
  LIVE: ["PAUSED", "SUSPENDED", "ENDING", "CANCELLED"],
  PAUSED: ["LIVE", "SUSPENDED", "CANCELLED"],
  SUSPENDED: ["CANCELLED"],
  ENDING: ["ENDED", "RESERVE_NOT_MET"],
  ENDED: ["SETTLEMENT", "DISPUTED"],
  RESERVE_NOT_MET: [],
  SETTLEMENT: ["COMPLETED", "DISPUTED"],
  COMPLETED: [],
  CANCELLED: [],
  DISPUTED: ["SETTLEMENT", "CANCELLED"],
};

export function assertTransition(from: AuctionStatus, to: AuctionStatus): void {
  if (!transitions[from].includes(to)) {
    throw new DomainError("INVALID_TRANSITION", undefined, { from, to }, 409);
  }
}

export function incrementCounter(value: number): number {
  if (!Number.isSafeInteger(value) || value < 0 || value >= Number.MAX_SAFE_INTEGER) {
    throw new DomainError("SYSTEM_DEGRADED", "Auction counter capacity exceeded.", {}, 503);
  }
  return value + 1;
}

export function assertServerTime(now: number): void {
  if (!Number.isSafeInteger(now) || now < 0) throw new DomainError("INVALID_INPUT", "Invalid server timestamp.");
}

export function pauseAuction(state: AuctionState, now: number): AuctionState {
  assertServerTime(now);
  assertTransition(state.status, "PAUSED");
  if (now >= state.effectiveEndAt) throw new DomainError("AUCTION_ENDED", undefined, {}, 409);
  return { ...state, status: "PAUSED", pausedRemainingMs: state.effectiveEndAt - now, version: incrementCounter(state.version) };
}

export function resumeAuction(state: AuctionState, now: number): AuctionState {
  assertServerTime(now);
  if (state.status !== "PAUSED" || state.pausedRemainingMs === null || state.pausedRemainingMs <= 0) {
    throw new DomainError("INVALID_TRANSITION", "Only an explicitly paused auction can resume.", {}, 409);
  }
  const effectiveEndAt = now + state.pausedRemainingMs;
  assertServerTime(effectiveEndAt);
  return { ...state, status: "LIVE", effectiveEndAt, pausedRemainingMs: null, version: incrementCounter(state.version) };
}
