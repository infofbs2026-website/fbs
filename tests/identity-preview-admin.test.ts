import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const auth = vi.hoisted(() => ({ getViewer: vi.fn(), requirePermission: vi.fn() }));
vi.mock('@/lib/auth', () => auth);
vi.mock('next/navigation', () => ({ redirect: () => { throw new Error('REDIRECT_TO_LOGIN'); } }));

import IdentityPreviewPage from '@/app/admin/identity-preview/page';

beforeEach(() => {
  vi.resetAllMocks();
  auth.getViewer.mockResolvedValue({ id: 'admin-1' });
  auth.requirePermission.mockResolvedValue(undefined);
});

describe('identity administration preview', () => {
  it('requires permission before showing the demo review interface', async () => {
    const element = await IdentityPreviewPage();
    const html = renderToStaticMarkup(element);
    expect(html).toContain('مراجعة الهوية التجريبية');
    expect(auth.requirePermission).toHaveBeenCalledWith('user.view');
  });

  it('does not display the review interface when permission is denied', async () => {
    auth.requirePermission.mockRejectedValue(new Error('FORBIDDEN'));
    const element = await IdentityPreviewPage();
    const html = renderToStaticMarkup(element);
    expect(html).toContain('الوصول غير مسموح');
    expect(html).not.toContain('مراجعة الهوية التجريبية');
  });

  it('redirects signed-out visitors', async () => {
    auth.getViewer.mockResolvedValue(null);
    await expect(IdentityPreviewPage()).rejects.toThrow('REDIRECT_TO_LOGIN');
    expect(auth.requirePermission).not.toHaveBeenCalled();
  });
});
