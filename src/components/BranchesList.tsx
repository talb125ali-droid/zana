import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Branch, User } from '../types/store';
import {
  Building2,
  ShieldAlert,
  ShieldCheck,
  PlusCircle,
  Edit,
  Trash2,
  Power,
  ArrowRightLeft,
  UserPlus,
  Users,
  DollarSign,
  TrendingUp,
  Package,
  Receipt,
  Phone,
  MapPin,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowUpRight,
  TrendingDown,
  Percent,
  CreditCard,
  Building
} from 'lucide-react';

export const BranchesList: React.FC = () => {
  const {
    branches,
    addBranch,
    updateBranch,
    toggleBranchActive,
    deleteBranch,
    users,
    addUser,
    updateUserPermissions,
    currentUser,
    sales,
    expenses,
    customers,
    branchStock,
    products,
    transfers,
    createTransfer,
    setActiveBranchId,
    showToast
  } = useStore();

  const isSuperAdmin = currentUser.role === 'super_admin';

  // Navigation tab for the 7 sections: 'super_admin' | branch ID as string
  const [activeSection, setActiveSection] = useState<string>(() => {
    if (isSuperAdmin) return 'super_admin';
    return currentUser.branchId ? currentUser.branchId.toString() : '1';
  });

  // Modals state
  const [showAddBranchModal, setShowAddBranchModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [targetBranchForUser, setTargetBranchForUser] = useState<number>(1);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [editingUserPermissions, setEditingUserPermissions] = useState<User | null>(null);

  // Form states for Branch
  const [branchForm, setBranchForm] = useState({
    code: '',
    nameKu: '',
    nameEn: '',
    city: 'هەولێر',
    address: '',
    phone: '',
    manager: '',
    specialtyKu: ''
  });

  // Form state for User
  const [userForm, setUserForm] = useState({
    name: '',
    username: '',
    password: '',
    role: 'cashier' as User['role'],
    phone: '',
    maxDiscountPercent: 10,
    canGiveDebt: false
  });

  // Form state for Transfer
  const [transferForm, setTransferForm] = useState({
    sourceBranchId: 1,
    destBranchId: 2,
    productId: products[0]?.id || 1,
    quantity: 5,
    notes: ''
  });

  // Calculate detailed financial and stock metrics for any branch
  const getBranchMetrics = (branchId: number) => {
    const branchSales = sales.filter((s) => s.branchId === branchId && s.status === 'completed');
    const totalSales = branchSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const grossProfit = branchSales.reduce((sum, s) => sum + s.grossProfit, 0);

    const branchExpenses = expenses.filter((e) => e.branchId === branchId);
    const totalExpenses = branchExpenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = Math.max(0, grossProfit - totalExpenses);

    const branchCustomers = customers.filter((c) => c.branchId === branchId);
    const totalDebt = branchCustomers.reduce((sum, c) => sum + c.currentBalance, 0);

    const stockItems = branchStock.filter((s) => s.branchId === branchId);
    const totalStockQty = stockItems.reduce((sum, s) => sum + s.quantity, 0);
    const totalStockValue = stockItems.reduce((sum, s) => {
      const prod = products.find((p) => p.id === s.productId);
      return sum + s.quantity * (prod ? prod.purchasePrice : 0);
    }, 0);

    const branchUsers = users.filter((u) => u.branchId === branchId);

    return {
      salesCount: branchSales.length,
      totalSales,
      grossProfit,
      totalExpenses,
      netProfit,
      totalDebt,
      totalStockQty,
      totalStockValue,
      userCount: branchUsers.length,
      users: branchUsers
    };
  };

  // Grand total calculations for Super Admin Overview
  const totalCompanySales = sales.filter((s) => s.status === 'completed').reduce((sum, s) => sum + s.totalAmount, 0);
  const totalCompanyExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalCompanyGrossProfit = sales.filter((s) => s.status === 'completed').reduce((sum, s) => sum + s.grossProfit, 0);
  const totalCompanyNetProfit = Math.max(0, totalCompanyGrossProfit - totalCompanyExpenses);
  const totalCompanyDebt = customers.reduce((sum, c) => sum + c.currentBalance, 0);
  const totalCompanyStockQty = branchStock.reduce((sum, s) => sum + s.quantity, 0);

  // Handle open edit branch
  const handleOpenEditBranch = (b: Branch) => {
    setEditingBranch(b);
    setBranchForm({
      code: b.code,
      nameKu: b.nameKu,
      nameEn: b.nameEn,
      city: b.city,
      address: b.address,
      phone: b.phone,
      manager: b.manager,
      specialtyKu: b.specialtyKu
    });
  };

  const handleSaveBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchForm.code || !branchForm.nameKu) {
      showToast('تکایە ناوی لق و کۆدی لق پڕبکەرەوە');
      return;
    }

    if (editingBranch) {
      updateBranch(editingBranch.id, {
        code: branchForm.code,
        nameKu: branchForm.nameKu,
        nameEn: branchForm.nameEn,
        city: branchForm.city,
        address: branchForm.address,
        phone: branchForm.phone,
        manager: branchForm.manager,
        specialtyKu: branchForm.specialtyKu
      });
      setEditingBranch(null);
    } else {
      addBranch({
        code: branchForm.code,
        nameKu: branchForm.nameKu,
        nameEn: branchForm.nameEn || `Branch ${branches.length + 1}`,
        city: branchForm.city,
        address: branchForm.address || 'شەقامی گشتی',
        phone: branchForm.phone || '0750 000 0000',
        manager: branchForm.manager || 'دیارینەکراو',
        isActive: true,
        specialtyKu: branchForm.specialtyKu || 'لقی گشتی فرۆشتن'
      });
      setShowAddBranchModal(false);
    }

    setBranchForm({
      code: '',
      nameKu: '',
      nameEn: '',
      city: 'هەولێر',
      address: '',
      phone: '',
      manager: '',
      specialtyKu: ''
    });
  };

  // Handle Save User
  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name || !userForm.username) {
      showToast('تکایە ناو و ناوی بەکارهێنەر پڕبکەرەوە');
      return;
    }

    let roleNameKu = 'کاشێر';
    if (userForm.role === 'branch_manager') roleNameKu = 'بەڕێوەبەری لق';
    else if (userForm.role === 'inventory_staff') roleNameKu = 'بەرپرسی کۆگا';

    addUser({
      name: userForm.name,
      username: userForm.username.toLowerCase().trim(),
      password: userForm.password || '123456',
      role: userForm.role,
      roleNameKu,
      branchId: targetBranchForUser,
      phone: userForm.phone || '0750 000 0000',
      maxDiscountPercent: Number(userForm.maxDiscountPercent) || 0,
      canGiveDebt: userForm.canGiveDebt
    });

    setShowAddUserModal(false);
    setUserForm({
      name: '',
      username: '',
      password: '',
      role: 'cashier',
      phone: '',
      maxDiscountPercent: 10,
      canGiveDebt: false
    });
  };

  // Handle Quick Transfer
  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (transferForm.sourceBranchId === transferForm.destBranchId) {
      showToast('لقی سەرچاوە و مەبەست ناتوانن هەمان لق بن!');
      return;
    }
    createTransfer(
      Number(transferForm.sourceBranchId),
      Number(transferForm.destBranchId),
      [{ productId: Number(transferForm.productId), requestedQty: Number(transferForm.quantity) }],
      transferForm.notes || 'حەواڵەی خێرا لە داشبۆردی بەڕێوەبردن'
    );
    setShowTransferModal(false);
  };

  // Switch workspace and make this branch active
  const handleSwitchToBranch = (bId: number) => {
    setActiveBranchId(bId);
    showToast(`سیستەم گواسترایەوە بۆ لقی ژمارە ${bId}`);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Identity Check */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <span>سیستەمی بەڕێوەبردنی لقەکان</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                    ٧ بەشی دەسەڵات
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  بەڕێوەبردنی سەربەخۆ و ناوەندیی سەرجەم ٦ لقەکە لەگەڵ کۆنترۆڵی باڵای لیدەر (Super Admin)
                </p>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {isSuperAdmin && (
              <>
                <button
                  onClick={() => setShowAddBranchModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20 active:scale-95"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>زیادکردنی لقی نوێ</span>
                </button>
                <button
                  onClick={() => setShowTransferModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all border border-slate-700 active:scale-95"
                >
                  <ArrowRightLeft className="w-4 h-4 text-amber-400" />
                  <span>حەواڵەی نێوان لقەکان</span>
                </button>
              </>
            )}

            <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border ${
              isSuperAdmin
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              {isSuperAdmin ? <ShieldCheck className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span>
                {isSuperAdmin
                  ? 'دەسەڵاتی لیدەری گشتی (Super Admin)'
                  : `کارمەندی لقی ${currentUser.branchId || 'دیاریکراو'}`}
              </span>
            </div>
          </div>
        </div>

        {/* Status notice if restricted */}
        {!isSuperAdmin && (
          <div className="mt-4 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 text-xs text-amber-300">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
            <span>
              <strong>تێبینی دەسەڵات:</strong> بەپێی یاسای سیستم، تەنها بەڕێوەبەری گشتی دەسەڵاتی دەستکاری و بینینی هەموو لقەکانی هەیە. دەسەڵاتی تۆ سنووردارە بە لقی خۆت.
            </span>
          </div>
        )}
      </div>

      {/* 2. Seven Management Portals Navigation (7 بەشی بەڕێوەبردن) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2">
        <div className="text-[11px] font-bold text-slate-400 mb-2 px-2 flex items-center justify-between">
          <span>هەڵبژاردنی بەشی بەڕێوەبردن لەنێوان ٧ بەشەکەدا:</span>
          <span className="text-[10px] text-amber-400">کلیک بکە بۆ چوونە ناو داشبۆردی تایبەت</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {/* Section 1: Super Admin */}
          <button
            onClick={() => setActiveSection('super_admin')}
            disabled={!isSuperAdmin}
            className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all ${
              activeSection === 'super_admin'
                ? 'bg-gradient-to-b from-amber-500 to-amber-600 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/25 scale-102 font-black'
                : !isSuperAdmin
                ? 'bg-slate-950/40 border-slate-800/50 text-slate-600 cursor-not-allowed opacity-60'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-5 h-5 mb-1.5" />
            <span className="text-[11px]">١. ئەدمینی سەرەکی</span>
            <span className="text-[9px] opacity-80 mt-0.5">کۆنترۆڵی ٦ لق</span>
          </button>

          {/* Sections 2 to 7 (Branches) */}
          {branches.map((b, idx) => {
            const isUserBranch = currentUser.branchId === b.id;
            const canAccess = isSuperAdmin || isUserBranch;
            const isSelected = activeSection === b.id.toString();

            return (
              <button
                key={b.id}
                onClick={() => {
                  if (canAccess) setActiveSection(b.id.toString());
                  else showToast('دەستگەیشتن سنووردارە! تەنها ئەدمین دەتوانێت ئەم لقە ببینێت.');
                }}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-bold transition-all relative ${
                  isSelected
                    ? 'bg-slate-800 border-amber-500 text-amber-400 shadow-md scale-102'
                    : !canAccess
                    ? 'bg-slate-950/40 border-slate-800/40 text-slate-600 cursor-not-allowed opacity-50'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                {!canAccess && (
                  <Lock className="w-3.5 h-3.5 absolute top-2 right-2 text-slate-600" />
                )}
                <Building className="w-5 h-5 mb-1.5 text-slate-400" />
                <span className="text-[11px] truncate max-w-full">{idx + 2}. {b.nameKu.split('-')[0]}</span>
                <span className="text-[9px] text-slate-400 mt-0.5 truncate max-w-full">
                  {b.city}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Section 1: Super Admin Central Control Dashboard */}
      {activeSection === 'super_admin' && isSuperAdmin && (
        <div className="space-y-6">
          {/* Top 5 Central Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>کۆی فرۆشتنی ٦ لق</span>
                <DollarSign className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl font-black text-white font-mono">
                {totalCompanySales.toLocaleString()} <span className="text-xs font-sans text-amber-400 font-normal">د.ع</span>
              </div>
              <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                <span>داهاتی تەواوی گرووپ</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>قازانجی پوختەی کۆمپانیا</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-black text-emerald-400 font-mono">
                {totalCompanyNetProfit.toLocaleString()} <span className="text-xs font-sans text-slate-400 font-normal">د.ع</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                دوای دەرکردنی خەرجییەکان
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>کۆی بەهای کۆگاکان</span>
                <Package className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-xl font-black text-white font-mono">
                {totalCompanyStockQty.toLocaleString()} <span className="text-xs font-sans text-blue-400 font-normal">دانە</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                لە تەواوی ڕەفەکان
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>کۆی قەرزی کڕیاران</span>
                <CreditCard className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-xl font-black text-red-400 font-mono">
                {totalCompanyDebt.toLocaleString()} <span className="text-xs font-sans text-slate-400 font-normal">د.ع</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                قەرزی ماوەی هەموو لقەکان
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
                <span>کۆی خەرجی ٦ لق</span>
                <TrendingDown className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-xl font-black text-rose-400 font-mono">
                {totalCompanyExpenses.toLocaleString()} <span className="text-xs font-sans text-slate-400 font-normal">د.ع</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                کرێ، مووچە و کارەبا
              </div>
            </div>
          </div>

          {/* Multi-Branch Comparative Performance Table (بەراوردی داهات و قازانجی لقەکان) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-400" />
                  <span>خشتەی بەراوردکاری کارایی و قازانجی سەرجەم لقەکان</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  بەراوردی داهات، قازانجی پوختە، قەرزی ماوە، و کۆگای هەر لقێک بە جیا
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1.5 rounded-xl border border-slate-700">
                  کۆی لقەکان: <strong className="text-white">{branches.length}</strong>
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/40">
                    <th className="py-3 px-3">کۆد</th>
                    <th className="py-3 px-3">ناوی لق</th>
                    <th className="py-3 px-3">شار و ناونیشان</th>
                    <th className="py-3 px-3 text-center">کارمەند</th>
                    <th className="py-3 px-3 text-left">کۆی فرۆشتن</th>
                    <th className="py-3 px-3 text-left">قازانجی پوختە</th>
                    <th className="py-3 px-3 text-left">قەرزی کڕیاران</th>
                    <th className="py-3 px-3 text-center">پشکی فرۆش</th>
                    <th className="py-3 px-3 text-center">دۆخ</th>
                    <th className="py-3 px-3 text-center">کردارەکان</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {branches.map((b) => {
                    const m = getBranchMetrics(b.id);
                    const salesShare = totalCompanySales > 0 ? ((m.totalSales / totalCompanySales) * 100).toFixed(1) : '0';

                    return (
                      <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3.5 px-3 font-mono font-bold text-amber-400">
                          {b.code}
                        </td>
                        <td className="py-3.5 px-3 font-bold text-white">
                          <button
                            onClick={() => setActiveSection(b.id.toString())}
                            className="hover:text-amber-400 transition-colors text-right"
                          >
                            {b.nameKu}
                          </button>
                          <div className="text-[11px] text-slate-400 font-normal">بەڕێوەبەر: {b.manager}</div>
                        </td>
                        <td className="py-3.5 px-3 text-slate-300">
                          <div>{b.city}</div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[150px]">{b.address}</div>
                        </td>
                        <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-200">
                          {m.userCount}
                        </td>
                        <td className="py-3.5 px-3 text-left font-mono font-bold text-white">
                          {m.totalSales.toLocaleString()} <span className="text-[10px] text-slate-400">د.ع</span>
                        </td>
                        <td className="py-3.5 px-3 text-left font-mono font-bold text-emerald-400">
                          {m.netProfit.toLocaleString()} <span className="text-[10px] text-slate-400">د.ع</span>
                        </td>
                        <td className="py-3.5 px-3 text-left font-mono font-bold text-red-400">
                          {m.totalDebt.toLocaleString()} <span className="text-[10px] text-slate-400">د.ع</span>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 font-mono text-[11px] font-bold text-amber-400 border border-slate-700">
                            {salesShare}%
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          {b.isActive ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                              چالاک
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                              ناچالاک
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleSwitchToBranch(b.id)}
                              className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors"
                              title="چوونە ناو لۆگینی ئەم لقە"
                            >
                              <ArrowRightLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEditBranch(b)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                              title="دەستکاریکردنی زانیاری"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => toggleBranchActive(b.id)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                b.isActive
                                  ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20'
                                  : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                              }`}
                              title={b.isActive ? 'ناچالاککردن' : 'چالاککردنەوە'}
                            >
                              <Power className="w-3.5 h-3.5" />
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

          {/* Centralized Audit Log (چاودێری هەموو مامەڵەکان لە یەک شوێنەوە) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-400" />
                <span>تۆماری چاودێری و وردبینی گشتی هەموو مامەڵەکانی لقەکان (Centralized Audit Log)</span>
              </h3>
              <span className="text-xs text-slate-400">نوێترین فاکتۆر و جووڵەی دارایی</span>
            </div>

            <div className="space-y-2.5">
              {sales.slice(0, 7).map((s) => {
                const b = branches.find((br) => br.id === s.branchId);
                return (
                  <div
                    key={s.id}
                    className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 font-mono font-bold border border-amber-500/20">
                        {b ? b.code : `BR-${s.branchId}`}
                      </span>
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{s.invoiceNumber}</span>
                          <span className="text-[11px] text-slate-400 font-normal">({b ? b.nameKu : 'لق'})</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          کاشێر: <span className="text-slate-300 font-semibold">{s.cashierName}</span> • کڕیار: {s.customerName}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-auto">
                      <div className="text-left">
                        <div className="font-mono font-black text-white text-sm">
                          {s.totalAmount.toLocaleString()} <span className="text-[10px] text-amber-400 font-sans">د.ع</span>
                        </div>
                        <div className="text-[10px] text-emerald-400 font-mono">
                          قازانج: +{s.grossProfit.toLocaleString()} د.ع
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        سەرکەوتوو
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. Sections 2 to 7: Branch Specific Dedicated Management Workspace */}
      {activeSection !== 'super_admin' && (
        (() => {
          const selectedBranchId = parseInt(activeSection, 10);
          const branch = branches.find((b) => b.id === selectedBranchId);

          if (!branch) {
            return (
              <div className="p-8 text-center bg-slate-900 rounded-3xl border border-slate-800">
                <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                <p className="text-white font-bold">لق نەدۆزرایەوە!</p>
              </div>
            );
          }

          const isUserBranch = currentUser.branchId === branch.id;
          const canManage = isSuperAdmin || isUserBranch;

          if (!canManage) {
            return (
              <div className="p-8 text-center bg-slate-900 rounded-3xl border border-slate-800">
                <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">دەستگەیشتن قەدەغەیە!</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  تۆ کارمەندی لقی {currentUser.branchId}یت و مافی چوونە ناو داتاکانی {branch.nameKu}ت نییە. تەنها ئەدمینی سەرەکی مافی گەیشتنی بە هەموو لقەکان هەیە.
                </p>
              </div>
            );
          }

          const metrics = getBranchMetrics(branch.id);
          const branchSales = sales.filter((s) => s.branchId === branch.id);

          return (
            <div className="space-y-6">
              {/* Branch Title & Quick Actions Card */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold px-3 py-1 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {branch.code}
                    </span>
                    <h3 className="text-xl font-black text-white">{branch.nameKu}</h3>
                    {branch.isActive ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        چالاک
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        ناچالاک
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 flex items-center gap-2">
                    <span>شار: <strong className="text-white">{branch.city}</strong></span>
                    <span>•</span>
                    <span>بەڕێوەبەری سەرپەرشتیار: <strong className="text-amber-300">{branch.manager}</strong></span>
                    <span>•</span>
                    <span className="font-mono">{branch.phone}</span>
                  </p>
                </div>

                {/* Branch Operations for Super Admin */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleSwitchToBranch(branch.id)}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all active:scale-95"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>داخڵبوون لەم لقە</span>
                  </button>

                  {isSuperAdmin && (
                    <>
                      <button
                        onClick={() => handleOpenEditBranch(branch)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all border border-slate-700"
                      >
                        <Edit className="w-3.5 h-3.5 text-amber-400" />
                        <span>دەستکاری زانیاری</span>
                      </button>

                      <button
                        onClick={() => {
                          setTargetBranchForUser(branch.id);
                          setShowAddUserModal(true);
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all border border-slate-700"
                      >
                        <UserPlus className="w-3.5 h-3.5 text-blue-400" />
                        <span>زیادکردنی کارمەند</span>
                      </button>

                      <button
                        onClick={() => toggleBranchActive(branch.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs transition-all border ${
                          branch.isActive
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20'
                            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{branch.isActive ? 'ناچالاککردن' : 'چالاککردنەوە'}</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`ئایا دڵنیایت لە سڕینەوەی ${branch.nameKu}؟`)) {
                            deleteBranch(branch.id);
                            setActiveSection('super_admin');
                          }
                        }}
                        className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all border border-rose-500/20"
                        title="سڕینەوەی لق"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* 5 Specific Financial Metrics for this Branch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-slate-400 text-xs mb-1.5">فرۆشتنی ئەم لقە</div>
                  <div className="text-lg font-black text-white font-mono">
                    {metrics.totalSales.toLocaleString()} <span className="text-xs text-amber-400">د.ع</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    ژمارەی فاکتۆر: <strong className="text-white">{metrics.salesCount}</strong>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-slate-400 text-xs mb-1.5">قازانجی ئەم لقە</div>
                  <div className="text-lg font-black text-emerald-400 font-mono">
                    {metrics.netProfit.toLocaleString()} <span className="text-xs text-slate-400">د.ع</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    دوای دەرکردنی خەرجییەکان
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-slate-400 text-xs mb-1.5">قەرزی کڕیارانی لق</div>
                  <div className="text-lg font-black text-red-400 font-mono">
                    {metrics.totalDebt.toLocaleString()} <span className="text-xs text-slate-400">د.ع</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    قەرزی کەڵەکەبووی کڕیاران
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-slate-400 text-xs mb-1.5">خەرجییەکانی ئەم لقە</div>
                  <div className="text-lg font-black text-rose-400 font-mono">
                    {metrics.totalExpenses.toLocaleString()} <span className="text-xs text-slate-400">د.ع</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    کرێ، خزمەتگوزاری و خەرجی
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="text-slate-400 text-xs mb-1.5">بەهای کۆگای لق</div>
                  <div className="text-lg font-black text-blue-400 font-mono">
                    {metrics.totalStockQty.toLocaleString()} <span className="text-xs text-slate-400">دانە</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    بەها: {metrics.totalStockValue.toLocaleString()} د.ع
                  </div>
                </div>
              </div>

              {/* Branch Employees & Role Permissions */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
                  <div>
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-amber-400" />
                      <span>کارمەندانی ئەم لقە و دەسەڵاتەکانیان ({metrics.users.length} کارمەند)</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      دیاریکردنی دەسەڵاتەکانی داشکاندن، قەرزدان، و ڕۆڵی فەرمی
                    </p>
                  </div>

                  {isSuperAdmin && (
                    <button
                      onClick={() => {
                        setTargetBranchForUser(branch.id);
                        setShowAddUserModal(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs self-start sm:self-auto transition-all"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>زیادکردنی کارمەند بۆ ئەم لقە</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {metrics.users.map((u) => (
                    <div
                      key={u.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-white text-sm">{u.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 font-semibold border border-slate-700">
                            {u.roleNameKu}
                          </span>
                        </div>

                        <div className="space-y-1 text-xs text-slate-400">
                          <div>ناوی بەکارهێنەر: <strong className="text-slate-200 font-mono">{u.username}</strong></div>
                          <div>تەلەفۆن: <span className="font-mono">{u.phone}</span></div>
                          <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-800/80 text-[11px]">
                            <span>ئاستی داشکاندن: <strong className="text-amber-400 font-mono">{u.maxDiscountPercent}%</strong></span>
                            <span>مافی قەرز: <strong className={u.canGiveDebt ? 'text-emerald-400' : 'text-slate-500'}>{u.canGiveDebt ? 'هەیە' : 'نییە'}</strong></span>
                          </div>
                        </div>
                      </div>

                      {isSuperAdmin && (
                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                          <button
                            onClick={() => setEditingUserPermissions(u)}
                            className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                          >
                            <Edit className="w-3 h-3" />
                            <span>دەستکاری دەسەڵات</span>
                          </button>
                          <span className="text-[10px] text-slate-500 font-mono">UID: #{u.id}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Sales of this branch */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm">
                <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-amber-400" />
                  <span>تۆماری فرۆشتنی لقی {branch.nameKu}</span>
                </h4>

                {branchSales.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">هیچ فرۆشتنێک لەم لقە تۆمار نەکراوە.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                          <th className="py-2.5 px-3">ژمارەی پسوولە</th>
                          <th className="py-2.5 px-3">کاشێر</th>
                          <th className="py-2.5 px-3">کڕیار</th>
                          <th className="py-2.5 px-3 text-left">کۆی پارە</th>
                          <th className="py-2.5 px-3 text-left">قازانج</th>
                          <th className="py-2.5 px-3 text-center">شێوازی پارەدان</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {branchSales.slice(0, 5).map((s) => (
                          <tr key={s.id} className="hover:bg-slate-800/30">
                            <td className="py-3 px-3 font-mono font-bold text-white">{s.invoiceNumber}</td>
                            <td className="py-3 px-3 text-slate-300">{s.cashierName}</td>
                            <td className="py-3 px-3 text-slate-300">{s.customerName}</td>
                            <td className="py-3 px-3 text-left font-mono font-bold text-white">
                              {s.totalAmount.toLocaleString()} د.ع
                            </td>
                            <td className="py-3 px-3 text-left font-mono font-bold text-emerald-400">
                              +{s.grossProfit.toLocaleString()} د.ع
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px]">
                                {s.paymentMethod === 'cash' ? 'نەقد' : s.paymentMethod === 'card' ? 'کارت' : 'قەرز'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          );
        })()
      )}

      {/* MODAL 1: Add New Branch */}
      {showAddBranchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <span>زیادکردنی لقی نوێ بۆ تۆڕی زانا</span>
              </h3>
              <button
                onClick={() => setShowAddBranchModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBranch} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">کۆدی لق (نموونە: BR-07):</label>
                  <input
                    type="text"
                    required
                    value={branchForm.code}
                    onChange={(e) => setBranchForm({ ...branchForm, code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                    placeholder="BR-07"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">شار:</label>
                  <select
                    value={branchForm.city}
                    onChange={(e) => setBranchForm({ ...branchForm, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="هەولێر">هەولێر</option>
                    <option value="سلێمانی">سلێمانی</option>
                    <option value="دهۆک">دهۆک</option>
                    <option value="کەرکووک">کەرکووک</option>
                    <option value="هەڵەبجە">هەڵەبجە</option>
                    <option value="زاخۆ">زاخۆ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">ناوی لق بە کوردی:</label>
                <input
                  type="text"
                  required
                  value={branchForm.nameKu}
                  onChange={(e) => setBranchForm({ ...branchForm, nameKu: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  placeholder="لقی ٧ - زانا (زاخۆ)"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">بەڕێوەبەری سەرپەرشتیار:</label>
                  <input
                    type="text"
                    value={branchForm.manager}
                    onChange={(e) => setBranchForm({ ...branchForm, manager: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    placeholder="ناوی بەڕێوەبەر"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">ژمارەی تەلەفۆن:</label>
                  <input
                    type="text"
                    value={branchForm.phone}
                    onChange={(e) => setBranchForm({ ...branchForm, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                    placeholder="0750 000 0000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">ناونیشانی تەواو:</label>
                <input
                  type="text"
                  value={branchForm.address}
                  onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  placeholder="شەقامی سەرەکی، بەرامبەر مۆڵ..."
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">تایبەتمەندی و بەشەکانی فرۆش:</label>
                <input
                  type="text"
                  value={branchForm.specialtyKu}
                  onChange={(e) => setBranchForm({ ...branchForm, specialtyKu: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  placeholder="پۆشاک، میکیاژ، کەلوپەلی ناوماڵ..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddBranchModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  پاشگەزبوونەوە
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
                >
                  زیادکردنی لق
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Branch */}
      {editingBranch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-amber-400" />
                <span>دەستکاریکردنی زانیاری لق ({editingBranch.nameKu})</span>
              </h3>
              <button
                onClick={() => setEditingBranch(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBranch} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">کۆدی لق:</label>
                  <input
                    type="text"
                    required
                    value={branchForm.code}
                    onChange={(e) => setBranchForm({ ...branchForm, code: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">شار:</label>
                  <input
                    type="text"
                    required
                    value={branchForm.city}
                    onChange={(e) => setBranchForm({ ...branchForm, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">ناوی لق بە کوردی:</label>
                <input
                  type="text"
                  required
                  value={branchForm.nameKu}
                  onChange={(e) => setBranchForm({ ...branchForm, nameKu: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">بەڕێوەبەری سەرپەرشتیار:</label>
                  <input
                    type="text"
                    value={branchForm.manager}
                    onChange={(e) => setBranchForm({ ...branchForm, manager: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">ژمارەی تەلەفۆن:</label>
                  <input
                    type="text"
                    value={branchForm.phone}
                    onChange={(e) => setBranchForm({ ...branchForm, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">ناونیشان:</label>
                <input
                  type="text"
                  value={branchForm.address}
                  onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">تایبەتمەندی و بەشەکان:</label>
                <input
                  type="text"
                  value={branchForm.specialtyKu}
                  onChange={(e) => setBranchForm({ ...branchForm, specialtyKu: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBranch(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  پاشگەزبوونەوە
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
                >
                  پاشەکەوتکردنی گۆڕانکاری
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Add User to Branch */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <span>زیادکردنی کارمەند بۆ لقی {branches.find((b) => b.id === targetBranchForUser)?.nameKu}</span>
              </h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">ناوی سیانی کارمەند:</label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  placeholder="ناوی تەواو"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">ناوی بەکارهێنەر (Username):</label>
                  <input
                    type="text"
                    required
                    value={userForm.username}
                    onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                    placeholder="cashier_new"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">تێپەڕەوشە (پاسۆرد):</label>
                  <input
                    type="password"
                    required
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">ڕۆڵ و دەسەڵات:</label>
                  <select
                    value={userForm.role}
                    onChange={(e) => setUserForm({ ...userForm, role: e.target.value as User['role'] })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="cashier">کاشێر</option>
                    <option value="branch_manager">بەڕێوەبەری لق</option>
                    <option value="inventory_staff">کارمەندی کۆگا</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">بەرزترین داشکاندن (%):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={userForm.maxDiscountPercent}
                    onChange={(e) => setUserForm({ ...userForm, maxDiscountPercent: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  id="userDebtCheck"
                  checked={userForm.canGiveDebt}
                  onChange={(e) => setUserForm({ ...userForm, canGiveDebt: e.target.checked })}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
                />
                <label htmlFor="userDebtCheck" className="text-slate-300 cursor-pointer">
                  مافی دەرکردنی فاکتۆری بە قەرز هەیە
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  پاشگەزبوونەوە
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
                >
                  تۆمارکردنی کارمەند
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Quick Inter-Branch Transfer */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-amber-400" />
                <span>حەواڵەی ڕاستەوخۆی کاڵا لە لقێکەوە بۆ لقێکی تر</span>
              </h3>
              <button
                onClick={() => setShowTransferModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteTransfer} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">لقی سەرچاوە (نێرەر):</label>
                  <select
                    value={transferForm.sourceBranchId}
                    onChange={(e) => setTransferForm({ ...transferForm, sourceBranchId: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>{b.nameKu}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">لقی مەبەست (وەرگر):</label>
                  <select
                    value={transferForm.destBranchId}
                    onChange={(e) => setTransferForm({ ...transferForm, destBranchId: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>{b.nameKu}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">کاڵا بۆ حەواڵەکردن:</label>
                <select
                  value={transferForm.productId}
                  onChange={(e) => setTransferForm({ ...transferForm, productId: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nameKu} ({p.code}) - {p.sellingPrice.toLocaleString()} د.ع
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">ژمارەی دانە:</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={transferForm.quantity}
                  onChange={(e) => setTransferForm({ ...transferForm, quantity: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">تێبینی یان هۆکاری حەواڵە:</label>
                <input
                  type="text"
                  value={transferForm.notes}
                  onChange={(e) => setTransferForm({ ...transferForm, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  placeholder="پڕکردنەوەی کەمی کۆگا، داواکاری کڕیار..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  پاشگەزبوونەوە
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
                >
                  ناردنی حەواڵە
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Edit User Permissions */}
      {editingUserPermissions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>دەستکاری دەسەڵات ({editingUserPermissions.name})</span>
              </h3>
              <button
                onClick={() => setEditingUserPermissions(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">بەرزترین داشکاندنی ڕێگەپێدراو (%):</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editingUserPermissions.maxDiscountPercent}
                  onChange={(e) =>
                    setEditingUserPermissions({
                      ...editingUserPermissions,
                      maxDiscountPercent: Number(e.target.value)
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  id="debtPermCheck"
                  checked={editingUserPermissions.canGiveDebt}
                  onChange={(e) =>
                    setEditingUserPermissions({
                      ...editingUserPermissions,
                      canGiveDebt: e.target.checked
                    })
                  }
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0"
                />
                <label htmlFor="debtPermCheck" className="text-slate-300 cursor-pointer">
                  مافی تۆمارکردنی فاکتۆری بە قەرز
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUserPermissions(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  پاشگەزبوونەوە
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateUserPermissions(editingUserPermissions.id, {
                      maxDiscountPercent: editingUserPermissions.maxDiscountPercent,
                      canGiveDebt: editingUserPermissions.canGiveDebt
                    });
                    setEditingUserPermissions(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400"
                >
                  پاشەکەوتکردن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
