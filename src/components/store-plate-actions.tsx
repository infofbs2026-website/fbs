'use client';

import { useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag } from 'lucide-react';

const WISHLIST_KEY = 'fbs_store_wishlist';
const CART_KEY = 'fbs_store_cart';
const EMPTY_IDS = '[]';

function subscribe(onChange: () => void) {
  window.addEventListener('storage', onChange);
  window.addEventListener('fbs_store_updated', onChange);
  return () => {
    window.removeEventListener('storage', onChange);
    window.removeEventListener('fbs_store_updated', onChange);
  };
}

function readIds(key: string) {
  const value: unknown = JSON.parse(window.localStorage.getItem(key) ?? EMPTY_IDS);
  if (!Array.isArray(value) || value.some((id) => typeof id !== 'string')) {
    throw new Error('Invalid saved store data');
  }
  return value as string[];
}

function favoriteSnapshot(plateId: string) {
  try {
    return readIds(WISHLIST_KEY).includes(plateId);
  } catch {
    return false;
  }
}

export function StorePlateActions({ plateId }: { plateId: string }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const isFavorite = useSyncExternalStore(
    subscribe,
    () => favoriteSnapshot(plateId),
    () => false,
  );

  function updateStore(key: string, toggle: boolean) {
    try {
      const ids = readIds(key);
      const next = ids.includes(plateId)
        ? toggle ? ids.filter((id) => id !== plateId) : ids
        : [...ids, plateId];
      window.localStorage.setItem(key, JSON.stringify(next));
      window.dispatchEvent(new Event('fbs_store_updated'));
      setError('');
      return true;
    } catch {
      setError('تعذّر حفظ اختيارك. يرجى المحاولة مرة أخرى.');
      return false;
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        <button
          type="button"
          onClick={() => {
            if (updateStore(CART_KEY, false)) router.push('/plates?drawer=cart');
          }}
          className="btn btn-gold w-full font-bold"
        >
          <ShoppingBag size={17} />
          <span>الشراء المباشر</span>
        </button>
        <button
          type="button"
          aria-pressed={isFavorite}
          onClick={() => updateStore(WISHLIST_KEY, true)}
          className="btn btn-outline w-full font-bold"
        >
          <Heart size={17} className={isFavorite ? 'fill-rose-500 text-rose-500' : 'text-gold-accent'} />
          <span>{isFavorite ? 'محفوظة في المفضلة' : 'حفظ في المفضلة'}</span>
        </button>
      </div>
      {error ? <p role="alert" className="text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
