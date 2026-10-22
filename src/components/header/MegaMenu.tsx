import React, { useState, useRef } from 'react';
import { Menu, ChevronDown, Sparkles, Tag, ArrowRight, Compass } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const MegaMenu: React.FC = () => {
  const {
    t,
    activeProduct,
    setActiveProductById,
    categoriesTree,
    products,
    showToast,
  } = useStore();

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseLeave = () => {
    setActiveMenuId(null);
  };

  const currentCategoryData = categoriesTree.find(
    (c) => c.id === activeMenuId || c.handle === activeMenuId
  );

  return (
    <div
      className="bg-white border-b border-neutral-200 text-sm relative z-30"
      ref={menuContainerRef}
      onMouseLeave={handleMouseLeave}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Categories Nav Strip (Level 1 Shopify Collections) */}
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            {/* All Categories Button */}
            <button
              onMouseEnter={() => setActiveMenuId(categoriesTree[0]?.id || null)}
              onClick={() => setActiveMenuId(activeMenuId ? null : (categoriesTree[0]?.id || null))}
              className="flex items-center gap-2 bg-[#25282F] hover:bg-[#1A1C20] text-neutral-100 font-semibold text-xs py-2 px-3.5 rounded transition-colors cursor-pointer shrink-0 uppercase tracking-wide mr-2"
              aria-label="All Categories Menu"
            >
              <Menu className="w-3.5 h-3.5" />
              <span>{t('allCategories')}</span>
              <ChevronDown className="w-3 h-3 ml-0.5 text-neutral-400" />
            </button>

            {/* Level 1: Main Category Links mapped from Shopify backend */}
            {categoriesTree.map((cat) => {
              const isActive = activeMenuId === cat.id || activeMenuId === cat.handle;
              return (
                <button
                  key={cat.id}
                  onMouseEnter={() => setActiveMenuId(cat.id)}
                  onClick={() => setActiveMenuId(isActive ? null : cat.id)}
                  className={`flex items-center gap-1.5 py-2.5 px-3 font-medium text-xs lg:text-sm rounded transition-colors cursor-pointer shrink-0 whitespace-nowrap ${
                    isActive
                      ? 'text-neutral-950 bg-neutral-100 font-semibold'
                      : 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-150 ${
                      isActive ? 'rotate-180 text-neutral-900' : 'text-neutral-400'
                    }`}
                  />
                </button>
              );
            })}

            {/* Quiet Curated Links */}
            <button
              onClick={() => showToast('Seasonal Living Edit: Handpicked pieces for balanced homes')}
              className="flex items-center gap-1.5 py-2.5 px-3 font-medium text-xs lg:text-sm text-neutral-600 hover:text-neutral-900 rounded transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Compass className="w-3.5 h-3.5 text-neutral-400" />
              <span>Lookbook 2026</span>
            </button>

            <button
              onClick={() => showToast('New additions synced from European warehouses')}
              className="hidden lg:flex items-center gap-1.5 py-2.5 px-3 font-medium text-xs lg:text-sm text-neutral-600 hover:text-neutral-900 rounded transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Tag className="w-3.5 h-3.5 text-neutral-400" />
              <span>New Additions</span>
            </button>
          </nav>

          {/* Quick Product Switcher */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-neutral-500 shrink-0 border-l border-neutral-200 pl-4 my-1">
            <span className="font-medium text-neutral-400 uppercase text-[10px] tracking-wider">Catalog:</span>
            {products.slice(0, 5).map((prod) => {
              const isSelected = activeProduct.id === prod.id;
              const shortLabel =
                prod.title.es.split(' con ')[0].split(' with ')[0].split(' ')[0] +
                ' ' +
                (prod.title.es.split(' ')[1] || 'Design');

              return (
                <button
                  key={prod.id}
                  onClick={() => setActiveProductById(prod.id)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer font-medium max-w-[130px] truncate ${
                    isSelected
                      ? 'bg-neutral-900 text-white font-semibold'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                  title={prod.title.es}
                >
                  {shortLabel}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Full-Width Mega Menu Dropdown: Level 1 & Level 2 from Shopify */}
      {currentCategoryData && (
        <div className="absolute left-0 right-0 top-full bg-white border-b border-neutral-200 shadow-xl py-6 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
              
              {/* Columns: Level 2 Subcategories directly mapped from Shopify backend */}
              <div className="md:col-span-3 lg:col-span-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentCategoryData.subcategories.map((subcat, idx) => (
                  <div key={idx} className="space-y-2.5">
                    <div className="flex items-center justify-between pb-1 border-b border-neutral-100">
                      <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                        {subcat.title}
                      </h4>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        L2
                      </span>
                    </div>

                    <ul className="space-y-1.5">
                      {subcat.items.map((item, itemIdx) => (
                        <li key={itemIdx}>
                          <button
                            onClick={() => {
                              if (item.productId) {
                                setActiveProductById(item.productId);
                                showToast(`Selected from Shopify: ${item.label}`);
                              } else {
                                showToast(`Browsing category: ${item.label}`);
                              }
                              setActiveMenuId(null);
                            }}
                            className="text-xs text-neutral-600 hover:text-neutral-950 hover:translate-x-0.5 transition-all text-left block w-full py-0.5 cursor-pointer group"
                          >
                            <span className="group-hover:font-medium">{item.label}</span>
                            {item.productId && (
                              <span className="ml-1 text-[9px] text-neutral-400 group-hover:text-neutral-600">
                                · View
                              </span>
                            )}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Column 5: Featured Banner Card from Shopify Collection */}
              <div className="col-span-1 hidden md:block">
                <div className="bg-neutral-900 text-neutral-200 rounded-lg p-5 flex flex-col justify-between h-full relative overflow-hidden group border border-neutral-800">
                  {/* Background decoration or image preview if available */}
                  {currentCategoryData.banner.imageUrl && (
                    <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none">
                      <img
                        src={currentCategoryData.banner.imageUrl}
                        alt={currentCategoryData.banner.headline}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="relative z-10">
                    <div className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded mb-3 border border-neutral-700">
                      <Sparkles className="w-3 h-3 text-[#A8796E]" />
                      <span>{currentCategoryData.featuredTag || 'Shopify Collection'}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-2 leading-snug line-clamp-2">
                      {currentCategoryData.banner.headline}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-4 line-clamp-3">
                      {currentCategoryData.banner.subtext}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (currentCategoryData.banner.targetProductId) {
                        setActiveProductById(currentCategoryData.banner.targetProductId);
                        showToast(`Opened: ${currentCategoryData.banner.headline}`);
                      } else {
                        showToast(`Navigating to collection: ${currentCategoryData.name}`);
                      }
                      setActiveMenuId(null);
                    }}
                    className="relative z-10 inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-200 hover:text-white transition-colors cursor-pointer group-hover:translate-x-1 duration-200"
                  >
                    <span>{currentCategoryData.banner.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};
