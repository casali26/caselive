import React, { useState } from 'react';
import { X, User, Lock, Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AccountModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, showToast } = useStore();
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoggedIn(true);
    showToast(`Signed in as ${email}`);
    setTimeout(() => {
      setIsLoginModalOpen(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-sm w-full p-6 text-neutral-800 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        
        <div className="flex items-center justify-between pb-3.5 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800">
              <User className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-base text-neutral-900">caselive Account</h3>
          </div>
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isLoggedIn ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="font-medium text-neutral-900 text-sm">Welcome back</div>
            <div className="text-xs text-neutral-500">{email}</div>
            <div className="text-[11px] text-neutral-600 bg-neutral-100 py-1 px-3 rounded-full inline-block font-medium">
              Verified Member
            </div>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="pt-4 space-y-3.5 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 uppercase mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-8 pr-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-700"
                />
                <Mail className="w-4 h-4 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-neutral-600 uppercase mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  defaultValue="password123"
                  className="w-full pl-8 pr-3 py-2 border border-neutral-300 rounded focus:outline-none focus:border-neutral-700"
                />
                <Lock className="w-4 h-4 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#1F2429] hover:bg-black text-white font-medium rounded-md flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="text-center text-[11px] text-neutral-500 pt-1">
              Save favorite items, review order status, and manage doorstep delivery preferences.
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
