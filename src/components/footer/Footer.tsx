import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Award } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { COUNTRIES } from '../../data/mockData';

export const Footer: React.FC = () => {
  const { currentCountry, setCountryByCode, setIsTrackOrderModalOpen, showToast } = useStore();

  return (
    <footer className="bg-[#181A1E] text-neutral-400 text-xs mt-16 border-t border-neutral-800">
      {/* 1. Value Proposition Banner */}
      <div className="border-b border-neutral-800/80 py-8 bg-[#141619]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="p-2.5 bg-neutral-800 text-neutral-300 rounded-lg shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-neutral-200 text-sm">Direct Home Delivery</h4>
                <p className="text-neutral-500 text-xs mt-0.5">
                  Complimentary standard shipping on every catalog item.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="p-2.5 bg-neutral-800 text-neutral-300 rounded-lg shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-neutral-200 text-sm">30-Day Home Trial</h4>
                <p className="text-neutral-500 text-xs mt-0.5">
                  Experience your piece in your space with hassle-free returns.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="p-2.5 bg-neutral-800 text-neutral-300 rounded-lg shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-neutral-200 text-sm">256-Bit SSL Checkout</h4>
                <p className="text-neutral-500 text-xs mt-0.5">
                  Encrypted transactions with Klarna, PayPal, Visa, and Mastercard.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3">
              <div className="p-2.5 bg-neutral-800 text-neutral-300 rounded-lg shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-neutral-200 text-sm">3-Year Guarantee</h4>
                <p className="text-neutral-500 text-xs mt-0.5">
                  Official direct warranty on all mechanical frames and components.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main 2C Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-semibold text-neutral-200 text-xs uppercase tracking-wider mb-3">
              About caselive
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button
                  onClick={() => showToast('caselive: Modern Living & Ergonomics')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Design Philosophy
                </button>
              </li>
              <li>
                <button
                  onClick={() => showToast('Material integrity and durability testing')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Craft & Materials
                </button>
              </li>
              <li>
                <button
                  onClick={() => showToast('Responsible sourcing and FSC certified wood')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Sustainability Standards
                </button>
              </li>
              <li>
                <button
                  onClick={() => showToast('Visit our European partner showrooms')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Showrooms & Spaces
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-200 text-xs uppercase tracking-wider mb-3">
              Customer Support
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button
                  onClick={() => setIsTrackOrderModalOpen(true)}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Track Delivery
                </button>
              </li>
              <li>
                <button
                  onClick={() => showToast('Easy prepaid return label service')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Returns & Claims
                </button>
              </li>
              <li>
                <button
                  onClick={() => showToast('Dispatched from local hubs in 24-48h')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Shipping & Logistics
                </button>
              </li>
              <li>
                <button
                  onClick={() => showToast('Contact: hello@caselive.com · Mon-Fri 9:00-18:00')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Contact & FAQs
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-200 text-xs uppercase tracking-wider mb-3">
              Collections
            </h4>
            <ul className="space-y-2 text-neutral-400">
              <li>
                <button
                  onClick={() => showToast('Ergonomic Seating Collection')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Ergonomic Seating
                </button>
              </li>
              <li>
                <button
                  onClick={() => showToast('Desks & Studio Workstations')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Studio Workstations
                </button>
              </li>
              <li>
                <button
                  onClick={() => showToast('Outdoor Patio Living')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Outdoor Patio Sets
                </button>
              </li>
              <li>
                <button
                  onClick={() => showToast('Pet Living Collection')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Pet Furniture Series
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-neutral-200 text-xs uppercase tracking-wider mb-3">
              European Dispatch
            </h4>
            <div className="space-y-2 text-neutral-400 text-xs">
              <p className="leading-relaxed">
                Direct fulfillment from our dedicated logistics hubs across Europe and North America.
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {COUNTRIES.slice(0, 8).map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setCountryByCode(c.code)}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer transition-colors ${
                      c.code === currentCountry.code
                        ? 'bg-neutral-200 text-neutral-900 font-bold'
                        : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {c.flag} {c.code}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Legal Bar */}
      <div className="border-t border-neutral-800/80 py-6 bg-[#111316]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} caselive. All rights reserved. GPSR (EU 2023/988) Compliant.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-neutral-400 cursor-pointer">Privacy Notice</span>
            <span className="hover:text-neutral-400 cursor-pointer">Terms of Sale</span>
            <span className="hover:text-neutral-400 cursor-pointer">Cookie Settings</span>
            <span className="hover:text-neutral-400 cursor-pointer">Legal Disclosure</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
