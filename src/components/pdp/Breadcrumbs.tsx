import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Breadcrumbs: React.FC = () => {
  const { activeProduct, currentLanguage } = useStore();

  const title = activeProduct.title[currentLanguage] || activeProduct.title.es;

  return (
    <nav className="py-3 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center text-xs text-neutral-500">
      <div className="flex items-center gap-1.5 flex-wrap">
        <a href="#home" className="hover:text-neutral-900 transition-colors flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </a>
        
        {activeProduct.categoryPath.map((cat, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-neutral-400 shrink-0" />
            <span className="hover:text-neutral-900 cursor-pointer transition-colors">
              {cat}
            </span>
          </React.Fragment>
        ))}

        <ChevronRight className="w-3 h-3 text-neutral-400 shrink-0" />
        <span className="font-medium text-neutral-800 truncate max-w-xs sm:max-w-md">
          {title.split(' con ')[0].split(' with ')[0].split(' mit ')[0]}
        </span>
      </div>
    </nav>
  );
};
