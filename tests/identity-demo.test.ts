import { afterEach, describe, expect, it, vi } from 'vitest';
import { canIdentityDemoBid, clearIdentityDemo, getIdentityDemo, reviewIdentityDemo, submitIdentityDemo, subscribeIdentityDemo } from '@/components/identity-demo-store';

afterEach(() => clearIdentityDemo());

function sample(ownerId = 'test-owner') {
  return {
    ownerId, fullName: 'اسم تجريبي', nationalId: '0000000000', birthDate: '2000-01-01',
    phone: '0000000000', email: 'test@example.com', city: 'مدينة تجريبية',
    front: new File(['test-front'], 'front.png', { type: 'image/png' }),
    back: new File(['test-back'], 'back.png', { type: 'image/png' })
  };
}

describe('identity preview', () => {
  it('keeps the submission scoped to the same browser session and simulates approval before bidding', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeIdentityDemo(listener);
    submitIdentityDemo(sample());
    expect(getIdentityDemo('test-owner')?.status).toBe('pending');
    expect(getIdentityDemo('other-user')).toBeNull();
    expect(canIdentityDemoBid('test-owner')).toBe(false);
    expect(reviewIdentityDemo('other-user', 'approved')).toBe(false);
    expect(reviewIdentityDemo('test-owner', 'approved')).toBe(true);
    expect(canIdentityDemoBid('test-owner')).toBe(true);
    expect(reviewIdentityDemo('test-owner', 'rejected')).toBe(false);
    clearIdentityDemo();
    expect(getIdentityDemo('test-owner')).toBeNull();
    expect(listener).toHaveBeenCalledTimes(3);
    unsubscribe();
  });

  it('does not allow bidding in the rejection simulation', () => {
    submitIdentityDemo(sample());
    expect(reviewIdentityDemo('test-owner', 'rejected')).toBe(true);
    expect(canIdentityDemoBid('test-owner')).toBe(false);
  });
});
