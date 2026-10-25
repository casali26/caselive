import React from 'react';
import { ArrowRight, PawPrint, Briefcase, Sun, Dumbbell, Sparkles, Wrench } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  mascotas: PawPrint,
  muebles: Briefcase,
  'hogar-y-jard-n': Sun,
  'hogar-y-jardin': Sun,
  'deporte-y-aire-libre': Dumbbell,
  juguetes: Sparkles,
  'ferreter-a': Wrench,
  ferreteria: Wrench,
};

export const CategoryShowcase: React.FC = () => {
  const { categoriesTree, navigateToCatalog, products } = useStore();

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest font-mono">
              Colecciones de Temporada
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#191C20] tracking-tight mt-1">
              Explora por Colección
            </h2>
            <p className="text-sm text-neutral-600 mt-1">
              Diseño contemporáneo, materiales duraderos y confort para cada espacio de tu hogar.
            </p>
          </div>

          <button
            onClick={() => navigateToCatalog('all')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-800 hover:text-[#8A584C] transition-colors cursor-pointer shrink-0"
          >
            <span>Ver Catálogo Completo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categoriesTree.map((cat) => {
            const IconComponent = CATEGORY_ICONS[cat.handle] || Sparkles;
            const matchingCount = products.filter(
              (p) => p.categoryPath[0]?.toLowerCase() === cat.name.toLowerCase()
            ).length;

            return (
              <div
                key={cat.id}
                onClick={() => navigateToCatalog(cat.name)}
                className="group relative bg-[#F9F9F8] hover:bg-white rounded-xl border border-neutral-200 p-4 transition-all hover:shadow-md cursor-pointer flex flex-col justify-between overflow-hidden"
              >
                {cat.banner?.imageUrl && (
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-neutral-100 mb-3">
                    <img
                      src={cat.banner.imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-neutral-500 group-hover:text-[#8A584C] transition-colors">
                    <IconComponent className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider">
                      {matchingCount > 0 ? `${matchingCount} prods` : 'Colección'}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-neutral-900 group-hover:text-black line-clamp-1">
                    {cat.name}
                  </h3>
                </div>

                <div className="mt-3 pt-2 border-t border-neutral-200/60 flex items-center justify-between text-[11px] font-medium text-neutral-500 group-hover:text-neutral-900">
                  <span>Explorar</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
