import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ArrowLeftRight,
  Plus,
  CheckCircle2,
  Clock,
  Truck,
  Building2,
  X,
  AlertTriangle
} from 'lucide-react';

export const TransfersView: React.FC = () => {
  const {
    branches,
    products,
    transfers,
    createTransfer,
    approveTransfer,
    receiveTransfer,
    activeBranch,
    getProductStock
  } = useStore();

  const [showModal, setShowModal] = useState(false);
  const [sourceBranchId, setSourceBranchId] = useState<number>(activeBranch.id);
  const [destBranchId, setDestBranchId] = useState<number>(activeBranch.id === 1 ? 2 : 1);
  const [selectedProductId, setSelectedProductId] = useState<number>(products[0]?.id || 1);
  const [transferQty, setTransferQty] = useState<number>(5);
  const [notes, setNotes] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (sourceBranchId === destBranchId) {
      alert('نابێت لقی سەرچاوە و لقی وەرگر هەمان لق بن!');
      return;
    }

    const available = getProductStock(selectedProductId, sourceBranchId);
    if (transferQty > available) {
      alert(`بڕی بەردەست لە لقی سەرچاوە تەنها ${available} دانەیە!`);
      return;
    }

    createTransfer(
      sourceBranchId,
      destBranchId,
      [{ productId: selectedProductId, requestedQty: transferQty }],
      notes
    );

    setShowModal(false);
    setNotes('');
  };

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const availableAtSource = selectedProduct ? getProductStock(selectedProduct.id, sourceBranchId) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ArrowLeftRight className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-bold text-white">حەواڵەکردنی کاڵا لە نێوان ٦ لقەکەدا (Stock Transfers)</h3>
          </div>
          <p className="text-xs text-slate-300">
            گواستنەوەی کاڵا بە شێوازی پارێزراو بە ڕەزامەندی لقی نێرەر و تەئکیدکردنەوەی وەرگرتن لە لقی وەرگر.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>داواکاری حەواڵەی نوێ</span>
        </button>
      </div>

      {/* Transfers List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-800/60 border-b border-slate-800 text-slate-300 font-bold">
                <th className="py-3 px-4">ژمارەی حەواڵە</th>
                <th className="py-3 px-4">لقی سەرچاوە (نێرەر)</th>
                <th className="py-3 px-4">لقی مەبەست (وەرگر)</th>
                <th className="py-3 px-4">کاڵاکان و بڕ</th>
                <th className="py-3 px-4">داواکار</th>
                <th className="py-3 px-4">دۆخ</th>
                <th className="py-3 px-4 text-center">ڕێکارەکان</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {transfers.map((tr) => (
                <tr key={tr.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-amber-400">
                    {tr.transferNumber}
                  </td>
                  <td className="py-3 px-4 font-bold text-white">
                    {tr.sourceBranchName}
                  </td>
                  <td className="py-3 px-4 font-bold text-blue-400">
                    {tr.destinationBranchName}
                  </td>
                  <td className="py-3 px-4">
                    {tr.items.map((i, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 font-medium">
                        <span className="text-white">{i.productNameKu}:</span>
                        <span className="font-mono text-amber-400 font-bold">{i.requestedQty} دانە</span>
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-4 text-slate-400">
                    {tr.requesterName}
                  </td>
                  <td className="py-3 px-4">
                    {tr.status === 'pending' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        چاوەڕوانە
                      </span>
                    )}
                    {tr.status === 'dispatched' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 inline-flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        لە ڕێگایە (نێردرا)
                      </span>
                    )}
                    {tr.status === 'received' && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        وەرگیرا
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {tr.status === 'pending' && (
                      <button
                        onClick={() => approveTransfer(tr.id)}
                        className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs shadow-sm transition-all"
                      >
                        پەسەندکردن و ناردن
                      </button>
                    )}
                    {tr.status === 'dispatched' && (
                      <button
                        onClick={() => receiveTransfer(tr.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-sm transition-all"
                      >
                        تەئکیدکردنەوەی گەیشتن
                      </button>
                    )}
                    {tr.status === 'received' && (
                      <span className="text-[11px] text-slate-500 font-medium">تەواوبوو</span>
                    )}
                  </td>
                </tr>
              ))}

              {transfers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-xs text-slate-500">
                    هیچ حەواڵەیەک ئەنجام نەدراوە. کلیک لەسەر "داواکاری حەواڵەی نوێ" بکە!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Transfer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute left-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ArrowLeftRight className="w-5 h-5 text-amber-400" />
              <span>داواکاری گواستنەوەی کاڵا لە نێوان لقەکان</span>
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">لقی سەرچاوە (نێرەر):</label>
                <select
                  value={sourceBranchId}
                  onChange={(e) => setSourceBranchId(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nameKu} ({b.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">لقی مەبەست (وەرگر):</label>
                <select
                  value={destBranchId}
                  onChange={(e) => setDestBranchId(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {branches.filter((b) => b.id !== sourceBranchId).map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nameKu} ({b.city})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">کاڵا بۆ حەواڵەکردن:</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nameKu} (بەردەست لە سەرچاوە: {getProductStock(p.id, sourceBranchId)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="text-slate-300 font-semibold">بڕی داواکراو:</span>
                  <span className="text-slate-400">بەردەست لە لقی نێرەر: {availableAtSource} دانە</span>
                </div>
                <input
                  type="number"
                  min={1}
                  max={availableAtSource}
                  value={transferQty}
                  onChange={(e) => setTransferQty(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">تێبینی یان هۆکار:</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="هۆکاری گواستنەوە بنووسە..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
                >
                  ناردنی داواکاری حەواڵە
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium"
                >
                  پاشگەزبوونەوە
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
