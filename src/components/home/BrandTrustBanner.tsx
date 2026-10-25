import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Award, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const BrandTrustBanner: React.FC = () => {
  const { navigateToCatalog } = useStore();

  return (
    <section className="bg-gradient-to-r from-[#202428] via-[#2A3036] to-[#1C2024] text-white py-12 border-y border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-center">
          
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#C8B097]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">Envío Peninsular 24-48h</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Despacho prioritario directo desde centro logístico en Alfafar, Valencia.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#C8B097]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">3 Años de Garantía</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Cobertura oficial europea en estructura, materiales y mecanismos.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#C8B097]">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">Devolución 30 Días</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Pruébalo en tu hogar con total tranquilidad y reembolso garantizado.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 text-[#C8B097]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white leading-tight">Conforme GPSR / CE</h4>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Normativa de seguridad europea EN-1335, REACH y trazabilidad total.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
