'use client';

import React, { useEffect, useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';

export function StoreHeaderActions() {
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateCounts = () => {
      try {
        const savedWish = localStorage.getItem('fbs_store_wishlist');
        const savedCart = localStorage.getItem('fbs_store_cart');
        setWishlistCount(savedWish ? JSON.parse(savedWish).length : 0);
        setCartCount(savedCart ? JSON.parse(savedCart).length : 0);
      } catch {
        // ignore storage parse errors
      }
    };

    updateCounts();
    window.addEventListener('storage', updateCounts);
    window.addEventListener('fbs_store_updated', updateCounts);
    return () => {
      window.removeEventListener('storage', updateCounts);
      window.removeEventListener('fbs_store_updated', updateCounts);
    };
  }, []);

  const openDrawer = (tab: 'cart' | 'wishlist') => {
    window.dispatchEvent(new CustomEvent('fbs_open_store_drawer', { detail: tab }));
  };

  return (
    <div className="flex items-center gap-3">
      {/* 1. المفضلة (Wishlist Button) */}
      <button
        type="button"
        onClick={() => openDrawer('wishlist')}
        title="اللوحات المفضلة"
        aria-label="اللوحات المفضلة"
        className="group relative flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.07] text-slate-200 shadow-[0_8px_24px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-400/50 hover:bg-rose-500/15 hover:text-white active:scale-95"
      >
        <Heart
          size={22}
          className={`transition-transform duration-300 group-hover:scale-110 ${
            mounted && wishlistCount > 0
              ? 'fill-rose-500 text-rose-500'
              : 'text-slate-300 group-hover:text-rose-400'
          }`}
        />

        {/* Wishlist Notification Badge */}
        {mounted && wishlistCount > 0 && (
          <span className="absolute -top-1.5 -end-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 font-norwester text-[11px] font-black text-white shadow-lg ring-2 ring-[#0a1329] animate-fade-in-up">
            {wishlistCount}
          </span>
        )}
      </button>

      {/* 2. سلة الشراء (Cart Button) */}
      <button
        type="button"
        onClick={() => openDrawer('cart')}
        title="سلة الشراء"
        aria-label="سلة الشراء"
        className="group relative flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-2xl border border-gold/40 bg-gradient-to-b from-[#101e3d]/90 to-[#091224]/90 text-gold shadow-[0_8px_24px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-gold/20 active:scale-95"
      >
        <ShoppingBag
          size={22}
          className="text-gold transition-transform duration-300 group-hover:scale-110"
        />

        {/* Cart Notification Badge */}
        {mounted && cartCount > 0 && (
          <span className="absolute -top-1.5 -end-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-[#d9b87f] to-[#cb9b48] px-1 font-norwester text-[11px] font-black text-navy-deep shadow-lg ring-2 ring-[#0a1329] animate-fade-in-up">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );
}
