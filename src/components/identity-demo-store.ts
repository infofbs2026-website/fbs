'use client';

// This preview is intentionally memory-only. It never posts identity data or files.
export interface IdentityDemoInput {
  ownerId: string;
  fullName: string;
  nationalId: string;
  birthDate: string;
  phone: string;
  email: string;
  city: string;
  front: File;
  back: File;
}

export interface IdentityDemoSubmission extends IdentityDemoInput {
  status: 'pending' | 'approved' | 'rejected';
}

let submission: IdentityDemoSubmission | null = null;
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

export function subscribeIdentityDemo(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getIdentityDemo(ownerId: string) {
  return submission?.ownerId === ownerId ? submission : null;
}

export function canIdentityDemoBid(ownerId: string) {
  return getIdentityDemo(ownerId)?.status === 'approved';
}

export function submitIdentityDemo(input: IdentityDemoInput) {
  submission = { ...input, status: 'pending' };
  notify();
}

export function reviewIdentityDemo(ownerId: string, decision: 'approved' | 'rejected') {
  if (!submission || submission.ownerId !== ownerId || submission.status !== 'pending') return false;
  submission = { ...submission, status: decision };
  notify();
  return true;
}

export function clearIdentityDemo() {
  submission = null;
  notify();
}
