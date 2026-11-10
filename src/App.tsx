import React, { useState } from 'react';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { PosView } from './components/pos/PosView';
import { ReturnsView } from './components/returns/ReturnsView';
import { StocktakingView } from './components/inventory/StocktakingView';
import { ProductsView } from './components/products/ProductsView';
import { TransfersView } from './components/transfers/TransfersView';
import { CustomersView } from './components/customers/CustomersView';
import { PurchasesView } from './components/suppliers/PurchasesView';
import { ExpensesCashView } from './components/finance/ExpensesCashView';
import { ReportsView } from './components/reports/ReportsView';
import { BranchesList } from './components/BranchesList';
import { UsersView } from './components/users/UsersView';
import { SchemaBrowser } from './components/SchemaBrowser';
import { ErdDiagram } from './components/ErdDiagram';
import { SqlViewer } from './components/SqlViewer';
import { SettingsView } from './components/settings/SettingsView';

function StoreApp() {
  const [activeTab, setActiveTab] = useState<string>('pos');
  const [databaseSubTab, setDatabaseSubTab] = useState<'tables' | 'erd' | 'sql'>('tables');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {activeTab === 'pos' && <PosView />}
          {activeTab === 'users' && <UsersView />}
          {activeTab === 'returns' && <ReturnsView />}
          {activeTab === 'products' && <ProductsView />}
          {activeTab === 'stocktake' && <StocktakingView />}
          {activeTab === 'transfers' && <TransfersView />}
          {activeTab === 'customers' && <CustomersView />}
          {activeTab === 'purchases' && <PurchasesView />}
          {activeTab === 'finance' && <ExpensesCashView />}
          {activeTab === 'reports' && <ReportsView />}
          {activeTab === 'branches' && <BranchesList />}

          {/* Database Architecture & SQL Viewer */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-2xl w-fit">
                <button
                  onClick={() => setDatabaseSubTab('tables')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    databaseSubTab === 'tables'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  پشکنەری ٣٧ خشتەکە
                </button>
                <button
                  onClick={() => setDatabaseSubTab('erd')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    databaseSubTab === 'erd'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  نەخشەی پەیوەندییەکان (ERD)
                </button>
                <button
                  onClick={() => setDatabaseSubTab('sql')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    databaseSubTab === 'sql'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  سکریپتەکانی SQL بۆ XAMPP
                </button>
              </div>

              {databaseSubTab === 'tables' && <SchemaBrowser />}
              {databaseSubTab === 'erd' && <ErdDiagram />}
              {databaseSubTab === 'sql' && <SqlViewer />}
            </div>
          )}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="font-bold text-slate-200">سیستەمی بەڕێوەبردنی کۆگاکانی زانا</span>
            <span>—</span>
            <span>٦ لقی بازرگانی • بنکەدراوەی MySQL 8+ • PHP 8.2+ و MySQLi</span>
          </div>
          <div className="text-[11px] text-slate-400">
            هەموو مافەکان پارێزراوە بۆ کۆمەڵگەی بازرگانی زانا © 2026
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <StoreApp />
    </StoreProvider>
  );
}
