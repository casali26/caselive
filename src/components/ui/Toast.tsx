import React from 'react';
import { useStore } from '../../context/StoreContext';

export const Toast: React.FC = () => {
  const { toast } = useStore();

  if (!toast.visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200 pointer-events-none">
      <div className="bg-neutral-900/95 backdrop-blur-md text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-lg shadow-2xl border border-neutral-700 flex items-center gap-2 max-w-md">
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
