import React, { useState } from 'react';
import { X, ShoppingBag, Heart, Star, Check, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const QuickViewModal: React.FC = () => {
  const {
    isQuickViewOpen,
    setIsQuickViewOpen,
    quickViewProduct,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setActiveProductById,
  } = useStore();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  if (!isQuickViewOpen || !quickViewProduct) return null;

  const isFav = isInWishlist(quickViewProduct.id);
  const currentVariantId = selectedVariantId || quickViewProduct.variants[0]?.id;
  const currentVariant = quickViewProduct.variants.find((v) => v.id === currentVariantId) || quickViewProduct.variants[0];
  const activeImage = quickViewProduct.images[activeImageIdx] || quickViewProduct.images[0];
  const savings = quickViewProduct.originalPriceEUR - quickViewProduct.basePriceEUR;
  const discountPct = Math.round((savings / quickViewProduct.originalPriceEUR) * 100);

  const handleOpenPDP = () => {
    setActiveProductById(quickViewProduct.id);
    setIsQuickViewOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={() => setIsQuickViewOpen(false)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-neutral-500 hover:text-neutral-900 shadow-sm border border-neutral-200 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left: Product Media Gallery */}
          <div className="p-6 bg-neutral-50 flex flex-col justify-between">
            <div className="aspect-square rounded-xl overflow-hidden bg-white border border-neutral-200 shadow-2xs relative">
              <img
                src={activeImage?.url}
                alt={quickViewProduct.title.es}
                className="w-full h-full object-cover"
              />
              {discountPct > 0 && (
                <div className="absolute top-3 left-3 bg-[#191C20] text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase">
                  -{discountPct}%
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {quickViewProduct.images.length > 1 && (
              <div className="flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar py-1">
                {quickViewProduct.images.slice(0, 5).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border transition-all cursor-pointer shrink-0 ${
                      activeImageIdx === idx ? 'border-neutral-900 ring-2 ring-neutral-900/10' : 'border-neutral-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Buy & Details Info */}
          <div className="p-6 flex flex-col justify-between space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span className="font-bold text-[#8A584C] uppercase tracking-wider">
                  {quickViewProduct.brand} • {quickViewProduct.categoryPath[0]}
                </span>
                <span className="font-mono text-neutral-400">{quickViewProduct.spu}</span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-neutral-900 leading-snug">
                {quickViewProduct.title.es}
              </h2>

              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                </div>
                <span className="font-semibold text-neutral-800">{quickViewProduct.rating}</span>
                <span className="text-neutral-400">({quickViewProduct.reviewCount} opiniones verificadas)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-2xl font-extrabold text-neutral-900 font-mono">
                  {formatPrice(quickViewProduct.basePriceEUR)}
                </span>
                {quickViewProduct.originalPriceEUR > quickViewProduct.basePriceEUR && (
                  <span className="text-xs text-neutral-400 line-through font-mono">
                    {formatPrice(quickViewProduct.originalPriceEUR)}
                  </span>
                )}
              </div>

              {/* Short description */}
              <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                {quickViewProduct.shortDesc.es}
              </p>

              {/* Variants */}
              {quickViewProduct.variants.length > 1 && (
                <div className="space-y-1.5 pt-2">
                  <div className="text-xs font-semibold text-neutral-700">
                    Color: <span className="text-neutral-900">{currentVariant?.colorName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {quickViewProduct.variants.map((v) => {
                      const isSelected = v.id === currentVariant?.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => {
                            setSelectedVariantId(v.id);
                            if (v.imageIndex !== undefined) setActiveImageIdx(v.imageIndex);
                          }}
                          className={`w-7 h-7 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
                            isSelected ? 'ring-2 ring-neutral-900 ring-offset-2 border-white' : 'border-neutral-300'
                          }`}
                          style={{ backgroundColor: v.colorHex }}
                          title={v.colorName}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow-xs" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-semibold text-neutral-700">Cantidad:</span>
                <div className="flex items-center border border-neutral-300 rounded-lg">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 rounded-l-lg cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-9 text-center text-xs font-bold font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 rounded-r-lg cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-4 border-t border-neutral-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    addToCart(quickViewProduct, currentVariant, quantity);
                    setIsQuickViewOpen(false);
                  }}
                  className="flex-1 py-3 bg-[#202428] hover:bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Añadir a la Cesta</span>
                </button>

                <button
                  onClick={() => toggleWishlist(quickViewProduct)}
                  className="p-3 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-700 transition-colors cursor-pointer"
                  title="Favoritos"
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'text-rose-600 fill-rose-600' : ''}`} />
                </button>
              </div>

              <button
                onClick={handleOpenPDP}
                className="w-full py-2 text-center text-xs font-semibold text-neutral-700 hover:text-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Ver Ficha Técnica Completa (PDP)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
