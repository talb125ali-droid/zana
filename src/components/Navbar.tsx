import React from 'react';
import { useStore } from '../context/StoreContext';
import { Building2, UserCircle, ShoppingCart, DollarSign, Bell } from 'lucide-react';

interface NavbarProps {
  onOpenCart?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, activeTab, setActiveTab }) => {
  const {
    branches,
    activeBranchId,
    setActiveBranchId,
    activeBranch,
    currentUser,
    setCurrentUser,
    users,
    cart,
    cartTotal,
    currentShift,
    toastMessage
  } = useStore();

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-amber-500 text-slate-950 px-5 py-3 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-2 border border-amber-400 animate-bounce">
          <Bell className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-md shadow-amber-500/20">
                Z
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-white tracking-wide">کۆگاکانی زانا</h1>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                    ZANA STORE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  سیستەمی بەڕێوەبردنی کۆگا و فرۆشتنی ٦ لقی فیزیکی • ١٠٠٪ کوردی سۆرانی
                </p>
              </div>
            </div>

            {/* Controls: Branch Switcher, User Switcher, Cart */}
            <div className="flex items-center gap-3">
              {/* Branch Switcher */}
              <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 rounded-xl px-2.5 py-1.5">
                <Building2 className="w-4 h-4 text-amber-400 shrink-0" />
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 leading-none">
                    {currentUser.role === 'super_admin' ? 'لقى کارپێکراو (لیدەر):' : 'لقی پەیوەستکراو:'}
                  </div>
                  {currentUser.role === 'super_admin' ? (
                    <select
                      value={activeBranchId}
                      onChange={(e) => setActiveBranchId(Number(e.target.value))}
                      aria-label="هەڵبژاردنی لق"
                      className="bg-transparent text-xs font-bold text-amber-400 focus:outline-none cursor-pointer"
                    >
                      {branches.map((b) => (
                        <option key={b.id} value={b.id} className="bg-slate-800 text-white">
                          {b.nameKu} ({b.city})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <span>{activeBranch.nameKu}</span>
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                        تایبەت بە لق
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* User / Role Switcher */}
              <div className="hidden md:flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/80 rounded-xl px-2.5 py-1.5">
                <UserCircle className="w-4 h-4 text-blue-400 shrink-0" />
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 leading-none">بەکارهێنەر / ڕۆڵ:</div>
                  <button
                    onClick={() => setActiveTab('users')}
                    className="bg-transparent text-xs font-bold text-white hover:text-amber-400 focus:outline-none cursor-pointer flex items-center gap-1 text-right"
                    title="کلیک بکە بۆ گۆڕینی هەژمار یان بینینی یوزەر و پاسۆردی لقەکان"
                  >
                    <span>{currentUser.name}</span>
                    <span className="text-[10px] text-slate-400">({currentUser.roleNameKu})</span>
                  </button>
                </div>
              </div>

              {/* Quick POS Cart Button */}
              <button
                onClick={() => {
                  setActiveTab('pos');
                  if (onOpenCart) onOpenCart();
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'pos'
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                }`}
              >
                <div className="relative">
                  <ShoppingCart className="w-4 h-4" />
                  {totalCartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                      {totalCartCount}
                    </span>
                  )}
                </div>
                <span>خاڵی فرۆشتن (POS)</span>
                {cartTotal > 0 && (
                  <span className="font-mono bg-slate-900/40 px-1.5 py-0.5 rounded text-[11px]">
                    {cartTotal.toLocaleString()} د.ع
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
