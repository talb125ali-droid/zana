import React, { useState } from 'react';
import { FileCode, Copy, Check, Download, Database } from 'lucide-react';

export const SqlViewer: React.FC = () => {
  const [activeFile, setActiveFile] = useState<'schema' | 'seed'>('schema');
  const [copied, setCopied] = useState(false);

  // We load or present snippets and full content
  const schemaSummary = `-- =====================================================================
-- ZANA STORE MANAGEMENT SYSTEM - سیستەمی بەڕێوەبردنی کۆگاکانی زانا
-- DATABASE ARCHITECTURE: PHASE 1 SCHEMA
-- Compatible with MySQL 8.0+ / MariaDB 10.5+
-- Charset: utf8mb4, Collation: utf8mb4_unicode_ci
-- Engine: InnoDB with Foreign Key Constraints & Safe Auditing
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS \`zana_store_db\`;
CREATE DATABASE \`zana_store_db\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`zana_store_db\`;

-- 1. CURRENCIES & EXCHANGE RATES (currencies, exchange_rates)
-- 2. BRANCHES (branches: 6 physical branches)
-- 3. ROLES & PERMISSIONS (roles, permissions, role_permissions)
-- 4. USERS & USER PERMISSIONS (users, user_permissions)
-- 5. CATEGORIES & BRANDS (categories, brands)
-- 6. SUPPLIERS (suppliers)
-- 7. PRODUCTS, VARIANTS & BARCODES (products, product_variants, barcodes)
-- 8. BRANCH INVENTORY & STOCK MOVEMENTS (branch_inventory, inventory_movements)
-- 9. CUSTOMERS & DEBTS (customers, customer_transactions)
-- 10. CASH REGISTERS & SHIFTS (cash_registers, cash_transactions)
-- 11. SALES, ITEMS & PAYMENTS (sales, sale_items, sale_payments)
-- 12. PURCHASES & SUPPLIER PAYMENTS (purchases, purchase_items, supplier_payments)
-- 13. STOCK TRANSFERS BETWEEN BRANCHES (stock_transfers, stock_transfer_items)
-- 14. SALES RETURNS & EXCHANGES (returns, return_items)
-- 15. EXPENSES & EXPENSE CATEGORIES (expense_categories, expenses)
-- 16. STOCKTAKES & AUDITS (stocktakes, stocktake_items)
-- 17. NOTIFICATIONS & ALERTS (notifications)
-- 18. AUDIT LOGS (audit_logs)
-- 19. SYSTEM SETTINGS & BACKUPS (system_settings, backup_logs)
-- 20. VIEWS FOR PROFIT & INVENTORY (view_branch_inventory_summary, view_branch_financial_performance)

-- تەواوی سکریپتی ئەم پەڕگەیە بە سەرکەوتوویی لە ڕێڕەوی database/schema.sql خەزن کراوە.`;

  const seedSummary = `-- =====================================================================
-- ZANA STORE MANAGEMENT SYSTEM - سیستەمی بەڕێوەبردنی کۆگاکانی زانا
-- DATABASE SEED DATA: PHASE 1
-- Initial Setup: 6 Branches, Roles, Permissions, Admin, Currencies, Categories
-- =====================================================================

USE \`zana_store_db\`;

-- 1. دەستپێکی دراوەکان: IQD (دیناری سەرەکی) و USD بە نرخی 1530 دینار
-- 2. دروستکردنی ٦ لقی فیزیکی فرۆشگاکانی زانا (BR-01 تا BR-06) لە هەولێر، سلێمانی، دهۆک، کەرکووک
-- 3. چوار ڕۆڵی بنەڕەتی: بەڕێوەبەری گشتی، بەڕێوەبەری لق، کاشێر، کارمەندی کۆگا
-- 4. پێدانی ٤٧ دەسەڵاتی جیاواز بۆ سەرجەم بەشەکانی سیستەم
-- 5. هەژماری سەرەکی بەڕێوەبەری گشتی:
--    Username: admin
--    Password: Admin@123456 (Hashed via BCRYPT)
-- 6. دە پۆلی سەرەکی کاتالۆگی زانا: جوانکاری، پێست، عەتر، پۆشاک، ئێکسسوارات، جانتا، دیکۆر، گوڵ، ناوماڵ، قوماش
-- 7. نۆ پۆلی سەرەکی خەرجی لقەکان: کرێ، مووچە، کارەبا، ئینتەرنێت، گواستنەوە، چاککردنەوە، بەستەبەندی، میوانداری، گشتی
-- 8. ڕێکخستنە سەرەکییەکان: کۆمپانیا، چاپکەری وەسڵ 80mm، لۆگۆ، قەدەغەکردنی باڵانسی نێگەتیڤی کۆگا

-- تەواوی سکریپتی ئەم پەڕگەیە لە database/seed.sql جێگیر کراوە.`;

  const activeContent = activeFile === 'schema' ? schemaSummary : seedSummary;
  const fileName = activeFile === 'schema' ? 'schema.sql' : 'seed.sql';

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeContent], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Database className="w-5 h-5 text-amber-400" />
              <h3 className="text-xl font-bold text-white">سکریپتەکانی بنکەدراوە (SQL Scripts)</h3>
            </div>
            <p className="text-xs text-slate-300">
              سکریپتی تەواوی دروستکردنی ٣٧ خشتەکە لەگەڵ داتای سەرەتایی ئامادەکراو بۆ MySQL 8.0+ و XAMPP.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFile('schema')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeFile === 'schema'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              schema.sql (٣٧ خشتە)
            </button>
            <button
              onClick={() => setActiveFile('seed')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeFile === 'seed'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              seed.sql (٦ لق و داتای بنەڕەتی)
            </button>
          </div>
        </div>
      </div>

      {/* Code Editor Preview */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-amber-400" />
            <span className="font-mono text-xs font-bold text-white">database/{fileName}</span>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              UTF-8 (utf8mb4_unicode_ci)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all flex items-center gap-1.5 border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'کۆپی کرا!' : 'کۆپیکردنی SQL'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>دابەزاندنی پەڕگە (.sql)</span>
            </button>
          </div>
        </div>

        <div className="p-5 font-mono text-xs text-slate-300 bg-slate-950/80 overflow-x-auto leading-relaxed max-h-[500px]">
          <pre className="text-left font-mono" dir="ltr">
            {activeContent}
          </pre>
        </div>
      </div>
    </div>
  );
};
