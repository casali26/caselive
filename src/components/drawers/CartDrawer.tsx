import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    cartCount,
    cartSubtotalEUR,
    promoCode,
    discountPercent,
    applyPromoCode,
    updateCartQuantity,
    removeFromCart,
    formatPrice,
    t,
    showToast,
  } = useStore();

  const [inputCode, setInputCode] = useState('');
  const [codeError, setCodeError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const success = applyPromoCode(inputCode);
    if (!success) {
      setCodeError('Invalid code. Try "CASE10" for 10% off.');
    } else {
      setCodeError('');
      setInputCode('');
    }
  };

  const handleCheckout = () => {
    showToast('Connecting to 256-bit encrypted checkout...');
    setTimeout(() => {
      showToast('Order simulated successfully! Thank you for choosing caselive.');
      setIsCartOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4.5 h-4.5 text-neutral-800" />
            <span className="font-semibold text-base text-neutral-900">
              Shopping Bag ({cartCount})
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors cursor-pointer"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Tracker */}
        <div className="bg-[#F4F7F5] px-5 py-2.5 border-b border-[#D5E2D9] flex items-center gap-2 text-xs text-[#2E5841]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#2E5841] shrink-0" />
          <span className="font-medium">
            <strong>Free Home Delivery</strong> included on all items
          </span>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 thin-scrollbar">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <div className="font-medium text-neutral-800 text-sm">{t('emptyCart')}</div>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                Explore our ergonomic recliners, patio lounge sets, and quiet home furnishings.
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-neutral-800 hover:text-neutral-950 cursor-pointer"
              >
                <span>{t('startShopping')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.variantId}
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
                        onClick={() => removeFromCart(item.variantId)}
                        className="text-neutral-400 hover:text-neutral-700 transition-colors p-0.5 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="text-xs font-medium text-neutral-900 line-clamp-1 leading-snug">
                      {item.title}
                    </h4>

                    <div className="text-[11px] text-neutral-500 mt-0.5">
                      Color: {item.colorName.split('/')[0]}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-neutral-300 rounded h-7 bg-white">
                      <button
                        onClick={() => updateCartQuantity(item.variantId, item.quantity - 1)}
                        className="w-6 h-full flex items-center justify-center text-neutral-600 hover:bg-neutral-100 rounded-l"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-7 text-center text-xs font-mono font-bold text-neutral-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.variantId, item.quantity + 1)}
                        className="w-6 h-full flex items-center justify-center text-neutral-600 hover:bg-neutral-100 rounded-r"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-neutral-900 font-mono">
                        {formatPrice(item.priceEUR * item.quantity)}
                      </div>
                      {item.quantity > 1 && (
                        <div className="text-[10px] text-neutral-400 font-mono">
                          {formatPrice(item.priceEUR)} each
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Area */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-neutral-200 bg-neutral-50/80 space-y-3.5">
            {/* Promo Code Form */}
            <form onSubmit={handleApplyCode} className="space-y-1">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => {
                      setInputCode(e.target.value);
                      setCodeError('');
                    }}
                    placeholder="Coupon code (e.g. CASE10)"
                    className="w-full text-xs px-3 py-2 bg-white border border-neutral-300 rounded focus:outline-none focus:border-neutral-700 uppercase font-mono"
                  />
                  <Tag className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-medium rounded cursor-pointer transition-colors"
                >
                  {t('apply')}
                </button>
              </div>

              {promoCode && (
                <div className="text-[11px] text-neutral-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Coupon {promoCode} active: 10% discount applied</span>
                </div>
              )}
              {codeError && <div className="text-[11px] text-[#8A4C40] font-medium">{codeError}</div>}
            </form>

            {/* Price Summary */}
            <div className="space-y-1.5 text-xs text-neutral-600 pt-2 border-t border-neutral-200">
              <div className="flex justify-between">
                <span>{t('subtotal')}</span>
                <span className="font-mono text-neutral-800">
                  {formatPrice(cartSubtotalEUR / (discountPercent > 0 ? 0.9 : 1))}
                </span>
              </div>

              {discountPercent > 0 && (
                <div className="flex justify-between text-neutral-700 font-medium">
                  <span>Discount ({promoCode})</span>
                  <span className="font-mono">
                    -
                    {formatPrice(
                      (cartSubtotalEUR / (1 - discountPercent / 100)) * (discountPercent / 100)
                    )}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Doorstep Delivery</span>
                <span className="font-medium text-emerald-700">FREE</span>
              </div>

              <div className="flex justify-between text-sm font-semibold text-neutral-900 pt-1.5 border-t border-neutral-200">
                <span>Total</span>
                <span className="font-mono text-base text-neutral-900 font-bold">
                  {formatPrice(cartSubtotalEUR)}
                </span>
              </div>
            </div>

            {/* Primary Checkout Button: Low-saturation dark slate */}
            <button
              onClick={handleCheckout}
              className="w-full py-2.5 bg-[#1F2429] hover:bg-[#13161A] active:bg-black text-white font-medium text-xs sm:text-sm rounded-md shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-neutral-300" />
              <span>{t('checkout')}</span>
            </button>

            <div className="text-center text-[10px] text-neutral-400">
              🔒 30-Day Home Trial · Free Standard Returns · 256-Bit SSL
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
