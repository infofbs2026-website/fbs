import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  session: vi.fn(),
  admin: vi.fn(),
  readJson: vi.fn(),
  rateLimit: vi.fn(),
  sendOtpEmail: vi.fn(),
  signUp: vi.fn(),
  resend: vi.fn(),
  verifyOtp: vi.fn(),
  generateLink: vi.fn()
}));

vi.mock('@/lib/supabase/server', () => ({ createSessionClient: mocks.session, createAdminClient: mocks.admin }));
vi.mock('@/lib/rate-limit', () => ({ rateLimit: mocks.rateLimit }));
vi.mock('@/lib/email', () => ({ sendOtpEmail: mocks.sendOtpEmail }));
vi.mock('@/lib/env', () => ({ siteOrigin: () => 'https://fbsplates.com' }));
vi.mock('@/lib/api', async (importOriginal) => ({
  ...await importOriginal<typeof import('@/lib/api')>(),
  assertOrigin: vi.fn(), readJson: mocks.readJson
}));

import { POST } from '@/app/api/v1/auth/[action]/route';

const email = 'member@example.com';
async function request(action: string, body: Record<string, unknown>) {
  mocks.readJson.mockResolvedValueOnce(body);
  const response = await POST(new Request(`https://fbsplates.com/api/v1/auth/${action}`, { method: 'POST' }), { params: Promise.resolve({ action }) });
  return { response, body: await response.json() };
}

beforeEach(() => {
  vi.clearAllMocks();
  mocks.rateLimit.mockResolvedValue(undefined);
  mocks.session.mockResolvedValue({ auth: { signUp: mocks.signUp, resend: mocks.resend, verifyOtp: mocks.verifyOtp } });
  mocks.admin.mockReturnValue({
    auth: { admin: { generateLink: mocks.generateLink } },
    from: () => ({ select: () => ({ ilike: () => ({ maybeSingle: async () => ({ data: null }) }) }) })
  });
  mocks.signUp.mockResolvedValue({ data: { user: { identities: [{}] }, session: null }, error: null });
  mocks.resend.mockResolvedValue({ data: {}, error: null });
});

describe('signup email confirmation', () => {
  it('uses the signup confirmation email once and does not generate a second token', async () => {
    const { response, body } = await request('register', { email, password: 'password123', displayName: 'عضو جديد' });
    expect(response.status).toBe(200);
    expect(body.data).toMatchObject({ step: 'otp', email });
    expect(mocks.signUp).toHaveBeenCalledWith({ email, password: 'password123', options: { data: { display_name: 'عضو جديد' }, emailRedirectTo: 'https://fbsplates.com/auth/callback' } });
    expect(mocks.generateLink).not.toHaveBeenCalled();
    expect(mocks.sendOtpEmail).not.toHaveBeenCalled();
  });

  it('resends a signup token for both the existing-account screen and the OTP screen', async () => {
    const first = await request('verify', { email });
    const second = await request('resend-otp', { email, type: 'signup' });
    expect(first.body.data).toMatchObject({ step: 'otp', email });
    expect(second.response.status).toBe(200);
    expect(mocks.resend).toHaveBeenCalledTimes(2);
    expect(mocks.resend).toHaveBeenCalledWith({ type: 'signup', email, options: { emailRedirectTo: 'https://fbsplates.com/auth/callback' } });
    expect(mocks.generateLink).not.toHaveBeenCalled();
  });

  it('verifies the signup code and only redirects when a session exists', async () => {
    mocks.verifyOtp.mockResolvedValueOnce({ data: { session: { access_token: 'session' } }, error: null });
    const valid = await request('verify-otp', { email, token: '123456', type: 'signup' });
    expect(valid.body.data.redirect).toBe('/account');
    expect(mocks.verifyOtp).toHaveBeenCalledWith({ email, token: '123456', type: 'signup' });
    mocks.verifyOtp.mockResolvedValueOnce({ data: { session: null }, error: { message: 'expired' } });
    const invalid = await request('verify-otp', { email, token: '123456', type: 'signup' });
    expect(invalid.response.status).toBe(400);
    expect(invalid.body.error.message).toContain('منتهي الصلاحية');
  });

  it('reports resend failures instead of claiming that an email was sent', async () => {
    mocks.resend.mockResolvedValueOnce({ error: { message: 'rate limit' } });
    const { response, body } = await request('resend-otp', { email, type: 'signup' });
    expect(response.status).toBe(400);
    expect(body.error.message).toContain('تعذر إعادة إرسال');
  });

  it('does not pretend signup succeeded when authentication is unavailable', async () => {
    mocks.session.mockResolvedValueOnce(null);
    const { response } = await request('register', { email, password: 'password123' });
    expect(response.status).toBe(503);
  });

  it('reports recovery email delivery failure', async () => {
    mocks.generateLink.mockResolvedValue({ data: { properties: { email_otp: '123456' } }, error: null });
    mocks.sendOtpEmail.mockResolvedValue({ sent: false });
    const { response, body } = await request('forgot-password', { email });
    expect(response.status).toBe(503);
    expect(body.error.message).toContain('تعذر إرسال');
  });
});
