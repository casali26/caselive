import React, { useState, useRef } from 'react';
import { Maximize2, Play, ChevronLeft, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const MediaGallery: React.FC = () => {
  const { activeProduct, activeImageIndex, setActiveImageIndex } = useStore();
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const images = activeProduct.images;
  const currentImage = images[activeImageIndex] || images[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handlePrevImage = () => {
    setActiveImageIndex(activeImageIndex === 0 ? images.length - 1 : activeImageIndex - 1);
  };

  const handleNextImage = () => {
    setActiveImageIndex(activeImageIndex === images.length - 1 ? 0 : activeImageIndex + 1);
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4 select-none">
      
      {/* 1. Thumbnail List */}
      <div className="flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-y-auto no-scrollbar lg:max-h-[580px] shrink-0">
        {images.map((img, idx) => {
          const isActive = idx === activeImageIndex;
          return (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden border transition-all cursor-pointer shrink-0 bg-neutral-100 ${
                isActive
                  ? 'border-neutral-900 shadow-sm ring-1 ring-neutral-900/20'
                  : 'border-transparent hover:border-neutral-300 opacity-75 hover:opacity-100'
              }`}
            >
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              {img.isBlackVariant && (
                <span className="absolute bottom-1 right-1 text-[9px] font-medium bg-neutral-900/90 text-white px-1 py-0.2 rounded font-mono">
                  BK
                </span>
              )}
            </button>
          );
        })}

        {/* Video placeholder */}
        <button
          onClick={() => setIsVideoModalOpen(true)}
          className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden border border-dashed border-neutral-300 hover:border-neutral-600 bg-neutral-900 text-white flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer shrink-0 group"
          title="Watch Product Demonstration"
        >
          <div className="w-6.5 h-6.5 rounded-full bg-neutral-700 group-hover:bg-[#8A584C] flex items-center justify-center transition-colors">
            <Play className="w-3 h-3 fill-white text-white ml-0.5" />
          </div>
          <span className="text-[10px] font-medium text-neutral-300 tracking-tight">Preview</span>
        </button>
      </div>

      {/* 2. Main High-Res Image Display */}
      <div className="flex-1 relative bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-xs">
        
        {/* Subtle low-saturation badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
          <span className="inline-flex items-center gap-1 bg-[#25282F]/90 backdrop-blur-xs text-neutral-100 text-[11px] font-medium px-2.5 py-0.5 rounded shadow-xs">
            <Sparkles className="w-3 h-3 text-[#C49B90]" />
            Signature Living
          </span>
          <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-xs text-neutral-800 text-[10px] font-medium px-2 py-0.5 rounded border border-neutral-200/80 shadow-2xs">
            <ShieldCheck className="w-3 h-3 text-emerald-700" />
            caselive Studio
          </span>
        </div>

        {/* Expand / Fullscreen */}
        <button
          onClick={() => setIsLightboxOpen(true)}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-neutral-700 hover:text-neutral-900 shadow-xs border border-neutral-200 transition-colors cursor-pointer"
          title="Expand image"
          aria-label="Expand image"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Zoom Area */}
        <div
          ref={imageContainerRef}
          onMouseEnter={() => setIsZooming(true)}
          onMouseLeave={() => setIsZooming(false)}
          onMouseMove={handleMouseMove}
          className="relative w-full aspect-[4/3] max-h-[580px] bg-neutral-50 overflow-hidden cursor-crosshair flex items-center justify-center"
        >
          <img
            src={currentImage.url}
            alt={currentImage.alt}
            className={`w-full h-full object-cover transition-transform duration-100 ease-out ${
              isZooming ? 'scale-150 origin-center pointer-events-none' : 'scale-100'
            }`}
            style={
              isZooming
                ? {
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }
                : undefined
            }
            referrerPolicy="no-referrer"
          />

          {!isZooming && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-neutral-900/60 backdrop-blur-xs text-neutral-200 text-[11px] px-2.5 py-0.8 rounded-full pointer-events-none flex items-center gap-1 font-normal">
              <span>Hover to zoom details</span>
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrevImage}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-neutral-800 shadow-xs border border-neutral-200 transition-colors cursor-pointer"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={handleNextImage}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-neutral-800 shadow-xs border border-neutral-200 transition-colors cursor-pointer"
          aria-label="Next image"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="absolute bottom-3 right-3 bg-neutral-900/60 text-white text-[11px] font-mono px-2 py-0.5 rounded">
          {activeImageIndex + 1} / {images.length}
        </div>
      </div>

      {/* Video Demonstration Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-xl max-w-2xl w-full p-6 text-white relative shadow-2xl">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white text-sm font-semibold p-1 cursor-pointer"
            >
              ✕ Close
            </button>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#8A584C]" />
              <h3 className="font-semibold text-base">
                caselive Design & Motion Overview
              </h3>
            </div>
            <div className="relative aspect-video bg-neutral-800 rounded-lg overflow-hidden flex flex-col items-center justify-center border border-neutral-700">
              <img
                src={currentImage.url}
                alt="Video thumbnail"
                className="absolute inset-0 w-full h-full object-cover opacity-35 blur-xs"
              />
              <div className="relative z-10 flex flex-col items-center gap-3 text-center px-4">
                <div className="w-14 h-14 rounded-full bg-neutral-800 border border-neutral-600 flex items-center justify-center shadow-lg">
                  <Play className="w-6 h-6 fill-white text-white ml-0.5" />
                </div>
                <div className="font-semibold text-sm">Motion, Ergonomics & Material Finish</div>
                <div className="text-xs text-neutral-300 max-w-md">
                  A close look at the 135° fluid recline glide, cushioned footrest movement, and multi-zone vibration relaxation modes.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-5xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute -top-10 right-0 text-white hover:text-neutral-300 text-xs font-medium cursor-pointer"
            >
              ✕ Close Preview
            </button>
            <img
              src={currentImage.url}
              alt={currentImage.alt}
              className="max-h-[85vh] max-w-full object-contain rounded-lg shadow-2xl"
              referrerPolicy="no-referrer"
            />
            <div className="text-neutral-400 text-xs mt-3 font-medium">
              {currentImage.label} · caselive Collection
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
