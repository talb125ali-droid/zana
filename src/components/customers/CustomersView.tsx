import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Customer } from '../../types/store';
import {
  Users,
  Plus,
  Search,
  DollarSign,
  Phone,
  MapPin,
  CheckCircle2,
  FileText,
  X,
  CreditCard
} from 'lucide-react';

export const CustomersView: React.FC = () => {
  const { customers, customerTransactions, addCustomer, recordCustomerPayment, activeBranch } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState<Customer | null>(null);
  const [showStatementModal, setShowStatementModal] = useState<Customer | null>(null);

  // New Customer Form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [creditLimit, setCreditLimit] = useState<number>(500000);
  const [notes, setNotes] = useState('');

  // Payment Form
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentNotes, setPaymentNotes] = useState('');

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) {
      alert('تکایە ناوی تەواو و ژمارەی مۆبایل بنووسە!');
      return;
    }

    addCustomer({
      branchId: activeBranch.id,
      fullName,
      phone,
      address,
      creditLimit,
      notes
    });

    setShowAddModal(false);
    setFullName('');
    setPhone('');
    setAddress('');
  };

  const handlePayDebt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showPayModal || paymentAmount <= 0) return;

    recordCustomerPayment(showPayModal.id, paymentAmount, paymentNotes);
    setShowPayModal(null);
    setPaymentAmount(0);
    setPaymentNotes('');
  };

  const filtered = customers.filter(
    (c) =>
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  const totalOutstandingDebt = customers.reduce((sum, c) => sum + c.currentBalance, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-bold text-white">بەڕێوەبردنی کڕیاران و قەرزەکان</h3>
          </div>
          <p className="text-xs text-slate-300">
            تۆمارکردنی کڕیار، چاودێری قەرزی کڕیاران، وەرگرتنی پارەی قەرز، و دەرکردنی کەشفی حیساب.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700">
            <span className="text-[10px] text-slate-400 block">کۆی گشتی قەرزی وەرنەگیراو:</span>
            <span className="text-base font-bold font-mono text-purple-400">
              {totalOutstandingDebt.toLocaleString()} د.ع
            </span>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>تۆمارکردنی کڕیاری نوێ</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="گەڕان بەدوای ناوی کڕیار یان مۆبایل..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Customers List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-800/60 border-b border-slate-800 text-slate-300 font-bold">
                <th className="py-3 px-4">ناوی کڕیار</th>
                <th className="py-3 px-4">مۆبایل و ناونیشان</th>
                <th className="py-3 px-4">ئاستی ڕێگەپێدراوی قەرز</th>
                <th className="py-3 px-4">کۆی قەرز</th>
                <th className="py-3 px-4">کۆی پارەی دراو</th>
                <th className="py-3 px-4">قەرزی ماوە (باڵانس)</th>
                <th className="py-3 px-4 text-center">کردارەکان</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-bold text-white text-sm">
                    {c.fullName}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 font-mono text-slate-300">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{c.phone}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{c.address}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {c.creditLimit.toLocaleString()} د.ع
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {c.totalDebt.toLocaleString()} د.ع
                  </td>
                  <td className="py-3 px-4 font-mono text-emerald-400 font-bold">
                    {c.totalPaid.toLocaleString()} د.ع
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        c.currentBalance > 0
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                          : 'bg-emerald-500/10 text-emerald-400'
                      }`}
                    >
                      {c.currentBalance.toLocaleString()} د.ع
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {c.currentBalance > 0 && (
                        <button
                          onClick={() => {
                            setShowPayModal(c);
                            setPaymentAmount(c.currentBalance);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-sm transition-all"
                        >
                          وەرگرتنی قەرز
                        </button>
                      )}
                      <button
                        onClick={() => setShowStatementModal(c)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-400" />
                        <span>کەشفی حیساب</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute left-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <span>تۆمارکردنی کڕیاری نوێ</span>
            </h3>

            <form onSubmit={handleCreateCustomer} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">ناوی تەواوی کڕیار:</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="بۆ نموونە: دانا کەریم..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">ژمارەی مۆبایل:</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0750 xxx xxxx"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">ناونیشان:</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="شار و گەڕەک..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">ئاستی ڕێگەپێدراوی قەرز (Credit Limit):</label>
                <input
                  type="number"
                  value={creditLimit}
                  onChange={(e) => setCreditLimit(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
                >
                  تۆمارکردنی کڕیار
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium"
                >
                  داخستن
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay Debt Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowPayModal(null)}
              className="absolute left-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <span>وەرگرتنەوەی پارەی قەرز</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              کڕیار: <strong className="text-white">{showPayModal.fullName}</strong>
              <br />
              قەرزی ماوە: <strong className="text-purple-400 font-mono">{showPayModal.currentBalance.toLocaleString()} د.ع</strong>
            </p>

            <form onSubmit={handlePayDebt} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">بڕی پارەی وەرگیراو (دینار):</label>
                <input
                  type="number"
                  min={1}
                  max={showPayModal.currentBalance}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">تێبینی یان ژمارەی پسوولە:</label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="پسوولەی وەرگرتنی کاشێر..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md"
                >
                  تەئکیدکردنەوە و وەرگرتن
                </button>
                <button
                  type="button"
                  onClick={() => setShowPayModal(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium"
                >
                  داخستن
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Statement Modal */}
      {showStatementModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowStatementModal(null)}
              className="absolute left-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-base font-bold text-white">کەشفی حیسابی کڕیار (Account Statement)</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {showStatementModal.fullName} • مۆبایل: {showStatementModal.phone} • قەرزی ئێستا: <strong className="text-purple-400 font-mono">{showStatementModal.currentBalance.toLocaleString()} د.ع</strong>
              </p>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pl-1">
              {customerTransactions
                .filter((tx) => tx.customerId === showStatementModal.id)
                .map((tx) => (
                  <div key={tx.id} className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">
                        {tx.type === 'sale_debt' ? 'قەرزی فاکتۆر' : 'پارەدانی قەرز'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {new Date(tx.date).toLocaleDateString('ckb')} {tx.invoiceNumber && `• ${tx.invoiceNumber}`}
                      </div>
                    </div>
                    <div className="font-mono font-bold text-sm">
                      <span className={tx.type === 'sale_debt' ? 'text-rose-400' : 'text-emerald-400'}>
                        {tx.type === 'sale_debt' ? '+' : '-'}{tx.amount.toLocaleString()} د.ع
                      </span>
                    </div>
                  </div>
                ))}

              {customerTransactions.filter((tx) => tx.customerId === showStatementModal.id).length === 0 && (
                <div className="text-center py-8 text-xs text-slate-500">
                  هیچ مامەڵەیەکی پێشوو تۆمار نەکراوە بۆ ئەم کڕیارە.
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                چاپکردنی کەشفی حیساب
              </button>
              <button
                onClick={() => setShowStatementModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs"
              >
                داخستن
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
