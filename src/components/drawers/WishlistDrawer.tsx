import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PRODUCTS } from '../../data/mockData';

export const WishlistDrawer: React.FC = () => {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    toggleWishlist,
    formatPrice,
    addToCart,
    showToast,
  } = useStore();

  if (!isWishlistOpen) return null;

  const handleMoveToCart = (item: any) => {
    const prod = PRODUCTS.find((p) => p.id === item.productId);
    if (prod) {
      addToCart(prod, prod.variants[0], 1);
      toggleWishlist(prod);
      showToast('Moved to bag');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        onClick={() => setIsWishlistOpen(false)}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <Heart className="w-4.5 h-4.5 text-neutral-800" />
            <span className="font-semibold text-base text-neutral-900">
              Saved Items ({wishlist.length})
            </span>
          </div>
          <button
            onClick={() => setIsWishlistOpen(false)}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 thin-scrollbar">
          {wishlist.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                <Heart className="w-7 h-7" />
              </div>
              <div className="font-medium text-neutral-800 text-sm">Your collection is empty</div>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Save your favorite chairs, patio lounge sets, and home pieces to review later.
              </p>
            </div>
          ) : (
            wishlist.map((item) => (
              <div
                key={item.productId}
                className="flex gap-3.5 pb-4 border-b border-neutral-100 last:border-0"
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-20 h-20 object-cover rounded-md bg-neutral-50 border border-neutral-200 shrink-0"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                        {item.brand}
                      </span>
                      <button
                        onClick={() => {
                          const prod = PRODUCTS.find((p) => p.id === item.productId);
                          if (prod) toggleWishlist(prod);
                        }}
                        className="text-neutral-400 hover:text-neutral-700 transition-colors p-0.5 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="text-xs font-medium text-neutral-900 line-clamp-2 leading-snug">
                      {item.title}
                    </h4>

                    <div className="text-sm font-semibold text-neutral-900 font-mono mt-1">
                      {formatPrice(item.priceEUR)}
                    </div>
                  </div>

                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="mt-2.5 w-full py-1.5 px-3 bg-[#1F2429] hover:bg-black text-white text-xs font-medium rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Bag</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
