import React, { useState } from 'react';
import { X, Search, Package } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const OrderTrackingModal: React.FC = () => {
  const { isTrackOrderModalOpen, setIsTrackOrderModalOpen, currentCountry, showToast } = useStore();
  const [orderNumber, setOrderNumber] = useState('CL-2026-98124');
  const [postalCode, setPostalCode] = useState('28001');
  const [isSearched, setIsSearched] = useState(true);

  if (!isTrackOrderModalOpen) return null;

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setIsSearched(true);
    showToast(`Tracking status updated for ${orderNumber}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 text-neutral-800 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-[#1F2429] text-white">
              <Package className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-base text-neutral-900">Track caselive Delivery</h3>
          </div>
          <button
            onClick={() => setIsTrackOrderModalOpen(false)}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleTrack} className="pt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold uppercase text-neutral-500 mb-1">
                Order Number
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="CL-2026-XXXXX"
                className="w-full px-3 py-2 text-xs font-mono border border-neutral-300 rounded focus:outline-none focus:border-neutral-700"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold uppercase text-neutral-500 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="28001"
                className="w-full px-3 py-2 text-xs font-mono border border-neutral-300 rounded focus:outline-none focus:border-neutral-700"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#1F2429] hover:bg-black text-white text-xs font-medium rounded flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Tracking</span>
          </button>
        </form>

        {/* Live Milestone Stepper */}
        {isSearched && (
          <div className="mt-5 pt-4 border-t border-neutral-200 space-y-4 text-xs">
            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 flex justify-between items-center">
              <div>
                <div className="text-[11px] text-neutral-500">Carrier: GLS / SEUR Express</div>
                <div className="font-mono font-medium text-neutral-900">Tracking Code: GLS-ES-981248012</div>
              </div>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#E8EFEA] text-[#2E5841]">
                In Transit
              </span>
            </div>

            <div className="space-y-3 relative pl-4 border-l-2 border-neutral-300 ml-2">
              <div className="relative">
                <span className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-neutral-800 ring-4 ring-white" />
                <div className="font-medium text-neutral-900">Dispatched from Logistics Hub</div>
                <div className="text-neutral-500 text-[11px]">{currentCountry.warehouseName}</div>
                <div className="text-[10px] text-neutral-400 font-mono">Today, 08:45 AM</div>
              </div>

              <div className="relative">
                <span className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-neutral-800 ring-4 ring-white" />
                <div className="font-medium text-neutral-900">Quality Checked & Scanned</div>
                <div className="text-neutral-500 text-[11px]">Direct atelier inspection passed</div>
                <div className="text-[10px] text-neutral-400 font-mono">Yesterday, 18:20 PM</div>
              </div>

              <div className="relative">
                <span className="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-neutral-300 ring-4 ring-white" />
                <div className="font-normal text-neutral-500">Scheduled Out for Delivery</div>
                <div className="text-neutral-400 text-[11px]">Estimated: Tomorrow before 14:00</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
