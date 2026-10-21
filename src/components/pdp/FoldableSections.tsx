import React, { useState } from 'react';
import {
  ChevronDown,
  CheckCircle2,
  FileText,
  Download,
  ShieldCheck,
  Truck,
  Building2,
  AlertTriangle,
  Scale,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../context/StoreContext';

interface AccordionSectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badge?: string;
}

const AccordionItem: React.FC<AccordionSectionProps> = ({
  title,
  icon,
  isOpen,
  onToggle,
  children,
  badge,
}) => {
  return (
    <div className="border border-neutral-200/90 rounded-lg bg-white overflow-hidden shadow-2xs transition-shadow hover:border-neutral-300">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer hover:bg-neutral-50/70 transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-md bg-neutral-100 text-neutral-700">{icon}</div>
          <span className="font-semibold text-sm sm:text-base text-neutral-900 tracking-tight">
            {title}
          </span>
          {badge && (
            <span className="hidden sm:inline-block text-[11px] font-medium bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded border border-neutral-200">
              {badge}
            </span>
          )}
        </div>
        <div className="p-1 text-neutral-400">
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4.5 h-4.5 text-neutral-600" />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <div className="px-5 pb-5 pt-1 border-t border-neutral-100 text-neutral-700 text-xs sm:text-sm">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FoldableSections: React.FC = () => {
  const {
    activeProduct,
    currentLanguage,
    t,
    currentCountry,
    setIsManualModalOpen,
  } = useStore();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    highlights: true,
    dimensions: true,
    description: false,
    gpsr: false,
    shipping: false,
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const highlights =
    activeProduct.highlights?.[currentLanguage] ||
    activeProduct.highlights?.es ||
    activeProduct.highlights?.en ||
    [];

  const fullDesc =
    activeProduct.fullDescription?.[currentLanguage] ||
    activeProduct.fullDescription?.es ||
    Object.values(activeProduct.fullDescription || {})[0] ||
    '';

  // Filter out any internal SKU / SPU / Ref specifications
  const cleanSpecs = activeProduct.specifications.filter(
    (s) =>
      !s.label.toLowerCase().includes('spu') &&
      !s.label.toLowerCase().includes('sku') &&
      !s.label.toLowerCase().includes('ref')
  );

  return (
    <div className="mt-8 space-y-3">
      
      {/* 1. Highlights / Key Features (Default: OPEN) */}
      <AccordionItem
        id="highlights"
        title={t('highlightsTitle')}
        icon={<Sparkles className="w-4 h-4 text-neutral-700" />}
        isOpen={!!openSections.highlights}
        onToggle={() => toggleSection('highlights')}
        badge="Key Features"
      >
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {highlights.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-neutral-700 shrink-0 mt-0.5" />
              <span className="text-neutral-700 leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </AccordionItem>

      {/* 2. Weights & Dimensions (Default: OPEN) */}
      <AccordionItem
        id="dimensions"
        title={t('dimensionsTitle')}
        icon={<Scale className="w-4 h-4 text-neutral-700" />}
        isOpen={!!openSections.dimensions}
        onToggle={() => toggleSection('dimensions')}
        badge="Technical Specs"
      >
        <div className="pt-2 space-y-4">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-50/80 p-3 rounded-lg border border-neutral-100">
            <div>
              <div className="text-[11px] text-neutral-500 uppercase font-medium">Max Load</div>
              <div className="text-base font-semibold text-neutral-900 font-mono">
                {activeProduct.dimensions.maxLoad}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-neutral-500 uppercase font-medium">Net Weight</div>
              <div className="text-base font-semibold text-neutral-900 font-mono">
                {activeProduct.dimensions.netWeight}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-neutral-500 uppercase font-medium">Gross Weight</div>
              <div className="text-base font-semibold text-neutral-900 font-mono">
                {activeProduct.dimensions.grossWeight}
              </div>
            </div>
            <div>
              <div className="text-[11px] text-neutral-500 uppercase font-medium">Package Size</div>
              <div className="text-xs font-semibold text-neutral-900 font-mono truncate">
                {activeProduct.dimensions.boxDimensions}
              </div>
            </div>
          </div>

          {/* Clean Specs Table (No Ref / SKU) */}
          <div className="overflow-x-auto border border-neutral-200 rounded-lg">
            <table className="w-full text-left text-xs sm:text-sm divide-y divide-neutral-200">
              <tbody className="divide-y divide-neutral-100">
                <tr className="bg-neutral-50/50">
                  <td className="py-2.5 px-4 font-medium text-neutral-800 w-1/3">Overall Dimensions</td>
                  <td className="py-2.5 px-4 text-neutral-600 font-mono">{activeProduct.dimensions.overall}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-neutral-800">Seat Dimensions</td>
                  <td className="py-2.5 px-4 text-neutral-600 font-mono">
                    Width: {activeProduct.dimensions.seatWidth} · Depth: {activeProduct.dimensions.seatDepth}
                  </td>
                </tr>
                <tr className="bg-neutral-50/50">
                  <td className="py-2.5 px-4 font-medium text-neutral-800">Seat Height Range</td>
                  <td className="py-2.5 px-4 text-neutral-600 font-mono">{activeProduct.dimensions.seatHeight}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-4 font-medium text-neutral-800">Reclined Position Depth</td>
                  <td className="py-2.5 px-4 text-neutral-600 font-mono">{activeProduct.dimensions.reclinedDepth}</td>
                </tr>
                {cleanSpecs.map((spec, sIdx) => (
                  <tr key={sIdx} className={sIdx % 2 === 0 ? 'bg-neutral-50/50' : ''}>
                    <td className="py-2.5 px-4 font-medium text-neutral-800">{spec.label}</td>
                    <td className="py-2.5 px-4 text-neutral-600">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </AccordionItem>

      {/* 3. Description & Manuals (Default: CLOSED) */}
      <AccordionItem
        id="description"
        title={t('descriptionTitle')}
        icon={<FileText className="w-4 h-4 text-neutral-700" />}
        isOpen={!!openSections.description}
        onToggle={() => toggleSection('description')}
      >
        <div className="pt-2 space-y-4">
          <p className="leading-relaxed text-neutral-700 whitespace-pre-line text-sm">
            {fullDesc}
          </p>

          <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-neutral-200/70 text-neutral-700">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-neutral-900 text-xs sm:text-sm">
                  Official Multilingual Assembly Manual (ES / EN / DE / FR / IT)
                </div>
                <div className="text-[11px] text-neutral-500">
                  Step-by-step illustrated assembly schematics & care instructions
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsManualModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#25282F] hover:bg-black text-white font-medium text-xs rounded-md shadow-2xs transition-colors cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t('downloadPdf')}</span>
            </button>
          </div>
        </div>
      </AccordionItem>

      {/* 4. EU Compliance & Manufacturer Info (Default: CLOSED) */}
      <AccordionItem
        id="gpsr"
        title={t('gpsrTitle')}
        icon={<ShieldCheck className="w-4 h-4 text-neutral-700" />}
        isOpen={!!openSections.gpsr}
        onToggle={() => toggleSection('gpsr')}
        badge="GPSR Compliant"
      >
        <div className="pt-2 space-y-4">
          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs text-neutral-600 leading-relaxed">
            In compliance with the <strong>European General Product Safety Regulation (GPSR EU 2023/988)</strong>, below is the legally binding manufacturer and Authorized EU Representative contact information:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-neutral-200 rounded-lg p-3.5 bg-white space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-neutral-900 pb-1 border-b border-neutral-100">
                <Building2 className="w-4 h-4 text-neutral-600" />
                <span>EU Responsible Entity (GPSR)</span>
              </div>
              <div className="font-semibold text-neutral-800">{activeProduct.gpsr.euResponsiblePerson.company}</div>
              <div className="text-neutral-600">{activeProduct.gpsr.euResponsiblePerson.address}</div>
              <div className="text-neutral-600">{activeProduct.gpsr.euResponsiblePerson.city}</div>
              <div className="text-neutral-600">{activeProduct.gpsr.euResponsiblePerson.country}</div>
              <div className="text-neutral-600 font-mono pt-1">
                Email: {activeProduct.gpsr.euResponsiblePerson.email}
              </div>
            </div>

            <div className="border border-neutral-200 rounded-lg p-3.5 bg-white space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-neutral-900 pb-1 border-b border-neutral-100">
                <Building2 className="w-4 h-4 text-neutral-600" />
                <span>Commercial Manufacturer</span>
              </div>
              <div className="font-semibold text-neutral-800">{activeProduct.gpsr.manufacturer.name}</div>
              <div className="text-neutral-600">{activeProduct.gpsr.manufacturer.address}</div>
              <div className="text-neutral-500 font-mono">{activeProduct.gpsr.manufacturer.origin}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-semibold text-neutral-800 uppercase tracking-wider">
              Safety Certifications & Standards:
            </div>
            <div className="flex flex-wrap gap-2">
              {activeProduct.gpsr.certifications.map((cert, cIdx) => (
                <span
                  key={cIdx}
                  className="px-2.5 py-1 bg-neutral-100 text-neutral-700 rounded text-xs border border-neutral-200"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>

          <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs text-neutral-700 space-y-1">
            <div className="font-semibold flex items-center gap-1.5 text-neutral-900">
              <AlertTriangle className="w-4 h-4 text-neutral-600" />
              <span>Safety & Usage Notices:</span>
            </div>
            <ul className="list-disc list-inside text-neutral-600 space-y-0.5">
              {activeProduct.gpsr.safetyNotices.map((sn, sIdx) => (
                <li key={sIdx}>{sn}</li>
              ))}
            </ul>
          </div>
        </div>
      </AccordionItem>

      {/* 5. Shipping & Delivery Policies (Default: CLOSED) */}
      <AccordionItem
        id="shipping"
        title={t('shippingTitle')}
        icon={<Truck className="w-4 h-4 text-neutral-700" />}
        isOpen={!!openSections.shipping}
        onToggle={() => toggleSection('shipping')}
      >
        <div className="pt-2 space-y-3.5 text-xs sm:text-sm">
          <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-lg flex items-start gap-3">
            <Truck className="w-5 h-5 text-neutral-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-neutral-900">
                Direct Local Fulfillment & Safe Doorstep Delivery
              </div>
              <div className="text-xs text-neutral-600 mt-1">
                Your parcel is prepared and dispatched from <strong>{currentCountry.warehouseName}</strong> within 24 business hours. Real-time courier tracking is provided upon dispatch.
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs text-neutral-700">
            <div className="font-semibold text-neutral-900">Delivery Guidelines:</div>
            <div className="border border-neutral-200 rounded-md p-3 bg-white space-y-1">
              <div className="flex justify-between font-medium">
                <span>Standard Home Parcel Delivery</span>
                <span className="text-emerald-700 font-semibold">FREE on all items</span>
              </div>
              <p className="text-neutral-500">
                Brought directly to your home or apartment door by our dedicated delivery partners ({activeProduct.shippingTier.courier}).
              </p>
            </div>
          </div>
        </div>
      </AccordionItem>

    </div>
  );
};
