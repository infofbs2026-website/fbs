import { describe, expect, it } from 'vitest';
import { mfaQrImageSource } from '@/components/mfa';

describe('authenticator QR image', () => {
  const svg = '<svg xmlns="http://www.w3.org/2000/svg"><path fill="#000" d="M0 0" /></svg>';
  const normalized = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  it('displays both raw SVG and the SVG data URL returned by the authentication SDK', () => {
    expect(mfaQrImageSource(svg)).toBe(normalized);
    expect(mfaQrImageSource(`data:image/svg+xml;utf-8,${svg}`)).toBe(normalized);
    expect(mfaQrImageSource(`data:image/svg+xml;utf-8,${encodeURIComponent(svg)}`)).toBe(normalized);
  });

  it('rejects external URLs and malformed data instead of loading another image', () => {
    expect(mfaQrImageSource('https://example.com/qr.svg')).toBe('');
    expect(mfaQrImageSource('data:image/svg+xml;utf-8,not-an-svg')).toBe('');
    expect(mfaQrImageSource('data:image/svg+xml;base64,not valid')).toBe('');
  });
});
