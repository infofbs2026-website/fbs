'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Share2, Check } from 'lucide-react';

interface SharePlateButtonProps {
  slug: string;
  plateLabel?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function SharePlateButton({
  slug,
  plateLabel,
  size = 'sm',
  className = ''
}: SharePlateButtonProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleShare = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (typeof window === 'undefined') return;
    const shareUrl = `${window.location.origin}/plates/${slug}`;
    const shareTitle = plateLabel
      ? `لوحة مميزة (${plateLabel}) — فارس بن سعود`
      : 'لوحة مميزة — فارس بن سعود';

    let didCopy = false;
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        didCopy = true;
      } catch {
        // Fallback below
      }
    }

    if (!didCopy) {
      try {
        const ta = document.createElement('textarea');
        ta.value = shareUrl;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        didCopy = true;
      } catch {
        // Ignore clipboard errors
      }
    }

    if (didCopy) {
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setCopied(false);
      }, 2200);
    }

    if (
      typeof navigator.share === 'function' &&
      window.matchMedia?.('(pointer: coarse)').matches
    ) {
      try {
        await navigator.share({
          title: shareTitle,
          url: shareUrl
        });
      } catch {
        // User dismissed native share sheet — link is already copied
      }
    }
  };

  const dims = size === 'md' ? 'h-9 w-9 rounded-xl' : 'h-7 w-7 rounded-lg';
  const iconSize = size === 'md' ? 15 : 13;

  return (
    <>
      <button
        type="button"
        onClick={handleShare}
        aria-label={copied ? 'تم نسخ رابط اللوحة' : 'مشاركة رابط اللوحة'}
        title={copied ? 'تم نسخ رابط اللوحة' : 'مشاركة اللوحة عبر الرابط'}
        data-pf-action="share-plate"
        className={`flex ${dims} items-center justify-center border transition-all active:scale-95 shrink-0 ${
          copied
            ? 'border-emerald-300 bg-emerald-50 text-emerald-600 shadow-2xs'
            : 'border-[#E5E2D9] bg-[#FAF9F6] text-slate-500 hover:border-[#D9BB81] hover:bg-[#FAF7F0] hover:text-[#8C6B2D]'
        } ${className}`}
      >
        {copied ? (
          <Check size={iconSize} strokeWidth={2.5} />
        ) : (
          <Share2 size={iconSize} />
        )}
      </button>

      {copied &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            role="status"
            aria-live="polite"
            dir="rtl"
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[150] inline-flex items-center gap-2 rounded-xl border border-[#D9BB81]/45 bg-[#14243C] px-4 py-2.5 pf-type-micro font-bold text-white shadow-[0_14px_32px_rgba(8,22,43,0.35)] pointer-events-none"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 shrink-0">
              <Check size={12} strokeWidth={2.8} />
            </span>
            <span>تم نسخ رابط اللوحة للمشاركة</span>
          </div>,
          document.body
        )}
    </>
  );
}
