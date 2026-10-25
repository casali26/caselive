import React, { useState, useRef, useEffect } from 'react';
import { Search, User, Heart, ShoppingBag, X, Clock, Flame, ChevronRight, RefreshCw } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const MainHeader: React.FC = () => {
  const {
    t,
    formatPrice,
    cartCount,
    cartSubtotalEUR,
    wishlist,
    products,
    categoriesTree,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsLoginModalOpen,
    setActiveProductById,
    navigateToHome,
    navigateToCatalog,
    currentView,
    liveStats,
    setIsShopifyModalOpen,
    showToast,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const recentKeywords = [
    'Ergonomic massage chair',
    'Patio lounge sofa',
    'Cat climbing tower',
    'Motorized studio desk',
    'Minimalist floor lamp',
  ];

  const popularSearches = products.slice(0, 3).map((p) => ({
    label: p.title.es.split(' con ')[0].split(' with ')[0],
    prodId: p.id,
  }));

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    navigateToCatalog(selectedCategory, searchQuery);
    showToast(`Mostrando catálogo para "${searchQuery}"`);
    setIsSearchFocused(false);
  };

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-40 transition-shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-18 flex items-center justify-between gap-4 lg:gap-8">
          
          {/* 1. Brand Logo & Primary Navigation Links */}
          <div className="flex items-center gap-5 lg:gap-7 shrink-0">
            <button
              onClick={() => navigateToHome()}
              className="flex items-center gap-1.5 group cursor-pointer focus:outline-none"
              title="caselive Home & Living"
            >
              <div className="flex items-baseline tracking-tight">
                <span className="text-2xl sm:text-[27px] font-extrabold text-[#1A1D20] tracking-tight lowercase font-sans">
                  caselive
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#8A584C] ml-0.5 inline-block" />
              </div>
            </button>

            {/* Quick View Nav Links */}
            <nav className="hidden lg:flex items-center gap-1">
              <button
                onClick={() => navigateToHome()}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  currentView === 'home' ? 'text-black bg-neutral-100 font-bold' : 'text-neutral-600 hover:text-black'
                }`}
              >
                Inicio
              </button>
              <button
                onClick={() => navigateToCatalog('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  currentView === 'catalog' ? 'text-black bg-neutral-100 font-bold' : 'text-neutral-600 hover:text-black'
                }`}
              >
                Catálogo
              </button>
            </nav>
          </div>

          {/* 2. Global Search Bar */}
          <div className="flex-1 max-w-2xl relative" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              {/* Category scope select */}
              <div className="hidden sm:flex items-center border-y border-l border-neutral-300 rounded-l-md bg-neutral-50 px-2.5 h-10.5 text-xs text-neutral-600 shrink-0 hover:bg-neutral-100 transition-colors">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent border-none text-xs font-medium text-neutral-700 focus:outline-none cursor-pointer pr-1"
                >
                  <option value="all">All Collections</option>
                  {categoriesTree.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Text Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full h-10.5 pl-4 pr-10 border sm:border-y sm:border-x-0 border-neutral-300 sm:rounded-none rounded-l-md text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-700 focus:ring-1 focus:ring-neutral-700"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer p-0.5"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Submit Button: Low-saturation charcoal */}
              <button
                type="submit"
                className="h-10.5 px-4.5 bg-[#25282F] hover:bg-[#1A1C20] active:bg-black text-neutral-100 rounded-r-md font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-xs"
                aria-label="Search"
              >
                <Search className="w-4 h-4 stroke-[2]" />
                <span className="hidden md:inline font-medium">Search</span>
              </button>
            </form>

            {/* Suggestions Dropdown (No Ref Numbers) */}
            {isSearchFocused && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-lg shadow-xl border border-neutral-200 z-50 overflow-hidden divide-y divide-neutral-100">
                <div className="p-3">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                    <Flame className="w-3.5 h-3.5 text-[#8A584C]" />
                    <span>Popular Searches</span>
                  </div>
                  <div className="space-y-1">
                    {popularSearches.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveProductById(item.prodId);
                          setSearchQuery(item.label);
                          setIsSearchFocused(false);
                        }}
                        className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-neutral-700 hover:bg-neutral-50 rounded text-left transition-colors cursor-pointer"
                      >
                        <span className="font-medium text-neutral-800">{item.label}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-neutral-50/80">
                  <div className="flex items-center gap-1 text-[11px] font-medium text-neutral-500 uppercase tracking-wider mb-2">
                    <Clock className="w-3 h-3 text-neutral-400" />
                    <span>Suggestions</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recentKeywords.map((kw) => (
                      <button
                        key={kw}
                        onClick={() => {
                          setSearchQuery(kw);
                          setIsSearchFocused(false);
                          showToast(`Searching: ${kw}`);
                        }}
                        className="px-2.5 py-1 bg-white border border-neutral-200 hover:border-neutral-400 hover:text-neutral-900 text-xs text-neutral-600 rounded-md transition-colors cursor-pointer"
                      >
                        {kw}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. User Actions (Account, Wishlist, Cart) */}
          <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
            {/* Account / Login */}
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="flex items-center gap-2 text-neutral-700 hover:text-neutral-950 transition-colors p-1.5 rounded-lg cursor-pointer"
              aria-label="Account Login"
            >
              <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 hover:bg-neutral-200/80 transition-colors">
                <User className="w-4.5 h-4.5 stroke-[1.8]" />
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-[11px] text-neutral-500 leading-tight">Welcome</div>
                <div className="text-xs font-semibold text-neutral-900 leading-tight">{t('account')}</div>
              </div>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative flex items-center gap-2 text-neutral-700 hover:text-neutral-950 transition-colors p-1.5 rounded-lg cursor-pointer"
              aria-label="Open Wishlist"
            >
              <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 hover:bg-neutral-200/80 transition-colors relative">
                <Heart className="w-4.5 h-4.5 stroke-[1.8]" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#8A584C] text-white text-[10px] font-medium rounded-full flex items-center justify-center font-mono">
                    {wishlist.length}
                  </span>
                )}
              </div>
              <div className="hidden xl:block text-left">
                <div className="text-[11px] text-neutral-500 leading-tight">Saved</div>
                <div className="text-xs font-semibold text-neutral-900 leading-tight">{t('wishlist')}</div>
              </div>
            </button>

            {/* Cart Drawer Trigger: Low-saturation dark slate */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 bg-[#25282F] hover:bg-[#1A1C20] text-white px-3.5 py-2 rounded-lg transition-colors cursor-pointer shadow-xs group"
              aria-label="Open Cart Drawer"
            >
              <div className="relative">
                <ShoppingBag className="w-4.5 h-4.5 text-neutral-100 stroke-[1.8]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#8A584C] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono ring-2 ring-neutral-900">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider leading-none">
                  {t('cart')}
                </div>
                <div className="text-xs font-semibold text-neutral-100 font-mono mt-0.5 leading-none">
                  {formatPrice(cartSubtotalEUR)}
                </div>
              </div>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
