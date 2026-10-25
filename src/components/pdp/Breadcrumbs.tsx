import React from 'react';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Breadcrumbs: React.FC = () => {
  const { activeProduct, currentLanguage, navigateToHome, navigateToCatalog } = useStore();

  const title = activeProduct.title[currentLanguage] || activeProduct.title.es;

  return (
    <nav className="py-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-between text-xs text-neutral-500">
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={navigateToHome}
          className="hover:text-neutral-900 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Inicio</span>
        </button>
        
        {activeProduct.categoryPath.map((cat, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-neutral-400 shrink-0" />
            <button
              onClick={() => navigateToCatalog(cat)}
              className="hover:text-neutral-900 cursor-pointer transition-colors"
            >
              {cat}
            </button>
          </React.Fragment>
        ))}

        <ChevronRight className="w-3 h-3 text-neutral-400 shrink-0" />
        <span className="font-medium text-neutral-800 truncate max-w-xs sm:max-w-md">
          {title.split(' con ')[0].split(' with ')[0].split(' mit ')[0]}
        </span>
      </div>

      <button
        onClick={() => navigateToCatalog('all')}
        className="hidden sm:inline-flex items-center gap-1 font-semibold text-xs text-neutral-700 hover:text-black transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Volver al Catálogo</span>
      </button>
    </nav>
  );
};
