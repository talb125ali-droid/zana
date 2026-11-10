import React, { useState } from 'react';
import { DollarSign, Calculator, CheckCircle2, AlertCircle } from 'lucide-react';

export const ProfitCalculator: React.FC = () => {
  // Sales & Profit simulation states
  const [salesRevenue, setSalesRevenue] = useState<number>(15000000); // 15 million IQD
  const [cogsCost, setCogsCost] = useState<number>(9500000); // 9.5 million IQD (cost)
  const [expenses, setExpenses] = useState<number>(2200000); // 2.2 million IQD (rent, salary, etc)

  // Currency Converter states
  const [exchangeRate, setExchangeRate] = useState<number>(1530);
  const [usdAmount, setUsdAmount] = useState<number>(1000);

  // Calculations
  const grossProfit = Math.max(0, salesRevenue - cogsCost);
  const netProfit = grossProfit - expenses;
  const grossMarginPercent = salesRevenue > 0 ? ((grossProfit / salesRevenue) * 100).toFixed(1) : '0';
  const netMarginPercent = salesRevenue > 0 ? ((netProfit / salesRevenue) * 100).toFixed(1) : '0';

  const convertedIqd = Math.round(usdAmount * exchangeRate);

  const accountingRules = [
    { title: 'کڕین ناکرێتە خەرجی ڕاستەوخۆ', desc: 'کڕینی کاڵا دەچێتە سەرمایەی کۆگا (Asset)، لە کاتی فرۆشتندا وەک تێچوو (COGS) لێ دەردەکرێت.' },
    { title: 'پاراستنی نرخی تێچووی کۆن (Cost Snapshot)', desc: 'لە کاتی فرۆشتنی هەر کاڵایەک تێچووی ئەو ساتە خەزن دەکرێت، بۆیە گۆڕانی نرخی کڕین لە داهاتوودا حیساباتی پێشوو تێک نادات.' },
    { title: 'قەرزی ماوە بە نەقد ئەژمار ناکرێت', desc: 'ئەو بەشەی فاکتۆر کە بە قەرز ماوەتەوە ناچێتە قاسەی نەقدی کاشێر تا ئەو کاتەی لە خشتەی customer_transactions پارەکە وەردەگیرێت.' },
    { title: 'حەواڵەی نێوان لقەکان نابێتە فرۆشتن', desc: 'گواستنەوەی کاڵا لە نێوان ٦ لقەکەدا تەنها حەواڵەی کۆگایە و بە هیچ جۆرێک لە داهات یان قازانج دانانرێت.' }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-1">
          <Calculator className="w-5 h-5 text-amber-400" />
          <h3 className="text-xl font-bold text-white">تاقیکەرەوەی یاساکانی دارایی، قازانج و دراو (Accounting & Profit Simulator)</h3>
        </div>
        <p className="text-xs text-slate-300">
          تەواوی فۆرمولەکانی ئەژمارکردنی قازانجی ناپوختە (Gross Profit) و قازانجی پوختە (Net Profit) بەپێی بەشی ١٣ی دۆکیومێنت.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Profit Simulator */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>ئەژمارکەری قازانجی لق (Profit Simulator)</span>
          </h4>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">
                کۆی داهاتی فرۆشتنی لق (Net Sales Revenue) - دینار:
              </label>
              <input
                type="number"
                value={salesRevenue}
                onChange={(e) => setSalesRevenue(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">
                تێچووی کڕینی کاڵا فرۆشراوەکان (COGS Snapshot) - دینار:
              </label>
              <input
                type="number"
                value={cogsCost}
                onChange={(e) => setCogsCost(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold mb-1 block">
                مەسروفیاتی لق (کرێ، مووچە، کارەبا، ئینتەرنێت) - دینار:
              </label>
              <input
                type="number"
                value={expenses}
                onChange={(e) => setExpenses(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Results Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">قازانجی ناپوختە (Gross Profit)</span>
              <div className="text-xl font-mono font-bold text-amber-400">
                {grossProfit.toLocaleString()} د.ع
              </div>
              <span className="text-[11px] text-slate-400">ڕێژە لە فرۆش: {grossMarginPercent}%</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
              <span className="text-xs text-slate-400 block mb-1">قازانجی پوختە (Net Profit)</span>
              <div className={`text-xl font-mono font-bold ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {netProfit.toLocaleString()} د.ع
              </div>
              <span className="text-[11px] text-slate-400">ڕێژە لە فرۆش: {netMarginPercent}%</span>
            </div>
          </div>
        </div>

        {/* Currency Converter & Accounting Rules */}
        <div className="lg:col-span-5 space-y-6">
          {/* Multi Currency Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-teal-400" />
              <span>ئاڵوگۆڕی دۆلار و دینار (Multi-Currency)</span>
            </h4>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">نرخی دۆلار بەرامبەر دینار:</label>
                <input
                  type="number"
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">بڕی پارە بە دۆلار ($):</label>
                <input
                  type="number"
                  value={usdAmount}
                  onChange={(e) => setUsdAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                />
              </div>

              <div className="p-3 rounded-lg bg-teal-500/10 border border-teal-500/20 text-center">
                <span className="text-[11px] text-slate-400 block">هاوتایە لە سیستەم بە دیناری عێراقی:</span>
                <span className="text-lg font-bold font-mono text-teal-300">
                  {convertedIqd.toLocaleString()} د.ع
                </span>
              </div>
            </div>
          </div>

          {/* Strict Rules */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>یاسا داراییە زۆر گرنگەکان:</span>
            </h4>

            <div className="space-y-2.5">
              {accountingRules.map((rule, idx) => (
                <div key={idx} className="text-xs border-b border-slate-800/80 pb-2 last:border-none">
                  <strong className="text-amber-300 block mb-0.5">{rule.title}</strong>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{rule.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
