import React from 'react';
import { Database, ShieldCheck, Layers, GitBranch } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'پوختەی قۆناغی ١', icon: Layers },
    { id: 'schema', label: 'خشتەکانی بنکەدراوە (٣٧)', icon: Database },
    { id: 'erd', label: 'نەخشەی پەیوەندییەکان (ERD)', icon: GitBranch },
    { id: 'branches', label: '٦ لقە فیزیکییەکە', icon: Layers },
    { id: 'rbac', label: 'دەسەڵاتەکان و ڕۆڵ (RBAC)', icon: ShieldCheck },
    { id: 'sql', label: 'سکریپتی فەرمی SQL', icon: Database },
    { id: 'php', label: 'نژیاروانی PHP و پەڕگەکان', icon: Layers },
    { id: 'accounting', label: 'یاساکانی قازانج و دراو', icon: ShieldCheck }
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-2xl tracking-tighter">
              Z
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-wide">سیستەمی بەڕێوەبردنی کۆگاکانی زانا</h1>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  قۆناغی ١: بنکەدراوە و ژێرخان
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                تۆڕی ٦ لقی فیزیکی • PHP 8.2+ و MySQLi • بنکەدراوەی MySQL 8+ • زمانی کوردی سۆرانی
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>دۆخی سیستەم: ئامادەیە بۆ دامەزراندن</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex space-x-1 space-x-reverse overflow-x-auto pb-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
