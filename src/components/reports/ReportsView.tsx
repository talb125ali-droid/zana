import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Building2,
  Calendar,
  Printer,
  Package,
  Award,
  FileSpreadsheet
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { sales, expenses, branches, activeBranch } = useStore();

  const [filterBranchId, setFilterBranchId] = useState<number | 'all'>('all');

  // Filtered sales and expenses
  const filteredSales = filterBranchId === 'all' ? sales : sales.filter((s) => s.branchId === filterBranchId);
  const filteredExpenses = filterBranchId === 'all' ? expenses : expenses.filter((e) => e.branchId === filterBranchId);

  // Financial calculations
  const totalSalesRevenue = filteredSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalCogs = filteredSales.reduce((sum, s) => sum + s.costOfGoodsSold, 0);
  const totalGrossProfit = Math.max(0, totalSalesRevenue - totalCogs);
  const totalOperatingExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalNetProfit = totalGrossProfit - totalOperatingExpenses;

  const grossMargin = totalSalesRevenue > 0 ? ((totalGrossProfit / totalSalesRevenue) * 100).toFixed(1) : '0';
  const netMargin = totalSalesRevenue > 0 ? ((totalNetProfit / totalSalesRevenue) * 100).toFixed(1) : '0';

  const exportToCsv = () => {
    const headers = ['لق', 'شار', 'داهاتی فرۆشتن', 'تێچووی کۆگا (COGS)', 'قازانجی ناپوختە (Gross)', 'خەرجییەکان', 'قازانجی پوختە (Net)'];
    const rows = branches.map((b) => {
      const bSales = sales.filter((s) => s.branchId === b.id);
      const bExpenses = expenses.filter((e) => e.branchId === b.id);
      const bRevenue = bSales.reduce((sum, s) => sum + s.totalAmount, 0);
      const bCogs = bSales.reduce((sum, s) => sum + s.costOfGoodsSold, 0);
      const bGross = Math.max(0, bRevenue - bCogs);
      const bExpTotal = bExpenses.reduce((sum, e) => sum + e.amount, 0);
      const bNet = bGross - bExpTotal;
      return [b.nameKu, b.city, bRevenue, bCogs, bGross, bExpTotal, bNet];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Zana_Financial_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Best selling products calculation
  const productSalesMap: Record<number, { name: string; barcode: string; qty: number; revenue: number; profit: number }> = {};
  filteredSales.forEach((s) => {
    s.items.forEach((item) => {
      if (!productSalesMap[item.productId]) {
        productSalesMap[item.productId] = {
          name: item.productNameKu,
          barcode: item.barcode,
          qty: 0,
          revenue: 0,
          profit: 0
        };
      }
      productSalesMap[item.productId].qty += item.quantity;
      productSalesMap[item.productId].revenue += item.totalPrice;
      productSalesMap[item.productId].profit += item.grossProfit;
    });
  });

  const topProducts = Object.values(productSalesMap).sort((a, b) => b.qty - a.qty).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-bold text-white">ڕاپۆرتە داراییەکان و شیکاری قازانج (Financial Reports)</h3>
          </div>
          <p className="text-xs text-slate-300">
            ئەژمارکردنی دەقیقی قازانجی ناپوختە (Gross Profit) و قازانجی پوختە (Net Profit) بۆ سەرجەم ٦ لقەکە بە جیا.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Branch filter */}
          <select
            value={filterBranchId}
            onChange={(e) => setFilterBranchId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-500"
          >
            <option value="all">سەرجەم ٦ لقەکە (کۆمپانیای زانا)</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nameKu} ({b.city})
              </option>
            ))}
          </select>

          <button
            onClick={exportToCsv}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
            title="هەناردەکردنی ڕاپۆرت بۆ فایلی ئێکسڵ"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>هەناردەی Excel</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>چاپکردنی ڕاپۆرت</span>
          </button>
        </div>
      </div>

      {/* Official Profit Formula Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold text-amber-300">یاسای ئەژمارکردنی قازانجی ڕاستەقینە:</span>
            <div className="text-slate-300 mt-0.5">
              قازانجی ناپوختە (Gross Profit) = داهاتی فرۆشتن - تێچووی کڕین (COGS) • قازانجی پوختە (Net Profit) = قازانجی ناپوختە - خەرجییەکان
            </div>
          </div>
        </div>
        <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-amber-500/20 text-amber-300 font-mono text-[11px] font-bold">
          دراوی بنەڕەتی: دیناری عێراقی (IQD)
        </div>
      </div>

      {/* Financial Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">کۆی داهاتی فرۆشتن (Net Sales):</span>
          <div className="text-2xl font-mono font-bold text-white mb-1">
            {totalSalesRevenue.toLocaleString()} د.ع
          </div>
          <span className="text-[11px] text-slate-400">ژمارەی فاکتۆرەکان: {filteredSales.length}</span>
        </div>

        {/* Total COGS */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400 block mb-1">تێچووی کڕینی کاڵا (COGS):</span>
          <div className="text-2xl font-mono font-bold text-slate-300 mb-1">
            {totalCogs.toLocaleString()} د.ع
          </div>
          <span className="text-[11px] text-slate-400">تێچووی بنەڕەتی لە کڕیندا</span>
        </div>

        {/* Gross Profit */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-amber-500/20 bg-amber-500/5">
          <span className="text-xs text-amber-400 font-bold block mb-1">قازانجی ناپوختە (Gross Profit):</span>
          <div className="text-2xl font-mono font-bold text-amber-400 mb-1">
            {totalGrossProfit.toLocaleString()} د.ع
          </div>
          <span className="text-[11px] text-amber-300 font-semibold font-mono">
            {grossMargin}% لە کۆی فرۆش
          </span>
        </div>

        {/* Net Profit */}
        <div className={`p-5 rounded-2xl bg-slate-900 border ${totalNetProfit >= 0 ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-rose-500/30 bg-rose-500/5'}`}>
          <span className="text-xs font-bold block mb-1 text-slate-300">قازانجی پوختە (Net Profit):</span>
          <div className={`text-2xl font-mono font-bold mb-1 ${totalNetProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalNetProfit.toLocaleString()} د.ع
          </div>
          <span className="text-[11px] text-slate-400">
            خەرجی لێدەرکراو: {totalOperatingExpenses.toLocaleString()} د.ع
          </span>
        </div>
      </div>

      {/* Six Branches Performance Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-amber-400" />
          <span>بەراوردی دارایی و قازانجی نێوان شەش لقەکە (Branches Performance Matrix)</span>
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-800/60 border-b border-slate-800 text-slate-300 font-bold">
                <th className="py-3 px-4">لق (Branch)</th>
                <th className="py-3 px-4">شار</th>
                <th className="py-3 px-4">داهاتی فرۆشتن</th>
                <th className="py-3 px-4">تێچووی فرۆش (COGS)</th>
                <th className="py-3 px-4">قازانجی ناپوختە</th>
                <th className="py-3 px-4">خەرجییەکانی لق</th>
                <th className="py-3 px-4">قازانجی پوختە (Net)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {branches.map((b) => {
                const bSales = sales.filter((s) => s.branchId === b.id);
                const bExpenses = expenses.filter((e) => e.branchId === b.id);
                const bRevenue = bSales.reduce((sum, s) => sum + s.totalAmount, 0);
                const bCogs = bSales.reduce((sum, s) => sum + s.costOfGoodsSold, 0);
                const bGross = Math.max(0, bRevenue - bCogs);
                const bExpTotal = bExpenses.reduce((sum, e) => sum + e.amount, 0);
                const bNet = bGross - bExpTotal;

                return (
                  <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-white">
                      {b.nameKu}
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {b.city}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {bRevenue.toLocaleString()} د.ع
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {bCogs.toLocaleString()} د.ع
                    </td>
                    <td className="py-3 px-4 font-mono text-amber-400 font-bold">
                      {bGross.toLocaleString()} د.ع
                    </td>
                    <td className="py-3 px-4 font-mono text-rose-400">
                      {bExpTotal.toLocaleString()} د.ع
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">
                      <span className={bNet >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {bNet.toLocaleString()} د.ع
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Best Selling Products */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>پڕفرۆشترین بەرهەمەکانی فرۆشگاکانی زانا</span>
        </h4>

        {topProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {topProducts.map((p, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">
                    #{idx + 1}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{p.barcode}</span>
                </div>
                <h5 className="text-xs font-bold text-white truncate">{p.name}</h5>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">فرۆشراو:</span>
                  <span className="font-mono font-bold text-amber-400">{p.qty} دانە</span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-800">
                  <span className="text-slate-400">قازانج:</span>
                  <span className="font-mono font-bold text-emerald-400">+{p.profit.toLocaleString()} د.ع</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-500">
            هیچ فرۆشتنێک تۆمار نەکراوە بۆ دیاریکردنی پڕفرۆشترین بەرهەمەکان. لە خاڵی فرۆشتن (POS) یەکەم فاکتۆر دەربکە!
          </div>
        )}
      </div>
    </div>
  );
};
