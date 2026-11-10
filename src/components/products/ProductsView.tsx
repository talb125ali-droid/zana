import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types/store';
import {
  Package,
  Plus,
  Search,
  Barcode,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Printer,
  Sparkles
} from 'lucide-react';

export const ProductsView: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, getProductStock, activeBranch, branches } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showBarcodeModal, setShowBarcodeModal] = useState<Product | null>(null);

  // Form states
  const [nameKu, setNameKu] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [brandNameKu, setBrandNameKu] = useState('');
  const [code, setCode] = useState('');
  const [barcode, setBarcode] = useState('');
  const [purchasePrice, setPurchasePrice] = useState<number>(10000);
  const [sellingPrice, setSellingPrice] = useState<number>(18000);
  const [wholesalePrice, setWholesalePrice] = useState<number>(15000);
  const [minStockAlert, setMinStockAlert] = useState<number>(5);
  const [unit, setUnit] = useState('دانە');

  const categories = [
    { id: 'all', name: 'هەموو' },
    { id: '1', name: 'جوانکاری و مەیکئەپ' },
    { id: '2', name: 'چاودێری پێست' },
    { id: '3', name: 'بۆن و عەتر' },
    { id: '4', name: 'جلوبەرگ و پۆشاک' },
    { id: '5', name: 'ئێکسسوارات' },
    { id: '6', name: 'جانتا' },
    { id: '7', name: 'ڕازاندنەوەی ماڵ' },
    { id: '8', name: 'گوڵی دەستکرد' },
    { id: '9', name: 'ئەساس و کەلوپەل' },
    { id: '10', name: 'قوماش و پەرۆ' }
  ];

  const handleGenerateBarcode = () => {
    const randomBarcode = '869' + Math.floor(100000000 + Math.random() * 900000000).toString();
    setBarcode(randomBarcode);
  };

  const handleOpenAdd = () => {
    setNameKu('');
    setNameEn('');
    setBrandNameKu('');
    setCode('PRD-' + Math.floor(100 + Math.random() * 900));
    handleGenerateBarcode();
    setPurchasePrice(10000);
    setSellingPrice(18000);
    setWholesalePrice(15000);
    setMinStockAlert(5);
    setUnit('دانە');
    setEditingProduct(null);
    setShowAddModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameKu || !barcode || !code) {
      alert('تکایە ناوی بەرهەم، کۆد و بارکۆد بە دروستی پڕبکەرەوە!');
      return;
    }

    const catName = categories.find((c) => c.id === categoryId.toString())?.name || 'گشتی';

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        nameKu,
        nameEn,
        categoryId,
        categoryNameKu: catName,
        brandNameKu,
        code,
        barcode,
        purchasePrice,
        sellingPrice,
        wholesalePrice,
        minStockAlert,
        unit
      });
    } else {
      addProduct({
        nameKu,
        nameEn,
        categoryId,
        categoryNameKu: catName,
        brandNameKu: brandNameKu || 'براندی زانا',
        code,
        barcode,
        purchasePrice,
        sellingPrice,
        wholesalePrice,
        minStockAlert,
        unit
      });
    }

    setShowAddModal(false);
  };

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setNameKu(p.nameKu);
    setNameEn(p.nameEn || '');
    setCategoryId(p.categoryId);
    setBrandNameKu(p.brandNameKu);
    setCode(p.code);
    setBarcode(p.barcode);
    setPurchasePrice(p.purchasePrice);
    setSellingPrice(p.sellingPrice);
    setWholesalePrice(p.wholesalePrice);
    setMinStockAlert(p.minStockAlert);
    setUnit(p.unit);
    setShowAddModal(true);
  };

  const filtered = products.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.categoryId.toString() === selectedCategory;
    const matchesSearch =
      p.nameKu.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode.includes(searchTerm) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-bold text-white">بەڕێوەبردنی بەرهەمەکان و بارکۆد</h3>
          </div>
          <p className="text-xs text-slate-300">
            تۆمارکردن، دەستکاریکردن، بەرهەمهێنانی بارکۆد و بینینی بڕی کۆگا لە سەرجەم لقەکان.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>تۆمارکردنی بەرهەمی نوێ</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="گەڕان بەدوای ناوی بەرهەم، کۆد، بارکۆد..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
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

      {/* Products Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-800/60 border-b border-slate-800 text-slate-300 font-bold">
                <th className="py-3 px-4">کۆد و بارکۆد</th>
                <th className="py-3 px-4">ناوی بەرهەم</th>
                <th className="py-3 px-4">پۆل و براند</th>
                <th className="py-3 px-4">نرخی کڕین (تێچوو)</th>
                <th className="py-3 px-4">نرخی فرۆشتن</th>
                <th className="py-3 px-4">قازانجی دانە</th>
                <th className="py-3 px-4">کۆگا ({activeBranch.nameKu})</th>
                <th className="py-3 px-4 text-center">کردارەکان</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((p) => {
                const stock = getProductStock(p.id, activeBranch.id);
                const profitPerUnit = p.sellingPrice - p.purchasePrice;
                const profitPercent = ((profitPerUnit / p.sellingPrice) * 100).toFixed(0);

                return (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-mono">
                      <div className="text-amber-400 font-bold">{p.code}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Barcode className="w-3 h-3 text-slate-500" />
                        <span>{p.barcode}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">{p.nameKu}</div>
                      {p.nameEn && <div className="text-[10px] text-slate-400 font-mono">{p.nameEn}</div>}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] bg-slate-800 border border-slate-700 text-slate-300 inline-block mb-1">
                        {p.categoryNameKu}
                      </span>
                      <div className="text-[11px] text-slate-400">{p.brandNameKu}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {p.purchasePrice.toLocaleString()} د.ع
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400 text-sm">
                      {p.sellingPrice.toLocaleString()} د.ع
                    </td>
                    <td className="py-3 px-4 font-mono text-xs">
                      <div className="text-amber-300 font-semibold">+{profitPerUnit.toLocaleString()} د.ع</div>
                      <div className="text-[10px] text-slate-400 font-bold">({profitPercent}% قازانج)</div>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                          stock <= p.minStockAlert
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}
                      >
                        {stock} {p.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setShowBarcodeModal(p)}
                          title="چاپکردنی لێبڵی بارکۆد"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-all"
                        >
                          <Barcode className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleEdit(p)}
                          title="دەستکاریکردن"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`دڵنیایت لە سڕینەوەی ${p.nameKu}؟`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          title="سڕینەوە"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute left-4 top-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-amber-400" />
              <span>{editingProduct ? 'دەستکاریکردنی بەرهەم' : 'تۆمارکردنی بەرهەمی نوێ'}</span>
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs text-slate-300 font-semibold block mb-1">ناوی بەرهەم بە کوردی:</label>
                  <input
                    type="text"
                    required
                    value={nameKu}
                    onChange={(e) => setNameKu(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    placeholder="بۆ نموونە: سوراوی مات هودا بیوتی..."
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">پۆلی بەرهەم:</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {categories.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">براند / مارکە:</label>
                  <input
                    type="text"
                    value={brandNameKu}
                    onChange={(e) => setBrandNameKu(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    placeholder="شانێل، دیۆر، ماک..."
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">کۆدی بەرهەم (SKU):</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs text-slate-300 font-semibold">بارکۆد:</label>
                    <button
                      type="button"
                      onClick={handleGenerateBarcode}
                      className="text-[10px] text-amber-400 hover:text-amber-300 font-bold"
                    >
                      دروستکردنی بارکۆد
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">نرخی کڕین (دینار):</label>
                  <input
                    type="number"
                    required
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">نرخی فرۆشتنی تاک (دینار):</label>
                  <input
                    type="number"
                    required
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
                >
                  {editingProduct ? 'پاشەکەوتکردنی دەستکاری' : 'زیادکردنی بەرهەم'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium"
                >
                  پاشگەزبوونەوە
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barcode Label Modal */}
      {showBarcodeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xs w-full p-5 text-center relative shadow-2xl">
            <button
              onClick={() => setShowBarcodeModal(null)}
              className="absolute left-3 top-3 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="text-sm font-bold text-white mb-4">لێبڵی بارکۆدی ستاندارد</h4>

            {/* Printable Label Box */}
            <div className="bg-white text-slate-950 p-4 rounded-xl font-mono border-2 border-dashed border-slate-300 space-y-2">
              <div className="text-[10px] font-black uppercase tracking-wider">کۆگاکانی زانا - ZANA</div>
              <div className="text-xs font-bold truncate">{showBarcodeModal.nameKu}</div>
              
              {/* Barcode graphic emulation */}
              <div className="py-2 flex justify-center items-center">
                <div className="h-12 bg-slate-950 w-48 flex items-center justify-around px-2">
                  <div className="h-full w-1 bg-white"></div>
                  <div className="h-full w-2 bg-white"></div>
                  <div className="h-full w-0.5 bg-white"></div>
                  <div className="h-full w-3 bg-white"></div>
                  <div className="h-full w-1.5 bg-white"></div>
                  <div className="h-full w-1 bg-white"></div>
                  <div className="h-full w-2 bg-white"></div>
                </div>
              </div>

              <div className="text-xs font-bold font-mono tracking-widest">{showBarcodeModal.barcode}</div>
              <div className="text-sm font-black pt-1 border-t border-slate-200">
                {showBarcodeModal.sellingPrice.toLocaleString()} د.ع
              </div>
            </div>

            <button
              onClick={() => window.print()}
              className="mt-4 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>چاپکردنی لێبڵ (Print Label)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
