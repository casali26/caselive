import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, HelpCircle, Package, Check, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { COUNTRIES } from '../../data/mockData';

export const TopBar: React.FC = () => {
  const {
    currentCountry,
    setCountryByCode,
    currentLanguage,
    setLanguage,
    t,
    setIsTrackOrderModalOpen,
    showToast,
  } = useStore();

  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.currency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#1C1F24] text-neutral-300 text-xs border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-9 flex items-center justify-between gap-4">
          
          {/* Left: Country / Currency / Language Selector */}
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
              className="flex items-center gap-1.5 py-1 px-2 rounded hover:bg-neutral-800 hover:text-white transition-colors cursor-pointer"
              aria-label="Select Country and Currency"
              aria-expanded={isCountryDropdownOpen}
            >
              <span className="text-sm leading-none">{currentCountry.flag}</span>
              <span className="font-semibold text-neutral-200 tracking-wide">{currentCountry.code}</span>
              <span className="text-neutral-500">/</span>
              <span className="text-neutral-300 font-mono text-[11px]">{currentCountry.currency}</span>
              <ChevronDown className={`w-3 h-3 text-neutral-400 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Country Dropdown */}
            {isCountryDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-72 bg-white text-neutral-900 rounded-lg shadow-xl border border-neutral-200 z-50 py-2 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 pb-2 border-b border-neutral-100">
                  <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
                    Select Delivery Country & Currency
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search country..."
                    className="w-full px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-neutral-400"
                    autoFocus
                  />
                </div>

                <div className="max-h-60 overflow-y-auto py-1 thin-scrollbar">
                  {filteredCountries.map((c) => {
                    const isSelected = c.code === currentCountry.code;
                    return (
                      <button
                        key={c.code}
                        onClick={() => {
                          setCountryByCode(c.code);
                          setIsCountryDropdownOpen(false);
                          setSearchTerm('');
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs transition-colors cursor-pointer ${
                          isSelected ? 'bg-neutral-100 text-neutral-900 font-semibold' : 'hover:bg-neutral-50 text-neutral-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base leading-none">{c.flag}</span>
                          <div>
                            <div className="font-medium">{c.name}</div>
                            <div className="text-[11px] text-neutral-500 font-normal">
                              {c.warehouseCity} · {c.deliveryDays}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600">
                            {c.currency} ({c.currencySymbol})
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-neutral-900" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Quick language toggle */}
                <div className="pt-2 px-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                  <span>Language:</span>
                  <div className="flex gap-1">
                    {(['es', 'en', 'de', 'fr'] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`px-1.5 py-0.5 rounded text-[11px] font-semibold uppercase cursor-pointer ${
                          currentLanguage === lang ? 'bg-neutral-900 text-white' : 'hover:bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Middle: Promotional Banner Ticker */}
          <div className="hidden md:flex items-center gap-2 overflow-hidden text-center truncate">
            <span className="text-neutral-400 font-medium">Notice:</span>
            <span className="text-neutral-200 truncate">{t('topTicker')}</span>
            <button
              onClick={() => {
                navigator.clipboard?.writeText('CASE10');
                showToast('Coupon code CASE10 copied');
              }}
              className="ml-1 text-[11px] bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-2 py-0.5 rounded font-mono font-medium cursor-pointer border border-neutral-700 transition-colors"
              title="Click to copy code"
            >
              CASE10
            </button>
          </div>

          {/* Right: Pure 2C utility links (No B2B) */}
          <div className="flex items-center gap-4 text-neutral-300 shrink-0">
            <button
              onClick={() => setIsTrackOrderModalOpen(true)}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <Package className="w-3.5 h-3.5 text-neutral-400" />
              <span>{t('trackOrder')}</span>
            </button>
            <button
              onClick={() => showToast('Direct delivery from European logistics hubs within 24-48h')}
              className="hidden sm:flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <Truck className="w-3.5 h-3.5 text-neutral-400" />
              <span>{t('shippingInfo')}</span>
            </button>
            <button
              onClick={() => showToast('Support: hello@caselive.com · Mon-Fri 9:00-18:00')}
              className="hidden lg:flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
              <span>{t('helpCenter')}</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
