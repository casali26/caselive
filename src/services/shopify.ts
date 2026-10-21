import {
  Product,
  ProductVariant,
  MegaMenuCategory,
  MegaMenuSubcategory,
  ShopifyRawProduct,
  ShopifyCollectionNode,
  ShopifyConfig,
} from '../types';
import { PRODUCTS, CATEGORIES_TREE } from '../data/mockData';

// GraphQL query for Shopify Storefront API
export const SHOPIFY_STOREFRONT_GRAPHQL_QUERY = `
  query GetShopifyCatalog($collectionsFirst: Int = 10, $productsFirst: Int = 20) {
    shop {
      name
      description
      primaryDomain {
        url
        host
      }
    }
    menu(handle: "main-menu") {
      id
      title
      items {
        id
        title
        url
        type
        items {
          id
          title
          url
          type
        }
      }
    }
    collections(first: $collectionsFirst) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
          }
          products(first: $productsFirst) {
            edges {
              node {
                id
                title
                handle
                description
                descriptionHtml
                vendor
                productType
                tags
                totalInventory
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                  maxVariantPrice {
                    amount
                    currencyCode
                  }
                }
                compareAtPriceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                images(first: 8) {
                  edges {
                    node {
                      url
                      altText
                      width
                      height
                    }
                  }
                }
                variants(first: 10) {
                  edges {
                    node {
                      id
                      title
                      sku
                      availableForSale
                      quantityAvailable
                      price {
                        amount
                        currencyCode
                      }
                      compareAtPrice {
                        amount
                        currencyCode
                      }
                      selectedOptions {
                        name
                        value
                      }
                      image {
                        url
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Helper: Map color names to hex codes for swatch display
const COLOR_MAP: Record<string, string> = {
  black: '#1D1D1F',
  negro: '#1D1D1F',
  schwarz: '#1D1D1F',
  noir: '#1D1D1F',
  white: '#F5F5F7',
  blanco: '#F5F5F7',
  weiß: '#F5F5F7',
  blanc: '#F5F5F7',
  brown: '#6B4423',
  marrón: '#6B4423',
  braun: '#6B4423',
  caramel: '#8A584C',
  caramelo: '#8A584C',
  grey: '#64748B',
  gray: '#64748B',
  gris: '#64748B',
  beige: '#D1C7BD',
  crema: '#EDE8E1',
  cream: '#EDE8E1',
  walnut: '#4B3621',
  oak: '#B8860B',
  natural: '#C8B097',
  charcoal: '#25282F',
  slate: '#334155',
  tan: '#9E7E5A',
};

function resolveColorHex(colorName: string): string {
  const lower = colorName.toLowerCase().trim();
  for (const [key, hex] of Object.entries(COLOR_MAP)) {
    if (lower.includes(key)) return hex;
  }
  return '#475569';
}

// Transform raw Shopify GraphQL Product into our application Product structure
export function transformShopifyProduct(
  raw: ShopifyRawProduct,
  collectionTitle?: string
): Product {
  const basePrice = parseFloat(raw.priceRange?.minVariantPrice?.amount || '99.00');
  const compareAtPrice = raw.compareAtPriceRange?.minVariantPrice?.amount
    ? parseFloat(raw.compareAtPriceRange.minVariantPrice.amount)
    : Math.round(basePrice * 1.35);

  const images = (raw.images?.edges || []).map((edge, idx) => ({
    url: edge.node.url,
    alt: edge.node.altText || `${raw.title} - View ${idx + 1}`,
    label: idx === 0 ? 'Lifestyle' : idx === 1 ? 'Controls' : idx === 2 ? 'Detail' : 'Perspective',
  }));

  // Fallback images if shopify has none
  if (images.length === 0) {
    images.push({
      url: '/images/chair_front.jpg',
      alt: raw.title,
      label: 'Main View',
    });
  }

  // Parse variants
  const variants: ProductVariant[] = (raw.variants?.edges || []).map((edge, idx) => {
    const v = edge.node;
    const colorOpt = v.selectedOptions?.find((opt) =>
      ['color', 'colour', 'coloris', 'farbe'].includes(opt.name.toLowerCase())
    );
    const colorName = colorOpt?.value || v.title || `Option ${idx + 1}`;
    return {
      id: v.id,
      colorName,
      colorHex: resolveColorHex(colorName),
      sku: v.sku || `SKU-${raw.handle.substring(0, 6).toUpperCase()}-${idx + 1}`,
      stock: v.quantityAvailable ?? 25,
      imageIndex: Math.min(idx, images.length - 1),
    };
  });

  if (variants.length === 0) {
    variants.push({
      id: `${raw.id}-default`,
      colorName: 'Standard',
      colorHex: '#25282F',
      sku: `SKU-${raw.handle.substring(0, 8).toUpperCase()}`,
      stock: 45,
      imageIndex: 0,
    });
  }

  // Build category path: [Level 1 Collection, Level 2 Product Type]
  const level1 = collectionTitle || raw.productType || 'Living Collection';
  const level2 = raw.productType || 'Ergonomics';
  const categoryPath = [level1, level2];

  return {
    id: raw.id || raw.handle,
    spu: raw.handle.toUpperCase(),
    sku: variants[0]?.sku || raw.handle,
    brand: raw.vendor || 'caselive',
    title: {
      es: raw.title,
      en: raw.title,
      de: raw.title,
      fr: raw.title,
    },
    shortDesc: {
      es: raw.description?.slice(0, 160) || 'Diseñado con materiales premium y ergonomía europea.',
      en: raw.description?.slice(0, 160) || 'Engineered with premium materials and European ergonomics.',
      de: raw.description?.slice(0, 160) || 'Entwickelt mit hochwertigen Materialien und europäischer Ergonomie.',
      fr: raw.description?.slice(0, 160) || 'Conçu avec des matériaux haut de gamme et une ergonomie européenne.',
    },
    categoryPath,
    rating: 4.8,
    reviewCount: 38 + (raw.tags?.length || 5) * 8,
    basePriceEUR: basePrice,
    originalPriceEUR: compareAtPrice > basePrice ? compareAtPrice : Math.round(basePrice * 1.25),
    variants,
    selectedVariantId: variants[0].id,
    images,
    highlights: {
      es: [
        'Auténtico diseño CaseLive con certificación CE y RoHS',
        'Acabados duraderos y tapicería transpirable para uso intensivo',
        'Envío express desde centros logísticos europeos en 24-48h',
        '3 años de garantía oficial con repuestos garantizados',
      ],
      en: [
        'Authentic CaseLive architectural design certified with CE & RoHS',
        'Heavy-duty breathable upholstery and reinforced steel chassis',
        'Fast delivery from European logistics hubs within 24-48 hours',
        '3-Year full manufacturer warranty with dedicated customer support',
      ],
    },
    dimensions: {
      overall: '115 - 125 cm × 68 cm × 72 cm',
      seatWidth: '52 cm',
      seatDepth: '50 cm',
      seatHeight: '46 - 54 cm',
      reclinedDepth: '158 cm (max recline)',
      maxLoad: '150 kg (330 lbs)',
      netWeight: '21.5 kg',
      grossWeight: '24.2 kg',
      boxDimensions: '84 cm × 66 cm × 38 cm',
    },
    specifications: [
      { label: 'Shopify ID', value: raw.id },
      { label: 'Vendor', value: raw.vendor || 'CaseLive Studio' },
      { label: 'Product Type', value: raw.productType || 'Living Furniture' },
      { label: 'Tags', value: raw.tags?.join(', ') || 'Home, Living' },
      { label: 'Chassis Material', value: 'High-Tensile Precision Alloy Steel' },
      { label: 'Upholstery', value: 'Perforated Eco-Leather / Engineered Fabric' },
      { label: 'Certifications', value: 'CE, RoHS, REACH, ISO 9001' },
    ],
    fullDescription: {
      es: raw.descriptionHtml || raw.description || 'Detalles completos disponibles en la ficha técnica.',
      en: raw.descriptionHtml || raw.description || 'Full specifications and details available on product catalog.',
    },
    assemblyPdfUrl: '#download-manual',
    gpsr: {
      euResponsiblePerson: {
        company: 'CaseLive European Logistics B.V.',
        address: 'Keizersgracht 421',
        city: 'Amsterdam',
        country: 'Netherlands',
        email: 'compliance@caselive.com',
      },
      manufacturer: {
        name: 'CaseLive Living Industrial Corp.',
        address: 'European Design Quarter, Industrial Park 4',
        origin: 'Made for CaseLive Europe',
      },
      certifications: ['CE 2026/GPSR', 'EN 1335-1/2', 'ISO 9001', 'REACH'],
      safetyNotices: [
        'Ensure all fasteners are tightened securely every 6 months.',
        'Operate adjustment controls smoothly on level indoor flooring.',
      ],
    },
    shippingTier: {
      type: 'Direct European Fulfillment',
      courier: 'DHL Freight / GLS Logistics',
      heavyItemNotice: 'Delivered directly to door step in reinforced protective packaging',
    },
  };
}

// Build 2-Level MegaMenu from Shopify Storefront Collections & Menu
export function buildMegaMenuFromShopify(
  collections: ShopifyCollectionNode[],
  menuData?: any,
  allProducts: Product[] = []
): MegaMenuCategory[] {
  // Option A: If Shopify Menu items exist in Shopify Admin (Online Store -> Navigation -> Main menu)
  if (menuData?.items && menuData.items.length > 0) {
    const categories: MegaMenuCategory[] = menuData.items.map((level1Item: any, idx: number) => {
      // Find products matching this level 1 item
      const matchingColl = collections.find(
        (c) =>
          c.title.toLowerCase() === level1Item.title.toLowerCase() ||
          c.handle.toLowerCase() === level1Item.title.toLowerCase().replace(/\s+/g, '-')
      );

      const subcategories: MegaMenuSubcategory[] = (level1Item.items || []).map((level2Item: any) => {
        // Find products belonging to level 2 item
        const matchingProducts = allProducts.filter(
          (p) =>
            p.categoryPath.some((cp) => cp.toLowerCase().includes(level2Item.title.toLowerCase())) ||
            p.title.es.toLowerCase().includes(level2Item.title.toLowerCase())
        );

        return {
          title: level2Item.title,
          handle: level2Item.url?.split('/').pop() || level2Item.title.toLowerCase().replace(/\s+/g, '-'),
          items: matchingProducts.length > 0
            ? matchingProducts.map((p) => ({
                label: p.title.es.split(' con ')[0].split(' with ')[0],
                productId: p.id,
                type: 'product' as const,
              }))
            : [
                { label: `All ${level2Item.title}`, type: 'link' as const },
                { label: 'Featured Design', type: 'link' as const },
                { label: 'New Arrivals', type: 'link' as const },
              ],
        };
      });

      // Default subcategories if Level 2 is empty in menu
      if (subcategories.length === 0) {
        subcategories.push({
          title: 'Featured Collection',
          items: (matchingColl?.products.edges || []).slice(0, 4).map((e) => ({
            label: e.node.title,
            productId: e.node.id,
            type: 'product' as const,
          })),
        });
      }

      const topProduct = matchingColl?.products.edges[0]?.node;

      return {
        id: level1Item.id || `menu-${idx}`,
        name: level1Item.title,
        handle: level1Item.url?.split('/').pop() || level1Item.title.toLowerCase().replace(/\s+/g, '-'),
        icon: idx === 0 ? 'Briefcase' : idx === 1 ? 'Sun' : idx === 2 ? 'PawPrint' : 'Sparkles',
        featuredTag: 'Shopify Collection',
        subcategories,
        banner: {
          headline: topProduct?.title || `Curated ${level1Item.title}`,
          subtext: `Directly synced from Shopify Storefront collection with live European pricing.`,
          linkText: 'Explore Category',
          imageUrl: topProduct?.images?.edges[0]?.node?.url,
          targetProductId: topProduct?.id,
        },
      };
    });

    if (categories.length > 0) return categories;
  }

  // Option B: Build from Shopify Collections directly (Level 1: Collection, Level 2: Product Types / Subcategories)
  if (collections && collections.length > 0) {
    return collections.map((coll, idx) => {
      // Group products within this collection by productType
      const typeGroups = new Map<string, { label: string; productId: string }[]>();

      coll.products.edges.forEach((edge) => {
        const prod = edge.node;
        const pType = prod.productType?.trim() || 'Core Essentials';
        if (!typeGroups.has(pType)) {
          typeGroups.set(pType, []);
        }
        typeGroups.get(pType)!.push({
          label: prod.title.split(' con ')[0].split(' with ')[0],
          productId: prod.id,
        });
      });

      // Transform groups into Level 2 Subcategories
      const subcategories: MegaMenuSubcategory[] = [];
      typeGroups.forEach((items, pType) => {
        subcategories.push({
          title: pType,
          handle: pType.toLowerCase().replace(/\s+/g, '-'),
          items: items.map((item) => ({
            label: item.label,
            productId: item.productId,
            type: 'product' as const,
          })),
        });
      });

      // If no product types, generate level 2 from product tags or direct items
      if (subcategories.length === 0) {
        subcategories.push({
          title: 'Catalog Essentials',
          items: coll.products.edges.slice(0, 5).map((e) => ({
            label: e.node.title,
            productId: e.node.id,
            type: 'product' as const,
          })),
        });
      }

      const topProduct = coll.products.edges[0]?.node;

      return {
        id: coll.id || coll.handle,
        name: coll.title,
        handle: coll.handle,
        icon: idx === 0 ? 'Briefcase' : idx === 1 ? 'Sun' : idx === 2 ? 'PawPrint' : 'Sparkles',
        featuredTag: 'Shopify Collection',
        subcategories,
        banner: {
          headline: topProduct?.title || `Discover ${coll.title}`,
          subtext: coll.description || `Handcrafted pieces synced directly from your Shopify storefront catalog.`,
          linkText: 'View In Store',
          imageUrl: topProduct?.images?.edges[0]?.node?.url || coll.image?.url,
          targetProductId: topProduct?.id,
        },
      };
    });
  }

  // Fallback to default high-quality category tree
  return CATEGORIES_TREE.map((c) => ({
    id: c.id,
    name: c.name,
    handle: c.id,
    icon: c.icon,
    featuredTag: c.featuredTag,
    subcategories: c.subcategories.map((sub) => ({
      title: sub.title,
      items: sub.items.map((item) => ({
        label: item,
        type: 'tag' as const,
      })),
    })),
    banner: c.banner,
  }));
}

// Default mock Shopify Storefront Response (reflecting live Shopify GraphQL schema)
export function getMockShopifyStorefrontResponse() {
  return {
    shop: {
      name: 'CaseLive Living Store',
      description: 'Sophisticated modern ergonomics and outdoor living',
      primaryDomain: {
        url: 'https://caselive.myshopify.com',
        host: 'caselive.myshopify.com',
      },
    },
    menu: {
      id: 'gid://shopify/Menu/108927182',
      title: 'Main menu',
      items: [
        {
          id: 'gid://shopify/MenuItem/101',
          title: 'Home & Office',
          url: '/collections/home-office',
          type: 'COLLECTION',
          items: [
            { id: 'gid://shopify/MenuItem/101-1', title: 'Ergonomic Seating', url: '/collections/seating' },
            { id: 'gid://shopify/MenuItem/101-2', title: 'Desks & Workstations', url: '/collections/desks' },
            { id: 'gid://shopify/MenuItem/101-3', title: 'Living & Storage', url: '/collections/storage' },
            { id: 'gid://shopify/MenuItem/101-4', title: 'Rest & Comfort', url: '/collections/comfort' },
          ],
        },
        {
          id: 'gid://shopify/MenuItem/102',
          title: 'Outdoor Living',
          url: '/collections/outdoor-garden',
          type: 'COLLECTION',
          items: [
            { id: 'gid://shopify/MenuItem/102-1', title: 'Patio Lounge Sets', url: '/collections/patio' },
            { id: 'gid://shopify/MenuItem/102-2', title: 'Dining & Bistro', url: '/collections/outdoor-dining' },
            { id: 'gid://shopify/MenuItem/102-3', title: 'Shade & Pergolas', url: '/collections/pergolas' },
          ],
        },
        {
          id: 'gid://shopify/MenuItem/103',
          title: 'Pet Furniture',
          url: '/collections/pet-living',
          type: 'COLLECTION',
          items: [
            { id: 'gid://shopify/MenuItem/103-1', title: 'Cat Climbing Towers', url: '/collections/cat-trees' },
            { id: 'gid://shopify/MenuItem/103-2', title: 'Dog Loungers & Beds', url: '/collections/dog-beds' },
          ],
        },
        {
          id: 'gid://shopify/MenuItem/104',
          title: 'Lighting & Decor',
          url: '/collections/decor-lighting',
          type: 'COLLECTION',
          items: [
            { id: 'gid://shopify/MenuItem/104-1', title: 'Sculptural Lighting', url: '/collections/lighting' },
            { id: 'gid://shopify/MenuItem/104-2', title: 'Soft Textiles & Rugs', url: '/collections/textiles' },
          ],
        },
      ],
    },
    collections: {
      edges: [
        {
          node: {
            id: 'gid://shopify/Collection/281928491',
            title: 'Home & Office',
            handle: 'home-office',
            description: 'Ergonomic seating and studio workspaces designed for restorative daily focus.',
            image: { url: '/images/chair_front.jpg', altText: 'Home Office Ergonomics' },
            products: {
              edges: [
                {
                  node: {
                    id: 'gid://shopify/Product/8271829101',
                    title: 'Silla de Oficina Ergonómica con Masaje 6 Puntos, Reclinable 135°',
                    handle: 'caselive-massage-chair',
                    description: 'Silla ergonómica de alto confort con masaje por vibración de 6 puntos, reclinación hasta 135 grados y reposapiés extensible.',
                    vendor: 'caselive',
                    productType: 'Ergonomic Seating',
                    tags: ['Office', 'Massage', 'Ergonomics', 'Leather'],
                    priceRange: {
                      minVariantPrice: { amount: '189.00', currencyCode: 'EUR' },
                      maxVariantPrice: { amount: '199.00', currencyCode: 'EUR' },
                    },
                    compareAtPriceRange: {
                      minVariantPrice: { amount: '269.00', currencyCode: 'EUR' },
                    },
                    images: {
                      edges: [
                        { node: { url: '/images/chair_front.jpg', altText: 'Front View' } },
                        { node: { url: '/images/chair_recline.jpg', altText: 'Recline Massage' } },
                        { node: { url: '/images/chair_black.jpg', altText: 'Black Variant' } },
                        { node: { url: '/images/chair_detail.jpg', altText: 'Control Panel Detail' } },
                      ],
                    },
                    variants: {
                      edges: [
                        {
                          node: {
                            id: 'gid://shopify/ProductVariant/440182910',
                            title: 'Caramelo Cálido',
                            sku: 'CL-921-CW',
                            availableForSale: true,
                            quantityAvailable: 42,
                            price: { amount: '189.00', currencyCode: 'EUR' },
                            compareAtPrice: { amount: '269.00', currencyCode: 'EUR' },
                            selectedOptions: [{ name: 'Color', value: 'Caramel' }],
                            image: { url: '/images/chair_front.jpg' },
                          },
                        },
                        {
                          node: {
                            id: 'gid://shopify/ProductVariant/440182911',
                            title: 'Negro Azabache',
                            sku: 'CL-921-BK',
                            availableForSale: true,
                            quantityAvailable: 18,
                            price: { amount: '189.00', currencyCode: 'EUR' },
                            compareAtPrice: { amount: '269.00', currencyCode: 'EUR' },
                            selectedOptions: [{ name: 'Color', value: 'Black' }],
                            image: { url: '/images/chair_black.jpg' },
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
        {
          node: {
            id: 'gid://shopify/Collection/281928492',
            title: 'Outdoor Living',
            handle: 'outdoor-garden',
            description: 'Turn terraces and gardens into calm, enduring outdoor sanctuaries.',
            image: { url: '/images/patio_rattan.jpg', altText: 'Patio Rattan Living' },
            products: {
              edges: [
                {
                  node: {
                    id: 'gid://shopify/Product/8271829102',
                    title: 'Conjunto Lounge Exterior 4 Piezas con Cojines Hidrófugos',
                    handle: 'caselive-rattan-set',
                    description: 'Set modular exterior en ratán sintético PE de alta resistencia UV con mesa de centro y cojines acolchados lavables.',
                    vendor: 'caselive',
                    productType: 'Patio Lounge Sets',
                    tags: ['Outdoor', 'Patio', 'Rattan', 'Garden'],
                    priceRange: {
                      minVariantPrice: { amount: '349.00', currencyCode: 'EUR' },
                      maxVariantPrice: { amount: '349.00', currencyCode: 'EUR' },
                    },
                    compareAtPriceRange: {
                      minVariantPrice: { amount: '489.00', currencyCode: 'EUR' },
                    },
                    images: {
                      edges: [
                        { node: { url: '/images/patio_rattan.jpg', altText: 'Patio Lounge Set' } },
                      ],
                    },
                    variants: {
                      edges: [
                        {
                          node: {
                            id: 'gid://shopify/ProductVariant/440182920',
                            title: 'Gris Grafito',
                            sku: 'CL-RT-04',
                            availableForSale: true,
                            quantityAvailable: 15,
                            price: { amount: '349.00', currencyCode: 'EUR' },
                            compareAtPrice: { amount: '489.00', currencyCode: 'EUR' },
                            selectedOptions: [{ name: 'Color', value: 'Graphite Grey' }],
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
        {
          node: {
            id: 'gid://shopify/Collection/281928493',
            title: 'Pet Furniture',
            handle: 'pet-living',
            description: 'Minimalist pet pieces that blend harmoniously into modern living spaces.',
            image: { url: '/images/cat_tree.jpg', altText: 'Pet Climbing Tree' },
            products: {
              edges: [
                {
                  node: {
                    id: 'gid://shopify/Product/8271829103',
                    title: 'Torre Rascador Multinivel 140cm en Madera y Sisal Natural',
                    handle: 'caselive-cat-tree',
                    description: 'Árbol rascador para gatos con estructura de madera maciza, postes de sisal natural y hamaca superior acolchada.',
                    vendor: 'caselive',
                    productType: 'Cat Climbing Towers',
                    tags: ['Pet', 'Cat', 'Wood', 'Scratcher'],
                    priceRange: {
                      minVariantPrice: { amount: '89.00', currencyCode: 'EUR' },
                      maxVariantPrice: { amount: '89.00', currencyCode: 'EUR' },
                    },
                    compareAtPriceRange: {
                      minVariantPrice: { amount: '129.00', currencyCode: 'EUR' },
                    },
                    images: {
                      edges: [
                        { node: { url: '/images/cat_tree.jpg', altText: 'Cat Tree Furniture' } },
                      ],
                    },
                    variants: {
                      edges: [
                        {
                          node: {
                            id: 'gid://shopify/ProductVariant/440182930',
                            title: 'Roble Claro / Crudo',
                            sku: 'CL-CT-140',
                            availableForSale: true,
                            quantityAvailable: 28,
                            price: { amount: '89.00', currencyCode: 'EUR' },
                            compareAtPrice: { amount: '129.00', currencyCode: 'EUR' },
                            selectedOptions: [{ name: 'Color', value: 'Natural Oak' }],
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  };
}

// Fetch live catalog from Shopify Storefront API
export async function fetchLiveShopifyCatalog(config: ShopifyConfig): Promise<{
  success: boolean;
  products: Product[];
  categoriesTree: MegaMenuCategory[];
  rawCollections: ShopifyCollectionNode[];
  error?: string;
}> {
  if (!config.storeDomain || !config.storefrontAccessToken) {
    // Return mock Shopify catalog when credentials are not configured
    const mock = getMockShopifyStorefrontResponse();
    const rawCollections = mock.collections.edges.map((e) => e.node);
    
    // Transform products
    const products: Product[] = [];
    rawCollections.forEach((coll) => {
      coll.products.edges.forEach((edge) => {
        products.push(transformShopifyProduct(edge.node, coll.title));
      });
    });

    // Also include any fallback products if needed
    PRODUCTS.forEach((p) => {
      if (!products.some((existing) => existing.id === p.id || existing.spu === p.spu)) {
        products.push(p);
      }
    });

    const categoriesTree = buildMegaMenuFromShopify(rawCollections, mock.menu, products);

    return {
      success: true,
      products,
      categoriesTree,
      rawCollections,
    };
  }

  // Sanitize domain
  let cleanDomain = config.storeDomain.trim().toLowerCase();
  cleanDomain = cleanDomain.replace(/^https?:\/\//, '').replace(/\/$/, '');
  if (!cleanDomain.includes('.')) {
    cleanDomain = `${cleanDomain}.myshopify.com`;
  }

  const endpoint = `https://${cleanDomain}/api/${config.apiVersion || '2024-01'}/graphql.json`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': config.storefrontAccessToken.trim(),
      },
      body: JSON.stringify({
        query: SHOPIFY_STOREFRONT_GRAPHQL_QUERY,
        variables: { collectionsFirst: 10, productsFirst: 20 },
      }),
    });

    if (!response.ok) {
      throw new Error(`Shopify HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.errors && data.errors.length > 0) {
      throw new Error(data.errors.map((e: any) => e.message).join('; '));
    }

    const shopifyData = data.data;
    const rawCollections: ShopifyCollectionNode[] =
      shopifyData?.collections?.edges?.map((e: any) => e.node) || [];

    const products: Product[] = [];
    rawCollections.forEach((coll) => {
      coll.products.edges.forEach((edge) => {
        products.push(transformShopifyProduct(edge.node, coll.title));
      });
    });

    if (products.length === 0) {
      throw new Error('Connected to Shopify Storefront, but no published products found in collections.');
    }

    const categoriesTree = buildMegaMenuFromShopify(
      rawCollections,
      shopifyData?.menu,
      products
    );

    return {
      success: true,
      products,
      categoriesTree,
      rawCollections,
    };
  } catch (err: any) {
    return {
      success: false,
      products: [],
      categoriesTree: [],
      rawCollections: [],
      error: err.message || 'Unknown network error connecting to Shopify Storefront API',
    };
  }
}
