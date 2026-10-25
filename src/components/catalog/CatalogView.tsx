import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  ShoppingBag,
  Eye,
  Heart,
  Star,
  ChevronRight,
  Home,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

export const CatalogView: React.FC = () => {
  const {
    products,
    categoriesTree,
    formatPrice,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setActiveProductById,
    openQuickView,
    catalogCategoryFilter,
    setCatalogCategoryFilter,
    catalogSearchQuery,
    setCatalogSearchQuery,
    navigateToHome,
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating' | 'name'>('featured');
  const [priceRange, setPriceRange] = useState<'all' | 'under50' | '50to100' | '100to200' | 'over200'>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Category filter
      if (
        catalogCategoryFilter !== 'all' &&
        !prod.categoryPath.some((cp) =>
          cp.toLowerCase().includes(catalogCategoryFilter.toLowerCase())
        )
      ) {
        return false;
      }

      // Search keyword filter
      if (catalogSearchQuery.trim()) {
        const q = catalogSearchQuery.toLowerCase();
        const matchesTitle = Object.values(prod.title).some((t) => t.toLowerCase().includes(q));
        const matchesBrand = prod.brand.toLowerCase().includes(q);
        const matchesSku = prod.sku.toLowerCase().includes(q);
        const matchesCat = prod.categoryPath.some((c) => c.toLowerCase().includes(q));
        if (!matchesTitle && !matchesBrand && !matchesSku && !matchesCat) return false;
      }

      // Price range
      if (priceRange === 'under50' && prod.basePriceEUR >= 50) return false;
      if (priceRange === '50to100' && (prod.basePriceEUR < 50 || prod.basePriceEUR > 100)) return false;
      if (priceRange === '100to200' && (prod.basePriceEUR < 100 || prod.basePriceEUR > 200)) return false;
      if (priceRange === 'over200' && prod.basePriceEUR <= 200) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.basePriceEUR - b.basePriceEUR;
      if (sortBy === 'price-desc') return b.basePriceEUR - a.basePriceEUR;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.title.es.localeCompare(b.title.es);
      return 0; // featured default
    });
  }, [products, catalogCategoryFilter, catalogSearchQuery, priceRange, inStockOnly, sortBy]);

  // Paginated slice
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(0, currentPage * pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  const hasMore = paginatedProducts.length < filteredProducts.length;

  const handleResetFilters = () => {
    setCatalogCategoryFilter('all');
    setCatalogSearchQuery('');
    setPriceRange('all');
    setSortBy('featured');
    setCurrentPage(1);
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-neutral-500 mb-6 flex-wrap">
          <button
            onClick={navigateToHome}
            className="hover:text-neutral-900 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Inicio</span>
          </button>
          <ChevronRight className="w-3 h-3 text-neutral-400 shrink-0" />
          <button
            onClick={() => {
              setCatalogCategoryFilter('all');
              setCurrentPage(1);
            }}
            className={`cursor-pointer transition-colors ${
              catalogCategoryFilter === 'all' ? 'font-semibold text-neutral-900' : 'hover:text-neutral-900'
            }`}
          >
            Catálogo General
          </button>
          {catalogCategoryFilter !== 'all' && (
            <>
              <ChevronRight className="w-3 h-3 text-neutral-400 shrink-0" />
              <span className="font-semibold text-neutral-900 capitalize">
                {catalogCategoryFilter}
              </span>
            </>
          )}
        </nav>

        {/* Catalog Banner / Header */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 sm:p-8 mb-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold text-[#8A584C] tracking-wider font-mono">
                Catálogo de Colección 2026
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191C20] tracking-tight mt-1 capitalize">
                {catalogCategoryFilter === 'all' ? 'Todos los Productos' : catalogCategoryFilter}
              </h1>
              <p className="text-sm text-neutral-600 mt-1">
                Mostrando {filteredProducts.length} referencias seleccionadas con envío express 24-48h.
              </p>
            </div>

            {/* Quick Search within Catalog */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={catalogSearchQuery}
                onChange={(e) => {
                  setCatalogSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Filtrar en catálogo..."
                className="w-full h-10 pl-9 pr-8 bg-neutral-50 border border-neutral-300 rounded-lg text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-700 focus:bg-white"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              {catalogSearchQuery && (
                <button
                  onClick={() => setCatalogSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills Bar */}
          <div className="mt-6 pt-5 border-t border-neutral-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                setCatalogCategoryFilter('all');
                setCurrentPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                catalogCategoryFilter === 'all'
                  ? 'bg-[#202428] text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Todos ({products.length})
            </button>
            {categoriesTree.map((cat) => {
              const count = products.filter(
                (p) => p.categoryPath[0]?.toLowerCase() === cat.name.toLowerCase()
              ).length;
              const isSelected = catalogCategoryFilter.toLowerCase() === cat.name.toLowerCase();

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCatalogCategoryFilter(cat.name);
                    setCurrentPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#202428] text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-600'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Controls & Sorting Toolbar */}
        <div className="bg-white rounded-xl border border-neutral-200 p-3 sm:p-4 mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Price Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-neutral-500 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Precio:
            </span>
            {[
              { id: 'all', label: 'Todos' },
              { id: 'under50', label: '< 50 €' },
              { id: '50to100', label: '50 - 100 €' },
              { id: '100to200', label: '100 - 200 €' },
              { id: 'over200', label: '> 200 €' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setPriceRange(p.id as any);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer font-medium ${
                  priceRange === p.id
                    ? 'bg-neutral-900 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-500 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Ordenar:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-neutral-50 border border-neutral-300 rounded-md px-2.5 py-1 text-xs font-medium text-neutral-800 focus:outline-none focus:border-neutral-700 cursor-pointer"
            >
              <option value="featured">Destacados</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="rating">Mayor Valoración</option>
              <option value="name">Alfabético (A-Z)</option>
            </select>

            {(catalogCategoryFilter !== 'all' || catalogSearchQuery || priceRange !== 'all') && (
              <button
                onClick={handleResetFilters}
                className="ml-2 text-rose-600 hover:text-rose-800 font-semibold underline cursor-pointer"
              >
                Limpiar Filtros
              </button>
            )}
          </div>

        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center max-w-md mx-auto my-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-neutral-900">No se encontraron productos</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Prueba ajustando los términos de búsqueda o limpiando los filtros seleccionados.
              </p>
            </div>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-[#202428] text-white rounded-lg text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
            >
              Ver todos los productos
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {paginatedProducts.map((prod) => {
                const isFav = isInWishlist(prod.id);
                const firstVariant = prod.variants[0];
                const activeImage = prod.images[0];
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
                      <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                        {discountPct > 0 && (
                          <span className="bg-[#191C20] text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono uppercase tracking-wide">
                            -{discountPct}%
                          </span>
                        )}
                        <span className="bg-white/95 text-neutral-800 text-[10px] font-semibold px-2 py-0.5 rounded shadow-2xs border border-neutral-200/80">
                          {prod.categoryPath[0]}
                        </span>
                      </div>

                      {/* Action Icons */}
                      <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(prod);
                          }}
                          className="w-7.5 h-7.5 rounded-full bg-white/95 hover:bg-white text-neutral-700 shadow-sm flex items-center justify-center transition-colors cursor-pointer border border-neutral-200/80"
                          title="Guardar en favoritos"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? 'text-rose-600 fill-rose-600' : ''}`} />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openQuickView(prod);
                          }}
                          className="w-7.5 h-7.5 rounded-full bg-white/95 hover:bg-white text-neutral-700 shadow-sm flex items-center justify-center transition-colors cursor-pointer border border-neutral-200/80"
                          title="Vista Rápida"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1">
                          <span className="font-semibold text-neutral-600 uppercase tracking-wider">{prod.brand}</span>
                          <span className="font-mono text-neutral-400">{prod.spu}</span>
                        </div>

                        <h3 className="font-semibold text-xs sm:text-sm text-neutral-900 group-hover:text-[#8A584C] transition-colors line-clamp-2 leading-snug">
                          {prod.title.es}
                        </h3>

                        <div className="flex items-center gap-1 mt-1 text-xs">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span className="font-semibold text-neutral-800 text-[11px]">{prod.rating}</span>
                          <span className="text-neutral-400 text-[11px]">({prod.reviewCount})</span>
                        </div>
                      </div>

                      {/* Price & Add to Bag */}
                      <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between">
                        <div>
                          <div className="text-sm sm:text-base font-bold text-neutral-900 font-mono leading-none">
                            {formatPrice(prod.basePriceEUR)}
                          </div>
                          {prod.originalPriceEUR > prod.basePriceEUR && (
                            <div className="text-[10px] text-neutral-400 line-through font-mono mt-0.5">
                              {formatPrice(prod.originalPriceEUR)}
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(prod, firstVariant, 1);
                          }}
                          className="p-2 bg-[#202428] hover:bg-black text-white rounded-lg transition-colors cursor-pointer shadow-2xs"
                          title="Añadir a la Cesta"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Load More Pagination */}
            {hasMore && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="px-6 py-3 bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-300 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer shadow-2xs hover:shadow"
                >
                  Cargar Más Productos ({paginatedProducts.length} de {filteredProducts.length})
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
};
