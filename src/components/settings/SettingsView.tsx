import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Settings, DollarSign, Database, Download, RefreshCw, CheckCircle2, Shield } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { exchangeRate, setExchangeRate, showToast } = useStore();

  const [rateInput, setRateInput] = useState<number>(exchangeRate);
  const [companyNameKu, setCompanyNameKu] = useState('کۆمەڵگەی بازرگانی زانا');
  const [companyPhone, setCompanyPhone] = useState('0750 111 2233');
  const [receiptFooter, setReceiptFooter] = useState(
    'سوپاس بۆ سەردانەکەتان - کاڵای فرۆشراو تا ٤٨ کاتژمێر دەگۆڕدرێتەوە بە هەبوونی وەسڵ'
  );

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setExchangeRate(rateInput);
    showToast('ڕێکخستنەکان بە سەرکەوتوویی پاشەکەوت کران!');
  };

  const handleDownloadSql = (fileName: string) => {
    showToast(`داگرتنی پەڕگەی ${fileName}...`);
  };

  const handleResetData = () => {
    if (confirm('ئایا دڵنیایت لە ڕیسێتکردنی داتای سیستەم بۆ دۆخی سەرەتایی؟')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-1">
          <Settings className="w-6 h-6 text-amber-400" />
          <h3 className="text-xl font-bold text-white">ڕێکخستنەکانی سیستەم و باکئەپ (System Settings & SQL)</h3>
        </div>
        <p className="text-xs text-slate-300">
          ڕێکخستنی نرخی ئاڵوگۆڕی دۆلار، زانیاری کۆمپانیا، دەقی پسوولەی کاشێر، و دابەزاندنی پەڕگەی بنکەدراوە بۆ XAMPP.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* General Form */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4 text-amber-400" />
            <span>ڕێکخستنە گشتییەکان</span>
          </h4>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">ناوی کۆمپانیا بە کوردی:</label>
              <input
                type="text"
                value={companyNameKu}
                onChange={(e) => setCompanyNameKu(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">تەلەفۆنی مەرکەزی:</label>
              <input
                type="text"
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">
                نرخی دیاریکراوی ١ دۆلار بە دیناری عێراقی (USD to IQD):
              </label>
              <input
                type="number"
                value={rateInput}
                onChange={(e) => setRateInput(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              />
              <span className="text-[11px] text-slate-500 mt-0.5 block">
                ئەم نرخە بەکاردێت بۆ وەرگرتنی دۆلار لە کاتی فرۆشتن لە کاشێر
              </span>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-semibold block mb-1">دەقی خوارەوەی وەسڵی فرۆشتن (Footer):</label>
              <textarea
                rows={2}
                value={receiptFooter}
                onChange={(e) => setReceiptFooter(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              پاشەکەوتکردنی ڕێکخستنەکان
            </button>
          </form>
        </div>

        {/* Database SQL Export and Maintenance */}
        <div className="lg:col-span-5 space-y-5">
          {/* Backup card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>پەڕگەکانی بنکەدراوەی MySQL</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              دەتوانیت پەڕگەکانی دروستکردنی بنکەدراوە داببەزێنیت و لەسەر سێرڤەری XAMPP یان هەر سێرڤەرێکی MySQL 8.0+ ئەنجامی بدەیت:
            </p>

            <div className="space-y-2">
              <a
                href="/zana_store_complete.zip"
                download="zana_store_complete.zip"
                className="w-full p-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black flex items-center justify-between shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-slate-950" />
                  <span>داگرتنی پاکێجی تەواوی پڕۆژە (ZIP بۆ XAMPP / Hosting)</span>
                </div>
                <span className="text-[10px] bg-slate-950/20 px-2 py-0.5 rounded font-mono">PHP + SQL</span>
              </a>

              <a
                href="/database/schema.sql"
                download="schema.sql"
                className="w-full p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white flex items-center justify-between transition-all"
              >
                <span>دابەزاندنی schema.sql (٣٧ خشتە)</span>
                <Download className="w-4 h-4 text-amber-400" />
              </a>

              <a
                href="/database/seed.sql"
                download="seed.sql"
                className="w-full p-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white flex items-center justify-between transition-all"
              >
                <span>دابەزاندنی seed.sql (٦ لق و ئەدمین)</span>
                <Download className="w-4 h-4 text-amber-400" />
              </a>
            </div>
          </div>

          {/* Reset Demo Data */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-rose-400" />
              <span>ڕیسێتکردنی داتای تاقیکاری</span>
            </h4>
            <p className="text-xs text-slate-400">
              ئەگەر دەتەوێت سەرجەم فرۆشتنەکان و مامەڵەکان بگەڕێنیتەوە بۆ دۆخی سەرەتایی تاقیکردنەوە:
            </p>
            <button
              onClick={handleResetData}
              className="w-full py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/40 text-xs font-bold transition-all"
            >
              ڕیسێتکردنی داتا بۆ دەستپێک
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
