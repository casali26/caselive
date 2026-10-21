import React from 'react';
import { ShoppingBag, Star, Heart } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const RelatedProducts: React.FC = () => {
  const {
    activeProduct,
    setActiveProductById,
    formatPrice,
    addToCart,
    currentLanguage,
    t,
    toggleWishlist,
    isInWishlist,
    products,
  } = useStore();

  const related = products.filter((p) => p.id !== activeProduct.id);

  if (related.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-neutral-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight">
            {t('relatedProducts')}
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Designed with the same material standards and quiet aesthetics
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {related.map((prod) => {
          const title = prod.title[currentLanguage] || prod.title.es;
          const isFav = isInWishlist(prod.id);
          const savings = prod.originalPriceEUR - prod.basePriceEUR;
          const discountPct = Math.round((savings / prod.originalPriceEUR) * 100);

          return (
            <div
              key={prod.id}
              className="group bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative bg-neutral-50 aspect-[4/3] overflow-hidden">
                <img
                  src={prod.images[0].url}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => toggleWishlist(prod)}
                  className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 hover:bg-white text-neutral-700 shadow-2xs border border-neutral-200 transition-colors cursor-pointer"
                  title="Save to collection"
                >
                  <Heart className={`w-3.5 h-3.5 ${isFav ? 'text-neutral-900 fill-neutral-900' : ''}`} />
                </button>
                <div className="absolute top-2.5 left-2.5 bg-[#F6EFEA] text-[#7E4C40] border border-[#E7D6CE] text-[10px] font-semibold px-2 py-0.5 rounded uppercase font-mono">
                  -{discountPct}%
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                    <span className="font-semibold text-neutral-600 uppercase tracking-wider">{prod.brand}</span>
                    <span className="font-normal text-neutral-400">Curated Design</span>
                  </div>

                  <h3
                    onClick={() => setActiveProductById(prod.id)}
                    className="font-medium text-xs sm:text-sm text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-2 cursor-pointer leading-snug"
                  >
                    {title}
                  </h3>

                  <div className="flex items-center gap-1 mt-1.5 text-xs text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-neutral-800 text-[11px]">{prod.rating}</span>
                    <span className="text-neutral-400 text-[11px]">({prod.reviewCount})</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <div className="text-sm sm:text-base font-bold text-neutral-900 font-mono leading-tight">
                      {formatPrice(prod.basePriceEUR)}
                    </div>
                    <div className="text-[11px] text-neutral-400 line-through font-mono leading-tight">
                      {formatPrice(prod.originalPriceEUR)}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setActiveProductById(prod.id)}
                      className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium text-xs rounded transition-colors cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      onClick={() => addToCart(prod, prod.variants[0], 1)}
                      className="p-1.5 bg-[#1F2429] hover:bg-black text-white rounded transition-colors cursor-pointer shadow-2xs"
                      title="Add to Bag"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
