import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Branch,
  User,
  BranchStock,
  CartItem,
  Sale,
  Customer,
  CustomerTransaction,
  Supplier,
  Purchase,
  StockTransfer,
  Expense,
  CashRegisterShift,
  PaymentMethod,
  ReturnRecord,
  ReturnItem,
  Stocktake,
  StocktakeItem
} from '../types/store';
import {
  INITIAL_BRANCHES,
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_BRANCH_STOCK,
  INITIAL_CUSTOMERS,
  INITIAL_SUPPLIERS,
  INITIAL_EXPENSES
} from '../data/initialStoreData';

interface StoreContextType {
  // Branches & Auth
  branches: Branch[];
  activeBranchId: number;
  setActiveBranchId: (id: number) => void;
  activeBranch: Branch;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  loginWithCredentials: (username: string, password?: string) => boolean;
  logout: () => void;
  addUser: (userData: Omit<User, 'id'>) => void;
  addBranch: (branchData: Omit<Branch, 'id'>) => void;
  updateBranch: (id: number, data: Partial<Branch>) => void;
  toggleBranchActive: (id: number) => void;
  deleteBranch: (id: number) => void;
  updateUserPermissions: (userId: number, permissions: Partial<User>) => void;

  // Products & Stock
  products: Product[];
  branchStock: BranchStock[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  getProductStock: (productId: number, branchId?: number) => number;
  adjustStock: (productId: number, branchId: number, newQty: number, reason: string) => void;

  // Cart & POS
  cart: CartItem[];
  addToCart: (product: Product, qty?: number) => boolean;
  updateCartQuantity: (productId: number, qty: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCogs: number;
  completeSale: (data: {
    customerId?: number;
    customerName?: string;
    discount: number;
    paymentMethod: PaymentMethod;
    paidAmount: number;
    currency: 'IQD' | 'USD';
  }) => Sale | null;

  // Sales History
  sales: Sale[];
  latestSale: Sale | null;

  // Customers & Debts
  customers: Customer[];
  customerTransactions: CustomerTransaction[];
  addCustomer: (cust: Omit<Customer, 'id' | 'totalDebt' | 'totalPaid' | 'currentBalance'>) => void;
  recordCustomerPayment: (customerId: number, amount: number, notes?: string) => void;

  // Inter-Branch Stock Transfers
  transfers: StockTransfer[];
  createTransfer: (sourceBranchId: number, destBranchId: number, items: { productId: number; requestedQty: number }[], notes?: string) => void;
  approveTransfer: (transferId: number) => void;
  receiveTransfer: (transferId: number) => void;

  // Suppliers & Purchases
  suppliers: Supplier[];
  purchases: Purchase[];
  addPurchase: (supplierId: number, items: { productId: number; quantity: number; purchaseCost: number }[], paidAmount: number) => void;

  // Expenses & Cash Registers
  expenses: Expense[];
  addExpense: (categoryKu: string, amount: number, description: string) => void;
  currentShift: CashRegisterShift | null;
  openShift: (openingBalanceIqd: number) => void;
  closeShift: (closingCashIqd: number, notes?: string) => void;

  // Returns & Exchanges
  returns: ReturnRecord[];
  processReturn: (data: {
    saleInvoiceNumber: string;
    items: ReturnItem[];
    refundMethod: 'cash' | 'card' | 'customer_credit' | 'exchange';
    reason: string;
  }) => ReturnRecord | null;

  // Stocktakes (سەرژمێری کۆگا)
  stocktakes: Stocktake[];
  performStocktake: (items: { productId: number; countedQty: number }[], notes?: string) => Stocktake;
  applyStocktakeAdjustment: (stocktakeId: number) => void;

  // Multi-Currency
  exchangeRate: number;
  setExchangeRate: (rate: number) => void;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Helper for localStorage
  const loadStorage = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`zana_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const saveStorage = <T,>(key: string, data: T) => {
    try {
      localStorage.setItem(`zana_${key}`, JSON.stringify(data));
    } catch (e) {
      console.error(e);
    }
  };

  // State initialization
  const [branches, setBranches] = useState<Branch[]>(() => {
    const stored = loadStorage<Branch[]>('branches', []);
    return stored.length >= INITIAL_BRANCHES.length ? stored : INITIAL_BRANCHES;
  });
  const [users, setUsers] = useState<User[]>(() => {
    const stored = loadStorage<User[]>('users', []);
    return stored.length >= INITIAL_USERS.length ? stored : INITIAL_USERS;
  });
  const [currentUser, setCurrentUser] = useState<User>(() => loadStorage('currentUser', INITIAL_USERS[0]));
  const [activeBranchId, setActiveBranchId] = useState<number>(() => loadStorage('activeBranchId', 1));

  const [products, setProducts] = useState<Product[]>(() => loadStorage('products', INITIAL_PRODUCTS));
  const [branchStock, setBranchStock] = useState<BranchStock[]>(() => loadStorage('branchStock', INITIAL_BRANCH_STOCK));
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sales, setSales] = useState<Sale[]>(() => loadStorage('sales', []));
  const [latestSale, setLatestSale] = useState<Sale | null>(null);

  const [customers, setCustomers] = useState<Customer[]>(() => loadStorage('customers', INITIAL_CUSTOMERS));
  const [customerTransactions, setCustomerTransactions] = useState<CustomerTransaction[]>(() => loadStorage('customerTransactions', []));
  const [suppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [purchases, setPurchases] = useState<Purchase[]>(() => loadStorage('purchases', []));
  const [transfers, setTransfers] = useState<StockTransfer[]>(() => loadStorage('transfers', []));
  const [expenses, setExpenses] = useState<Expense[]>(() => loadStorage('expenses', INITIAL_EXPENSES));
  const [returns, setReturns] = useState<ReturnRecord[]>(() => loadStorage('returns', []));
  const [stocktakes, setStocktakes] = useState<Stocktake[]>(() => loadStorage('stocktakes', []));

  const [currentShift, setCurrentShift] = useState<CashRegisterShift | null>(() => loadStorage('currentShift', {
    id: 1,
    branchId: 1,
    cashierName: 'زانا عەزیز (بەڕێوەبەری گشتی)',
    openingTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    openingBalanceIqd: 100000,
    expectedCashIqd: 100000,
    isOpen: true
  }));

  const [exchangeRate, setExchangeRate] = useState<number>(1530);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync back to storage on changes
  useEffect(() => saveStorage('products', products), [products]);
  useEffect(() => saveStorage('branchStock', branchStock), [branchStock]);
  useEffect(() => saveStorage('sales', sales), [sales]);
  useEffect(() => saveStorage('customers', customers), [customers]);
  useEffect(() => saveStorage('transfers', transfers), [transfers]);
  useEffect(() => saveStorage('expenses', expenses), [expenses]);
  useEffect(() => saveStorage('returns', returns), [returns]);
  useEffect(() => saveStorage('stocktakes', stocktakes), [stocktakes]);
  useEffect(() => saveStorage('currentShift', currentShift), [currentShift]);
  useEffect(() => saveStorage('activeBranchId', activeBranchId), [activeBranchId]);
  useEffect(() => saveStorage('currentUser', currentUser), [currentUser]);
  useEffect(() => saveStorage('users', users), [users]);
  useEffect(() => saveStorage('branches', branches), [branches]);

  const activeBranch = branches.find((b) => b.id === activeBranchId) || branches[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSetCurrentUser = (user: User) => {
    setCurrentUser(user);
    if (user.branchId !== null) {
      setActiveBranchId(user.branchId);
      showToast(`چوویتەژوورەوە وەک: ${user.name} (لقی ${user.branchId})`);
    } else {
      showToast(`چوویتەژوورەوە وەک ئەدمینی سەرەکی (دەسەڵاتی تەواو بەسەر ٦ لقەکەدا)`);
    }
  };

  const loginWithCredentials = (username: string, password?: string): boolean => {
    const user = users.find((u) => u.username.toLowerCase() === username.trim().toLowerCase());
    if (!user) {
      showToast('ناوی بەکارهێنەر نەدۆزرایەوە!');
      return false;
    }
    if (password && user.password && user.password !== password) {
      showToast('وشەی نهێنی (پاسۆرد) هەڵەیە!');
      return false;
    }
    setCurrentUser(user);
    if (user.branchId !== null) {
      setActiveBranchId(user.branchId);
      showToast(`چوویتەژوورەوە وەک ${user.name} بۆ لقی ${user.branchId}`);
    } else {
      showToast(`چوویتەژوورەوە وەک ئەدمینی سەرەکی (لیدەر)`);
    }
    return true;
  };

  const logout = () => {
    setCurrentUser(users[0]);
    showToast('دەرچوویت لە هەژمار و گەڕایتەوە بۆ سەرەکی');
  };

  const addUser = (userData: Omit<User, 'id'>) => {
    const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const newUser: User = { ...userData, id: newId };
    setUsers((prev) => [...prev, newUser]);
    showToast(`بەکارهێنەری نوێ '${newUser.name}' زیادکرا!`);
  };

  const addBranch = (branchData: Omit<Branch, 'id'>) => {
    const newId = branches.length > 0 ? Math.max(...branches.map((b) => b.id)) + 1 : 1;
    const newBranch: Branch = { ...branchData, id: newId };
    setBranches((prev) => [...prev, newBranch]);
    showToast(`لقی نوێ "${newBranch.nameKu}" زیادکرا!`);
  };

  const updateBranch = (id: number, data: Partial<Branch>) => {
    setBranches((prev) => prev.map((b) => (b.id === id ? { ...b, ...data } : b)));
    showToast('زانیارییەکانی لق بە سەرکەوتوویی نوێکرانەوە!');
  };

  const toggleBranchActive = (id: number) => {
    setBranches((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
    showToast('دۆخی چالاکی لق گۆڕدرا!');
  };

  const deleteBranch = (id: number) => {
    if (branches.length <= 1) {
      showToast('ناتوانیت هەموو لقەکان بسڕیتەوە! بەلایەنی کەم پێویستە یەک لق بمێنێتەوە.');
      return;
    }
    setBranches((prev) => prev.filter((b) => b.id !== id));
    if (activeBranchId === id) {
      const remaining = branches.filter((b) => b.id !== id);
      if (remaining.length > 0) setActiveBranchId(remaining[0].id);
    }
    showToast('لق سڕایەوە!');
  };

  const updateUserPermissions = (userId: number, permissions: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...permissions } : u)));
    showToast('دەسەڵاتەکانی بەکارهێنەر نوێکرانەوە!');
  };

  // Stock helpers
  const getProductStock = (productId: number, branchId: number = activeBranchId): number => {
    const record = branchStock.find((s) => s.productId === productId && s.branchId === branchId);
    return record ? record.quantity : 0;
  };

  const adjustStock = (productId: number, branchId: number, newQty: number, reason: string) => {
    setBranchStock((prev) => {
      const existing = prev.find((s) => s.productId === productId && s.branchId === branchId);
      if (existing) {
        return prev.map((s) => (s.productId === productId && s.branchId === branchId ? { ...s, quantity: newQty } : s));
      } else {
        return [...prev, { branchId, productId, quantity: newQty }];
      }
    });
    showToast(`کۆگای بەرهەم نوێکرایەوە بۆ ${newQty} دانە (${reason})`);
  };

  // Products CRUD
  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
    const newProduct: Product = { ...prodData, id: newId };
    setProducts((prev) => [newProduct, ...prev]);

    // Give default stock to current branch
    setBranchStock((prev) => [
      ...prev,
      { branchId: activeBranchId, productId: newId, quantity: 10, shelfLocation: 'نوێ' }
    ]);
    showToast(`بەرهەمی "${newProduct.nameKu}" بە سەرکەوتوویی زیادکرا!`);
  };

  const updateProduct = (id: number, data: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
    showToast('زانیاری بەرهەم نوێکرایەوە!');
  };

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('بەرهەم سڕایەوە!');
  };

  // Cart & POS
  const addToCart = (product: Product, qty: number = 1): boolean => {
    const currentStock = getProductStock(product.id, activeBranchId);
    const existing = cart.find((item) => item.product.id === product.id);
    const existingQty = existing ? existing.quantity : 0;

    if (existingQty + qty > currentStock) {
      showToast(`بڕی بەردەست لە لقی ${activeBranch.nameKu} تەنها ${currentStock} دانەیە!`);
      return false;
    }

    if (existing) {
      setCart((prev) =>
        prev.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + qty,
                total: (item.quantity + qty) * item.unitPrice - item.discount
              }
            : item
        )
      );
    } else {
      setCart((prev) => [
        ...prev,
        {
          product,
          quantity: qty,
          unitPrice: product.sellingPrice,
          unitCost: product.purchasePrice,
          discount: 0,
          total: qty * product.sellingPrice
        }
      ]);
    }
    showToast(`"${product.nameKu}" زیادکرا بۆ سەبەتە`);
    return true;
  };

  const updateCartQuantity = (productId: number, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    const currentStock = getProductStock(productId, activeBranchId);
    if (qty > currentStock) {
      showToast(`تەنها ${currentStock} دانە لە کۆگا ماوە!`);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: qty, total: qty * item.unitPrice - item.discount }
          : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((sum, item) => sum + item.total, 0);
  const cartCogs = cart.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);

  const completeSale = (data: {
    customerId?: number;
    customerName?: string;
    discount: number;
    paymentMethod: PaymentMethod;
    paidAmount: number;
    currency: 'IQD' | 'USD';
  }): Sale | null => {
    if (cart.length === 0) {
      showToast('سەبەتەی فرۆشتن بەتاڵە!');
      return null;
    }

    const subtotal = cartTotal;
    const finalTotal = Math.max(0, subtotal - data.discount);
    const costOfGoodsSold = cartCogs;
    const grossProfit = Math.max(0, finalTotal - costOfGoodsSold);

    let paidAmount = data.paidAmount;
    let remainingDebt = Math.max(0, finalTotal - paidAmount);

    if (data.paymentMethod === 'debt') {
      paidAmount = 0;
      remainingDebt = finalTotal;
    } else if (data.paymentMethod === 'cash' || data.paymentMethod === 'card') {
      remainingDebt = 0;
      paidAmount = finalTotal;
    }

    const invoiceNum = `INV-${activeBranch.code}-${Date.now().toString().slice(-6)}`;

    const newSale: Sale = {
      id: Date.now(),
      invoiceNumber: invoiceNum,
      branchId: activeBranchId,
      cashierId: currentUser.id,
      cashierName: currentUser.name,
      customerId: data.customerId,
      customerName: data.customerName || (data.customerId ? customers.find((c) => c.id === data.customerId)?.fullName : 'کڕیاری گشتی'),
      subtotal,
      discount: data.discount,
      totalAmount: finalTotal,
      costOfGoodsSold,
      grossProfit,
      paidAmount,
      remainingDebt,
      paymentMethod: data.paymentMethod,
      currency: data.currency,
      exchangeRate,
      items: cart.map((item) => ({
        productId: item.product.id,
        productNameKu: item.product.nameKu,
        barcode: item.product.barcode,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        unitCost: item.unitCost,
        totalPrice: item.total,
        grossProfit: item.total - item.quantity * item.unitCost
      })),
      date: new Date().toISOString(),
      status: 'completed'
    };

    // 1. Deduct stock from active branch
    setBranchStock((prev) =>
      prev.map((stock) => {
        const soldItem = cart.find((i) => i.product.id === stock.productId && stock.branchId === activeBranchId);
        if (soldItem) {
          return { ...stock, quantity: Math.max(0, stock.quantity - soldItem.quantity) };
        }
        return stock;
      })
    );

    // 2. If debt, update customer account
    if (data.customerId && remainingDebt > 0) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === data.customerId
            ? {
                ...c,
                totalDebt: c.totalDebt + remainingDebt,
                currentBalance: c.currentBalance + remainingDebt
              }
            : c
        )
      );
      setCustomerTransactions((prev) => [
        {
          id: Date.now(),
          customerId: data.customerId!,
          branchId: activeBranchId,
          type: 'sale_debt',
          amount: remainingDebt,
          invoiceNumber: invoiceNum,
          notes: 'قەرزی فاکتۆری فرۆشتن',
          date: new Date().toISOString()
        },
        ...prev
      ]);
    }

    // 3. Update cash register if cash
    if (currentShift && (data.paymentMethod === 'cash' || data.paymentMethod === 'mixed')) {
      setCurrentShift((prev) =>
        prev
          ? {
              ...prev,
              expectedCashIqd: prev.expectedCashIqd + paidAmount
            }
          : null
      );
    }

    // 4. Save sale & clear cart
    setSales((prev) => [newSale, ...prev]);
    setLatestSale(newSale);
    clearCart();
    showToast(`فاکتۆری ${invoiceNum} بە سەرکەوتوویی دەرکرا!`);
    return newSale;
  };

  // Customers & Debts
  const addCustomer = (custData: Omit<Customer, 'id' | 'totalDebt' | 'totalPaid' | 'currentBalance'>) => {
    const newCust: Customer = {
      ...custData,
      id: Date.now(),
      totalDebt: 0,
      totalPaid: 0,
      currentBalance: 0
    };
    setCustomers((prev) => [newCust, ...prev]);
    showToast(`کڕیار "${newCust.fullName}" تۆمارکرا!`);
  };

  const recordCustomerPayment = (customerId: number, amount: number, notes?: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? {
              ...c,
              totalPaid: c.totalPaid + amount,
              currentBalance: Math.max(0, c.currentBalance - amount)
            }
          : c
      )
    );

    setCustomerTransactions((prev) => [
      {
        id: Date.now(),
        customerId,
        branchId: activeBranchId,
        type: 'payment',
        amount,
        notes: notes || 'وەرگرتنەوەی پارەی قەرز لە کاشێر',
        date: new Date().toISOString()
      },
      ...prev
    ]);

    if (currentShift) {
      setCurrentShift((prev) =>
        prev
          ? {
              ...prev,
              expectedCashIqd: prev.expectedCashIqd + amount
            }
          : null
      );
    }

    showToast(`بڕی ${amount.toLocaleString()} د.ع قەرز لە کڕیار وەرگیرایەوە`);
  };

  // Inter-Branch Stock Transfers
  const createTransfer = (
    sourceBranchId: number,
    destBranchId: number,
    items: { productId: number; requestedQty: number }[],
    notes?: string
  ) => {
    const srcBranch = branches.find((b) => b.id === sourceBranchId);
    const dstBranch = branches.find((b) => b.id === destBranchId);

    const newTransfer: StockTransfer = {
      id: Date.now(),
      transferNumber: `TRF-${Date.now().toString().slice(-6)}`,
      sourceBranchId,
      sourceBranchName: srcBranch ? srcBranch.nameKu : `لقی ${sourceBranchId}`,
      destinationBranchId: destBranchId,
      destinationBranchName: dstBranch ? dstBranch.nameKu : `لقی ${destBranchId}`,
      requesterName: currentUser.name,
      status: 'pending',
      requestDate: new Date().toISOString(),
      notes,
      items: items.map((i) => {
        const prod = products.find((p) => p.id === i.productId);
        return {
          productId: i.productId,
          productNameKu: prod ? prod.nameKu : 'بەرهەم',
          barcode: prod ? prod.barcode : '',
          requestedQty: i.requestedQty
        };
      })
    };

    setTransfers((prev) => [newTransfer, ...prev]);
    showToast(`داواکاری حەواڵەی ${newTransfer.transferNumber} دروستکرا!`);
  };

  const approveTransfer = (transferId: number) => {
    setTransfers((prev) =>
      prev.map((t) => (t.id === transferId ? { ...t, status: 'dispatched' } : t))
    );
    showToast('حەواڵە پەسەندکرا و لە لقی سەرچاوەوە نێردرا!');
  };

  const receiveTransfer = (transferId: number) => {
    const tr = transfers.find((t) => t.id === transferId);
    if (!tr) return;

    // Deduct from source branch, add to destination branch
    setBranchStock((prev) => {
      let updated = [...prev];
      tr.items.forEach((item) => {
        // deduct from source
        const srcIdx = updated.findIndex((s) => s.productId === item.productId && s.branchId === tr.sourceBranchId);
        if (srcIdx >= 0) {
          updated[srcIdx] = { ...updated[srcIdx], quantity: Math.max(0, updated[srcIdx].quantity - item.requestedQty) };
        }
        // add to dest
        const dstIdx = updated.findIndex((s) => s.productId === item.productId && s.branchId === tr.destinationBranchId);
        if (dstIdx >= 0) {
          updated[dstIdx] = { ...updated[dstIdx], quantity: updated[dstIdx].quantity + item.requestedQty };
        } else {
          updated.push({ branchId: tr.destinationBranchId, productId: item.productId, quantity: item.requestedQty });
        }
      });
      return updated;
    });

    setTransfers((prev) =>
      prev.map((t) =>
        t.id === transferId
          ? { ...t, status: 'received', receiveDate: new Date().toISOString() }
          : t
      )
    );
    showToast('کاڵاکان لە لقی مەبەست وەرگیران و باڵانسی هەردوو کۆگا نوێکرایەوە!');
  };

  // Purchases
  const addPurchase = (
    supplierId: number,
    items: { productId: number; quantity: number; purchaseCost: number }[],
    paidAmount: number
  ) => {
    const supp = suppliers.find((s) => s.id === supplierId);
    const totalAmount = items.reduce((sum, i) => sum + i.quantity * i.purchaseCost, 0);
    const remainingDebt = Math.max(0, totalAmount - paidAmount);

    const newPurchase: Purchase = {
      id: Date.now(),
      invoiceNumber: `PUR-${Date.now().toString().slice(-6)}`,
      branchId: activeBranchId,
      supplierId,
      supplierName: supp ? supp.name : 'دابینکەر',
      date: new Date().toISOString(),
      totalAmount,
      paidAmount,
      remainingDebt,
      items: items.map((i) => {
        const prod = products.find((p) => p.id === i.productId);
        return {
          productId: i.productId,
          productNameKu: prod ? prod.nameKu : 'بەرهەم',
          quantity: i.quantity,
          purchaseCost: i.purchaseCost,
          totalCost: i.quantity * i.purchaseCost
        };
      })
    };

    // Increment branch stock
    setBranchStock((prev) => {
      let updated = [...prev];
      items.forEach((item) => {
        const idx = updated.findIndex((s) => s.productId === item.productId && s.branchId === activeBranchId);
        if (idx >= 0) {
          updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + item.quantity };
        } else {
          updated.push({ branchId: activeBranchId, productId: item.productId, quantity: item.quantity });
        }
      });
      return updated;
    });

    setPurchases((prev) => [newPurchase, ...prev]);
    showToast(`فاکتۆری کڕین تۆمارکرا و کۆگای لقی ${activeBranch.nameKu} زیادکرا!`);
  };

  // Expenses & Cash Registers
  const addExpense = (categoryKu: string, amount: number, description: string) => {
    const newExp: Expense = {
      id: Date.now(),
      branchId: activeBranchId,
      categoryKu,
      amount,
      currency: 'IQD',
      date: new Date().toISOString().split('T')[0],
      description,
      recordedBy: currentUser.name
    };

    setExpenses((prev) => [newExp, ...prev]);

    if (currentShift) {
      setCurrentShift((prev) =>
        prev
          ? {
              ...prev,
              expectedCashIqd: Math.max(0, prev.expectedCashIqd - amount)
            }
          : null
      );
    }
    showToast(`خەرجی بە بڕی ${amount.toLocaleString()} د.ع تۆمارکرا`);
  };

  const openShift = (openingBalanceIqd: number) => {
    setCurrentShift({
      id: Date.now(),
      branchId: activeBranchId,
      cashierName: currentUser.name,
      openingTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      openingBalanceIqd,
      expectedCashIqd: openingBalanceIqd,
      isOpen: true
    });
    showToast('شەفتی نوێی قاسە کرایەوە');
  };

  const closeShift = (closingCashIqd: number, notes?: string) => {
    if (!currentShift) return;
    const diff = closingCashIqd - currentShift.expectedCashIqd;
    setCurrentShift({
      ...currentShift,
      closingTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      closingCashIqd,
      differenceIqd: diff,
      isOpen: false,
      notes
    });
    showToast(`شەفت داخرا. جیاوازی پارە: ${diff.toLocaleString()} د.ع`);
  };

  // Returns & Exchanges
  const processReturn = (data: {
    saleInvoiceNumber: string;
    items: ReturnItem[];
    refundMethod: 'cash' | 'card' | 'customer_credit' | 'exchange';
    reason: string;
  }): ReturnRecord | null => {
    const originalSale = sales.find((s) => s.invoiceNumber === data.saleInvoiceNumber);
    if (!originalSale) {
      showToast('فاکتۆری سەرەکی نەدۆزرایەوە!');
      return null;
    }

    const totalRefund = data.items.reduce((sum, item) => sum + item.quantity * item.unitRefundPrice, 0);

    const newReturn: ReturnRecord = {
      id: Date.now(),
      returnNumber: `RET-${Date.now().toString().slice(-6)}`,
      saleInvoiceNumber: data.saleInvoiceNumber,
      branchId: activeBranchId,
      cashierName: currentUser.name,
      customerName: originalSale.customerName,
      refundMethod: data.refundMethod,
      totalRefundAmount: totalRefund,
      reason: data.reason,
      items: data.items,
      date: new Date().toISOString()
    };

    // Restock items in active branch if condition === 'good'
    setBranchStock((prev) => {
      let updated = [...prev];
      data.items.forEach((item) => {
        if (item.action === 'restock') {
          const idx = updated.findIndex((s) => s.productId === item.productId && s.branchId === activeBranchId);
          if (idx >= 0) {
            updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + item.quantity };
          } else {
            updated.push({ branchId: activeBranchId, productId: item.productId, quantity: item.quantity });
          }
        }
      });
      return updated;
    });

    // Update Cash register if refund cash
    if (currentShift && data.refundMethod === 'cash') {
      setCurrentShift((prev) =>
        prev
          ? {
              ...prev,
              expectedCashIqd: Math.max(0, prev.expectedCashIqd - totalRefund)
            }
          : null
      );
    }

    // Update customer credit balance if customer_credit
    if (originalSale.customerId && data.refundMethod === 'customer_credit') {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === originalSale.customerId
            ? {
                ...c,
                currentBalance: Math.max(0, c.currentBalance - totalRefund)
              }
            : c
        )
      );
    }

    setReturns((prev) => [newReturn, ...prev]);
    showToast(`گەڕاندنەوەی ${newReturn.returnNumber} تۆمارکرا (${totalRefund.toLocaleString()} د.ع)`);
    return newReturn;
  };

  // Stocktaking (سەرژمێری فەرمی کۆگا)
  const performStocktake = (
    items: { productId: number; countedQty: number }[],
    notes?: string
  ): Stocktake => {
    let totalSys = 0;
    let totalCounted = 0;
    let totalDiffCost = 0;

    const stocktakeItems: StocktakeItem[] = items.map((item) => {
      const prod = products.find((p) => p.id === item.productId);
      const sysQty = getProductStock(item.productId, activeBranchId);
      const diffQty = item.countedQty - sysQty;
      const unitCost = prod ? prod.purchasePrice : 0;
      const diffCost = diffQty * unitCost;

      totalSys += sysQty;
      totalCounted += item.countedQty;
      totalDiffCost += diffCost;

      let status: 'match' | 'shortage' | 'surplus' = 'match';
      if (diffQty < 0) status = 'shortage';
      else if (diffQty > 0) status = 'surplus';

      return {
        productId: item.productId,
        productNameKu: prod ? prod.nameKu : 'بەرهەم',
        barcode: prod ? prod.barcode : '',
        systemQty: sysQty,
        countedQty: item.countedQty,
        differenceQty: diffQty,
        unitCost,
        differenceCost: diffCost,
        status
      };
    });

    const newStocktake: Stocktake = {
      id: Date.now(),
      stocktakeNumber: `STK-${Date.now().toString().slice(-6)}`,
      branchId: activeBranchId,
      branchNameKu: activeBranch.nameKu,
      conductedBy: currentUser.name,
      date: new Date().toISOString(),
      totalSystemQty: totalSys,
      totalCountedQty: totalCounted,
      totalDifferenceCost: totalDiffCost,
      notes,
      isAdjusted: false,
      items: stocktakeItems
    };

    setStocktakes((prev) => [newStocktake, ...prev]);
    showToast(`سەرژمێری ${newStocktake.stocktakeNumber} ئەنجامدرا!`);
    return newStocktake;
  };

  const applyStocktakeAdjustment = (stocktakeId: number) => {
    const stk = stocktakes.find((s) => s.id === stocktakeId);
    if (!stk || stk.isAdjusted) return;

    // Adjust branch stock
    setBranchStock((prev) => {
      let updated = [...prev];
      stk.items.forEach((item) => {
        const idx = updated.findIndex((s) => s.productId === item.productId && s.branchId === stk.branchId);
        if (idx >= 0) {
          updated[idx] = { ...updated[idx], quantity: item.countedQty };
        } else {
          updated.push({ branchId: stk.branchId, productId: item.productId, quantity: item.countedQty });
        }
      });
      return updated;
    });

    setStocktakes((prev) =>
      prev.map((s) => (s.id === stocktakeId ? { ...s, isAdjusted: true } : s))
    );
    showToast(`باڵانسی کۆگای لقی ${stk.branchNameKu} بەپێی سەرژمێری نوێکرایەوە!`);
  };

  return (
    <StoreContext.Provider
      value={{
        branches,
        activeBranchId,
        setActiveBranchId,
        activeBranch,
        currentUser,
        setCurrentUser: handleSetCurrentUser,
        users,
        loginWithCredentials,
        logout,
        addUser,
        addBranch,
        updateBranch,
        toggleBranchActive,
        deleteBranch,
        updateUserPermissions,
        products,
        branchStock,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductStock,
        adjustStock,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCogs,
        completeSale,
        sales,
        latestSale,
        customers,
        customerTransactions,
        addCustomer,
        recordCustomerPayment,
        transfers,
        createTransfer,
        approveTransfer,
        receiveTransfer,
        suppliers,
        purchases,
        addPurchase,
        expenses,
        addExpense,
        currentShift,
        openShift,
        closeShift,
        returns,
        processReturn,
        stocktakes,
        performStocktake,
        applyStocktakeAdjustment,
        exchangeRate,
        setExchangeRate,
        toastMessage,
        showToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
