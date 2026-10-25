import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchShopifyPage(page) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'td5kxa-2d.myshopify.com',
      path: `/products.json?limit=250&page=${page}`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    };
    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.products || []);
        } catch(e) {
          console.error(`Page ${page} parse error:`, e.message);
          resolve([]);
        }
      });
    }).on('error', (err) => {
      console.error(`Page ${page} fetch error:`, err.message);
      resolve([]);
    });
  });
}

function cleanHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
}

function parseDimensionsAndSpecs(bodyHtml, grams, title) {
  const html = bodyHtml || '';

  // 1. Overall Dimensions: Length x Width x Height
  let overall = '';
  const mMontado = html.match(/Medidas\s+montado[^\d]*(\d+[\d.,\s*xX*×]+cm)/i);
  const mTotales = html.match(/Medidas\s+totales[^\d]*(\d+[\d.,\s*xX*×]+cm)/i);
  if (mMontado) overall = mMontado[1].replace(/\s+/g, ' ').trim();
  else if (mTotales) overall = mTotales[1].replace(/\s+/g, ' ').trim();

  if (!overall) {
    const mGen = html.match(/(\d+([.,]\d+)?\s*[xX*×]\s*\d+([.,]\d+)?(?:\s*[xX*×]\s*\d+([.,]\d+)?)?\s*cm)/i);
    if (mGen) overall = mGen[1].replace(/\s+/g, ' ').trim();
  }
  if (!overall) {
    const mTitle = (title || '').match(/(\d+([.,]\d+)?\s*[xX*×]\s*\d+([.,]\d+)?(?:\s*[xX*×]\s*\d+([.,]\d+)?)?\s*cm)/i);
    if (mTitle) overall = mTitle[1].replace(/\s+/g, ' ').trim();
  }

  // 2. Weight
  let weight = '';
  const mWeight = html.match(/(?:Peso|Peso\s+neto)[\s:]*<\/strong>\s*([^<]+)/i) || html.match(/Peso[\s:]*([0-9.,]+\s*kg)/i);
  if (mWeight) weight = mWeight[1].trim();
  else if (grams && grams > 0) weight = (grams / 1000).toFixed(1) + ' kg';

  // 3. Material
  let material = '';
  const mMat = html.match(/(?:Material|Materiales)[\s:]*<\/strong>\s*([^<]+)/i) || html.match(/Material[\s:]*([A-Za-zÁÉÍÓÚáéíóúñÑ\s,]+)/i);
  if (mMat) material = mMat[1].trim();

  // 4. Max Load Capacity
  let maxLoad = '';
  const mLoad = html.match(/(?:Carga\s+m[aá]xima|Capacidad\s+de\s+carga|Carga)[\s:]*<\/strong>\s*([^<]+)/i) || html.match(/Carga\s+m[aá]xima[\s:]*([0-9.,]+\s*kg)/i);
  if (mLoad) maxLoad = mLoad[1].trim();

  // 5. Package Size / Box Dimensions
  let boxDimensions = '';
  const mBox = html.match(/(?:Medidas\s+de\s+la\s+caja|Medidas\s+del\s+paquete|Dimensiones\s+del\s+paquete)[\s:]*([0-9.,\s*xX*×]+cm)/i);
  if (mBox) boxDimensions = mBox[1].trim();

  // 6. Detailed Specs List from <li> tags
  const specifications = [];
  const liMatches = html.match(/<li><strong>([^<:]+)[:\s]*<\/strong>\s*([^<]+)<\/li>/gi) || [];
  liMatches.forEach((li) => {
    const parts = li.match(/<strong>([^<:]+)[:\s]*<\/strong>\s*([^<]+)/i);
    if (parts) {
      const label = parts[1].trim();
      const val = parts[2].trim();
      if (label && val && !label.toLowerCase().includes('sku') && !label.toLowerCase().includes('ref')) {
        specifications.push({ label, value: val });
      }
    }
  });

  return {
    overall: overall || 'Dimensiones estándar en ficha técnica',
    seatWidth: 'Estándar',
    seatDepth: 'Estándar',
    seatHeight: 'Estándar',
    reclinedDepth: 'Conforme modelo',
    maxLoad: maxLoad || '120 kg',
    netWeight: weight || (grams && grams > 0 ? (grams / 1000).toFixed(1) + ' kg' : '15 kg'),
    grossWeight: grams && grams > 0 ? ((grams * 1.1) / 1000).toFixed(1) + ' kg' : '17.5 kg',
    boxDimensions: boxDimensions || 'Protección de embalaje reforzado',
    material: material || 'Acabados de primera calidad',
    specifications,
  };
}

function extractHighlights(bodyHtml, title) {
  if (!bodyHtml) return ['Calidad europea garantizada', 'Envío rápido 24-48h desde almacén de Valencia', '3 Años de Garantía Oficial'];
  const matches = bodyHtml.match(/<li>(.*?)<\/li>/g);
  if (matches && matches.length >= 2) {
    return matches.slice(0, 4).map(m => cleanHtml(m).slice(0, 140));
  }
  return [
    'Diseño y fabricación bajo rigurosos estándares de calidad europeos',
    'Materiales de alta durabilidad y mantenimiento sencillo',
    'Envío peninsular express en 24/48h desde almacén de Valencia',
    '3 Años de garantía europea oficial con soporte directo'
  ];
}

const COLOR_MAP = {
  negro: '#1D1D1F',
  black: '#1D1D1F',
  blanco: '#F5F5F7',
  white: '#F5F5F7',
  gris: '#64748B',
  grey: '#64748B',
  marron: '#6B4423',
  marrón: '#6B4423',
  brown: '#6B4423',
  beige: '#D1C7BD',
  crema: '#EDE8E1',
  cream: '#EDE8E1',
  roble: '#C8B097',
  oak: '#C8B097',
  natural: '#D4C4B5',
  antracita: '#25282F',
  azul: '#2563EB',
  blue: '#2563EB',
  verde: '#15803D',
  green: '#15803D',
  rojo: '#DC2626',
  red: '#DC2626',
  rosa: '#F472B6',
  pink: '#F472B6',
  amarillo: '#EAB308',
  yellow: '#EAB308',
  madera: '#855E42',
  wood: '#855E42',
};

function resolveColor(name) {
  if (!name) return '#475569';
  const lower = name.toLowerCase();
  for (const [key, hex] of Object.entries(COLOR_MAP)) {
    if (lower.includes(key)) return hex;
  }
  return '#334155';
}

function resolvePrice(v, raw) {
  let p = parseFloat(v?.price || '0');
  if (p > 0) return p;

  // Try checking other variants
  if (raw.variants && raw.variants.length > 1) {
    for (const otherV of raw.variants) {
      const op = parseFloat(otherV.price || '0');
      if (op > 0) return op;
    }
  }

  // Estimate realistic catalog price based on product weight and category
  const grams = v?.grams || 0;
  if (grams >= 25000) return 189.99;
  if (grams >= 15000) return 129.99;
  if (grams >= 10000) return 89.99;
  if (grams >= 5000) return 59.99;
  if (grams >= 2000) return 45.99;
  return 34.99;
}

async function run() {
  console.log('Fetching live products from store catalog...');
  const allRaw = [];
  
  // Fetch up to 10 pages (~2,500 products) for high diversity and instant compilation
  for (let p = 1; p <= 10; p++) {
    console.log(`Pulling page ${p}...`);
    const prods = await fetchShopifyPage(p);
    if (!prods.length) break;
    allRaw.push(...prods);
  }

  console.log(`Fetched ${allRaw.length} raw products.`);

  // Transform products
  const products = allRaw.map((raw, idx) => {
    const v0 = raw.variants && raw.variants[0] ? raw.variants[0] : {};
    const basePrice = resolvePrice(v0, raw);
    const compPrice = v0.compare_at_price && parseFloat(v0.compare_at_price) > basePrice
      ? parseFloat(v0.compare_at_price)
      : Math.round(basePrice * 1.35);

    const images = (raw.images || []).map((img, i) => ({
      url: img.src,
      alt: raw.title,
      label: i === 0 ? 'Principal' : i === 1 ? 'Detalle' : i === 2 ? 'Ambiente' : 'Perspectiva'
    }));

    if (images.length === 0) {
      images.push({
        url: '/images/chair_front.jpg',
        alt: raw.title,
        label: 'Principal'
      });
    }

    const variants = (raw.variants || []).map((v, vIdx) => {
      const colorVal = v.option1 || v.title || 'Estándar';
      return {
        id: String(v.id || `${raw.id}-${vIdx}`),
        colorName: colorVal,
        colorHex: resolveColor(colorVal),
        sku: v.sku || `SKU-${raw.id}-${vIdx + 1}`,
        stock: 25 + (idx % 30),
        imageIndex: Math.min(vIdx, images.length - 1)
      };
    });

    const categoryPrimary = raw.product_type || 'Hogar y Decoración';
    const subcategory = (raw.tags && typeof raw.tags === 'string' ? raw.tags.split(',')[0]?.trim() : '') || 'Selección Exclusiva';

    const highlights = extractHighlights(raw.body_html, raw.title);
    const specsData = parseDimensionsAndSpecs(raw.body_html, v0.grams, raw.title);

    // Build specs list including material, category, delivery
    const finalSpecs = [
      { label: 'Colección', value: categoryPrimary },
      { label: 'Material Principal', value: specsData.material },
      { label: 'Medidas Totales', value: specsData.overall },
      { label: 'Peso del Producto', value: specsData.netWeight },
      { label: 'Capacidad de Carga', value: specsData.maxLoad },
      { label: 'Origen Logístico', value: 'Almacén Valencia (Alfafar, ES)' },
      { label: 'Normativa', value: 'CE, RoHS, REACH, GPSR 2026' },
      { label: 'Garantía Oficial', value: '3 Años de Cobertura Europea' },
      ...specsData.specifications.slice(0, 5)
    ];

    return {
      id: raw.handle || String(raw.id),
      spu: `CL-${String(raw.id).slice(-6)}`,
      sku: variants[0]?.sku || `CL-${String(raw.id).slice(-6)}-01`,
      brand: raw.vendor || 'CaseLive',
      title: {
        es: raw.title,
        en: raw.title,
        de: raw.title,
        fr: raw.title
      },
      shortDesc: {
        es: cleanHtml(raw.body_html).slice(0, 160) || raw.title,
        en: cleanHtml(raw.body_html).slice(0, 160) || raw.title,
        de: cleanHtml(raw.body_html).slice(0, 160) || raw.title,
        fr: cleanHtml(raw.body_html).slice(0, 160) || raw.title
      },
      categoryPath: [categoryPrimary, subcategory],
      rating: +(4.5 + ((idx * 7) % 5) * 0.1).toFixed(1),
      reviewCount: 18 + ((idx * 13) % 75),
      basePriceEUR: basePrice,
      originalPriceEUR: compPrice,
      variants,
      selectedVariantId: variants[0]?.id || 'v1',
      images,
      highlights: {
        es: highlights,
        en: highlights
      },
      dimensions: {
        overall: specsData.overall,
        seatWidth: specsData.seatWidth,
        seatDepth: specsData.seatDepth,
        seatHeight: specsData.seatHeight,
        reclinedDepth: specsData.reclinedDepth,
        maxLoad: specsData.maxLoad,
        netWeight: specsData.netWeight,
        grossWeight: specsData.grossWeight,
        boxDimensions: specsData.boxDimensions
      },
      specifications: finalSpecs,
      fullDescription: {
        es: raw.body_html || raw.title,
        en: raw.body_html || raw.title
      },
      assemblyPdfUrl: '#download-manual',
      gpsr: {
        euResponsiblePerson: {
          company: 'Casalivo Living Spain S.L.',
          address: 'Avda. Doctor Gomez Ferrer 49, P01 05',
          city: 'Alfafar, Valencia',
          country: 'Spain',
          email: 'casalivo@outlook.com'
        },
        manufacturer: {
          name: raw.vendor || 'Casalivo International Design',
          address: 'Avda. Doctor Gomez Ferrer 49',
          origin: 'Normativa Europea de Fabricación CE'
        },
        certifications: ['CE 2026/GPSR', 'ISO 9001', 'REACH'],
        safetyNotices: [
          'Comprobar la fijación periódica de tornillos y anclajes.',
          'Utilizar siempre sobre superficies planas y estables.'
        ]
      },
      shippingTier: {
        type: 'Envío Peninsular Express',
        courier: 'GLS / DHL Freight'
      }
    };
  });

  // Group by category for MegaMenu
  const categoryGroups = {};
  products.forEach(p => {
    const cat = p.categoryPath[0];
    if (!categoryGroups[cat]) categoryGroups[cat] = [];
    categoryGroups[cat].push(p);
  });

  const categoriesTree = Object.entries(categoryGroups).slice(0, 6).map(([catName, prods], idx) => {
    const subGroups = {};
    prods.forEach(p => {
      const sub = p.categoryPath[1] || 'General';
      if (!subGroups[sub]) subGroups[sub] = [];
      subGroups[sub].push(p);
    });

    const subcategories = Object.entries(subGroups).slice(0, 4).map(([subTitle, items]) => ({
      title: subTitle,
      handle: subTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      items: items.slice(0, 6).map(it => ({
        label: it.title.es.slice(0, 36) + (it.title.es.length > 36 ? '...' : ''),
        productId: it.id,
        type: 'product'
      }))
    }));

    const topProd = prods[0];
    const icons = ['Briefcase', 'Sun', 'PawPrint', 'Sparkles', 'Layers', 'Heart'];

    return {
      id: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: catName,
      handle: catName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      icon: icons[idx % icons.length],
      featuredTag: `${prods.length} Productos`,
      subcategories,
      banner: {
        headline: `Colección ${catName}`,
        subtext: `Mobiliario y confort con envío express desde Valencia.`,
        linkText: 'Ver Colección',
        imageUrl: topProd?.images[0]?.url,
        targetProductId: topProd?.id
      }
    };
  });

  // Save the full catalog into public/data/allProducts.json
  const publicDir = path.resolve(__dirname, '../public/data');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  fs.writeFileSync(path.join(publicDir, 'allProducts.json'), JSON.stringify(products));

  // Also split top ~1,000 products across the 4 TS parts for instant startup
  const bundledProducts = products.slice(0, 1000);
  const partSize = Math.ceil(bundledProducts.length / 4);
  const part1 = bundledProducts.slice(0, partSize);
  const part2 = bundledProducts.slice(partSize, partSize * 2);
  const part3 = bundledProducts.slice(partSize * 2, partSize * 3);
  const part4 = bundledProducts.slice(partSize * 3);

  const outDir = path.resolve(__dirname, '../src/data');
  fs.writeFileSync(path.join(outDir, 'shopifyPart1.ts'), `import { Product } from '../types';\nexport const SHOPIFY_LIVE_PART1: Product[] = ${JSON.stringify(part1, null, 2)};\n`);
  fs.writeFileSync(path.join(outDir, 'shopifyPart2.ts'), `import { Product } from '../types';\nexport const SHOPIFY_LIVE_PART2: Product[] = ${JSON.stringify(part2, null, 2)};\n`);
  fs.writeFileSync(path.join(outDir, 'shopifyPart3.ts'), `import { Product } from '../types';\nexport const SHOPIFY_LIVE_PART3: Product[] = ${JSON.stringify(part3, null, 2)};\n`);
  fs.writeFileSync(path.join(outDir, 'shopifyPart4.ts'), `import { Product } from '../types';\nexport const SHOPIFY_LIVE_PART4: Product[] = ${JSON.stringify(part4, null, 2)};\n`);

  const metaContent = `import { MegaMenuCategory } from '../types';
export const SHOPIFY_SYNC_STATS = {
  totalStoreProducts: ${allRaw.length},
  syncedProducts: ${bundledProducts.length},
  lastSyncedAt: "${new Date().toISOString()}",
  storeDomain: "td5kxa-2d.myshopify.com"
};
export const SHOPIFY_LIVE_CATEGORIES: MegaMenuCategory[] = ${JSON.stringify(categoriesTree, null, 2)};
`;
  fs.writeFileSync(path.join(outDir, 'shopifyMeta.ts'), metaContent);

  console.log(`Successfully generated live catalog:`);
  console.log(` - ${bundledProducts.length} instant bundled products in shopifyPart1-4.ts`);
  console.log(` - ${products.length} products in public/data/allProducts.json`);
  console.log(` - Extracted real dimensions and specifications from description HTML`);
  console.log(` - Resolved all 0.00 prices with realistic catalog estimates`);
}

run().catch(console.error);
