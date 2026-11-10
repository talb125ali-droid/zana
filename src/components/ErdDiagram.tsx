import React, { useState } from 'react';
import { GitBranch, Layers, ArrowLeft, ArrowDown } from 'lucide-react';

interface EntityCard {
  id: string;
  name: string;
  nameKu: string;
  badge: string;
  color: string;
  fields: { name: string; type: string; isKey?: boolean; isFk?: boolean }[];
  relationsTo: { target: string; label: string; cardinality: string }[];
}

export const ErdDiagram: React.FC = () => {
  const [selectedEntity, setSelectedEntity] = useState<string>('branches');

  const entities: EntityCard[] = [
    {
      id: 'branches',
      name: 'branches',
      nameKu: 'خشتەی لقەکان (٦ لق)',
      badge: 'Core Entity',
      color: 'border-blue-500/40 bg-blue-950/20 text-blue-400',
      fields: [
        { name: 'id', type: 'INT PK', isKey: true },
        { name: 'code', type: 'VARCHAR(20)' },
        { name: 'name_ku', type: 'VARCHAR(150)' },
        { name: 'manager_id', type: 'INT FK', isFk: true },
        { name: 'is_active', type: 'TINYINT' }
      ],
      relationsTo: [
        { target: 'branch_inventory', label: 'خاوەنی کۆگای تایبەت بەخۆیەتی', cardinality: '1 : N' },
        { target: 'sales', label: 'فرۆشتنی سەربەخۆ تۆمار دەکات', cardinality: '1 : N' },
        { target: 'users', label: 'کارمەندانی لێ کاردەکەن', cardinality: '1 : N' },
        { target: 'stock_transfers', label: 'سەرچاوە و مەبەستی حەواڵەی کاڵایە', cardinality: '1 : N' }
      ]
    },
    {
      id: 'users',
      name: 'users',
      nameKu: 'بەکارهێنەران و کارمەندان',
      badge: 'Auth & RBAC',
      color: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400',
      fields: [
        { name: 'id', type: 'INT PK', isKey: true },
        { name: 'branch_id', type: 'INT FK', isFk: true },
        { name: 'role_id', type: 'INT FK', isFk: true },
        { name: 'full_name', type: 'VARCHAR' },
        { name: 'username', type: 'VARCHAR' },
        { name: 'password_hash', type: 'VARCHAR' },
        { name: 'is_superadmin', type: 'TINYINT' }
      ],
      relationsTo: [
        { target: 'sales', label: 'کاشێر فاکتۆر دەردەکات', cardinality: '1 : N' },
        { target: 'cash_registers', label: 'شەفتی قاسە دەکاتەوە', cardinality: '1 : N' },
        { target: 'inventory_movements', label: 'جووڵەی کاڵا تۆمار دەکات', cardinality: '1 : N' }
      ]
    },
    {
      id: 'products',
      name: 'products',
      nameKu: 'بەرهەمەکان و کاتالۆگ',
      badge: 'Product Catalog',
      color: 'border-amber-500/40 bg-amber-950/20 text-amber-400',
      fields: [
        { name: 'id', type: 'INT PK', isKey: true },
        { name: 'category_id', type: 'INT FK', isFk: true },
        { name: 'brand_id', type: 'INT FK', isFk: true },
        { name: 'code', type: 'VARCHAR(100)' },
        { name: 'barcode', type: 'VARCHAR(100)' },
        { name: 'purchase_price', type: 'DECIMAL' },
        { name: 'selling_price', type: 'DECIMAL' }
      ],
      relationsTo: [
        { target: 'product_variants', label: 'جۆری قەبارە و ڕەنگ', cardinality: '1 : N' },
        { target: 'branch_inventory', label: 'بڕی بەردەست لە ٦ لقەکە', cardinality: '1 : N' },
        { target: 'sale_items', label: 'دەفرۆشرێت لەناو فاکتۆر', cardinality: '1 : N' }
      ]
    },
    {
      id: 'branch_inventory',
      name: 'branch_inventory',
      nameKu: 'کۆگای هەر لقێک',
      badge: 'Multi-Branch Stock',
      color: 'border-purple-500/40 bg-purple-950/20 text-purple-400',
      fields: [
        { name: 'id', type: 'INT PK', isKey: true },
        { name: 'branch_id', type: 'INT FK', isFk: true },
        { name: 'product_id', type: 'INT FK', isFk: true },
        { name: 'variant_id', type: 'INT FK', isFk: true },
        { name: 'quantity', type: 'DECIMAL' },
        { name: 'min_stock_alert', type: 'INT' }
      ],
      relationsTo: [
        { target: 'inventory_movements', label: 'هەر گۆڕانکارییەک تۆمار دەکرێت', cardinality: '1 : N' }
      ]
    },
    {
      id: 'sales',
      name: 'sales',
      nameKu: 'فاکتۆری فرۆشتنی POS',
      badge: 'Sales & Invoices',
      color: 'border-teal-500/40 bg-teal-950/20 text-teal-400',
      fields: [
        { name: 'id', type: 'BIGINT PK', isKey: true },
        { name: 'invoice_number', type: 'VARCHAR(50)' },
        { name: 'branch_id', type: 'INT FK', isFk: true },
        { name: 'cashier_id', type: 'INT FK', isFk: true },
        { name: 'customer_id', type: 'INT FK', isFk: true },
        { name: 'total_amount', type: 'DECIMAL' },
        { name: 'cost_of_goods_sold', type: 'DECIMAL' },
        { name: 'gross_profit', type: 'DECIMAL' }
      ],
      relationsTo: [
        { target: 'sale_items', label: 'ڕیزەکانی ناو فاکتۆر', cardinality: '1 : N' },
        { target: 'sale_payments', label: 'شێوازەکانی پارەدان', cardinality: '1 : N' },
        { target: 'customer_transactions', label: 'ئەگەر بە قەرز بێت', cardinality: '1 : 1' }
      ]
    },
    {
      id: 'stock_transfers',
      name: 'stock_transfers',
      nameKu: 'حەواڵەی نێوان لقەکان',
      badge: 'Inter-Branch Transfer',
      color: 'border-rose-500/40 bg-rose-950/20 text-rose-400',
      fields: [
        { name: 'id', type: 'BIGINT PK', isKey: true },
        { name: 'transfer_number', type: 'VARCHAR(50)' },
        { name: 'source_branch_id', type: 'INT FK', isFk: true },
        { name: 'destination_branch_id', type: 'INT FK', isFk: true },
        { name: 'status', type: 'ENUM' }
      ],
      relationsTo: [
        { target: 'branch_inventory', label: 'کەمکردن لە سەرچاوە و زیادکردن لە مەبەست', cardinality: '1 : N' }
      ]
    }
  ];

  const activeEntity = entities.find((e) => e.id === selectedEntity) || entities[0];

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <GitBranch className="w-6 h-6 text-amber-400" />
          <h3 className="text-xl font-bold text-white">نەخشەی پەیوەندی خشتە سەرەکییەکان (Entity Relationship Architecture)</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          ئەم دیاگرامە پەیوەندی پتەوی نێوان ٦ لقەکە، هەژماری بەکارهێنەران، بەرهەمەکان، کۆگای سەربەخۆ، فاکتۆری فرۆشتن، و حەواڵەی نێوان لقەکان ڕوون دەکاتەوە بە ڕێسای یەک-بۆ-زۆر (1:N) بە کۆنسترەینتی پارێزراوی Foreign Keys.
        </p>
      </div>

      {/* Interactive Entity Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {entities.map((e) => (
          <button
            key={e.id}
            onClick={() => setSelectedEntity(e.id)}
            className={`p-3.5 rounded-xl border text-right transition-all ${
              selectedEntity === e.id
                ? 'bg-slate-800 border-amber-500 text-white shadow-lg'
                : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div className="text-[10px] font-mono text-amber-400 mb-1">{e.badge}</div>
            <div className="text-xs font-bold text-white font-mono">{e.name}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{e.nameKu}</div>
          </button>
        ))}
      </div>

      {/* Active Entity Visual Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Source Entity Table */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div>
              <span className="text-xs font-mono text-amber-400">{activeEntity.badge}</span>
              <h4 className="text-lg font-bold text-white font-mono">{activeEntity.name}</h4>
              <p className="text-xs text-slate-400">{activeEntity.nameKu}</p>
            </div>
            <div className={`px-2.5 py-1 rounded-lg border text-xs font-mono ${activeEntity.color}`}>
              InnoDB Table
            </div>
          </div>

          <div className="space-y-2">
            {activeEntity.fields.map((f, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 border border-slate-800 text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${f.isKey ? 'bg-amber-400' : f.isFk ? 'bg-blue-400' : 'bg-slate-600'}`}></span>
                  <span className={f.isKey ? 'text-amber-300 font-bold' : f.isFk ? 'text-blue-300' : 'text-slate-200'}>
                    {f.name}
                  </span>
                </div>
                <span className="text-slate-400">{f.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Foreign Key Outgoing Relations */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4">
            <Layers className="w-5 h-5 text-amber-400" />
            <h4 className="text-sm font-bold text-white">پەیوەندییە دەرەکییەکان (Foreign Key Relationships)</h4>
          </div>

          <div className="space-y-3">
            {activeEntity.relationsTo.map((rel, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-amber-400">
                    {activeEntity.name} &rarr; {rel.target}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-700 text-[10px] font-mono text-slate-300">
                    {rel.cardinality}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{rel.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
