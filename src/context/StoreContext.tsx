import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  CountryConfig,
  Product,
  ProductVariant,
  CartItem,
  WishlistItem,
  MegaMenuCategory,
  ShopifyConfig,
} from '../types';
import { COUNTRIES, PRODUCTS, UI_TRANSLATIONS } from '../data/mockData';
import {
  SHOPIFY_LIVE_PRODUCTS,
  SHOPIFY_LIVE_CATEGORIES,
} from '../data/shopifyLiveCatalog';
import {
  fetchLiveShopifyCatalog,
  buildMegaMenuFromShopify,
  getMockShopifyStorefrontResponse,
  transformShopifyProduct,
} from '../services/shopify';

interface StoreContextType {
  currentCountry: CountryConfig;
  setCountryByCode: (code: string) => void;
  currentLanguage: 'es' | 'en' | 'de' | 'fr' | 'it';
  setLanguage: (lang: 'es' | 'en' | 'de' | 'fr' | 'it') => void;
  t: (key: string) => string;
  formatPrice: (amountEUR: number) => string;
  formatRawAmount: (amountEUR: number) => number;
  
  // Products Catalog
  products: Product[];
  categoriesTree: MegaMenuCategory[];
  activeProduct: Product;
  setActiveProductById: (id: string) => void;
  selectedVariant: ProductVariant;
  setSelectedVariantId: (id: string) => void;
  activeImageIndex: number;
  setActiveImageIndex: (index: number) => void;

  // Shopify Storefront Integration
  shopifyConfig: ShopifyConfig;
  connectShopify: (domain: string, token: string, apiVersion?: string) => Promise<{ success: boolean; message: string }>;
  disconnectShopify: () => void;
  refreshShopifyCatalog: () => Promise<void>;
  selectedCollectionFilter: string | null;
  setSelectedCollectionFilter: (handleOrId: string | null) => void;
  
  // Cart State
  cart: CartItem[];
  cartCount: number;
  cartSubtotalEUR: number;
  promoCode: string;
  discountPercent: number;
  applyPromoCode: (code: string) => boolean;
  addToCart: (product: Product, variant: ProductVariant, quantity?: number) => void;
  updateCartQuantity: (variantId: string, quantity: number) => void;
  removeFromCart: (variantId: string) => void;
  
  // Wishlist State
  wishlist: WishlistItem[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  
  // Drawers and Modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isManualModalOpen: boolean;
  setIsManualModalOpen: (open: boolean) => void;
  isTrackOrderModalOpen: boolean;
  setIsTrackOrderModalOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  
  // Feedback Toast
  toast: { message: string; visible: boolean };
  showToast: (message: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Initial bootstrap of live Shopify catalog from td5kxa-2d.myshopify.com
const initialProducts: Product[] = SHOPIFY_LIVE_PRODUCTS;
const initialCategoriesTree: MegaMenuCategory[] = SHOPIFY_LIVE_CATEGORIES;

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCountry, setCurrentCountry] = useState<CountryConfig>(COUNTRIES[0]); // default ES
  const [currentLanguage, setCurrentLanguage] = useState<'es' | 'en' | 'de' | 'fr' | 'it'>('es');
  
  // Products & MegaMenu State
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categoriesTree, setCategoriesTree] = useState<MegaMenuCategory[]>(initialCategoriesTree);
  const [activeProduct, setActiveProduct] = useState<Product>(initialProducts[0]);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    initialProducts[0]?.variants[0]?.id || ''
  );
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedCollectionFilter, setSelectedCollectionFilter] = useState<string | null>(null);

  // Shopify Storefront Connection State
  const [shopifyConfig, setShopifyConfig] = useState<ShopifyConfig>(() => {
    let queryDomain = '';
    let queryToken = '';
    if (typeof window !== 'undefined') {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        queryDomain = urlParams.get('shop') || urlParams.get('shopify_domain') || '';
        queryToken = urlParams.get('token') || urlParams.get('storefront_token') || '';
      } catch (e) {
        // ignore
      }
    }

    const savedDomain = queryDomain || (typeof window !== 'undefined' ? localStorage.getItem('caselive_shopify_domain') : null);
    const savedToken = queryToken || (typeof window !== 'undefined' ? localStorage.getItem('caselive_shopify_token') : null);
    const savedVersion = typeof window !== 'undefined' ? localStorage.getItem('caselive_shopify_version') : null;

    const activeDomain = savedDomain || (import.meta.env.VITE_SHOPIFY_STORE_DOMAIN as string) || 'td5kxa-2d.myshopify.com';
    const activeToken = savedToken || (import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string) || '';

    return {
      storeDomain: activeDomain,
      storefrontAccessToken: activeToken,
      apiVersion: savedVersion || '2024-01',
      status: 'connected',
      lastSyncedAt: new Date().toLocaleTimeString(),
    };
  });

  const [cart, setCart] = useState<CartItem[]>([
    {
      productId: initialProducts[0].id,
      variantId: initialProducts[0].variants[0].id,
      spu: initialProducts[0].spu,
      sku: initialProducts[0].variants[0].sku,
      title: initialProducts[0].title.es,
      brand: initialProducts[0].brand,
      colorName: initialProducts[0].variants[0].colorName,
      imageUrl: initialProducts[0].images[0].url,
      priceEUR: initialProducts[0].basePriceEUR,
      originalPriceEUR: initialProducts[0].originalPriceEUR,
      quantity: 1,
    },
  ]);
  
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  
  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isTrackOrderModalOpen, setIsTrackOrderModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // Toast state
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false,
  });

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 3500);
  }, []);

  // Connect to live Shopify Storefront API
  const connectShopify = async (
    domain: string,
    token: string,
    apiVersion: string = '2024-01'
  ): Promise<{ success: boolean; message: string }> => {
    const targetConfig: ShopifyConfig = {
      storeDomain: domain,
      storefrontAccessToken: token,
      apiVersion,
      status: 'loading',
    };
    setShopifyConfig(targetConfig);

    const result = await fetchLiveShopifyCatalog(targetConfig);

    if (result.success && result.products.length > 0) {
      setProducts(result.products);
      setCategoriesTree(result.categoriesTree);
      setActiveProduct(result.products[0]);
      setSelectedVariantId(result.products[0].variants[0]?.id || '');
      setActiveImageIndex(0);

      const updatedConfig: ShopifyConfig = {
        storeDomain: domain,
        storefrontAccessToken: token,
        apiVersion,
        status: 'connected',
        lastSyncedAt: new Date().toLocaleTimeString(),
      };
      setShopifyConfig(updatedConfig);

      // Save to localStorage
      try {
        localStorage.setItem('caselive_shopify_domain', domain);
        localStorage.setItem('caselive_shopify_token', token);
        localStorage.setItem('caselive_shopify_version', apiVersion);
      } catch (e) {
        // storage disabled or quota
      }

      showToast(`Successfully linked Shopify: ${result.products.length} products & ${result.categoriesTree.length} collections synced`);
      return {
        success: true,
        message: `Successfully connected to ${domain}. Loaded ${result.products.length} products and built MegaMenu corresponding to Shopify backend.`,
      };
    } else {
      const errorMsg = result.error || 'Failed to fetch catalog from Shopify Storefront API';
      setShopifyConfig((prev) => ({
        ...prev,
        status: 'error',
        errorMessage: errorMsg,
      }));
      showToast(`Shopify Error: ${errorMsg}`);
      return { success: false, message: errorMsg };
    }
  };

  // Disconnect Shopify and reset to Demo catalog
  const disconnectShopify = () => {
    localStorage.removeItem('caselive_shopify_domain');
    localStorage.removeItem('caselive_shopify_token');
    localStorage.removeItem('caselive_shopify_version');

    setShopifyConfig({
      storeDomain: '',
      storefrontAccessToken: '',
      apiVersion: '2024-01',
      status: 'demo',
    });

    setProducts(initialProducts);
    setCategoriesTree(initialCategoriesTree);
    setActiveProduct(initialProducts[0]);
    setSelectedVariantId(initialProducts[0].variants[0]?.id || '');
    setActiveImageIndex(0);
    showToast('Reset to Casalivo catalog');
  };

  // Refresh current catalog
  const refreshShopifyCatalog = async () => {
    if (shopifyConfig.status === 'connected') {
      await connectShopify(
        shopifyConfig.storeDomain,
        shopifyConfig.storefrontAccessToken,
        shopifyConfig.apiVersion
      );
    } else {
      showToast('Rebuilt demo catalog from Shopify schema');
    }
  };

  // On mount: if env credentials or saved credentials exist, sync once
  useEffect(() => {
    if (shopifyConfig.storeDomain && shopifyConfig.storefrontAccessToken) {
      connectShopify(
        shopifyConfig.storeDomain,
        shopifyConfig.storefrontAccessToken,
        shopifyConfig.apiVersion
      );
    }
  }, []);

  const setCountryByCode = (code: string) => {
    const found = COUNTRIES.find((c) => c.code === code);
    if (found) {
      setCurrentCountry(found);
      setCurrentLanguage(found.language);
      showToast(`Locale updated: ${found.flag} ${found.name} (${found.currency})`);
    }
  };

  const setLanguage = (lang: 'es' | 'en' | 'de' | 'fr' | 'it') => {
    setCurrentLanguage(lang);
  };

  const t = (key: string): string => {
    const langDict = UI_TRANSLATIONS[currentLanguage] || UI_TRANSLATIONS.en;
    return langDict[key] || UI_TRANSLATIONS.es[key] || key;
  };

  const formatRawAmount = (amountEUR: number): number => {
    return Math.round(amountEUR * currentCountry.exchangeRate * 100) / 100;
  };

  const formatPrice = (amountEUR: number): string => {
    const converted = formatRawAmount(amountEUR);
    
    if (currentCountry.currency === 'GBP') {
      return `£${converted.toFixed(2)}`;
    }
    if (currentCountry.currency === 'USD') {
      return `$${converted.toFixed(2)}`;
    }
    if (currentCountry.currency === 'PLN') {
      return `${converted.toFixed(2)} zł`;
    }
    return `${converted.toFixed(2).replace('.', ',')} €`;
  };

  const selectedVariant =
    activeProduct.variants.find((v) => v.id === selectedVariantId) ||
    activeProduct.variants[0];

  const handleSelectVariantId = (id: string) => {
    setSelectedVariantId(id);
    const variant = activeProduct.variants.find((v) => v.id === id);
    if (variant && variant.imageIndex !== undefined) {
      setActiveImageIndex(variant.imageIndex);
    }
  };

  const setActiveProductById = (id: string) => {
    const product = products.find((p) => p.id === id || p.spu === id) || PRODUCTS.find((p) => p.id === id);
    if (product) {
      setActiveProduct(product);
      setSelectedVariantId(product.selectedVariantId || product.variants[0]?.id || '');
      setActiveImageIndex(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Cart actions
  const addToCart = (product: Product, variant: ProductVariant, quantity: number = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.variantId === variant.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      } else {
        const title = product.title[currentLanguage] || product.title.es || Object.values(product.title)[0];
        return [
          ...prev,
          {
            productId: product.id,
            variantId: variant.id,
            spu: product.spu,
            sku: variant.sku,
            title,
            brand: product.brand,
            colorName: variant.colorName,
            imageUrl: product.images[variant.imageIndex || 0]?.url || product.images[0].url,
            priceEUR: product.basePriceEUR,
            originalPriceEUR: product.originalPriceEUR,
            quantity,
          },
        ];
      }
    });
    showToast(`Added to Bag: ${variant.colorName.split('/')[0].trim()}`);
  };

  const updateCartQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(variantId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.variantId === variantId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (variantId: string) => {
    setCart((prev) => prev.filter((item) => item.variantId !== variantId));
  };

  const applyPromoCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'CASE10' || clean === 'CASELIVE10') {
      setPromoCode('CASE10');
      setDiscountPercent(10);
      showToast('10% discount applied to your order');
      return true;
    }
    return false;
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const rawSubtotal = cart.reduce((acc, item) => acc + item.priceEUR * item.quantity, 0);
  const cartSubtotalEUR = discountPercent > 0 ? rawSubtotal * (1 - discountPercent / 100) : rawSubtotal;

  // Wishlist actions
  const isInWishlist = (productId: string) => {
    return wishlist.some((item) => item.productId === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      setWishlist((prev) => prev.filter((item) => item.productId !== product.id));
      showToast('Removed from Saved Items');
    } else {
      const title = product.title[currentLanguage] || product.title.es || Object.values(product.title)[0];
      setWishlist((prev) => [
        ...prev,
        {
          productId: product.id,
          title,
          brand: product.brand,
          imageUrl: product.images[0]?.url || '',
          priceEUR: product.basePriceEUR,
        },
      ]);
      showToast('Saved to your collection');
    }
  };

  return (
    <StoreContext.Provider
      value={{
        currentCountry,
        setCountryByCode,
        currentLanguage,
        setLanguage,
        t,
        formatPrice,
        formatRawAmount,
        products,
        categoriesTree,
        activeProduct,
        setActiveProductById,
        selectedVariant,
        setSelectedVariantId: handleSelectVariantId,
        activeImageIndex,
        setActiveImageIndex,
        shopifyConfig,
        connectShopify,
        disconnectShopify,
        refreshShopifyCatalog,
        selectedCollectionFilter,
        setSelectedCollectionFilter,
        cart,
        cartCount,
        cartSubtotalEUR,
        promoCode,
        discountPercent,
        applyPromoCode,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        wishlist,
        toggleWishlist,
        isInWishlist,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isManualModalOpen,
        setIsManualModalOpen,
        isTrackOrderModalOpen,
        setIsTrackOrderModalOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        toast,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
