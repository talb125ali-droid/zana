import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { User, UserRole } from '../../types/store';
import {
  Users,
  Shield,
  KeyRound,
  LogIn,
  LogOut,
  UserCheck,
  Building2,
  Lock,
  Unlock,
  Plus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const UsersView: React.FC = () => {
  const {
    users,
    currentUser,
    branches,
    setCurrentUser,
    loginWithCredentials,
    logout,
    addUser
  } = useStore();

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // New user form state
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('branch_manager');
  const [newBranchId, setNewBranchId] = useState<number | 'all'>(1);
  const [newMaxDiscount, setNewMaxDiscount] = useState<number>(10);
  const [newCanGiveDebt, setNewCanGiveDebt] = useState<boolean>(false);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;
    const success = loginWithCredentials(usernameInput, passwordInput);
    if (success) {
      setUsernameInput('');
      setPasswordInput('');
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUsername.trim()) return;

    addUser({
      name: newName,
      username: newUsername,
      password: newPassword || '123456',
      phone: newPhone || '0750 000 0000',
      role: newRole,
      roleNameKu:
        newRole === 'super_admin'
          ? 'بەڕێوەبەری گشتی (لیدەر)'
          : newRole === 'branch_manager'
          ? 'بەڕێوەبەری لق'
          : newRole === 'cashier'
          ? 'کاشێر'
          : 'کارمەندی کۆگا',
      branchId: newRole === 'super_admin' || newBranchId === 'all' ? null : Number(newBranchId),
      maxDiscountPercent: newMaxDiscount,
      canGiveDebt: newCanGiveDebt
    });

    setShowAddUserModal(false);
    setNewName('');
    setNewUsername('');
    setNewPassword('');
    setNewPhone('');
  };

  const isSuperAdmin = currentUser.role === 'super_admin';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold text-white">
              هەژماری لقەکان و چوونەژوورەوە (Branch Logins & RBAC)
            </h2>
          </div>
          <p className="text-xs text-slate-300">
            هەر لقێک بەکارهێنەر و وشەی نهێنی خۆی هەیە. ئەدمینی سەرەکی وەک لیدەر دەسەڵاتی تەواوی بەسەر ٦ لقەکەدا هەیە.
          </p>
        </div>

        {/* Current Active Account Status */}
        <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{currentUser.name}</span>
              {isSuperAdmin && (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] px-1.5 py-0.2 rounded font-mono">
                  لیدەر (Leader)
                </span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              ڕۆڵ: <strong className="text-amber-400">{currentUser.roleNameKu}</strong> •{' '}
              {currentUser.branchId ? `دەسەڵات تەنها لە لقی ${currentUser.branchId}` : 'دەسەڵاتی گشتی بەسەر ٦ لقەکە'}
            </div>
          </div>

          {!isSuperAdmin && (
            <button
              onClick={logout}
              className="mr-2 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>دەرچوون</span>
            </button>
          )}
        </div>
      </div>

      {/* Manual Login Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>چوونەژوورەوە بە یوزەر و پاسۆرد</span>
          </h3>
          <p className="text-xs text-slate-400">
            دەتوانیت ناوی بەکارهێنەر و وشەی نهێنی هەر لقێک لێرە بنووسیت بۆ ئەوەی بە هەژماری ئەو لقە بچیتە ژوورەوە:
          </p>

          <form onSubmit={handleManualLogin} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">ناوی بەکارهێنەر (Username):</label>
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="نموونە: admin یان manager_br2"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">وشەی نهێنی (Password):</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="وشەی نهێنی بنووسە..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>چوونەژوورەوە بۆ لق</span>
            </button>
          </form>

          {/* Quick instructions */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 space-y-1.5">
            <div className="font-bold text-slate-200">هەژماری سەرەکی ئەدمین:</div>
            <div>یوزەر: <span className="text-amber-400 font-mono font-bold">admin</span></div>
            <div>پاسۆرد: <span className="text-amber-400 font-mono font-bold">Admin@123456</span></div>
            <div className="text-slate-500 pt-1 border-t border-slate-800">
              * کاتێک بە ئەدمین دەچیتەژوورەوە دەتوانیت لە سەرەوە هەموو لقەکان بگۆڕیت و دەسەڵاتی تەواوت هەیە.
            </div>
          </div>
        </div>

        {/* Right: Branch Accounts Matrix & User List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>هەژمارەکانی بەردەست بۆ هەر ٦ لقەکە ({users.length} بەکارهێنەر)</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  کلیک لەسەر "چوونەژوورەوە" بکە بۆ تاقیکردنەوەی سیستەم وەک بەڕێوەبەر یان کاشێری ئەو لقە
                </p>
              </div>

              {isSuperAdmin && (
                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>زیادکردنی بەکارهێنەر</span>
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                    <th className="pb-2.5 font-bold">ناو</th>
                    <th className="pb-2.5 font-bold">لقی دیاریکراو</th>
                    <th className="pb-2.5 font-bold">ناوی بەکارهێنەر</th>
                    <th className="pb-2.5 font-bold">وشەی نهێنی</th>
                    <th className="pb-2.5 font-bold">ڕۆڵ و دەسەڵات</th>
                    <th className="pb-2.5 font-bold text-center">کردار</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {users.map((u) => {
                    const isCurrent = currentUser.id === u.id;
                    const branch = branches.find((b) => b.id === u.branchId);

                    return (
                      <tr key={u.id} className={`hover:bg-slate-800/30 transition-colors ${isCurrent ? 'bg-amber-500/5' : ''}`}>
                        <td className="py-3 font-bold text-white">
                          <div className="flex items-center gap-1.5">
                            {isCurrent && <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>}
                            <span>{u.name}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          {u.branchId ? (
                            <span className="text-slate-300">
                              {branch ? branch.nameKu : `لقی ${u.branchId}`}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              هەموو ٦ لقەکە (سەرپەرشتیار)
                            </span>
                          )}
                        </td>
                        <td className="py-3 font-mono font-bold text-amber-400">{u.username}</td>
                        <td className="py-3 font-mono text-slate-400">{u.password || '••••••••'}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              u.role === 'super_admin'
                                ? 'bg-amber-500 text-slate-950 font-black'
                                : u.role === 'branch_manager'
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : u.role === 'cashier'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            }`}
                          >
                            {u.roleNameKu}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          {isCurrent ? (
                            <span className="text-[11px] text-emerald-400 font-bold flex items-center justify-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              چالاکە
                            </span>
                          ) : (
                            <button
                              onClick={() => setCurrentUser(u)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-[11px] font-bold transition-all cursor-pointer"
                            >
                              چوونەژوورەوە
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add New User */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-400" />
              <span>دروستکردنی هەژماری نوێ بۆ لق</span>
            </h3>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">ناوی تەواو:</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="نموونە: ئارام عەلی"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">ناوی بەکارهێنەر (Username):</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="aram_br3"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">وشەی نهێنی (Password):</label>
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Br3@123456"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">ڕۆڵ و پێگە:</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="branch_manager">بەڕێوەبەری لق</option>
                    <option value="cashier">کاشێر</option>
                    <option value="inventory_staff">کارمەندی کۆگا</option>
                    <option value="super_admin">بەڕێوەبەری گشتی (لیدەر)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-bold block mb-1">لقی کارپێکراو:</label>
                  <select
                    value={newBranchId}
                    onChange={(e) => setNewBranchId(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="all">سەرجەم لقەکان (ئەدمین)</option>
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.nameKu} ({b.city})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">ژمارەی مۆبایل:</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="0750 123 4567"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  پاشگەزبوونەوە
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  زیادکردن
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
