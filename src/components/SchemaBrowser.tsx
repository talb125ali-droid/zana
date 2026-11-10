import React, { useState } from 'react';
import { TABLES_DATA } from '../data/schemaData';
import { TableDef } from '../types/schema';
import { Search, Key, Database, ArrowLeftRight, Check, Copy } from 'lucide-react';

export const SchemaBrowser: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<TableDef>(TABLES_DATA[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copied, setCopied] = useState(false);

  const categories = [
    { id: 'all', label: 'هەموو خشتەکان' },
    { id: 'core', label: 'بنەڕەتی و لقەکان' },
    { id: 'products', label: 'بەرهەم و بارکۆد' },
    { id: 'inventory', label: 'کۆگا و حەواڵە' },
    { id: 'sales', label: 'فرۆشتن و POS' },
    { id: 'finance', label: 'دارایی و قەرز' },
    { id: 'system', label: 'ئاسایش و لۆگ' }
  ];

  const filteredTables = TABLES_DATA.filter((table) => {
    const matchesCategory = selectedCategory === 'all' || table.category === selectedCategory;
    const matchesSearch =
      table.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.nameKu.includes(searchTerm) ||
      table.columns.some((col) => col.name.toLowerCase().includes(searchTerm.toLowerCase()) || col.descriptionKu.includes(searchTerm));
    return matchesCategory && matchesSearch;
  });

  const handleCopyTableName = () => {
    navigator.clipboard.writeText(selectedTable.name);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Sidebar List of Tables */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="گەڕان بەدوای خشتە یان ستوون..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-1.5 pb-1">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  selectedCategory === c.id
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Table List */}
          <div className="space-y-1.5 max-h-[560px] overflow-y-auto pl-1">
            {filteredTables.map((table) => {
              const isSelected = selectedTable.name === table.name;
              return (
                <button
                  key={table.name}
                  onClick={() => setSelectedTable(table)}
                  className={`w-full text-right p-3 rounded-xl transition-all border ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-sm'
                      : 'bg-slate-800/30 border-slate-800/60 hover:bg-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold">{table.name}</span>
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 border border-slate-700">
                      {table.columns.length} ستوون
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{table.nameKu}</div>
                </button>
              );
            })}
            {filteredTables.length === 0 && (
              <div className="text-center py-8 text-xs text-slate-500">
                هیچ خشتەیەک نەدۆزرایەوە بەم ناوە!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Table Inspector */}
      <div className="lg:col-span-8 space-y-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white font-mono">{selectedTable.name}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {selectedTable.categoryKu}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">{selectedTable.nameKu} • {selectedTable.descriptionKu}</p>
            </div>

            <button
              onClick={handleCopyTableName}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-all self-start sm:self-auto"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'کۆپی کرا!' : 'کۆپیکردنی ناو'}</span>
            </button>
          </div>

          {/* Columns Table */}
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">ناوی ستوون</th>
                  <th className="py-2.5 px-3">جۆری داتا (Type)</th>
                  <th className="py-2.5 px-3">کلیلەکان (Keys)</th>
                  <th className="py-2.5 px-3">بەتاڵ (Nullable)</th>
                  <th className="py-2.5 px-3">بەهای بنەڕەتی</th>
                  <th className="py-2.5 px-3">ڕوونکردنەوە بە کوردی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {selectedTable.columns.map((col) => (
                  <tr key={col.name} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-amber-400 flex items-center gap-1.5">
                      {col.isPrimary && <Key className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                      {col.isForeignKey && <ArrowLeftRight className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                      <span>{col.name}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">{col.type}</td>
                    <td className="py-3 px-3">
                      {col.isPrimary && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          PRIMARY
                        </span>
                      )}
                      {col.isForeignKey && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30" title={`بەستراوە بە: ${col.references}`}>
                          FK &rarr; {col.references}
                        </span>
                      )}
                      {!col.isPrimary && !col.isForeignKey && <span className="text-slate-500">-</span>}
                    </td>
                    <td className="py-3 px-3">
                      {col.nullable ? (
                        <span className="text-emerald-400 font-medium">بەڵێ (NULL)</span>
                      ) : (
                        <span className="text-rose-400 font-medium">نەخێر (NOT NULL)</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-400">
                      {col.defaultVal || '-'}
                    </td>
                    <td className="py-3 px-3 text-slate-300 max-w-xs">{col.descriptionKu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Indexes & Performance */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 mb-2">ئیندێکس و ڕێکخستنی خێرایی (Indexes & Constraints):</h4>
            <div className="flex flex-wrap gap-2">
              {selectedTable.indexes.map((idx, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-[11px] font-mono text-slate-300"
                >
                  {idx}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
