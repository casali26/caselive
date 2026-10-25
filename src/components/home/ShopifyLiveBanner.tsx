import React from 'react';
import { RefreshCw, Database, CheckCircle2, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ShopifyLiveBanner: React.FC = () => {
  const { liveStats, isSyncingLive, syncShopifyNow, setIsShopifyModalOpen, navigateToCatalog } = useStore();

  return (
    <section className="bg-gradient-to-r from-[#202428] via-[#2A3036] to-[#1C2024] text-white py-10 sm:py-12 border-y border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left Info */}
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="uppercase tracking-wider font-mono">
                Sincronización en Tiempo Real con Shopify
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
              Conectado a {liveStats.storeDomain}
            </h3>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              El catálogo se alimenta directamente de la API de Shopify. {liveStats.syncedProducts} productos sincronizados con imágenes de alta resolución, descripciones técnicas, variantes de color y logística europea.
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => syncShopifyNow()}
              disabled={isSyncingLive}
              className="px-4 py-2.5 bg-white hover:bg-neutral-100 text-neutral-900 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingLive ? 'animate-spin' : ''}`} />
              <span>{isSyncingLive ? 'Consultando API...' : 'Re-consultar API de Shopify'}</span>
            </button>

            <button
              onClick={() => setIsShopifyModalOpen(true)}
              className="px-4 py-2.5 bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700 text-neutral-200 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Detalles del Backend</span>
            </button>

            <button
              onClick={() => navigateToCatalog('all')}
              className="px-4 py-2.5 bg-neutral-900/50 hover:bg-neutral-800/50 border border-neutral-700 text-neutral-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Ver {liveStats.syncedProducts} Productos</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
