import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const MobileStickyBar: React.FC = () => {
  const {
    activeProduct,
    selectedVariant,
    formatPrice,
    addToCart,
    setIsCartOpen,
  } = useStore();

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  const currentImg =
    activeProduct.images[selectedVariant.imageIndex || 0] || activeProduct.images[0];

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-neutral-200 z-40 px-3.5 py-2 shadow-xl transition-all duration-200 animate-in slide-in-from-bottom-2"
      style={{ maxHeight: '60px' }}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Left: Thumbnail & Price */}
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={currentImg.url}
            alt={activeProduct.brand}
            className="w-10 h-10 object-cover rounded bg-neutral-100 shrink-0 border border-neutral-200"
          />
          <div className="min-w-0">
            <div className="text-xs font-bold text-neutral-900 font-mono leading-tight">
              {formatPrice(activeProduct.basePriceEUR)}
            </div>
            <div className="text-[10px] text-neutral-500 truncate leading-tight mt-0.5">
              {selectedVariant.colorName.split('/')[0]}
            </div>
          </div>
        </div>

        {/* Right: Low-saturation Add to Bag CTA */}
        <button
          onClick={() => {
            addToCart(activeProduct, selectedVariant, 1);
            setIsCartOpen(true);
          }}
          className="h-9 px-4 bg-[#1F2429] hover:bg-black active:bg-black text-white font-medium text-xs rounded-md flex items-center justify-center gap-1.5 shrink-0 shadow-2xs transition-colors cursor-pointer"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add to Bag</span>
        </button>
      </div>
    </div>
  );
};
