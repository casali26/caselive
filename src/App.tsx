import React from 'react';
import { StoreProvider } from './context/StoreContext';
import { TopBar } from './components/header/TopBar';
import { MainHeader } from './components/header/MainHeader';
import { MegaMenu } from './components/header/MegaMenu';
import { Breadcrumbs } from './components/pdp/Breadcrumbs';
import { MediaGallery } from './components/pdp/MediaGallery';
import { BuyBox } from './components/pdp/BuyBox';
import { FoldableSections } from './components/pdp/FoldableSections';
import { RelatedProducts } from './components/pdp/RelatedProducts';
import { MobileStickyBar } from './components/pdp/MobileStickyBar';
import { CartDrawer } from './components/drawers/CartDrawer';
import { WishlistDrawer } from './components/drawers/WishlistDrawer';
import { ManualPreviewModal } from './components/drawers/ManualPreviewModal';
import { OrderTrackingModal } from './components/drawers/OrderTrackingModal';
import { AccountModal } from './components/drawers/AccountModal';
import { Toast } from './components/ui/Toast';
import { Footer } from './components/footer/Footer';

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-neutral-900 font-sans selection:bg-neutral-800 selection:text-white pb-14 md:pb-0">
      {/* 1. Global Header Navigation (2C Pure) */}
      <TopBar />
      <MainHeader />
      <MegaMenu />

      {/* 2. Breadcrumb Navigation (No Ref / SKU) */}
      <Breadcrumbs />

      {/* 3. Product Detail Page (PDP) Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full">
        {/* Above the Fold Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Media Gallery (7 cols on LG) */}
          <div className="lg:col-span-7">
            <MediaGallery />
          </div>

          {/* Right Column: Contiguous Purchase Buy Box (5 cols on LG) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <BuyBox />
          </div>
        </div>

        {/* Foldable Content Sections (Accordion Architecture) */}
        <div className="mt-8 lg:mt-12 max-w-5xl">
          <FoldableSections />
        </div>

        {/* Related & Recommended Products */}
        <div className="mt-8">
          <RelatedProducts />
        </div>
      </main>

      {/* 4. Global Footer */}
      <Footer />

      {/* 5. Drawers, Modals & Floating Components */}
      <MobileStickyBar />
      <CartDrawer />
      <WishlistDrawer />
      <ManualPreviewModal />
      <OrderTrackingModal />
      <AccountModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
