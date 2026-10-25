import React from 'react';
import { ArrowRight, ShieldCheck, Truck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const HeroBanner: React.FC = () => {
  const {
    navigateToCatalog,
    setActiveProductById,
    products,
  } = useStore();

  const featuredProduct = products[0] || null;

  return (
    <section className="relative overflow-hidden bg-[#F6F5F2] border-b border-neutral-200">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-stone-200/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Value Actions */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Brand Official Collection Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 shadow-2xs text-xs text-neutral-700">
              <span className="w-2 h-2 rounded-full bg-[#8A584C]" />
              <span className="font-semibold text-neutral-800">Caselive Living Direct</span>
              <span className="text-neutral-300">•</span>
              <span className="text-neutral-600 font-medium">Almacén Peninsular en Valencia (24-48h)</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest font-bold text-neutral-500 font-mono">
                Colección Europea 2026 • Caselive Living
              </span>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#191C20] tracking-tight leading-[1.12]">
                Confort arquitectónico y diseño para cada rincón de tu hogar.
              </h1>
              <p className="text-base sm:text-lg text-neutral-600 max-w-2xl font-normal leading-relaxed pt-1">
                Descubre nuestra selección directa desde el almacén peninsular en Valencia: mobiliario ergonómico, hábitats para mascotas, santuarios de jardín y confort contemporáneo.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigateToCatalog('all')}
                className="px-6 py-3.5 bg-[#202428] hover:bg-black text-white rounded-lg font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow group"
              >
                <span>Explorar Catálogo Completo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {featuredProduct && (
                <button
                  onClick={() => setActiveProductById(featuredProduct.id)}
                  className="px-5 py-3.5 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 rounded-lg font-semibold text-sm transition-colors cursor-pointer shadow-2xs"
                >
                  Ver Producto Destacado
                </button>
              )}
            </div>

            {/* Brand Value Pillars */}
            <div className="pt-6 border-t border-neutral-200/80 grid grid-cols-2 sm:grid-cols-3 gap-4 text-neutral-700">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-[#8A584C] shrink-0" />
                <span className="text-xs font-medium">Envío Express 24-48h</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#8A584C] shrink-0" />
                <span className="text-xs font-medium">3 Años de Garantía UE</span>
              </div>
              <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                <CheckCircle2 className="w-4 h-4 text-[#8A584C] shrink-0" />
                <span className="text-xs font-medium">Conforme GPSR / CE</span>
              </div>
            </div>

          </div>

          {/* Right Column: Featured Hero Visual Card */}
          <div className="lg:col-span-5">
            {featuredProduct ? (
              <div
                onClick={() => setActiveProductById(featuredProduct.id)}
                className="group relative bg-white rounded-2xl border border-neutral-200/90 p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100">
                  <img
                    src={featuredProduct.images[0]?.url}
                    alt={featuredProduct.title.es}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#191C20] text-white text-[11px] font-semibold px-2.5 py-1 rounded-md tracking-wider uppercase">
                    Destacado de Colección
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs text-neutral-900 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md border border-neutral-100 font-mono">
                    {featuredProduct.basePriceEUR.toFixed(2)} €
                  </div>
                </div>

                <div className="mt-4 space-y-1.5">
                  <div className="text-[11px] font-bold text-[#8A584C] uppercase tracking-wider">
                    {featuredProduct.categoryPath[0]} • {featuredProduct.brand}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-neutral-900 group-hover:text-[#8A584C] transition-colors line-clamp-2 leading-snug">
                    {featuredProduct.title.es}
                  </h3>
                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed pt-0.5">
                    {featuredProduct.shortDesc.es}
                  </p>
                </div>

                <div className="mt-3.5 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="font-semibold text-neutral-800">{featuredProduct.rating}</span>
                    <span className="text-neutral-400">({featuredProduct.reviewCount} opiniones)</span>
                  </div>
                  <span className="font-semibold text-neutral-900 group-hover:underline flex items-center gap-1">
                    Ver Detalles <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ) : null}
          </div>

        </div>
      </div>
    </section>
  );
};
