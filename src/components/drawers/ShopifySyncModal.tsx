import React, { useState } from 'react';
import { X, RefreshCw, Database, CheckCircle2, Globe, Key, ShieldCheck, ExternalLink } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ShopifySyncModal: React.FC = () => {
  const {
    isShopifyModalOpen,
    setIsShopifyModalOpen,
    liveStats,
    isSyncingLive,
    syncShopifyNow,
    connectShopify,
    products,
    categoriesTree,
  } = useStore();

  const [customDomain, setCustomDomain] = useState('td5kxa-2d.myshopify.com');
  const [customToken, setCustomToken] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  if (!isShopifyModalOpen) return null;

  const handleConnectCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDomain.trim()) return;
    setIsConnecting(true);
    await connectShopify(customDomain, customToken);
    setIsConnecting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#202428] text-white flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-neutral-900 leading-tight">
                Shopify Backend & Live Catalog
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Estado de la integración y sincronización de productos
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsShopifyModalOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Status Box */}
          <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-bold text-emerald-900">
                Conexión Activa y Sincronizada con Shopify
              </div>
              <div className="text-emerald-800">
                La tienda está conectada directamente con <strong>{liveStats.storeDomain}</strong>. Todos los precios, variantes y especificaciones se han extraído del catálogo real de Shopify.
              </div>
            </div>
          </div>

          {/* Integration Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="text-[11px] text-neutral-500 font-medium">Productos Activos</div>
              <div className="text-lg font-bold text-neutral-900 font-mono mt-0.5">
                {products.length}
              </div>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="text-[11px] text-neutral-500 font-medium">Colecciones</div>
              <div className="text-lg font-bold text-neutral-900 font-mono mt-0.5">
                {categoriesTree.length}
              </div>
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 col-span-2 sm:col-span-1">
              <div className="text-[11px] text-neutral-500 font-medium">Almacén Peninsular</div>
              <div className="text-xs font-bold text-neutral-900 mt-1">
                Alfafar, Valencia (ES)
              </div>
            </div>
          </div>

          {/* Quick Re-sync Action */}
          <div className="p-4 rounded-xl border border-neutral-200 bg-[#FAFAFA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-neutral-900">
                Actualizar Catálogo con la API
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5">
                Última verificación: {new Date(liveStats.lastSyncedAt).toLocaleString()}
              </div>
            </div>

            <button
              onClick={() => syncShopifyNow()}
              disabled={isSyncingLive}
              className="px-4 py-2 bg-[#202428] hover:bg-black text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs shrink-0 disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingLive ? 'animate-spin' : ''}`} />
              <span>{isSyncingLive ? 'Consultando...' : 'Re-consultar API'}</span>
            </button>
          </div>

          {/* Link Another Shopify Store Form */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold text-neutral-900">
              Conectar otra tienda Shopify (Opcional)
            </div>
            <form onSubmit={handleConnectCustom} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                  Dominio de Tienda (.myshopify.com)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder="ej. tu-tienda.myshopify.com"
                    className="w-full h-9 px-3 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-800"
                  />
                  <Globe className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                  Storefront Access Token (Opcional si es catálogo público)
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={customToken}
                    onChange={(e) => setCustomToken(e.target.value)}
                    placeholder="shpat_xxxxxxxxxxxxxxxx"
                    className="w-full h-9 px-3 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-800"
                  />
                  <Key className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isConnecting}
                className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                {isConnecting ? 'Verificando...' : 'Guardar y Vincular Tienda'}
              </button>
            </form>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Proxy Seguro SSL</span>
          </div>
          <button
            onClick={() => setIsShopifyModalOpen(false)}
            className="px-4 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-lg font-medium transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
