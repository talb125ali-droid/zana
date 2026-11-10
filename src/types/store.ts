export type UserRole = 'super_admin' | 'branch_manager' | 'cashier' | 'inventory_staff';

export interface User {
  id: number;
  name: string;
  username: string;
  password?: string;
  role: UserRole;
  roleNameKu: string;
  branchId: number | null; // null = all branches (Super Admin)
  phone: string;
  maxDiscountPercent: number;
  canGiveDebt: boolean;
}

export interface Branch {
  id: number;
  code: string;
  nameKu: string;
  nameEn: string;
  city: string;
  address: string;
  phone: string;
  manager: string;
  isActive: boolean;
  specialtyKu: string;
}

export interface ProductVariant {
  id: number;
  productId: number;
  sku: string;
  barcode: string;
  size?: string;
  color?: string;
  sellingPrice: number;
}

export interface Product {
  id: number;
  categoryId: number;
  categoryNameKu: string;
  brandNameKu: string;
  nameKu: string;
  nameEn?: string;
  code: string;
  barcode: string;
  purchasePrice: number; // Cost of product
  sellingPrice: number;  // Retail price
  wholesalePrice: number;
  minStockAlert: number;
  unit: string;
  descriptionKu?: string;
  hasVariants?: boolean;
  variants?: ProductVariant[];
  image?: string;
}

export interface BranchStock {
  branchId: number;
  productId: number;
  quantity: number;
  shelfLocation?: string;
}

export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  discount: number;
  total: number;
}

export type PaymentMethod = 'cash' | 'card' | 'debt' | 'mixed';

export interface Sale {
  id: number;
  invoiceNumber: string;
  branchId: number;
  cashierId: number;
  cashierName: string;
  customerId?: number;
  customerName?: string;
  subtotal: number;
  discount: number;
  totalAmount: number;
  costOfGoodsSold: number;
  grossProfit: number;
  paidAmount: number;
  remainingDebt: number;
  paymentMethod: PaymentMethod;
  currency: 'IQD' | 'USD';
  exchangeRate: number;
  items: {
    productId: number;
    productNameKu: string;
    barcode: string;
    quantity: number;
    unitPrice: number;
    unitCost: number;
    totalPrice: number;
    grossProfit: number;
  }[];
  date: string;
  status: 'completed' | 'returned' | 'cancelled';
}

export interface Customer {
  id: number;
  branchId: number;
  fullName: string;
  phone: string;
  address: string;
  creditLimit: number;
  totalDebt: number;
  totalPaid: number;
  currentBalance: number;
  notes?: string;
}

export interface CustomerTransaction {
  id: number;
  customerId: number;
  branchId: number;
  type: 'sale_debt' | 'payment';
  amount: number;
  invoiceNumber?: string;
  notes?: string;
  date: string;
}

export interface Supplier {
  id: number;
  name: string;
  contactPerson: string;
  phone: string;
  address: string;
  currentBalance: number;
}

export interface PurchaseItem {
  productId: number;
  productNameKu: string;
  quantity: number;
  purchaseCost: number;
  totalCost: number;
}

export interface Purchase {
  id: number;
  invoiceNumber: string;
  branchId: number;
  supplierId: number;
  supplierName: string;
  date: string;
  totalAmount: number;
  paidAmount: number;
  remainingDebt: number;
  items: PurchaseItem[];
}

export type TransferStatus = 'pending' | 'approved' | 'dispatched' | 'received' | 'rejected';

export interface StockTransfer {
  id: number;
  transferNumber: string;
  sourceBranchId: number;
  sourceBranchName: string;
  destinationBranchId: number;
  destinationBranchName: string;
  requesterName: string;
  status: TransferStatus;
  requestDate: string;
  receiveDate?: string;
  notes?: string;
  items: {
    productId: number;
    productNameKu: string;
    barcode: string;
    requestedQty: number;
    receivedQty?: number;
  }[];
}

export interface Expense {
  id: number;
  branchId: number;
  categoryKu: string;
  amount: number;
  currency: 'IQD' | 'USD';
  date: string;
  description: string;
  recordedBy: string;
}

export interface CashRegisterShift {
  id: number;
  branchId: number;
  cashierName: string;
  openingTime: string;
  closingTime?: string;
  openingBalanceIqd: number;
  expectedCashIqd: number;
  closingCashIqd?: number;
  differenceIqd?: number;
  isOpen: boolean;
  notes?: string;
}

export interface ReturnItem {
  productId: number;
  productNameKu: string;
  quantity: number;
  unitRefundPrice: number;
  unitCostSnapshot: number;
  condition: 'good' | 'damaged' | 'scrap';
  action: 'restock' | 'dispose';
}

export interface ReturnRecord {
  id: number;
  returnNumber: string;
  saleInvoiceNumber: string;
  branchId: number;
  cashierName: string;
  customerName?: string;
  refundMethod: 'cash' | 'card' | 'customer_credit' | 'exchange';
  totalRefundAmount: number;
  reason: string;
  items: ReturnItem[];
  exchangeSaleId?: number;
  date: string;
}

export interface StocktakeItem {
  productId: number;
  productNameKu: string;
  barcode: string;
  systemQty: number;
  countedQty: number;
  differenceQty: number; // counted - system
  unitCost: number;
  differenceCost: number;
  status: 'match' | 'shortage' | 'surplus';
}

export interface Stocktake {
  id: number;
  stocktakeNumber: string;
  branchId: number;
  branchNameKu: string;
  conductedBy: string;
  date: string;
  totalSystemQty: number;
  totalCountedQty: number;
  totalDifferenceCost: number;
  notes?: string;
  isAdjusted: boolean;
  items: StocktakeItem[];
}

