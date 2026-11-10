import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  Search,
  Filter,
  Layers,
  History,
  Check
} from 'lucide-react';

export const StocktakingView: React.FC = () => {
  const {
    products,
    activeBranch,
    activeBranchId,
    getProductStock,
    stocktakes,
    performStocktake,
    applyStocktakeAdjustment
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [countedQuantities, setCountedQuantities] = useState<{ [productId: number]: number }>(() => {
    // initialize with current system stock
    const init: { [productId: number]: number } = {};
    products.forEach((p) => {
      init[p.id] = getProductStock(p.id, activeBranchId);
    });
    return init;
  });

  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'count' | 'history'>('count');

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nameKu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery);
    const matchesCategory = selectedCategory === 'all' || p.categoryNameKu === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCountChange = (productId: number, val: number) => {
    setCountedQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, val)
    }));
  };

  // Metrics
  let totalSystemQty = 0;
  let totalCountedQty = 0;
  let matchesCount = 0;
  let shortagesCount = 0;
  let surplusesCount = 0;
  let totalDiscrepancyValueIqd = 0;

  products.forEach((p) => {
    const sys = getProductStock(p.id, activeBranchId);
    const counted = countedQuantities[p.id] !== undefined ? countedQuantities[p.id] : sys;
    const diff = counted - sys;

    totalSystemQty += sys;
    totalCountedQty += counted;

    if (diff === 0) matchesCount++;
    else if (diff < 0) {
      shortagesCount++;
      totalDiscrepancyValueIqd += diff * p.purchasePrice;
    } else {
      surplusesCount++;
      totalDiscrepancyValueIqd += diff * p.purchasePrice;
    }
  });

  const handleSubmitStocktake = (e: React.FormEvent) => {
    e.preventDefault();
    const items = products.map((p) => ({
      productId: p.id,
      countedQty: countedQuantities[p.id] !== undefined ? countedQuantities[p.id] : getProductStock(p.id, activeBranchId)
    }));

    performStocktake(items, notes);
    setNotes('');
    setActiveTab('history');
  };

  const categories = Array.from(new Set(products.map((p) => p.categoryNameKu)));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2.5">
            <ClipboardCheck className="w-6 h-6 text-amber-500" />
            سەرژمێری فەرمی کۆگا (Stocktaking & Reconciliation)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            سەرژمێریکردنی کاڵاکانی لقی <span className="text-amber-400 font-bold">{activeBranch.nameKu}</span>، دیاریکردنی کەمی و زیادەی کۆگا و چاکسازی لە سیستەمدا
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('count')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'count'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            سەرژمێری نوێ
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            مێژووی سەرژمێرییەکان ({stocktakes.length})
          </button>
        </div>
      </div>

      {/* Step-by-Step Stocktaking Guide Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-xs">
        <div className="font-bold text-amber-300 text-sm mb-2 flex items-center gap-2">
          <ClipboardCheck className="w-4 h-4" />
          <span>چۆنێتی ئەنجامدانی جەردی کۆگا هەنگاو بە هەنگاو:</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-slate-300">
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <div className="font-bold text-amber-400 mb-0.5">١. هەڵبژاردنی لق</div>
            <div className="text-[11px] text-slate-400">
              ئێستا جەرد بۆ لقی <strong className="text-white">{activeBranch.nameKu}</strong> دەکرێت. هەر لقێک بە جیا جەرد دەکرێت.
            </div>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <div className="font-bold text-amber-400 mb-0.5">٢. ژماردنی کاڵاکان</div>
            <div className="text-[11px] text-slate-400">
              بڕی ڕاستەقینەی ناو ڕەفەکان لە خانەی "بڕی ژمێردراو" بنووسە یان بە بارکۆد سکان بکە.
            </div>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <div className="font-bold text-amber-400 mb-0.5">٣. دۆزینەوەی کەمی و زیادە</div>
            <div className="text-[11px] text-slate-400">
              سیستەم ئۆتۆماتیکی جیاوازی و بەهای زیانی کەمی کاڵا بە نرخی تێچووی کڕین دەردەخات.
            </div>
          </div>
          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
            <div className="font-bold text-amber-400 mb-0.5">٤. پەسەندکردن و چاکسازی</div>
            <div className="text-[11px] text-slate-400">
              دوای تۆمارکردن، دوگمەی "چاکسازی کۆگا" دابگرە بۆ ئەوەی داتای کۆمپیوتەر لەگەڵ کۆگای فیزیکی تەبا بێتەوە.
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] text-slate-400 font-bold">کۆی کاڵای هەژمارکراو</div>
          <div className="text-xl font-black font-mono text-white mt-1">
            {totalCountedQty.toLocaleString()}{' '}
            <span className="text-xs text-slate-400 font-normal">/ {totalSystemQty} لە سیستەم</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            کاڵای تەواو و بێ جیاوازی
          </div>
          <div className="text-xl font-black font-mono text-emerald-400 mt-1">
            {matchesCount} <span className="text-xs text-slate-400 font-normal">جۆر</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] text-slate-400 font-bold flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
            کاڵای کەمی هەیە (کۆگا کەمترە)
          </div>
          <div className="text-xl font-black font-mono text-rose-400 mt-1">
            {shortagesCount} <span className="text-xs text-slate-400 font-normal">جۆر</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] text-slate-400 font-bold">بەهای دارایی جیاوازییەکان</div>
          <div
            className={`text-xl font-black font-mono mt-1 ${
              totalDiscrepancyValueIqd < 0
                ? 'text-rose-400'
                : totalDiscrepancyValueIqd > 0
                ? 'text-sky-400'
                : 'text-emerald-400'
            }`}
          >
            {totalDiscrepancyValueIqd.toLocaleString()} د.ع
          </div>
        </div>
      </div>

      {activeTab === 'count' ? (
        <form onSubmit={handleSubmitStocktake} className="space-y-6">
          {/* Filters & Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
              <input
                type="text"
                placeholder="گەڕان بەپێی ناوی کاڵا یان بارکۆد..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:w-64 relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="all">هەموو بەشەکان ({categories.length})</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stocktake Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4 font-bold">بەرهەم</th>
                    <th className="py-3.5 px-4 font-bold">بەش</th>
                    <th className="py-3.5 px-4 font-bold">بارکۆد</th>
                    <th className="py-3.5 px-4 font-bold text-center">بڕ لە سیستەم</th>
                    <th className="py-3.5 px-4 font-bold text-center">بڕی ژمێردراو لە کۆگا</th>
                    <th className="py-3.5 px-4 font-bold text-center">جیاوازی</th>
                    <th className="py-3.5 px-4 font-bold">بەهای دارایی (کڕین)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredProducts.map((p) => {
                    const sysQty = getProductStock(p.id, activeBranchId);
                    const counted = countedQuantities[p.id] !== undefined ? countedQuantities[p.id] : sysQty;
                    const diff = counted - sysQty;
                    const diffCost = diff * p.purchasePrice;

                    return (
                      <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-4 font-bold text-white">
                          <div>{p.nameKu}</div>
                          {p.nameEn && <div className="text-[10px] text-slate-400">{p.nameEn}</div>}
                        </td>
                        <td className="py-3 px-4 text-slate-400">{p.categoryNameKu}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-amber-400">{p.barcode}</td>
                        <td className="py-3 px-4 font-mono font-bold text-center text-slate-300">
                          {sysQty}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="number"
                            min={0}
                            value={counted}
                            onChange={(e) =>
                              handleCountChange(p.id, parseInt(e.target.value) || 0)
                            }
                            className={`w-20 px-2.5 py-1.5 rounded-lg border text-center font-mono font-bold text-xs focus:outline-none ${
                              diff === 0
                                ? 'bg-slate-950 border-slate-700 text-white'
                                : diff < 0
                                ? 'bg-rose-950/40 border-rose-500/50 text-rose-300'
                                : 'bg-sky-950/40 border-sky-500/50 text-sky-300'
                            }`}
                          />
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold">
                          {diff === 0 ? (
                            <span className="text-emerald-400 text-xs">ڕێکە (٠)</span>
                          ) : diff < 0 ? (
                            <span className="text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full">
                              {diff} دانە کەمە
                            </span>
                          ) : (
                            <span className="text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full">
                              +{diff} دانە زیادە
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs">
                          {diffCost === 0 ? (
                            <span className="text-slate-400">٠ د.ع</span>
                          ) : (
                            <span
                              className={`font-bold ${
                                diffCost < 0 ? 'text-rose-400' : 'text-sky-400'
                              }`}
                            >
                              {diffCost.toLocaleString()} د.ع
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Notes & Submit */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1.5 block">
                تێبینی سەرژمێری و شاندی پشکنین:
              </label>
              <textarea
                rows={2}
                placeholder="تێبینی دەربارەی دۆخی کۆگا، شاندی سەرژمێریکار، هۆکاری کەمبوون یان زیادبوون..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              تۆمارکردنی ئەم سەرژمێرییە بە فەرمی
            </button>
          </div>
        </form>
      ) : (
        /* History of Stocktakes */
        <div className="space-y-4">
          {stocktakes.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
              <ClipboardCheck className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <div className="text-sm font-bold text-slate-300 mb-1">
                هیچ سەرژمێرییەکی پێشوو تۆمار نەکراوە
              </div>
              <p className="text-xs text-slate-500">
                دەتوانیت لە بەشی سەرژمێری نوێ، کۆگای لق ژمێریاری بکەیت و تۆماری بکەیت.
              </p>
            </div>
          ) : (
            stocktakes.map((stk) => (
              <div
                key={stk.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-black text-amber-400">
                      {stk.stocktakeNumber}
                    </span>
                    <span className="text-xs text-slate-300 font-bold">
                      لقی {stk.branchNameKu}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      بەروار: {new Date(stk.date).toLocaleDateString('ku-IQ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {stk.isAdjusted ? (
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        کۆگا بەپێی ئەم سەرژمێرییە چاککراوە
                      </span>
                    ) : (
                      <button
                        onClick={() => applyStocktakeAdjustment(stk.id)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/20"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        چاکسازی باڵانسی کۆگا بەپێی سەرژمێری
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 block text-[11px]">ئەنجامدراوە لەلایەن:</span>
                    <span className="font-bold text-white">{stk.conductedBy}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 block text-[11px]">بڕی سیستەم:</span>
                    <span className="font-mono font-bold text-white">{stk.totalSystemQty} دانە</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 block text-[11px]">بڕی ژمێردراو:</span>
                    <span className="font-mono font-bold text-amber-400">{stk.totalCountedQty} دانە</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-slate-400 block text-[11px]">بەهای دارایی جیاوازی:</span>
                    <span
                      className={`font-mono font-bold ${
                        stk.totalDifferenceCost < 0 ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {stk.totalDifferenceCost.toLocaleString()} د.ع
                    </span>
                  </div>
                </div>

                {stk.notes && (
                  <div className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                    <span className="font-bold text-slate-300">تێبینی: </span>
                    {stk.notes}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
