import React from 'react';
import { Database, Building2, ShieldCheck, KeyRound, DollarSign, PackageCheck, CheckCircle2, Shield, Lock, FileCode, Check } from 'lucide-react';
import { CATEGORIES_DATA } from '../data/schemaData';

interface OverviewStatsProps {
  onNavigateTab: (tab: string) => void;
}

export const OverviewStats: React.FC<OverviewStatsProps> = ({ onNavigateTab }) => {
  const stats = [
    { label: 'خشتەکانی بنکەدراوە', value: '٣٧ خشتە', sub: 'MySQL 8.0+ Normalized 3NF', icon: Database, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    { label: 'لقە فیزیکییەکان', value: '٦ لق', sub: 'هەولێر، سلێمانی، دهۆک، کەرکووک', icon: Building2, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { label: 'ڕۆڵ و بەکارهێنەران', value: '٤ ڕۆڵی سەرەکی', sub: 'Super Admin, Manager, Cashier, Stock', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
    { label: 'دەسەڵاتە وردەکان', value: '٤٧ دەسەڵات', sub: 'کۆنترۆڵی وردی هەموو بەشەکان', icon: KeyRound, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    { label: 'دراوەکانی سیستەم', value: 'IQD / USD', sub: 'دیناری عێراقی سەرەکی + دۆلاری هاوتەریب', icon: DollarSign, color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/20' },
    { label: 'پۆلە سەرەکییەکانی زانا', value: '١٠ پۆلی بنەڕەتی', sub: 'مەیکئەپ، عەتر، پۆشاک، دیکۆر، قوماش', icon: PackageCheck, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' }
  ];

  const highlights = [
    { title: 'بەکارهێنانی MySQLi بە تەواوی', desc: 'بەستنەوە بە بنکەدراوە تەنها لە ڕێگەی MySQLi و بەکارهێنانی Prepared Statements بۆ ڕێگری ١٠٠٪ لە SQL Injection.' },
    { title: 'کۆگای سەربەخۆ بۆ هەر ٦ لقەکە', desc: 'هەر لقێک خاوەنی کۆگا، باڵانسی کاڵا، شەفتی قاسە، خەرجی و داهاتی سەربەخۆی خۆیەتی لەگەڵ دەسەڵاتی حەواڵەی نێوان لقەکان.' },
    { title: 'پاراستنی مێژووی دارایی و تێچوو', desc: 'تۆمارکردنی snapshot ی تێچووی کڕین (COGS) لە کاتی هەر فرۆشتنێک بۆ دەرهێنانی قازانجی ڕاستەقینەی ناپوختە (Gross Profit) و پوختە (Net Profit).' },
    { title: 'ئاسایش و دڵنیایی بەرز', desc: 'هاشکردنی وشەی نهێنی بە bcrypt، دروستکردنی CSRF Token، پاککردنەوەی XSS، و لۆگکردنی وردی چالاکییەکان لە audit_logs.' }
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 p-6 sm:p-8">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-4">
            <CheckCircle2 className="w-4 h-4" />
            <span>قۆناغی یەکەم تەواو بوو: نەخشەسازی و بنکەدراوەی زانا</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
            بەخێربێن بۆ پڕۆژەی سیستەمی کۆگاکانی زانا (ZANA)
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            سیستەمەکە لەسەر بنەمای تەکنەلۆژیای نەیتیڤی PHP 8.2+ و بنکەدراوەی بەهێزی MySQL 8.0+ بە پەیوەندی MySQLi داڕێژراوە. هەموو بەش و پەڕەکانی بۆ بەڕێوەبردنی تۆڕی شەش لق بە زمانی کوردی سۆرانی بە ڕەچاوکردنی تەواوی یاساکانی ئاسایش و دارایی بنیات نراون.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigateTab('schema')}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <Database className="w-4 h-4" />
              <span>پشکنینی ٣٧ خشتەی بنکەدراوە</span>
            </button>
            <button
              onClick={() => onNavigateTab('sql')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium border border-slate-700 transition-all flex items-center gap-2"
            >
              <FileCode className="w-4 h-4" />
              <span>بینینی سکریپتی schema.sql</span>
            </button>
            <button
              onClick={() => onNavigateTab('branches')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium border border-slate-700 transition-all flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span>تایبەتمەندی ٦ لقەکە</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className={`p-5 rounded-xl bg-slate-900/80 border ${stat.border} hover:border-slate-600 transition-all shadow-sm`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-400">{stat.label}</span>
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Architectural Pillars */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-400" />
          <span>پایە سەرەکییەکانی نژیاروانی سیستەمی زانا</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {highlights.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex gap-3.5">
              <div className="mt-0.5 text-amber-400">
                <Check className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Business Retail Categories */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">پۆلە سەرەکییەکانی بازرگانی زانا (Retail Catalog)</h3>
            <p className="text-xs text-slate-400 mt-1">ئەم ١٠ بەشە سەرەکییە لە داتای سەرەتایی (seed.sql) جێگیر کراون لەگەڵ پۆلە لاوەکییەکان</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {CATEGORIES_DATA.map((cat) => (
            <div key={cat.id} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-800 hover:border-amber-500/30 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-amber-400">{cat.code}</span>
                <span className="text-[10px] bg-slate-700/60 text-slate-300 px-1.5 py-0.5 rounded">
                  {cat.subcategories.length} لاوەکی
                </span>
              </div>
              <h4 className="text-sm font-bold text-white mb-1">{cat.nameKu}</h4>
              <p className="text-[11px] text-slate-400 line-clamp-2">{cat.descriptionKu}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Credentials Callout */}
      <div className="rounded-xl bg-slate-800/50 border border-slate-700 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">هەژماری سەرەکی بەڕێوەبەری گشتی (Super Admin Setup)</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              ناوی بەکارهێنەر: <span className="font-mono text-amber-400 font-bold">admin</span> • وشەی نهێنی: <span className="font-mono text-amber-400 font-bold">Admin@123456</span> • دەسەڵات: تەواوی سیستەم و ٦ لقەکە
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700/60 font-mono">
          Status: Ready in seed.sql
        </div>
      </div>
    </div>
  );
};
