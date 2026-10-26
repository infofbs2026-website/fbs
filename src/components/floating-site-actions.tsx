'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store } from 'lucide-react';
import styles from './floating-site-actions.module.css';

// Match the existing contact links until the official WhatsApp number is set.
const WHATSAPP_URL = 'https://wa.me/966500000000';
const HIDDEN_ROUTES = [
  '/account',
  '/admin',
  '/auction-room',
  '/studio-3d',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/verify',
  '/auth',
];

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M20.5 11.7a8.3 8.3 0 0 1-12.3 7.3l-4.7 1.5 1.45-4.6A8.3 8.3 0 1 1 20.5 11.7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479s1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.078 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347Z"
        fill="currentColor"
        transform="translate(1.8 1.8) scale(.82)"
      />
    </svg>
  );
}

export function FloatingSiteActions() {
  const pathname = usePathname();
  if (!pathname || HIDDEN_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    return null;
  }

  return (
    <nav className={styles.actions} aria-label="روابط سريعة">
      <a
        className={`${styles.action} ${styles.whatsapp}`}
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل مع FBS عبر واتساب (يفتح في نافذة جديدة)"
        title="تواصل عبر واتساب"
        data-floating-action="whatsapp"
      >
        <WhatsAppIcon />
      </a>
      {pathname === '/' ? (
        <Link
          className={`${styles.action} ${styles.store}`}
          href="/plates"
          aria-label="تصفح متجر اللوحات"
          title="متجر اللوحات"
          data-floating-action="store"
        >
          <Store aria-hidden="true" strokeWidth={1.8} />
        </Link>
      ) : null}
    </nav>
  );
}
