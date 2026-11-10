import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, PaymentMethod, Sale } from '../../types/store';
import {
  Barcode,
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Printer,
  CheckCircle2,
  X,
  CreditCard,
  Banknote,
  Clock,
  Sparkles
} from 'lucide-react';

export const PosView: React.FC = () => {
  const {
    products,
    cart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCogs,
    completeSale,
    activeBranch,
    getProductStock,
    customers,
    currentUser,
    exchangeRate
  } = useStore();

  const [barcodeInput, setBarcodeInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | undefined>(undefined);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<'iqd' | 'percent'>('iqd');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [tenderedCash, setTenderedCash] = useState<number>(0);
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);

  const barcodeInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus barcode input
  useEffect(() => {
    barcodeInputRef.current?.focus();
  }, []);

  const categories = [
    { id: 'all', name: 'هەموو' },
    { id: 1, name: 'جوانکاری و مەیکئەپ' },
    { id: 2, name: 'چاودێری پێست' },
    { id: 3, name: 'بۆن و عەتر' },
    { id: 4, name: 'جلوبەرگ و پۆشاک' },
    { id: 5, name: 'ئێکسسوارات' },
    { id: 6, name: 'جانتا' },
    { id: 7, name: 'ڕازاندنەوەی ماڵ' },
    { id: 8, name: 'گوڵی دەستکرد' },
    { id: 9, name: 'ئەساس و کەلوپەل' },
    { id: 10, name: 'قوماش و پەرۆ' }
  ];

  // Barcode scanner handler (USB barcode scanners send Enter at end)
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcodeInput.trim()) return;

    const matched = products.find(
      (p) => p.barcode === barcodeInput.trim() || p.code.toLowerCase() === barcodeInput.trim().toLowerCase()
    );

    if (matched) {
      addToCart(matched, 1);
      setBarcodeInput('');
    } else {
      alert(`کاڵایەک نەدۆزرایەوە بە بارکۆدی: ${barcodeInput}`);
      setBarcodeInput('');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchesSearch =
      p.nameKu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode.includes(searchTerm) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const effectiveDiscount = discountType === 'percent'
    ? Math.round((cartTotal * Math.min(100, discountAmount)) / 100)
    : Math.min(cartTotal, discountAmount);

  const finalTotal = Math.max(0, cartTotal - effectiveDiscount);
  const finalTotalUsd = (finalTotal / (exchangeRate || 1530)).toFixed(2);
  const changeAmount = Math.max(0, tenderedCash - finalTotal);

  const handleCompleteSale = () => {
    if (cart.length === 0) return;

    const sale = completeSale({
      customerId: selectedCustomerId,
      discount: effectiveDiscount,
      paymentMethod,
      paidAmount: paymentMethod === 'debt' ? 0 : paymentMethod === 'cash' ? Math.min(finalTotal, tenderedCash || finalTotal) : finalTotal,
      currency: 'IQD'
    });

    if (sale) {
      setCompletedSale(sale);
      setShowReceiptModal(true);
      setDiscountAmount(0);
      setTenderedCash(0);
      setSelectedCustomerId(undefined);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Barcode Fast Scanner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">خاڵی فرۆشتن (POS) - {activeBranch.nameKu}</h2>
            <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
              کاشێر: {currentUser.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            سکانکردنی بارکۆد، گەڕان بەدوای بەرهەم، دیاریکردنی کڕیار و دەرکردنی فاکتۆر
          </p>
        </div>

        {/* Barcode input form */}
        <form onSubmit={handleBarcodeSubmit} className="flex items-center gap-2 max-w-md w-full">
          <div className="relative flex-1">
            <Barcode className="w-5 h-5 absolute right-3 top-2.5 text-amber-400" />
            <input
              ref={barcodeInputRef}
              type="text"
              placeholder="سکانکەر یان بارکۆد لێرە بنووسە و Enter داگرە..."
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              className="w-full bg-slate-800 border-2 border-amber-500/40 rounded-xl pr-10 pl-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 font-mono shadow-inner"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shrink-0"
          >
            سکان
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Product Catalog & Search */}
        <div className="lg:col-span-8 space-y-4">
          {/* Category Filter and Search */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="گەڕان بەدوای بەرهەم، کۆد یان بارکۆد..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                    selectedCategory === c.id
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5 max-h-[620px] overflow-y-auto pl-1">
            {filteredProducts.map((p) => {
              const stock = getProductStock(p.id, activeBranch.id);
              const inStock = stock > 0;
              return (
                <div
                  key={p.id}
                  onClick={() => inStock && addToCart(p, 1)}
                  className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between cursor-pointer ${
                    inStock
                      ? 'bg-slate-900 border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 hover:shadow-lg'
                      : 'bg-slate-900/40 border-slate-800/40 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                        {p.code}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          stock <= p.minStockAlert
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {stock} دانە لە کۆگا
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white line-clamp-2 mb-1">{p.nameKu}</h4>
                    <span className="text-[11px] text-slate-400 block mb-2">{p.brandNameKu}</span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-black font-mono text-amber-400">
                        {p.sellingPrice.toLocaleString()} د.ع
                      </div>
                      <div className="text-[9px] text-slate-500 font-mono">{p.barcode}</div>
                    </div>
                    <button
                      disabled={!inStock}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (inStock) addToCart(p, 1);
                      }}
                      className="p-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold transition-all shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Shopping Cart & Checkout */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">سەبەتەی کڕین ({cart.length})</h3>
              </div>
              {cart.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-400 hover:text-rose-300 font-medium"
                >
                  سڕینەوەی هەموو
                </button>
              )}
            </div>

            {/* Customer Picker */}
            <div className="mb-4">
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">کڕیار:</label>
              <select
                value={selectedCustomerId || ''}
                onChange={(e) => setSelectedCustomerId(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="">کڕیاری گشتی (نەقد - بێناونیشان)</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.fullName} - {c.phone} {c.currentBalance > 0 ? `(قەرز: ${c.currentBalance.toLocaleString()} د.ع)` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Cart Items List */}
            <div className="space-y-2.5 max-h-[260px] overflow-y-auto pl-1 mb-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-800 flex items-center justify-between gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-white truncate">{item.product.nameKu}</h5>
                    <div className="text-[11px] font-mono text-amber-400">
                      {item.unitPrice.toLocaleString()} د.ع
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 rounded bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono text-xs font-bold px-1.5">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 rounded bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-xs font-bold font-mono text-white text-left min-w-[65px]">
                    {item.total.toLocaleString()} د.ع
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {cart.length === 0 && (
                <div className="text-center py-10 text-xs text-slate-500">
                  سەبەتە بەتاڵە! کلیک لەسەر بەرهەمەکان بکە یان بارکۆد سکان بکە.
                </div>
              )}
            </div>
          </div>

          {/* Checkout Controls */}
          <div className="pt-3 border-t border-slate-800 space-y-3">
            {/* Discount & Calculation */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>کۆی سەرەتایی:</span>
              <span className="font-mono text-white">{cartTotal.toLocaleString()} د.ع</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">داشکاندن:</span>
                <div className="flex rounded-lg overflow-hidden border border-slate-700 text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setDiscountType('iqd')}
                    className={`px-1.5 py-0.5 ${discountType === 'iqd' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
                  >
                    د.ع
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscountType('percent')}
                    className={`px-1.5 py-0.5 ${discountType === 'percent' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}
                  >
                    %
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={discountAmount || ''}
                  placeholder="0"
                  max={discountType === 'percent' ? 100 : cartTotal}
                  onChange={(e) => setDiscountAmount(Math.max(0, Number(e.target.value)))}
                  className="w-20 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono text-left focus:outline-none focus:border-amber-500"
                />
                {discountType === 'percent' && discountAmount > 0 && (
                  <span className="text-[10px] text-amber-400 font-mono">
                    (-{effectiveDiscount.toLocaleString()} د.ع)
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm font-bold pt-1 border-t border-slate-800/80">
              <div>
                <span className="text-amber-400 block">کۆی گشتی فاکتۆر:</span>
                <span className="text-[10px] text-slate-400 font-mono">نرخی دۆلار: 1$ = {exchangeRate} د.ع</span>
              </div>
              <div className="text-left">
                <span className="text-lg font-mono text-amber-400 block">{finalTotal.toLocaleString()} د.ع</span>
                <span className="text-xs font-mono text-slate-400">≈ ${finalTotalUsd} USD</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'cash'
                    ? 'bg-emerald-500 text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <Banknote className="w-4 h-4" />
                <span>نەقد</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>کارت</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!selectedCustomerId) {
                    alert('بۆ فرۆشتن بە قەرز، دەبێت کڕیارێک دیاری بکەیت!');
                    return;
                  }
                  setPaymentMethod('debt');
                }}
                className={`py-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  paymentMethod === 'debt'
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>قەرز</span>
              </button>
            </div>

            {/* Cash Tendered Calculator (If Cash) */}
            {paymentMethod === 'cash' && cart.length > 0 && (
              <div className="space-y-1.5 bg-slate-800/40 p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">پارەی دراو لە کڕیار:</span>
                  <input
                    type="number"
                    value={tenderedCash || ''}
                    placeholder={finalTotal.toString()}
                    onChange={(e) => setTenderedCash(Number(e.target.value))}
                    className="w-28 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white font-mono text-left"
                  />
                </div>
                {tenderedCash > finalTotal && (
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                    <span>پارەی گەڕاوە (Change):</span>
                    <span className="font-mono">{changeAmount.toLocaleString()} د.ع</span>
                  </div>
                )}
              </div>
            )}

            {/* Checkout Action Button */}
            <button
              disabled={cart.length === 0}
              onClick={handleCompleteSale}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 text-sm font-black shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>تەواوکردنی فرۆشتن و دەرکردنی پسوولە</span>
            </button>
          </div>
        </div>
      </div>

      {/* Printable Thermal Receipt Modal */}
      {showReceiptModal && completedSale && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowReceiptModal(false)}
              className="absolute left-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Thermal Receipt Paper Layout */}
            <div id="thermal-receipt" className="bg-white text-slate-950 p-5 rounded-lg font-mono text-xs space-y-3">
              <div className="text-center pb-2 border-b border-dashed border-slate-400">
                <div className="text-base font-black tracking-wider">کۆگاکانی زانا</div>
                <div className="text-[11px] font-bold">{activeBranch.nameKu}</div>
                <div className="text-[10px] text-slate-600">{activeBranch.address}</div>
                <div className="text-[10px] text-slate-600">تەلەفۆن: {activeBranch.phone}</div>
              </div>

              <div className="space-y-1 text-[11px] pb-2 border-b border-dashed border-slate-400">
                <div className="flex justify-between">
                  <span>ژمارەی فاکتۆر:</span>
                  <span className="font-bold">{completedSale.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>بەروار:</span>
                  <span>{new Date(completedSale.date).toLocaleDateString('ckb')}</span>
                </div>
                <div className="flex justify-between">
                  <span>کاشێر:</span>
                  <span>{completedSale.cashierName}</span>
                </div>
                <div className="flex justify-between">
                  <span>کڕیار:</span>
                  <span>{completedSale.customerName}</span>
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-1.5 pb-2 border-b border-dashed border-slate-400 text-[11px]">
                {completedSale.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start">
                    <div className="flex-1">
                      <div>{item.productNameKu}</div>
                      <div className="text-[10px] text-slate-500">
                        {item.quantity} × {item.unitPrice.toLocaleString()} د.ع
                      </div>
                    </div>
                    <span className="font-bold">{item.totalPrice.toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Financial Summary */}
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>کۆی سەرەتایی:</span>
                  <span>{completedSale.subtotal.toLocaleString()} د.ع</span>
                </div>
                {completedSale.discount > 0 && (
                  <div className="flex justify-between text-rose-600 font-bold">
                    <span>داشکاندن:</span>
                    <span>-{completedSale.discount.toLocaleString()} د.ع</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black pt-1 border-t border-slate-300">
                  <span>کۆی گشتی:</span>
                  <span>{completedSale.totalAmount.toLocaleString()} د.ع</span>
                </div>
                <div className="flex justify-between">
                  <span>شێوازی پارەدان:</span>
                  <span className="font-bold">
                    {completedSale.paymentMethod === 'cash' ? 'نەقد' : completedSale.paymentMethod === 'card' ? 'کارت' : 'قەرز'}
                  </span>
                </div>
                {completedSale.remainingDebt > 0 && (
                  <div className="flex justify-between text-purple-700 font-bold">
                    <span>قەرزی ماوە:</span>
                    <span>{completedSale.remainingDebt.toLocaleString()} د.ع</span>
                  </div>
                )}
              </div>

              <div className="text-center pt-3 border-t border-dashed border-slate-400 text-[10px] text-slate-600 space-y-1">
                <div className="font-bold">سوپاس بۆ سەردانەکەتان بۆ کۆگاکانی زانا</div>
                <div>کاڵای فرۆشراو تا ٤٨ کاتژمێر دەگۆڕدرێتەوە بە هەبوونی وەسڵ</div>
                <div className="font-mono pt-1 text-[9px] tracking-widest text-slate-400">
                  * {completedSale.invoiceNumber} *
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={handlePrint}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>چاپکردنی وەسڵ (Print)</span>
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs"
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
