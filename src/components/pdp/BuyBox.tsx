import React, { useState } from 'react';
import {
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  Award,
  CreditCard,
  Plus,
  Minus,
  Check,
  Lock,
  Heart,
  Share2,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const BuyBox: React.FC = () => {
  const {
    activeProduct,
    selectedVariant,
    setSelectedVariantId,
    currentCountry,
    currentLanguage,
    t,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsCartOpen,
    showToast,
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [isBnplModalOpen, setIsBnplModalOpen] = useState(false);
  const [isBuyNowModalOpen, setIsBuyNowModalOpen] = useState(false);

  const priceEUR = activeProduct.basePriceEUR;
  const originalPriceEUR = activeProduct.originalPriceEUR;
  const savingsEUR = originalPriceEUR - priceEUR;
  const savingsPercent = Math.round((savingsEUR / originalPriceEUR) * 100);

  const bnplMonthlyEUR = priceEUR / 3;

  const handleAddToCart = () => {
    addToCart(activeProduct, selectedVariant, quantity);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    addToCart(activeProduct, selectedVariant, quantity);
    setIsBuyNowModalOpen(true);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Product link copied to clipboard');
  };

  const title = activeProduct.title[currentLanguage] || activeProduct.title.es;
  const isWishlisted = isInWishlist(activeProduct.id);

  return (
    <div className="bg-white rounded-lg border border-neutral-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div>
        {/* Brand Label & Action Buttons (No Ref / SKU) */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold tracking-tight text-neutral-900 uppercase">
              {activeProduct.brand}
            </span>
            <span className="text-neutral-300">·</span>
            <span className="text-xs text-neutral-500 font-medium">
              Ergonomic Studio
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleWishlist(activeProduct)}
              className={`p-1.5 rounded-full border transition-colors cursor-pointer ${
                isWishlisted
                  ? 'border-neutral-300 bg-neutral-100 text-neutral-900'
                  : 'border-neutral-200 hover:border-neutral-300 text-neutral-600'
              }`}
              title={isWishlisted ? 'Saved in collection' : 'Save to collection'}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-neutral-900' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-full border border-neutral-200 hover:border-neutral-300 text-neutral-600 transition-colors cursor-pointer"
              title="Share product"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-snug tracking-tight mb-2.5">
          {title}
        </h1>

        {/* Reviews & Star Rating */}
        <div className="flex items-center gap-2 pb-3 mb-4 border-b border-neutral-100 text-xs">
          <div className="flex items-center text-amber-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="font-semibold text-neutral-800">{activeProduct.rating}</span>
          <span className="text-neutral-400">·</span>
          <button
            onClick={() => showToast(`Displaying 342 verified reviews for caselive`)}
            className="text-neutral-600 hover:text-neutral-900 underline decoration-neutral-300 transition-colors cursor-pointer"
          >
            {activeProduct.reviewCount} {t('verifiedReviews')}
          </button>
        </div>

        {/* Price Block: Low-Saturation Refined Tones */}
        <div className="bg-neutral-50/80 rounded-lg p-3.5 mb-4 border border-neutral-200/70">
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#1F2429] font-mono tracking-tight">
              {formatPrice(priceEUR)}
            </span>
            <span className="text-sm text-neutral-400 line-through font-mono">
              {formatPrice(originalPriceEUR)}
            </span>
            <span className="bg-[#F6EFEA] text-[#7E4C40] text-[11px] font-semibold px-2 py-0.5 rounded border border-[#E7D6CE] tracking-tight">
              {t('save')} {formatPrice(savingsEUR)} (-{savingsPercent}%)
            </span>
          </div>

          <div className="text-[11px] text-neutral-500 mt-1.5 flex items-center justify-between">
            <span>{t('vatIncluded')} · Direct from atelier</span>
            <span className="text-neutral-700 font-medium flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-neutral-600" /> 3-Year Direct Warranty
            </span>
          </div>

          {/* BNPL Split Payment */}
          <div className="mt-2.5 pt-2.5 border-t border-neutral-200/60 flex items-center justify-between text-xs text-neutral-700">
            <div className="flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
              <span>
                {t('bnplNotice')}{' '}
                <strong className="font-mono text-neutral-900">{formatPrice(bnplMonthlyEUR)}/month</strong>{' '}
                {t('bnplProvider')}
              </span>
            </div>
            <button
              onClick={() => setIsBnplModalOpen(true)}
              className="text-neutral-500 hover:text-neutral-800 underline text-[11px] cursor-pointer ml-1 shrink-0"
            >
              Details
            </button>
          </div>
        </div>

        {/* Stock & Doorstep Dispatch Badge: Low-Saturation Sage Green */}
        <div className="mb-5 space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
            <span className="font-semibold text-neutral-800">
              {t('inStock')} ({selectedVariant.stock} units available)
            </span>
          </div>
          
          <div className="bg-[#F4F7F5] border border-[#D5E2D9] rounded-md p-2.5 text-neutral-700 flex items-start gap-2.5">
            <Truck className="w-4 h-4 text-[#2E5841] shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-neutral-900">
                {t('dispatchedFrom')}{' '}
                <span className="font-semibold">
                  {currentCountry.warehouseName}
                </span>{' '}
                {t('within')} 24h
              </div>
              <div className="text-[11px] text-neutral-600 mt-0.5">
                Estimated Delivery to <strong>{currentCountry.name}</strong>: <strong>{currentCountry.deliveryDays}</strong> (Tracked doorstep parcel)
              </div>
            </div>
          </div>
        </div>

        {/* SKU Variant Selector: Color Swatches (No SKU / Ref Numbers) */}
        <div className="mb-5">
          <div className="text-xs mb-2 font-medium text-neutral-800">
            {t('selectColor')}: <span className="text-neutral-600">{selectedVariant.colorName}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {activeProduct.variants.map((v) => {
              const isSelected = v.id === selectedVariant.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariantId(v.id)}
                  className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-100 text-neutral-950 shadow-2xs ring-1 ring-neutral-900/30'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-neutral-300 shadow-2xs shrink-0"
                    style={{ backgroundColor: v.colorHex }}
                  />
                  <span>{v.colorName.split('/')[0].trim()}</span>
                  {isSelected && <Check className="w-3 h-3 text-neutral-900 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity Picker & Action Buttons: Low-Saturation Palette */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center gap-2.5">
            {/* Quantity Stepper */}
            <div className="flex items-center border border-neutral-300 rounded-md h-11 bg-white shrink-0">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-full flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors rounded-l-md cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-9 text-center font-bold text-xs font-mono text-neutral-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(selectedVariant.stock, q + 1))}
                className="w-9 h-full flex items-center justify-center text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors rounded-r-md cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Primary CTA: Low-saturation deep charcoal */}
            <button
              onClick={handleAddToCart}
              className="flex-1 h-11 bg-[#1F2429] hover:bg-[#13161A] active:bg-black text-white font-semibold text-xs sm:text-sm rounded-md flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <span>{t('addToCart')}</span>
              <span className="text-xs font-mono opacity-80">({formatPrice(priceEUR * quantity)})</span>
            </button>
          </div>

          {/* Secondary CTA: Soft calm stone */}
          <button
            onClick={handleBuyNow}
            className="w-full h-10 bg-neutral-100 hover:bg-neutral-200 active:bg-neutral-300 text-neutral-900 font-medium text-xs rounded-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-neutral-200"
          >
            <Lock className="w-3.5 h-3.5 text-neutral-700" />
            <span>{t('buyNow')}</span>
          </button>
        </div>
      </div>

      {/* Value Propositions Strip */}
      <div className="mt-6 pt-4 border-t border-neutral-100 grid grid-cols-2 gap-2.5 text-xs text-neutral-600">
        <div className="flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
          <span>{t('freeDelivery')}</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
          <span>{t('securePayment')}</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
          <span>{t('returnGuarantee')}</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
          <span>{t('officialWarranty')}</span>
        </div>
      </div>

      {/* BNPL Info Modal */}
      {isBnplModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 text-neutral-800 shadow-xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-semibold text-base text-neutral-900">Installment Payment Schedule</h3>
              <button
                onClick={() => setIsBnplModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs leading-relaxed">
              <p>
                Split your purchase across 3 equal monthly payments of{' '}
                <strong className="text-neutral-900 font-mono">{formatPrice(bnplMonthlyEUR)}</strong> with 0% APR.
              </p>
              <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 space-y-2">
                <div className="flex justify-between font-medium">
                  <span>Due Today</span>
                  <span className="font-mono">{formatPrice(bnplMonthlyEUR)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Month 2</span>
                  <span className="font-mono">{formatPrice(bnplMonthlyEUR)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Month 3</span>
                  <span className="font-mono">{formatPrice(bnplMonthlyEUR)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsBnplModalOpen(false)}
              className="w-full py-2 bg-neutral-900 text-white font-medium rounded-lg text-xs cursor-pointer hover:bg-black"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Express Checkout Modal */}
      {isBuyNowModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 text-neutral-800 shadow-xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-neutral-700" />
                <h3 className="font-semibold text-base text-neutral-900">caselive Express Checkout</h3>
              </div>
              <button
                onClick={() => setIsBuyNowModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs">
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <img
                  src={activeProduct.images[0].url}
                  alt="Product"
                  className="w-14 h-14 object-cover rounded bg-white border border-neutral-200"
                />
                <div className="flex-1">
                  <div className="font-semibold text-neutral-900 line-clamp-1">{title}</div>
                  <div className="text-neutral-500">Color: {selectedVariant.colorName} · Qty: {quantity}</div>
                  <div className="text-sm font-bold text-neutral-900 font-mono mt-0.5">
                    {formatPrice(priceEUR * quantity)}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-neutral-700">Delivery Destination:</label>
                <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded text-neutral-700">
                  <div className="font-medium">{currentCountry.flag} Deliver to {currentCountry.name}</div>
                  <div className="text-neutral-500 text-[11px]">Direct fulfillment from {currentCountry.warehouseName}</div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    showToast('Order confirmed! We have sent receipt details to your email.');
                    setIsBuyNowModalOpen(false);
                  }}
                  className="w-full py-2.5 bg-[#1F2429] hover:bg-black text-white font-medium rounded-lg text-xs cursor-pointer shadow transition-colors"
                >
                  Pay {formatPrice(priceEUR * quantity)} & Finalize Order
                </button>
                <p className="text-[11px] text-center text-neutral-400 mt-2">
                  🔒 256-bit encrypted checkout with standard consumer protection
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
