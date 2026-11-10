import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Wallet,
  Plus,
  DollarSign,
  TrendingDown,
  Lock,
  Unlock,
  AlertCircle,
  X,
  CheckCircle2
} from 'lucide-react';

export const ExpensesCashView: React.FC = () => {
  const { expenses, addExpense, currentShift, openShift, closeShift, activeBranch, currentUser } = useStore();

  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);

  // Expense form
  const [categoryKu, setCategoryKu] = useState('کرێی باڵەخانە');
  const [amount, setAmount] = useState<number>(50000);
  const [description, setDescription] = useState('');

  // Shift form
  const [openingBalance, setOpeningBalance] = useState<number>(100000);
  const [closingCash, setClosingCash] = useState<number>(0);
  const [shiftNotes, setShiftNotes] = useState('');

  const expenseCategories = [
    'کرێی باڵەخانە',
    'مووچەی کارمەندان',
    'کارەبا و موەلیدە',
    'ئینتەرنێت و پەیوەندی',
    'تێچووی گواستنەوە',
    'چاککردنەوە و نۆژەنکردنەوە',
    'کەلوپەلی بەستەبەندی',
    'میوانداری و پاکوخاوێنی',
    'خەرجییە گشتییەکان'
  ];

  const handleRecordExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !description) {
      alert('تکایە بڕی خەرجی و هۆکارەکەی بنووسە!');
      return;
    }

    addExpense(categoryKu, amount, description);
    setShowExpenseModal(false);
    setDescription('');
    setAmount(50000);
  };

  const handleShiftAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentShift && currentShift.isOpen) {
      // Closing shift
      closeShift(closingCash, shiftNotes);
    } else {
      // Opening shift
      openShift(openingBalance);
    }
    setShowShiftModal(false);
  };

  const branchExpenses = expenses.filter((e) => e.branchId === activeBranch.id);
  const totalBranchExpenses = branchExpenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-bold text-white">خەرجییەکان و قاسەی کاشێر ({activeBranch.nameKu})</h3>
          </div>
          <p className="text-xs text-slate-300">
            تۆمارکردنی خەرجییەکانی ڕۆژانە و کۆنترۆڵکردنی شەفتی قاسە و پشکنینی جیاوازی پارە.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (currentShift && currentShift.isOpen) {
                setClosingCash(currentShift.expectedCashIqd);
              }
              setShowShiftModal(true);
            }}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md transition-all ${
              currentShift && currentShift.isOpen
                ? 'bg-rose-500 hover:bg-rose-400 text-white'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
            }`}
          >
            {currentShift && currentShift.isOpen ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            <span>{currentShift && currentShift.isOpen ? 'داخستنی شەفتی قاسە' : 'کردنەوەی شەفتی نوێ'}</span>
          </button>

          <button
            onClick={() => setShowExpenseModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>تۆمارکردنی خەرجی</span>
          </button>
        </div>
      </div>

      {/* Cash Register Shift Status Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <Wallet className="w-4 h-4 text-emerald-400" />
          <span>دۆخی قاسەی کاشێر لە لقی {activeBranch.nameKu}</span>
        </h4>

        {currentShift && currentShift.isOpen ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">کاتی کردنەوە:</span>
              <span className="text-sm font-bold text-white font-mono">{currentShift.openingTime}</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">کاشێر: {currentShift.cashierName}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">پارەی دەستپێک (Opening):</span>
              <span className="text-base font-bold text-amber-400 font-mono">
                {currentShift.openingBalanceIqd.toLocaleString()} د.ع
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
              <span className="text-xs text-slate-400 block mb-1">پارەی چاوەڕوانکراو لە قاسە:</span>
              <span className="text-base font-bold text-emerald-400 font-mono">
                {currentShift.expectedCashIqd.toLocaleString()} د.ع
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block mb-0.5">دۆخی قاسە:</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  شەفت کراوەیە
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 bg-slate-800/20 rounded-xl border border-slate-800/60">
            <p className="text-xs text-slate-400 mb-2">شەفتی قاسە داخراوە لەم کاتەدا.</p>
            <button
              onClick={() => setShowShiftModal(true)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md"
            >
              کردنەوەی شەفت بە پارەی سەرەتایی
            </button>
          </div>
        )}
      </div>

      {/* Expenses History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-rose-400" />
            <h4 className="text-sm font-bold text-white">تۆماری خەرجییەکانی لقی {activeBranch.nameKu}</h4>
          </div>
          <div className="text-xs font-mono text-rose-400 font-bold bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20">
            کۆی خەرجی: {totalBranchExpenses.toLocaleString()} د.ع
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-800/60 border-b border-slate-800 text-slate-300 font-bold">
                <th className="py-3 px-4">هاوپۆل (Category)</th>
                <th className="py-3 px-4">بڕی خەرجی (Amount)</th>
                <th className="py-3 px-4">وەسف و هۆکار</th>
                <th className="py-3 px-4">تۆمارکەر</th>
                <th className="py-3 px-4">بەروار</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {branchExpenses.map((e) => (
                <tr key={e.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300">
                      {e.categoryKu}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-rose-400 text-sm">
                    {e.amount.toLocaleString()} د.ع
                  </td>
                  <td className="py-3 px-4 text-slate-300 max-w-sm">
                    {e.description}
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-medium">
                    {e.recordedBy}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                    {e.date}
                  </td>
                </tr>
              ))}

              {branchExpenses.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-xs text-slate-500">
                    هیچ خەرجییەک لەم لقە تۆمار نەکراوە.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowExpenseModal(false)}
              className="absolute left-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-rose-400" />
              <span>تۆمارکردنی خەرجی نوێ</span>
            </h3>

            <form onSubmit={handleRecordExpense} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">پۆلی خەرجی:</label>
                <select
                  value={categoryKu}
                  onChange={(e) => setCategoryKu(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {expenseCategories.map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">بڕی خەرجی (دینار):</label>
                <input
                  type="number"
                  min={1000}
                  step={1000}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">وەسف و هۆکاری خەرجی:</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="ڕوونکردنەوەی وەسڵ و تێچووەکە بنووسە..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
                >
                  تۆمارکردنی خەرجی
                </button>
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium"
                >
                  داخستن
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shift Open / Close Modal */}
      {showShiftModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowShiftModal(false)}
              className="absolute left-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Wallet className="w-5 h-5 text-amber-400" />
              <span>{currentShift && currentShift.isOpen ? 'داخستنی شەفتی قاسە' : 'کردنەوەی شەفتی نوێ'}</span>
            </h3>

            <form onSubmit={handleShiftAction} className="space-y-4 mt-4">
              {currentShift && currentShift.isOpen ? (
                <>
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-xs space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>پارەی چاوەڕوانکراو لە قاسە:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {currentShift.expectedCashIqd.toLocaleString()} د.ع
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">
                      پارەی فیعلی ژمێردراوی ناو قاسە (دینار):
                    </label>
                    <input
                      type="number"
                      required
                      value={closingCash}
                      onChange={(e) => setClosingCash(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {closingCash !== currentShift.expectedCashIqd && (
                    <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>
                        جیاوازی قاسە: {(closingCash - currentShift.expectedCashIqd).toLocaleString()} د.ع
                      </span>
                    </div>
                  )}

                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">تێبینی کۆتایی شەفت:</label>
                    <input
                      type="text"
                      value={shiftNotes}
                      onChange={(e) => setShiftNotes(e.target.value)}
                      placeholder="تێبینی جیاوازی پارە ئەگەر هەبێت..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs shadow-md"
                  >
                    داخستنی فەرمی شەفت
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-xs text-slate-300 font-semibold block mb-1">
                      پارەی دەستپێکی ناو قاسە (Opening Cash):
                    </label>
                    <input
                      type="number"
                      required
                      value={openingBalance}
                      onChange={(e) => setOpeningBalance(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md"
                  >
                    کردنەوەی شەفتی نوێ
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
