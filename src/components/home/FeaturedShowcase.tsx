import React, { useState } from 'react';
import { ShoppingBag, Eye, Heart, Star, ArrowRight, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

export const FeaturedShowcase: React.FC = () => {
  const {
    products,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setActiveProductById,
    openQuickView,
    navigateToCatalog,
  } = useStore();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});

  // Filter products by active tab
  const filteredProducts = React.useMemo(() => {
    if (activeTab === 'all') return products.slice(0, 8);
    if (activeTab === 'deals') {
      return products
        .filter((p) => p.originalPriceEUR > p.basePriceEUR)
        .slice(0, 8);
    }
    return products
      .filter((p) => p.categoryPath[0]?.toLowerCase().includes(activeTab.toLowerCase()))
      .slice(0, 8);
  }, [products, activeTab]);

  const handleSelectVariant = (productId: string, variantId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedVariants((prev) => ({ ...prev, [productId]: variantId }));
  };

  return (
    <section className="py-12 sm:py-16 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header & Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest font-mono">
              Selección Exclusiva 2026
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#191C20] tracking-tight mt-1">
              Productos Destacados
            </h2>
            <p className="text-sm text-neutral-600 mt-1">
              Piezas populares con existencias en almacén y entrega express garantizada.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'mascotas', label: 'Mascotas' },
              { id: 'muebles', label: 'Muebles' },
              { id: 'hogar', label: 'Hogar y Jardín' },
              { id: 'deals', label: 'Ofertas' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#202428] text-white shadow-xs'
                      : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredProducts.map((prod) => {
            const isFav = isInWishlist(prod.id);
            const activeVariantId = selectedVariants[prod.id] || prod.variants[0]?.id;
            const currentVariant = prod.variants.find((v) => v.id === activeVariantId) || prod.variants[0];
            const activeImage = prod.images[currentVariant?.imageIndex || 0] || prod.images[0];
            const secondaryImage = prod.images[1] || prod.images[0];
            const savings = prod.originalPriceEUR - prod.basePriceEUR;
            const discountPct = Math.round((savings / prod.originalPriceEUR) * 100);

            return (
              <div
                key={prod.id}
                onClick={() => setActiveProductById(prod.id)}
                className="group bg-white rounded-xl border border-neutral-200/90 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Product Image Stage */}
                <div className="relative aspect-square overflow-hidden bg-neutral-100">
                  <img
                    src={activeImage?.url}
                    alt={prod.title.es}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {secondaryImage && secondaryImage.url !== activeImage?.url && (
                    <img
                      src={secondaryImage.url}
                      alt={prod.title.es}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      loading="lazy"
                    />
                  )}

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                    {discountPct > 0 && (
                      <span className="bg-[#191C20] text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wide">
                        -{discountPct}%
                      </span>
                    )}
                    <span className="bg-white/95 text-neutral-800 text-[10px] font-semibold px-2 py-0.5 rounded shadow-2xs border border-neutral-200/80">
                      Stock 24h
                    </span>
                  </div>

                  {/* Floating Action Buttons */}
                  <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(prod);
                      }}
                      className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-neutral-700 shadow-sm flex items-center justify-center transition-colors cursor-pointer border border-neutral-200/80"
                      title="Guardar en favoritos"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'text-rose-600 fill-rose-600' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openQuickView(prod);
                      }}
                      className="w-8 h-8 rounded-full bg-white/95 hover:bg-white text-neutral-700 shadow-sm flex items-center justify-center transition-colors cursor-pointer border border-neutral-200/80"
                      title="Vista Rápida"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Product Content Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category & Brand */}
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                      <span className="font-semibold text-neutral-600 uppercase tracking-wider">
                        {prod.brand}
                      </span>
                      <span>{prod.categoryPath[0]}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-xs sm:text-sm text-neutral-900 group-hover:text-[#8A584C] transition-colors line-clamp-2 leading-snug">
                      {prod.title.es}
                    </h3>

                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-1 mt-1.5 text-xs">
                      <div className="flex items-center text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      </div>
                      <span className="font-semibold text-neutral-800 text-[11px]">{prod.rating}</span>
                      <span className="text-neutral-400 text-[11px]">({prod.reviewCount})</span>
                    </div>

                    {/* Variants Swatches if multiple */}
                    {prod.variants.length > 1 && (
                      <div className="flex items-center gap-1.5 mt-2.5">
                        {prod.variants.slice(0, 4).map((v) => {
                          const isSelected = v.id === currentVariant.id;
                          return (
                            <button
                              key={v.id}
                              type="button"
                              onClick={(e) => handleSelectVariant(prod.id, v.id, e)}
                              className={`w-4.5 h-4.5 rounded-full border transition-all cursor-pointer ${
                                isSelected ? 'ring-2 ring-[#8A584C] ring-offset-1 border-white' : 'border-neutral-300'
                              }`}
                              style={{ backgroundColor: v.colorHex }}
                              title={v.colorName}
                            />
                          );
                        })}
                        {prod.variants.length > 4 && (
                          <span className="text-[10px] text-neutral-400 font-medium">
                            +{prod.variants.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Price & Action Row */}
                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <div>
                      <div className="text-base font-bold text-neutral-900 font-mono leading-none">
                        {formatPrice(prod.basePriceEUR)}
                      </div>
                      {prod.originalPriceEUR > prod.basePriceEUR && (
                        <div className="text-[11px] text-neutral-400 line-through font-mono mt-0.5">
                          {formatPrice(prod.originalPriceEUR)}
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(prod, currentVariant, 1);
                      }}
                      className="px-3 py-1.5 bg-[#202428] hover:bg-black text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Añadir</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* View All Bottom Banner */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigateToCatalog('all')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 rounded-lg text-sm font-semibold transition-all cursor-pointer shadow-2xs hover:shadow"
          >
            <span>Explorar Todo el Catálogo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
