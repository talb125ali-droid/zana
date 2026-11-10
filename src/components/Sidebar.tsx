import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShoppingCart,
  Package,
  ArrowLeftRight,
  Users,
  Truck,
  Wallet,
  BarChart3,
  Building2,
  Database,
  Settings,
  RotateCcw,
  ClipboardCheck,
  KeyRound
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { cart } = useStore();
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const menuItems = [
    { id: 'pos', label: 'خاڵی فرۆشتن (POS)', icon: ShoppingCart, badge: cartCount > 0 ? cartCount : undefined },
    { id: 'users', label: 'هەژمار و پاسۆردی لقەکان', icon: KeyRound },
    { id: 'returns', label: 'گەڕاندنەوە و پسوولە', icon: RotateCcw },
    { id: 'products', label: 'بەرهەم و بارکۆد', icon: Package },
    { id: 'stocktake', label: 'سەرژمێری و جەردی کۆگا', icon: ClipboardCheck },
    { id: 'transfers', label: 'حەواڵەی نێوان لقەکان', icon: ArrowLeftRight },
    { id: 'customers', label: 'کڕیاران و قەرزەکان', icon: Users },
    { id: 'purchases', label: 'کڕین و دابینکەران', icon: Truck },
    { id: 'finance', label: 'خەرجییەکان و قاسە', icon: Wallet },
    { id: 'reports', label: 'قازانج و ڕاپۆرتەکان', icon: BarChart3 },
    { id: 'branches', label: 'بەڕێوەبردنی ٦ لق و ئەدمین', icon: Building2 },
    { id: 'database', label: 'نەخشەی بنکەدراوە و ERD', icon: Database },
    { id: 'settings', label: 'ڕێکخستن و باکئەپ', icon: Settings }
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 border-l border-slate-800 p-4 shrink-0 flex flex-col justify-between">
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold text-slate-400 px-3 py-1 mb-1">
          بەشەکانی سیستەم:
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-black ${
                    isActive ? 'bg-slate-950 text-amber-400' : 'bg-rose-500 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 text-center">
        <div className="font-bold text-white mb-0.5">سیستەمی کۆگاکانی زانا</div>
        <div>وەشانی کارا ١.٠ • زمانی کوردی سۆرانی</div>
      </div>
    </aside>
  );
};
