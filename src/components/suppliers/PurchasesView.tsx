import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Truck, Plus, PackageCheck, DollarSign, Search, X, CheckCircle2 } from 'lucide-react';

export const PurchasesView: React.FC = () => {
  const { suppliers, products, purchases, addPurchase, activeBranch, getProductStock } = useStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<number>(suppliers[0]?.id || 1);
  const [selectedProductId, setSelectedProductId] = useState<number>(products[0]?.id || 1);
  const [quantity, setQuantity] = useState<number>(10);
  const [purchaseCost, setPurchaseCost] = useState<number>(15000);
  const [paidAmount, setPaidAmount] = useState<number>(150000);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  // Auto-update purchase cost when product changes
  const handleProductChange = (prodId: number) => {
    setSelectedProductId(prodId);
    const prod = products.find((p) => p.id === prodId);
    if (prod) {
      setPurchaseCost(prod.purchasePrice);
      setPaidAmount(quantity * prod.purchasePrice);
    }
  };

  const totalCost = quantity * purchaseCost;

  const handleCreatePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0 || purchaseCost <= 0) return;

    addPurchase(
      selectedSupplierId,
      [
        {
          productId: selectedProductId,
          quantity,
          purchaseCost
        }
      ],
      paidAmount
    );

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Truck className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-bold text-white">کڕین و دابینکەران (Purchases & Suppliers)</h3>
          </div>
          <p className="text-xs text-slate-300">
            تۆمارکردنی کڕینی کاڵا لە دابینکەران؛ پاش تەئکیدکردنەوە بڕی کاڵاکان ڕاستەوخۆ دەچێتە کۆگای لقی {activeBranch.nameKu}.
          </p>
        </div>

        <button
          onClick={() => {
            if (selectedProduct) {
              setPurchaseCost(selectedProduct.purchasePrice);
              setPaidAmount(quantity * selectedProduct.purchasePrice);
            }
            setShowAddModal(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>تۆمارکردنی فاکتۆری کڕینی نوێ</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Suppliers List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-400" />
              <span>دابینکەرە تۆمارکراوەکان ({suppliers.length})</span>
            </h4>

            <div className="space-y-2.5">
              {suppliers.map((s) => (
                <div key={s.id} className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{s.name}</span>
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-amber-400 font-mono">
                      #{s.id}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">کەسی پەیوەندیدار: {s.contactPerson}</div>
                  <div className="text-[11px] font-mono text-slate-400">مۆبایل: {s.phone}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Purchases Invoices History */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-emerald-400" />
              <span>مێژووی فاکتۆرەکانی کڕین</span>
            </h4>
            <span className="text-xs text-slate-400 font-mono">Total Invoices: {purchases.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="bg-slate-800/60 border-b border-slate-800 text-slate-300 font-bold">
                  <th className="py-3 px-4">ژمارەی فاکتۆر</th>
                  <th className="py-3 px-4">دابینکەر</th>
                  <th className="py-3 px-4">کاڵاکان</th>
                  <th className="py-3 px-4">کۆی کڕین</th>
                  <th className="py-3 px-4">پارەی دراو</th>
                  <th className="py-3 px-4">قەرزی ماوە</th>
                  <th className="py-3 px-4">بەروار</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {purchases.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      {p.invoiceNumber}
                    </td>
                    <td className="py-3 px-4 font-bold text-white">
                      {p.supplierName}
                    </td>
                    <td className="py-3 px-4">
                      {p.items.map((i, idx) => (
                        <div key={idx} className="text-slate-300">
                          {i.productNameKu} ({i.quantity} دانە × {i.purchaseCost.toLocaleString()} د.ع)
                        </div>
                      ))}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-white">
                      {p.totalAmount.toLocaleString()} د.ع
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-400 font-bold">
                      {p.paidAmount.toLocaleString()} د.ع
                    </td>
                    <td className="py-3 px-4 font-mono text-rose-400">
                      {p.remainingDebt > 0 ? `${p.remainingDebt.toLocaleString()} د.ع` : '٠'}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(p.date).toLocaleDateString('ckb')}
                    </td>
                  </tr>
                ))}

                {purchases.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-xs text-slate-500">
                      هیچ فاکتۆری کڕین تۆمار نەکراوە.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* New Purchase Modal */}
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
              <Plus className="w-5 h-5 text-amber-400" />
              <span>تۆمارکردنی کڕین و زیادکردن بۆ کۆگا</span>
            </h3>

            <form onSubmit={handleCreatePurchase} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">دابینکەر (Supplier):</label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">بەرهەم بۆ کڕین:</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => handleProductChange(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nameKu} (کۆگای ئێستا: {getProductStock(p.id, activeBranch.id)} دانە)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">بڕی کڕین (دانە):</label>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => {
                      const q = Math.max(1, Number(e.target.value));
                      setQuantity(q);
                      setPaidAmount(q * purchaseCost);
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">نرخی کڕینی دانە (دینار):</label>
                  <input
                    type="number"
                    value={purchaseCost}
                    onChange={(e) => {
                      const cost = Number(e.target.value);
                      setPurchaseCost(cost);
                      setPaidAmount(quantity * cost);
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 space-y-1 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>کۆی گشتی فاکتۆری کڕین:</span>
                  <span className="font-mono font-bold text-amber-400">{totalCost.toLocaleString()} د.ع</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">بڕی پارەی دراو بە دابینکەر (نەقد):</label>
                <input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
                >
                  تەئکیدکردنەوە و زیادکردنی کۆگا
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
    </div>
  );
};
