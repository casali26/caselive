import React from 'react';
import { X, Download, Printer, AlertCircle, Wrench, FileText } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ManualPreviewModal: React.FC = () => {
  const { isManualModalOpen, setIsManualModalOpen, activeProduct, showToast } = useStore();

  if (!isManualModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-neutral-300 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* PDF Top Toolbar */}
        <div className="px-5 py-3.5 bg-[#1F2429] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-neutral-700 rounded text-neutral-200">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-xs sm:text-sm">
                caselive Assembly & Maintenance Guide
              </div>
              <div className="text-[10px] text-neutral-400 font-mono">
                Multilingual Edition (ES / EN / DE / FR / IT) · 4 Pages
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                showToast('Printing manual instructions...');
                window.print();
              }}
              className="p-1.5 rounded hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              title="Print Manual"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                showToast('Downloading assembly manual PDF...');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white text-xs font-medium rounded cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={() => setIsManualModalOpen(false)}
              className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Document Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-neutral-100 text-neutral-800 font-sans thin-scrollbar">
          
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xs border border-neutral-200 max-w-2xl mx-auto space-y-6">
            <div className="flex justify-between items-start border-b border-neutral-200 pb-4">
              <div>
                <span className="text-xl font-bold tracking-tight text-neutral-900 lowercase">
                  caselive
                </span>
                <h2 className="text-xs font-semibold text-neutral-600 uppercase tracking-wider mt-0.5">
                  Assembly Guide & User Instructions
                </h2>
              </div>
              <div className="text-right text-[11px] text-neutral-500">
                <div>Quality Standard: EN 1335 / BIFMA</div>
                <div className="text-neutral-700 font-medium">Estimated time: 20 min</div>
              </div>
            </div>

            {/* Safety Notice */}
            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded text-xs text-neutral-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />
              <div>
                <strong>Assembly Note:</strong> Do not fully tighten bolts until all connecting pieces are loosely set in position. Assemble over a soft blanket to prevent surface marking.
              </div>
            </div>

            {/* Hardware Inventory Box */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-2 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-neutral-500" />
                <span>Components Inventory</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2 border border-neutral-200 rounded text-center bg-neutral-50">
                  <div className="font-semibold text-neutral-800">Part [A] x 1</div>
                  <div className="text-[11px] text-neutral-500">Ergonomic Cushion</div>
                </div>
                <div className="p-2 border border-neutral-200 rounded text-center bg-neutral-50">
                  <div className="font-semibold text-neutral-800">Part [B] x 1</div>
                  <div className="text-[11px] text-neutral-500">Backrest with Motors</div>
                </div>
                <div className="p-2 border border-neutral-200 rounded text-center bg-neutral-50">
                  <div className="font-semibold text-neutral-800">Part [C] x 2</div>
                  <div className="text-[11px] text-neutral-500">Armrest Supports</div>
                </div>
                <div className="p-2 border border-neutral-200 rounded text-center bg-neutral-50">
                  <div className="font-semibold text-neutral-800">Part [D] x 1</div>
                  <div className="text-[11px] text-neutral-500">Slide Footrest</div>
                </div>
                <div className="p-2 border border-neutral-200 rounded text-center bg-neutral-50">
                  <div className="font-semibold text-neutral-800">Part [E] x 1</div>
                  <div className="text-[11px] text-neutral-500">Class-3 Gas Lift</div>
                </div>
                <div className="p-2 border border-neutral-200 rounded text-center bg-neutral-50">
                  <div className="font-semibold text-neutral-800">Part [F] x 5</div>
                  <div className="text-[11px] text-neutral-500">PU Casters</div>
                </div>
                <div className="p-2 border border-neutral-200 rounded text-center bg-neutral-50">
                  <div className="font-semibold text-neutral-800">Hardware Kit</div>
                  <div className="text-[11px] text-neutral-500">Hex Screws & Washers</div>
                </div>
                <div className="p-2 border border-neutral-200 rounded text-center bg-neutral-50">
                  <div className="font-semibold text-neutral-800">Hex Key x 1</div>
                  <div className="text-[11px] text-neutral-500">Tool Included</div>
                </div>
              </div>
            </div>

            {/* Step-by-Step */}
            <div className="space-y-3 pt-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                Assembly Steps
              </h3>

              <div className="p-3 border border-neutral-200 rounded-lg space-y-1 text-xs">
                <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-neutral-800 text-white flex items-center justify-center text-[10px]">1</span>
                  <span>Assemble Base & Casters</span>
                </div>
                <p className="text-neutral-600 pl-5">
                  Insert the 5 smooth-rolling casters into the base sockets until firmly seated. Place the gas cylinder upright into the center.
                </p>
              </div>

              <div className="p-3 border border-neutral-200 rounded-lg space-y-1 text-xs">
                <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-neutral-800 text-white flex items-center justify-center text-[10px]">2</span>
                  <span>Mount Mechanism to Seat Base</span>
                </div>
                <p className="text-neutral-600 pl-5">
                  Align the control mechanism with the pre-fitted anchor holes on the underside of Seat [A] using 4 hex bolts.
                </p>
              </div>

              <div className="p-3 border border-neutral-200 rounded-lg space-y-1 text-xs">
                <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-neutral-800 text-white flex items-center justify-center text-[10px]">3</span>
                  <span>Secure Backrest & Slide Footrest</span>
                </div>
                <p className="text-neutral-600 pl-5">
                  Fasten backrest brackets into the rear seat steel hinge. Slide footrest rails [D] into retention clips beneath the seat.
                </p>
              </div>

              <div className="p-3 border border-neutral-200 rounded-lg space-y-1 text-xs">
                <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-neutral-800 text-white flex items-center justify-center text-[10px]">4</span>
                  <span>Connect Power Adapter</span>
                </div>
                <p className="text-neutral-600 pl-5">
                  Plug the vibration motor connector between backrest and seat. Connect the power adapter to any standard AC wall socket.
                </p>
              </div>
            </div>

            <div className="border-t border-neutral-200 pt-3 text-center text-xs text-neutral-500">
              Customer Support: hello@caselive.com · 3-Year Direct Warranty
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
