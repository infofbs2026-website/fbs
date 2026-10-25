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

  const wishActive = mounted && wishlistCount > 0;
  const cartActive = mounted && cartCount > 0;

  return (
    <div className="relative w-full lg:w-auto rounded-2xl border border-[#D9BB81]/30 bg-[#060E1F]/90 p-1.5 backdrop-blur-xl shadow-[0_14px_34px_rgba(0,0,0,0.45)] shrink-0">
      {/* Subtle Top Gold Hairline */}
      <div className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#D9BB81]/60 to-transparent" />

      <div className="grid grid-cols-2 lg:flex items-center gap-1.5">
        {/* 1. المفضلة (Wishlist Pill) */}
        <button
          type="button"
          onClick={() => openDrawer('wishlist')}
          title="قائمة اللوحات المفضلة"
          aria-label="قائمة اللوحات المفضلة"
          className={`group relative flex h-10 sm:h-[42px] items-center justify-center gap-2 rounded-xl px-3.5 sm:px-4 text-xs sm:text-[13px] font-bold transition-all duration-200 active:scale-[0.98] ${
            wishActive
              ? 'border border-rose-400/50 bg-rose-500/15 text-white shadow-xs'
              : 'border border-white/10 bg-white/[0.05] text-slate-100 hover:border-rose-400/45 hover:bg-rose-500/12 hover:text-white'
          }`}
        >
          <Heart
            size={15}
            className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
              wishActive
                ? 'fill-rose-500 text-rose-400'
                : 'text-rose-300/90 group-hover:text-rose-400'
            }`}
          />
          <span className="whitespace-nowrap">المفضلة</span>
          <span
            className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-norwester text-[11px] font-black leading-none transition-colors ${
              wishActive
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-white/10 text-slate-300'
            }`}
          >
            {mounted ? wishlistCount : 0}
          </span>
        </button>

        {/* 2. سلة الشراء (Cart Pill) */}
        <button
          type="button"
          onClick={() => openDrawer('cart')}
          title="سلة الشراء المباشر"
          aria-label="سلة الشراء المباشر"
          className={`group relative flex h-10 sm:h-[42px] items-center justify-center gap-2 rounded-xl px-3.5 sm:px-4 text-xs sm:text-[13px] font-bold transition-all duration-200 active:scale-[0.98] ${
            cartActive
              ? 'bg-gradient-to-r from-[#DFC38D] via-[#F2DFB6] to-[#C89B4B] text-[#071122] font-black border border-white/40 shadow-[0_4px_14px_rgba(217,187,129,0.3)]'
              : 'border border-[#D9BB81]/45 bg-gradient-to-r from-[#D9BB81]/16 via-[#D9BB81]/10 to-[#D9BB81]/16 text-[#F5E3BE] hover:border-[#D9BB81] hover:from-[#D9BB81]/24 hover:to-[#D9BB81]/24'
          }`}
        >
          <ShoppingBag
            size={15}
            className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${
              cartActive ? 'text-[#071122]' : 'text-[#E5C98E]'
            }`}
          />
          <span className="whitespace-nowrap">سلة الشراء</span>
          <span
            className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-norwester text-[11px] font-black leading-none transition-colors ${
              cartActive
                ? 'bg-[#071122] text-[#F5E3BE]'
                : 'bg-[#D9BB81]/25 text-[#F7E6C4]'
            }`}
          >
            {mounted ? cartCount : 0}
          </span>
        </button>
      </div>
    </div>
  );
}
