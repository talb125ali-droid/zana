import React, { useState } from 'react';
import { PERMISSIONS_DATA } from '../data/schemaData';
import { ShieldCheck, Check, X, Search, Filter } from 'lucide-react';

export const RbacMatrix: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModule, setSelectedModule] = useState('all');

  const modules = [
    { id: 'all', label: 'هەموو مۆدیوڵەکان' },
    { id: 'branches', label: 'لقەکان (Branches)' },
    { id: 'users', label: 'کارمەندان (Users)' },
    { id: 'products', label: 'بەرهەم و بارکۆد' },
    { id: 'pos', label: 'خاڵی فرۆشتن (POS)' },
    { id: 'inventory', label: 'کۆگا و حەواڵە' },
    { id: 'customers', label: 'کڕیاران و قەرز' },
    { id: 'expenses', label: 'خەرجی و قاسە' },
    { id: 'reports', label: 'ڕاپۆرتە داراییەکان' },
    { id: 'settings', label: 'ڕێکخستن و باکئەپ' }
  ];

  const filteredPermissions = PERMISSIONS_DATA.filter((p) => {
    const matchesModule = selectedModule === 'all' || p.module === selectedModule;
    const matchesSearch =
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nameKu.includes(searchTerm);
    return matchesModule && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <h3 className="text-xl font-bold text-white">ماتریسی دەسەڵاتەکان و ڕۆڵەکان (RBAC System)</h3>
            </div>
            <p className="text-xs text-slate-300">
              چوار ڕۆڵی بنەڕەتی لەگەڵ ٤٧ دەسەڵاتی جیاواز کە بە تەواوی لە خشتەکانی `roles`، `permissions` و `role_permissions` جێگیر کراون.
            </p>
          </div>
          <div className="text-xs font-mono bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300">
            Role Count: 4 • Permissions: 47
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="گەڕان بەدوای کۆدی دەسەڵات یان ناو..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {modules.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedModule(m.id)}
              className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                selectedModule === m.id
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* RBAC Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-slate-800/60 border-b border-slate-800 text-slate-300 font-bold">
                <th className="py-3 px-4">کۆدی دەسەڵات (Code)</th>
                <th className="py-3 px-4">ناوی دەسەڵات بە کوردی</th>
                <th className="py-3 px-4 text-center">
                  <div className="font-bold text-amber-400">بەڕێوەبەری گشتی</div>
                  <div className="text-[10px] text-slate-400 font-mono">Super Admin</div>
                </th>
                <th className="py-3 px-4 text-center">
                  <div className="font-bold text-blue-400">بەڕێوەبەری لق</div>
                  <div className="text-[10px] text-slate-400 font-mono">Branch Manager</div>
                </th>
                <th className="py-3 px-4 text-center">
                  <div className="font-bold text-emerald-400">کاشێر</div>
                  <div className="text-[10px] text-slate-400 font-mono">Cashier</div>
                </th>
                <th className="py-3 px-4 text-center">
                  <div className="font-bold text-purple-400">کارمەندی کۆگا</div>
                  <div className="text-[10px] text-slate-400 font-mono">Inventory Staff</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPermissions.map((perm) => (
                <tr key={perm.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-400 font-medium">
                    {perm.code}
                  </td>
                  <td className="py-3 px-4 text-white font-medium">
                    {perm.nameKu}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400">
                      <Check className="w-4 h-4" />
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {perm.branchManager ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400">
                        <Check className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-slate-600">
                        <X className="w-4 h-4" />
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {perm.cashier ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400">
                        <Check className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-slate-600">
                        <X className="w-4 h-4" />
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {perm.inventoryStaff ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400">
                        <Check className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 text-slate-600">
                        <X className="w-4 h-4" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
