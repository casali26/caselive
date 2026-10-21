export interface CountryConfig {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  exchangeRate: number; // relative to EUR (1 EUR = X)
  locale: string;
  language: 'es' | 'en' | 'de' | 'fr' | 'it';
  warehouseName: string;
  warehouseCity: string;
  deliveryDays: string;
  freeShippingThreshold: number; // in EUR
}

export interface ProductVariant {
  id: string;
  colorName: string;
  colorHex: string;
  sku: string;
  stock: number;
  imageIndex: number;
}

export interface SpecificationItem {
  label: string;
  value: string;
}

export interface DimensionSpec {
  overall: string;
  seatWidth: string;
  seatDepth: string;
  seatHeight: string;
  reclinedDepth: string;
  maxLoad: string;
  netWeight: string;
  grossWeight: string;
  boxDimensions: string;
}

export interface GpsrCompliance {
  euResponsiblePerson: {
    company: string;
    address: string;
    city: string;
    country: string;
    email: string;
  };
  manufacturer: {
    name: string;
    address: string;
    origin: string;
  };
  certifications: string[];
  safetyNotices: string[];
}

export interface Product {
  id: string;
  spu: string;
  sku: string;
  brand: string;
  title: Record<string, string>; // localized titles (es, en, de, fr)
  shortDesc: Record<string, string>;
  categoryPath: string[];
  rating: number;
  reviewCount: number;
  basePriceEUR: number;
  originalPriceEUR: number;
  variants: ProductVariant[];
  selectedVariantId: string;
  images: {
    url: string;
    alt: string;
    label: string;
    isBlackVariant?: boolean;
  }[];
  videoPlaceholderUrl?: string;
  highlights: Record<string, string[]>;
  dimensions: DimensionSpec;
  specifications: SpecificationItem[];
  fullDescription: Record<string, string>;
  assemblyPdfUrl: string;
  gpsr: GpsrCompliance;
  shippingTier: {
    type: string;
    courier: string;
    heavyItemNotice?: string;
  };
}

export interface CartItem {
  productId: string;
  variantId: string;
  spu: string;
  sku: string;
  title: string;
  brand: string;
  colorName: string;
  imageUrl: string;
  priceEUR: number;
  originalPriceEUR: number;
  quantity: number;
}

export interface WishlistItem {
  productId: string;
  title: string;
  brand: string;
  imageUrl: string;
  priceEUR: number;
}

export interface MegaMenuItem {
  label: string;
  handle?: string;
  productId?: string;
  type?: 'product' | 'collection' | 'tag' | 'link';
}

export interface MegaMenuSubcategory {
  title: string;
  handle?: string;
  items: MegaMenuItem[];
}

export interface MegaMenuCategory {
  id: string;
  name: string;
  handle: string;
  icon?: string;
  featuredTag?: string;
  subcategories: MegaMenuSubcategory[];
  banner: {
    headline: string;
    subtext: string;
    linkText: string;
    imageUrl?: string;
    targetProductId?: string;
  };
}

export interface ShopifyConfig {
  storeDomain: string;
  storefrontAccessToken: string;
  apiVersion: string;
  status: 'connected' | 'demo' | 'loading' | 'error';
  errorMessage?: string;
  lastSyncedAt?: string;
}

export interface ShopifyRawProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string;
  vendor: string;
  productType: string;
  tags: string[];
  totalInventory?: number;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
    maxVariantPrice?: { amount: string; currencyCode: string };
  };
  compareAtPriceRange?: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  images: {
    edges: {
      node: {
        url: string;
        altText?: string;
        width?: number;
        height?: number;
      };
    }[];
  };
  variants: {
    edges: {
      node: {
        id: string;
        title: string;
        sku?: string;
        availableForSale: boolean;
        quantityAvailable?: number;
        price: { amount: string; currencyCode: string };
        compareAtPrice?: { amount: string; currencyCode: string };
        selectedOptions: { name: string; value: string }[];
        image?: { url: string; altText?: string };
      };
    }[];
  };
  collections?: {
    edges: {
      node: {
        id: string;
        title: string;
        handle: string;
      };
    }[];
  };
}

export interface ShopifyCollectionNode {
  id: string;
  title: string;
  handle: string;
  description?: string;
  image?: { url: string; altText?: string };
  products: {
    edges: {
      node: ShopifyRawProduct;
    }[];
  };
}
