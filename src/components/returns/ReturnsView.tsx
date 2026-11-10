import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ReturnItem, ReturnRecord } from '../../types/store';
import {
  RotateCcw,
  Search,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Printer,
  DollarSign,
  Package,
  Calendar,
  X
} from 'lucide-react';

export const ReturnsView: React.FC = () => {
  const { sales, returns, processReturn, activeBranch } = useStore();

  const [searchInvoice, setSearchInvoice] = useState('');
  const [selectedInvoiceNumber, setSelectedInvoiceNumber] = useState<string | null>(null);
  const [returnItems, setReturnItems] = useState<{ [productId: number]: { qty: number; action: 'restock' | 'dispose' } }>({});
  const [refundMethod, setRefundMethod] = useState<'cash' | 'card' | 'customer_credit' | 'exchange'>('cash');
  const [reason, setReason] = useState('کڕیار پەشیمان بووەوە');
  const [customReason, setCustomReason] = useState('');
  const [activeReceipt, setActiveReceipt] = useState<ReturnRecord | null>(null);

  // Filter sales
  const filteredSales = sales.filter((s) => {
    if (!searchInvoice.trim()) return true;
    const q = searchInvoice.toLowerCase();
    return s.invoiceNumber.toLowerCase().includes(q) || (s.customerName && s.customerName.toLowerCase().includes(q));
  });

  const selectedSale = sales.find((s) => s.invoiceNumber === selectedInvoiceNumber);

  const handleSelectSale = (invNum: string) => {
    setSelectedInvoiceNumber(invNum);
    const sale = sales.find((s) => s.invoiceNumber === invNum);
    if (sale) {
      const initialMap: { [productId: number]: { qty: number; action: 'restock' | 'dispose' } } = {};
      sale.items.forEach((item) => {
        initialMap[item.productId] = { qty: 0, action: 'restock' };
      });
      setReturnItems(initialMap);
    }
  };

  const updateItemReturnQty = (productId: number, maxQty: number, qty: number) => {
    const validQty = Math.max(0, Math.min(qty, maxQty));
    setReturnItems((prev) => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || { action: 'restock' }),
        qty: validQty
      }
    }));
  };

  const updateItemAction = (productId: number, action: 'restock' | 'dispose') => {
    setReturnItems((prev) => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || { qty: 0 }),
        action
      }
    }));
  };

  // Calculate refund totals
  const totalRefund = selectedSale
    ? selectedSale.items.reduce((sum, item) => {
        const rItem = returnItems[item.productId];
        const qty = rItem ? rItem.qty : 0;
        return sum + qty * item.unitPrice;
      }, 0)
    : 0;

  const totalReturnedQty = Object.values(returnItems).reduce((sum, val) => sum + val.qty, 0);

  const handleProcessReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSale || totalReturnedQty === 0) return;

    const itemsToReturn: ReturnItem[] = [];
    selectedSale.items.forEach((item) => {
      const rItem = returnItems[item.productId];
      if (rItem && rItem.qty > 0) {
        itemsToReturn.push({
          productId: item.productId,
          productNameKu: item.productNameKu,
          quantity: rItem.qty,
          unitRefundPrice: item.unitPrice,
          unitCostSnapshot: item.unitCost,
          condition: rItem.action === 'restock' ? 'good' : 'damaged',
          action: rItem.action
        });
      }
    });

    const finalReason = customReason.trim() ? `${reason}: ${customReason}` : reason;

    const res = processReturn({
      saleInvoiceNumber: selectedSale.invoiceNumber,
      items: itemsToReturn,
      refundMethod,
      reason: finalReason
    });

    if (res) {
      setActiveReceipt(res);
      setSelectedInvoiceNumber(null);
      setReturnItems({});
      setCustomReason('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2.5">
            <RotateCcw className="w-6 h-6 text-amber-500" />
            بەشی گەڕاندنەوە و گۆڕینەوەی کاڵا
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            گەڕاندنەوەی فاکتۆری فرۆشتن، گەڕانەوەی ڕاستەوخۆ بۆ کۆگای لقی {activeBranch.nameKu}، و دانەوەی پارەی کڕیار
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Search and Select Sales */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
            <h2 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Search className="w-4 h-4 text-amber-400" />
              گەڕان بەدوای فاکتۆری فرۆشتندا
            </h2>
            <div className="relative">
              <input
                type="text"
                placeholder="ژمارەی فاکتۆر یان ناوی کڕیار بنووسە..."
                value={searchInvoice}
                onChange={(e) => setSearchInvoice(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="mt-3 space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {filteredSales.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  هیچ فاکتۆرێکی فرۆشتن نەدۆزرایەوە
                </div>
              ) : (
                filteredSales.map((sale) => {
                  const isSelected = selectedInvoiceNumber === sale.invoiceNumber;
                  return (
                    <div
                      key={sale.id}
                      onClick={() => handleSelectSale(sale.invoiceNumber)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/50 text-white'
                          : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-amber-400">
                          {sale.invoiceNumber}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(sale.date).toLocaleDateString('ku-IQ')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1 text-xs">
                        <span className="font-bold text-white">{sale.customerName || 'کڕیاری گشتی'}</span>
                        <span className="font-mono font-bold text-emerald-400">
                          {sale.totalAmount.toLocaleString()} د.ع
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                        <span>{sale.items.length} بەرهەم</span>
                        <span>•</span>
                        <span>کاشێر: {sale.cashierName}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right: Return Processing Form */}
        <div className="lg:col-span-7">
          {selectedSale ? (
            <form onSubmit={handleProcessReturn} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-xs text-slate-400">گەڕاندنەوە بۆ فاکتۆری:</span>
                  <h3 className="text-base font-black text-amber-400 font-mono mt-0.5">
                    {selectedSale.invoiceNumber}
                  </h3>
                </div>
                <div className="text-left text-xs">
                  <span className="text-slate-400">کڕیار: </span>
                  <span className="font-bold text-white">{selectedSale.customerName || 'کڕیاری گشتی'}</span>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <label className="text-xs font-bold text-slate-300 mb-2 block">
                  دیاریکردنی کاڵاکانی گەڕاندنەوە:
                </label>
                <div className="space-y-2.5">
                  {selectedSale.items.map((item) => {
                    const rItem = returnItems[item.productId] || { qty: 0, action: 'restock' };
                    return (
                      <div
                        key={item.productId}
                        className={`p-3 rounded-xl border transition-all ${
                          rItem.qty > 0
                            ? 'bg-slate-950 border-amber-500/40'
                            : 'bg-slate-950/60 border-slate-800'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="text-xs font-bold text-white">{item.productNameKu}</div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                              نرخی فرۆشراو: {item.unitPrice.toLocaleString()} د.ع • بڕی فاکتۆر: {item.quantity} دانە
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[11px] text-slate-400">بڕی گەڕاندنەوە:</span>
                              <input
                                type="number"
                                min={0}
                                max={item.quantity}
                                value={rItem.qty}
                                onChange={(e) =>
                                  updateItemReturnQty(
                                    item.productId,
                                    item.quantity,
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-center font-mono text-xs text-white focus:outline-none focus:border-amber-500"
                              />
                            </div>

                            {rItem.qty > 0 && (
                              <select
                                value={rItem.action}
                                onChange={(e) =>
                                  updateItemAction(
                                    item.productId,
                                    e.target.value as 'restock' | 'dispose'
                                  )
                                }
                                className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-200 focus:outline-none"
                              >
                                <option value="restock">گەڕانەوە بۆ کۆگا (ساغ)</option>
                                <option value="dispose">خراپ و سووتاو (لەناوبردن)</option>
                              </select>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Return Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1.5 block">
                    هۆکاری گەڕاندنەوە:
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="کڕیار پەشیمان بووەوە">کڕیار پەشیمان بووەوە</option>
                    <option value="کێشەی سایز و ڕەنگ">کێشەی سایز و ڕەنگ</option>
                    <option value="کاڵای شکاو یان عەیبدار">کاڵای شکاو یان عەیبدار</option>
                    <option value="گۆڕینەوە بە بەرهەمێکی تر">گۆڕینەوە بە بەرهەمێکی تر</option>
                    <option value="هەڵەی کاشێر لە بارکۆد لێدان">هەڵەی کاشێر لە بارکۆد لێدان</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1.5 block">
                    شێوازی دانەوەی پارە:
                  </label>
                  <select
                    value={refundMethod}
                    onChange={(e) =>
                      setRefundMethod(
                        e.target.value as 'cash' | 'card' | 'customer_credit' | 'exchange'
                      )
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="cash">کاش (پارەی نەختینە لە قاسە)</option>
                    <option value="card">کارت (گەڕاندنەوەی بانکی)</option>
                    <option value="customer_credit">باڵانسی هەژماری کڕیار (قەرزی کڕیار)</option>
                    <option value="exchange">گۆڕینەوە (Exchange)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 mb-1.5 block">
                  تێبینی یان ڕوونکردنەوەی زیاتر (ئارەزوومەندانە):
                </label>
                <input
                  type="text"
                  placeholder="هۆکاری ورد یان تێبینی بنووسە..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Total Refund Banner */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-amber-300 font-bold">کۆی گشتی پارەی گەڕاوە:</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    بڕی {totalReturnedQty} کاڵا هەڵبژێردراوە
                  </div>
                </div>
                <div className="text-xl font-black font-mono text-amber-400">
                  {totalRefund.toLocaleString()} د.ع
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={totalReturnedQty === 0}
                className={`w-full py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  totalReturnedQty > 0
                    ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer shadow-lg shadow-amber-500/20'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                تەواوکردن و دەرکردنی پسوولەی گەڕاندنەوە
              </button>
            </form>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
              <Receipt className="w-12 h-12 text-slate-700 mb-3" />
              <div className="text-sm font-bold text-slate-300 mb-1">
                تکایە فاکتۆرێکی فرۆشتن لە لیستەکە هەڵبژێرە
              </div>
              <p className="text-xs text-slate-500 max-w-sm">
                دەتوانی بەدوای ژمارەی فاکتۆر یان ناوی کڕیاردا بگەڕێیت بۆ هەڵبژاردنی ئەو کاڵایانەی کڕیار دەیگەڕێنێتەوە.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* History of Returns */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-black text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-400" />
          مێژووی گەڕاندنەوە و پسوولە دەرکراوەکان ({returns.length})
        </h2>

        {returns.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            هیچ کاڵایەکی گەڕاوە تۆمار نەکراوە
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="pb-3 font-bold">ژمارەی پسوولە</th>
                  <th className="pb-3 font-bold">فاکتۆری سەرەکی</th>
                  <th className="pb-3 font-bold">کڕیار</th>
                  <th className="pb-3 font-bold">هۆکار</th>
                  <th className="pb-3 font-bold">شێوازی پارەدانەوە</th>
                  <th className="pb-3 font-bold">بڕی گەڕاوە</th>
                  <th className="pb-3 font-bold">بەروار</th>
                  <th className="pb-3 font-bold text-center">پسوولە</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {returns.map((ret) => (
                  <tr key={ret.id} className="hover:bg-slate-800/30">
                    <td className="py-3 font-mono font-bold text-amber-400">{ret.returnNumber}</td>
                    <td className="py-3 font-mono text-slate-300">{ret.saleInvoiceNumber}</td>
                    <td className="py-3 font-bold text-white">{ret.customerName || 'کڕیاری گشتی'}</td>
                    <td className="py-3 text-slate-400 max-w-xs truncate">{ret.reason}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                        {ret.refundMethod === 'cash' && 'نەختینە (قاسە)'}
                        {ret.refundMethod === 'card' && 'کارت'}
                        {ret.refundMethod === 'customer_credit' && 'باڵانسی هەژمار'}
                        {ret.refundMethod === 'exchange' && 'گۆڕینەوە'}
                      </span>
                    </td>
                    <td className="py-3 font-mono font-bold text-rose-400">
                      {ret.totalRefundAmount.toLocaleString()} د.ع
                    </td>
                    <td className="py-3 text-slate-400 font-mono text-[11px]">
                      {new Date(ret.date).toLocaleDateString('ku-IQ')}
                    </td>
                    <td className="py-3 text-center">
                      <button
                        onClick={() => setActiveReceipt(ret)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors"
                        title="چاپکردنی پسوولە"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Return Thermal Receipt Modal */}
      {activeReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveReceipt(null)}
              className="absolute top-4 left-4 p-1 rounded-full text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Receipt Content */}
            <div className="text-center border-b border-dashed border-slate-300 pb-4 mb-4">
              <h2 className="text-base font-black">کۆمەڵگەی بازرگانی زانا</h2>
              <div className="text-xs text-slate-600 mt-0.5">پسوولەی گەڕاندنەوەی کاڵا</div>
              <div className="text-[11px] text-slate-500 font-mono mt-1">{activeReceipt.returnNumber}</div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-700 mb-4 border-b border-dashed border-slate-300 pb-3">
              <div className="flex justify-between">
                <span>فاکتۆری سەرەکی:</span>
                <span className="font-mono font-bold">{activeReceipt.saleInvoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>کڕیار:</span>
                <span className="font-bold">{activeReceipt.customerName || 'کڕیاری گشتی'}</span>
              </div>
              <div className="flex justify-between">
                <span>کاشێر:</span>
                <span>{activeReceipt.cashierName}</span>
              </div>
              <div className="flex justify-between">
                <span>بەروار:</span>
                <span className="font-mono">{new Date(activeReceipt.date).toLocaleString('ku-IQ')}</span>
              </div>
              <div className="flex justify-between">
                <span>هۆکار:</span>
                <span>{activeReceipt.reason}</span>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-2 mb-4 border-b border-dashed border-slate-300 pb-3 text-xs">
              {activeReceipt.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div>
                    <div className="font-bold">{item.productNameKu}</div>
                    <div className="text-[10px] text-slate-500">
                      {item.quantity} × {item.unitRefundPrice.toLocaleString()} د.ع
                    </div>
                  </div>
                  <div className="font-mono font-bold">
                    {(item.quantity * item.unitRefundPrice).toLocaleString()} د.ع
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center text-sm font-black mb-6">
              <span>کۆی پارەی گەڕاوە:</span>
              <span className="text-base text-rose-600 font-mono">
                {activeReceipt.totalRefundAmount.toLocaleString()} د.ع
              </span>
            </div>

            <button
              onClick={() => {
                window.print();
                setActiveReceipt(null);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              چاپکردنی پسوولەی گەڕاندنەوە
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
