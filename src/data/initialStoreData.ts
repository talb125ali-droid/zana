import { Product, BranchStock, Customer, Supplier, Branch, User, Expense } from '../types/store';

export const INITIAL_BRANCHES: Branch[] = [
  { id: 1, code: 'BR-01', nameKu: 'لقی ١ - زانا (مەرکەزی)', nameEn: 'Branch 1 - Zana Central', city: 'هەولێر', address: 'شەقامی ٦٠ مەتری، نزیک فامیلی مۆڵ', phone: '0750 111 2231', manager: 'کاروان حەمە', isActive: true, specialtyKu: 'لقی سەرەکی و کۆگای ناوەندی و سەرجەم بەرهەمەکان' },
  { id: 2, code: 'BR-02', nameKu: 'لقی ٢ - زانا (ئیسکان)', nameEn: 'Branch 2 - Zana Iskan', city: 'هەولێر', address: 'شەقامی ئیسکان، بازاڕی زانا', phone: '0750 111 2232', manager: 'ئاراس ئەحمەد', isActive: true, specialtyKu: 'تایبەتمەند لە جوانکاری، میکیاژ و عەتری فەرەنسی' },
  { id: 3, code: 'BR-03', nameKu: 'لقی ٣ - زانا (بەختیاری)', nameEn: 'Branch 3 - Zana Bakhtiyari', city: 'هەولێر', address: 'گەڕەکی بەختیاری، تەنیشت پارک', phone: '0750 111 2233', manager: 'ڕەوەند فەرهاد', isActive: true, specialtyKu: 'پۆشاکی مۆدێل بەرز، ئێکسسوارات و جانتا' },
  { id: 4, code: 'BR-04', nameKu: 'لقی ٤ - زانا (سلێمانی)', nameEn: 'Branch 4 - Zana Sulaymaniyah', city: 'سلێمانی', address: 'شەقامی سالم، نزیک باخی گشتی', phone: '0770 222 3341', manager: 'بەرهەم کەریم', isActive: true, specialtyKu: 'لقی سەرەکی شاری سلێمانی و کەلوپەلی ناوماڵ' },
  { id: 5, code: 'BR-05', nameKu: 'لقی ٥ - زانا (دهۆک)', nameEn: 'Branch 5 - Zana Duhok', city: 'دهۆک', address: 'شەقامی KRO، سەنتەری شار', phone: '0750 333 4451', manager: 'دڵشاد نێچیرڤان', isActive: true, specialtyKu: 'لقی سەرەکی شاری دهۆک و چاودێری پێست' },
  { id: 6, code: 'BR-06', nameKu: 'لقی ٦ - زانا (کەرکووک)', nameEn: 'Branch 6 - Zana Kirkuk', city: 'کەرکووک', address: 'شەقامی کۆماری، نزیک قەڵات', phone: '0770 444 5561', manager: 'عەلی مەحموود', isActive: true, specialtyKu: 'لقی گشتی، قوماش، پەردە و ڕازاندنەوەی ماڵ' }
];

export const INITIAL_USERS: User[] = [
  // Super Admin (Leader over all 6 branches)
  { id: 1, name: 'زانا عەزیز (بەڕێوەبەری گشتی)', username: 'admin', password: 'Admin@123456', role: 'super_admin', roleNameKu: 'بەڕێوەبەری گشتی (لیدەر)', branchId: null, phone: '0750 100 2030', maxDiscountPercent: 100, canGiveDebt: true },

  // Branch 1 - Central Erbil
  { id: 2, name: 'کاروان حەمە (بەڕێوەبەری لقی ١)', username: 'manager_br1', password: 'Br1@123456', role: 'branch_manager', roleNameKu: 'بەڕێوەبەری لقی ١', branchId: 1, phone: '0750 200 3040', maxDiscountPercent: 25, canGiveDebt: true },
  { id: 3, name: 'سەروەر عوسمان (کاشێری لقی ١)', username: 'cashier_br1', password: 'Cash1@123', role: 'cashier', roleNameKu: 'کاشێری لقی ١', branchId: 1, phone: '0750 300 4050', maxDiscountPercent: 10, canGiveDebt: false },
  { id: 4, name: 'هێمن قادر (کارمەندی کۆگای لقی ١)', username: 'stock_br1', password: 'Stock1@123', role: 'inventory_staff', roleNameKu: 'کارمەندی کۆگای لقی ١', branchId: 1, phone: '0750 400 5060', maxDiscountPercent: 0, canGiveDebt: false },

  // Branch 2 - Iskan Erbil
  { id: 5, name: 'ئاراس ئەحمەد (بەڕێوەبەری لقی ٢)', username: 'manager_br2', password: 'Br2@123456', role: 'branch_manager', roleNameKu: 'بەڕێوەبەری لقی ٢', branchId: 2, phone: '0750 200 3042', maxDiscountPercent: 25, canGiveDebt: true },
  { id: 6, name: 'دانا مەجید (کاشێری لقی ٢)', username: 'cashier_br2', password: 'Cash2@123', role: 'cashier', roleNameKu: 'کاشێری لقی ٢', branchId: 2, phone: '0750 300 4052', maxDiscountPercent: 10, canGiveDebt: false },
  { id: 7, name: 'سەردار فەتاح (کارمەندی کۆگای لقی ٢)', username: 'stock_br2', password: 'Stock2@123', role: 'inventory_staff', roleNameKu: 'کارمەندی کۆگای لقی ٢', branchId: 2, phone: '0750 400 5062', maxDiscountPercent: 0, canGiveDebt: false },

  // Branch 3 - Bakhtiyari Erbil
  { id: 8, name: 'ڕەوەند فەرهاد (بەڕێوەبەری لقی ٣)', username: 'manager_br3', password: 'Br3@123456', role: 'branch_manager', roleNameKu: 'بەڕێوەبەری لقی ٣', branchId: 3, phone: '0750 200 3043', maxDiscountPercent: 25, canGiveDebt: true },
  { id: 9, name: 'ڕێبین سالار (کاشێری لقی ٣)', username: 'cashier_br3', password: 'Cash3@123', role: 'cashier', roleNameKu: 'کاشێری لقی ٣', branchId: 3, phone: '0750 300 4053', maxDiscountPercent: 10, canGiveDebt: false },

  // Branch 4 - Sulaymaniyah
  { id: 10, name: 'بەرهەم کەریم (بەڕێوەبەری لقی ٤)', username: 'manager_br4', password: 'Br4@123456', role: 'branch_manager', roleNameKu: 'بەڕێوەبەری لقی ٤', branchId: 4, phone: '0770 200 3044', maxDiscountPercent: 25, canGiveDebt: true },
  { id: 11, name: 'شاخەوان عومەر (کاشێری لقی ٤)', username: 'cashier_br4', password: 'Cash4@123', role: 'cashier', roleNameKu: 'کاشێری لقی ٤', branchId: 4, phone: '0770 300 4054', maxDiscountPercent: 10, canGiveDebt: false },

  // Branch 5 - Duhok
  { id: 12, name: 'دڵشاد نێچیرڤان (بەڕێوەبەری لقی ٥)', username: 'manager_br5', password: 'Br5@123456', role: 'branch_manager', roleNameKu: 'بەڕێوەبەری لقی ٥', branchId: 5, phone: '0750 200 3045', maxDiscountPercent: 25, canGiveDebt: true },
  { id: 13, name: 'ڕێبوار سەعید (کاشێری لقی ٥)', username: 'cashier_br5', password: 'Cash5@123', role: 'cashier', roleNameKu: 'کاشێری لقی ٥', branchId: 5, phone: '0750 300 4055', maxDiscountPercent: 10, canGiveDebt: false },

  // Branch 6 - Kirkuk
  { id: 14, name: 'عەلی مەحموود (بەڕێوەبەری لقی ٦)', username: 'manager_br6', password: 'Br6@123456', role: 'branch_manager', roleNameKu: 'بەڕێوەبەری لقی ٦', branchId: 6, phone: '0770 200 3046', maxDiscountPercent: 25, canGiveDebt: true },
  { id: 15, name: 'یوسف ڕەشید (کاشێری لقی ٦)', username: 'cashier_br6', password: 'Cash6@123', role: 'cashier', roleNameKu: 'کاشێری لقی ٦', branchId: 6, phone: '0770 300 4056', maxDiscountPercent: 10, canGiveDebt: false }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    categoryId: 1,
    categoryNameKu: 'جوانکاری و مەیکئەپ',
    brandNameKu: 'هودا بیوتی',
    nameKu: 'سوراوی مات هودا بیوتی (Power Bullet)',
    nameEn: 'Huda Beauty Matte Lipstick',
    code: 'PRD-101',
    barcode: '869100100101',
    purchasePrice: 18000,
    sellingPrice: 32000,
    wholesalePrice: 28000,
    minStockAlert: 5,
    unit: 'دانە',
    descriptionKu: 'سوراوی لێوی ماتی ئەسڵی بە مانەوەی ٢٤ کاتژمێری'
  },
  {
    id: 2,
    categoryId: 1,
    categoryNameKu: 'جوانکاری و مەیکئەپ',
    brandNameKu: 'ماک',
    nameKu: 'فاوەندەیشنی ماک Studio Fix Fluid SPF 15',
    nameEn: 'MAC Studio Fix Fluid Foundation',
    code: 'PRD-102',
    barcode: '869100100102',
    purchasePrice: 35000,
    sellingPrice: 58000,
    wholesalePrice: 52000,
    minStockAlert: 4,
    unit: 'دانە',
    descriptionKu: 'داپۆشەری تەواوی پەڵە بە کۆنترۆڵی چەوری پێست'
  },
  {
    id: 3,
    categoryId: 2,
    categoryNameKu: 'چاودێری پێست و کەسی',
    brandNameKu: 'لۆریال',
    nameKu: 'سیرۆمی هیالۆرۆنیک ئەسید بۆ شێداری پێست',
    nameEn: "L'Oreal Revitalift Hyaluronic Serum",
    code: 'PRD-201',
    barcode: '869100100201',
    purchasePrice: 19000,
    sellingPrice: 35000,
    wholesalePrice: 30000,
    minStockAlert: 6,
    unit: 'دانە',
    descriptionKu: 'سیرۆمی شێدارکەرەوەی قووڵی ڕووخسار بە قەبارەی 30ml'
  },
  {
    id: 4,
    categoryId: 2,
    categoryNameKu: 'چاودێری پێست و کەسی',
    brandNameKu: 'لارۆش پۆزەی',
    nameKu: 'کرێمی دژەخۆری Anthelios SPF 50+',
    nameEn: 'La Roche-Posay Anthelios SPF50',
    code: 'PRD-202',
    barcode: '869100100202',
    purchasePrice: 22000,
    sellingPrice: 38000,
    wholesalePrice: 33000,
    minStockAlert: 5,
    unit: 'دانە',
    descriptionKu: 'پارێزەری بەهێزی دژە تیشکی خۆر بەبێ جێهێشتنی سپیاتی'
  },
  {
    id: 5,
    categoryId: 3,
    categoryNameKu: 'بۆن و عەتر',
    brandNameKu: 'شانێل',
    nameKu: 'عەتری پیاوان Bleu de Chanel Eau de Parfum 100ml',
    nameEn: 'Bleu de Chanel EDP 100ml',
    code: 'PRD-301',
    barcode: '869100100301',
    purchasePrice: 120000,
    sellingPrice: 195000,
    wholesalePrice: 180000,
    minStockAlert: 2,
    unit: 'شوشە',
    descriptionKu: 'عەتری ئۆرجیناڵی پیاوان بە بۆنی فێنک و چێژبەخش'
  },
  {
    id: 6,
    categoryId: 3,
    categoryNameKu: 'بۆن و عەتر',
    brandNameKu: 'دیۆر',
    nameKu: 'عەتری ئافرەتان Miss Dior Blooming Bouquet',
    nameEn: 'Miss Dior Blooming Bouquet 100ml',
    code: 'PRD-302',
    barcode: '869100100302',
    purchasePrice: 110000,
    sellingPrice: 185000,
    wholesalePrice: 170000,
    minStockAlert: 2,
    unit: 'شوشە',
    descriptionKu: 'عەتری گوڵاوی ناوازەی خانمان لە فەرەنساوە'
  },
  {
    id: 7,
    categoryId: 4,
    categoryNameKu: 'جلوبەرگ و پۆشاک',
    brandNameKu: 'دیزاینی زانا',
    nameKu: 'عەزی شیک و شاهانەی ئافرەتان بە قوماشی ئاوریشم',
    nameEn: 'Luxury Silk Evening Gown',
    code: 'PRD-401',
    barcode: '869100100401',
    purchasePrice: 45000,
    sellingPrice: 85000,
    wholesalePrice: 75000,
    minStockAlert: 3,
    unit: 'دانە',
    descriptionKu: 'عەزی تایبەت بە بۆنە و ئاهەنگەکان'
  },
  {
    id: 8,
    categoryId: 5,
    categoryNameKu: 'ئێکسسوارات',
    brandNameKu: 'ڕۆلێکس ستایل',
    nameKu: 'کاتژمێری ئۆتۆماتیکی پیاوان بە ڕەنگی زێڕین و زیوین',
    nameEn: 'Two-Tone Automatic Luxury Watch',
    code: 'PRD-501',
    barcode: '869100100501',
    purchasePrice: 50000,
    sellingPrice: 95000,
    wholesalePrice: 85000,
    minStockAlert: 3,
    unit: 'دانە',
    descriptionKu: 'دژە ئاو بە شووشەی سافایر'
  },
  {
    id: 9,
    categoryId: 6,
    categoryNameKu: 'جانتا و جانتای پشت',
    brandNameKu: 'مایکڵ کۆرس',
    nameKu: 'جانتای چەرمی دەستی خانمان (Leather Tote)',
    nameEn: 'Designer Leather Handbag',
    code: 'PRD-601',
    barcode: '869100100601',
    purchasePrice: 38000,
    sellingPrice: 72000,
    wholesalePrice: 65000,
    minStockAlert: 4,
    unit: 'دانە',
    descriptionKu: 'جانتای چەرمی بە کوالێتی بەرز بە جزدانی هاوپێچ'
  },
  {
    id: 10,
    categoryId: 7,
    categoryNameKu: 'ڕازاندنەوەی ماڵ',
    brandNameKu: 'زارا هۆم',
    nameKu: 'گوڵدانی کریستاڵی مۆدێرن بە نەخشی زێڕین',
    nameEn: 'Modern Crystal Gold Vase',
    code: 'PRD-701',
    barcode: '869100100701',
    purchasePrice: 20000,
    sellingPrice: 42000,
    wholesalePrice: 35000,
    minStockAlert: 3,
    unit: 'دانە',
    descriptionKu: 'دیکۆری شیک بۆ مێزی ژووری میوان'
  },
  {
    id: 11,
    categoryId: 8,
    categoryNameKu: 'گوڵ و ڕووەکی دەستکرد',
    brandNameKu: 'گوڵزاری زانا',
    nameKu: 'داری دەستکردی Fiddle Leaf Fig بەرزی 160cm',
    nameEn: 'Artificial Fiddle Leaf Fig 160cm',
    code: 'PRD-801',
    barcode: '869100100801',
    purchasePrice: 40000,
    sellingPrice: 75000,
    wholesalePrice: 68000,
    minStockAlert: 2,
    unit: 'دانە',
    descriptionKu: 'داری سەوزی دەستکرد بە گوڵدانی سیرامیکی تایبەت'
  },
  {
    id: 12,
    categoryId: 9,
    categoryNameKu: 'کەلوپەلی ناوماڵ و ئەساس',
    brandNameKu: 'ئەساسی زانا',
    nameKu: 'کورسی مەخمەلی تاک بە پێچکەی زێڕین',
    nameEn: 'Velvet Accent Armchair',
    code: 'PRD-901',
    barcode: '869100100901',
    purchasePrice: 90000,
    sellingPrice: 160000,
    wholesalePrice: 145000,
    minStockAlert: 2,
    unit: 'دانە',
    descriptionKu: 'کورسی نەرم و مۆدێرن بۆ گۆشەی دانیشتن'
  },
  {
    id: 13,
    categoryId: 10,
    categoryNameKu: 'قوماش و پەرۆ',
    brandNameKu: 'قوماشی شاهانە',
    nameKu: 'قوماشی کوردی کریستاڵی نەخشدار بە بەردی درەوشاوە',
    nameEn: 'Luxury Embroidered Crystal Fabric',
    code: 'PRD-1001',
    barcode: '869100101001',
    purchasePrice: 30000,
    sellingPrice: 60000,
    wholesalePrice: 50000,
    minStockAlert: 5,
    unit: 'مەتر',
    descriptionKu: 'قوماشی تایبەتی جلی کوردی بە کوالێتی بەرز'
  }
];

export const INITIAL_BRANCH_STOCK: BranchStock[] = [
  // Branch 1 Stock (Central store - plenty of stock)
  { branchId: 1, productId: 1, quantity: 45, shelfLocation: 'A1-01' },
  { branchId: 1, productId: 2, quantity: 30, shelfLocation: 'A1-02' },
  { branchId: 1, productId: 3, quantity: 40, shelfLocation: 'B2-01' },
  { branchId: 1, productId: 4, quantity: 35, shelfLocation: 'B2-02' },
  { branchId: 1, productId: 5, quantity: 18, shelfLocation: 'C1-VIP' },
  { branchId: 1, productId: 6, quantity: 20, shelfLocation: 'C1-VIP' },
  { branchId: 1, productId: 7, quantity: 22, shelfLocation: 'D1-Rack' },
  { branchId: 1, productId: 8, quantity: 15, shelfLocation: 'E1-Case' },
  { branchId: 1, productId: 9, quantity: 25, shelfLocation: 'F1-Shelf' },
  { branchId: 1, productId: 10, quantity: 16, shelfLocation: 'G1-Decor' },
  { branchId: 1, productId: 11, quantity: 12, shelfLocation: 'H1-Plants' },
  { branchId: 1, productId: 12, quantity: 8, shelfLocation: 'I1-Floor' },
  { branchId: 1, productId: 13, quantity: 80, shelfLocation: 'J1-Rolls' },

  // Branch 2 Stock (Iskan - Makeup & Perfume specialty)
  { branchId: 2, productId: 1, quantity: 35, shelfLocation: 'A1-Display' },
  { branchId: 2, productId: 2, quantity: 25, shelfLocation: 'A2-Display' },
  { branchId: 2, productId: 3, quantity: 20, shelfLocation: 'B1-Skincare' },
  { branchId: 2, productId: 4, quantity: 15, shelfLocation: 'B2-Skincare' },
  { branchId: 2, productId: 5, quantity: 12, shelfLocation: 'C1-Perfume' },
  { branchId: 2, productId: 6, quantity: 14, shelfLocation: 'C2-Perfume' },
  { branchId: 2, productId: 7, quantity: 5, shelfLocation: 'D1-Fashion' },
  { branchId: 2, productId: 8, quantity: 10, shelfLocation: 'E1-Watch' },
  { branchId: 2, productId: 9, quantity: 12, shelfLocation: 'F1-Bags' },
  { branchId: 2, productId: 10, quantity: 6, shelfLocation: 'G1-Decor' },
  { branchId: 2, productId: 11, quantity: 4, shelfLocation: 'H1-Plants' },
  { branchId: 2, productId: 12, quantity: 2, shelfLocation: 'I1-Floor' },
  { branchId: 2, productId: 13, quantity: 20, shelfLocation: 'J1-Rolls' },

  // Branch 3 Stock (Bakhtiyari - Fashion & Luxury)
  { branchId: 3, productId: 1, quantity: 18, shelfLocation: 'A1' },
  { branchId: 3, productId: 2, quantity: 15, shelfLocation: 'A2' },
  { branchId: 3, productId: 5, quantity: 10, shelfLocation: 'C1' },
  { branchId: 3, productId: 6, quantity: 12, shelfLocation: 'C2' },
  { branchId: 3, productId: 7, quantity: 30, shelfLocation: 'D1' },
  { branchId: 3, productId: 8, quantity: 20, shelfLocation: 'E1' },
  { branchId: 3, productId: 9, quantity: 24, shelfLocation: 'F1' },

  // Branch 4 Stock (Sulaymaniyah)
  { branchId: 4, productId: 1, quantity: 25, shelfLocation: 'A1' },
  { branchId: 4, productId: 3, quantity: 20, shelfLocation: 'B1' },
  { branchId: 4, productId: 5, quantity: 8, shelfLocation: 'C1' },
  { branchId: 4, productId: 10, quantity: 15, shelfLocation: 'G1' },
  { branchId: 4, productId: 11, quantity: 10, shelfLocation: 'H1' },
  { branchId: 4, productId: 12, quantity: 6, shelfLocation: 'I1' },

  // Branch 5 Stock (Duhok)
  { branchId: 5, productId: 1, quantity: 20, shelfLocation: 'A1' },
  { branchId: 5, productId: 2, quantity: 18, shelfLocation: 'A2' },
  { branchId: 5, productId: 3, quantity: 22, shelfLocation: 'B1' },
  { branchId: 5, productId: 4, quantity: 18, shelfLocation: 'B2' },
  { branchId: 5, productId: 5, quantity: 6, shelfLocation: 'C1' },

  // Branch 6 Stock (Kirkuk)
  { branchId: 6, productId: 1, quantity: 15, shelfLocation: 'A1' },
  { branchId: 6, productId: 7, quantity: 12, shelfLocation: 'D1' },
  { branchId: 6, productId: 9, quantity: 10, shelfLocation: 'F1' },
  { branchId: 6, productId: 13, quantity: 60, shelfLocation: 'J1' }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 1, branchId: 1, fullName: 'ئالان کامەران', phone: '0750 445 1122', address: 'هەولێر - وەزیران', creditLimit: 500000, totalDebt: 125000, totalPaid: 350000, currentBalance: 125000, notes: 'کڕیاری بەردەوامی بەشی عەتر و جلوبەرگ' },
  { id: 2, branchId: 1, fullName: 'سۆران سەردار', phone: '0750 678 3344', address: 'هەولێر - فەرمانبەران', creditLimit: 300000, totalDebt: 0, totalPaid: 210000, currentBalance: 0, notes: 'پارەدانی نەقدە بە بەردەوامی' },
  { id: 3, branchId: 2, fullName: 'شیلان هێرش', phone: '0750 999 5566', address: 'هەولێر - برایەتی', creditLimit: 400000, totalDebt: 85000, totalPaid: 150000, currentBalance: 85000, notes: 'کڕیاری تایبەتی ماکیاژ و پێست' },
  { id: 4, branchId: 4, fullName: 'ڕێباز عەبدوڵڵا', phone: '0770 123 7788', address: 'سلێمانی - ڕزگاری', creditLimit: 600000, totalDebt: 240000, totalPaid: 400000, currentBalance: 240000, notes: 'کڕیاری کەلوپەلی ماڵ و دیکۆر' }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  { id: 1, name: 'کۆمپانیای ئەڵماس بۆ جوانکاری و عەتر', contactPerson: 'هاوڕێ محەمەد', phone: '0750 888 1111', address: 'هەولێر - کۆگاکانی کەرکووک', currentBalance: 450000 },
  { id: 2, name: 'بازرگانی ئاریا بۆ پۆشاک و ئێکسسوارات', contactPerson: 'کەیوان تەها', phone: '0750 777 2222', address: 'سلێمانی - بازاڕی گەورە', currentBalance: 320000 },
  { id: 3, name: 'گرووپی شاهانە بۆ کەلوپەلی ناوماڵ و قوماش', contactPerson: 'سیروان فەتاح', phone: '0750 666 3333', address: 'دهۆک - پیشەسازی', currentBalance: 180000 }
];

export const INITIAL_EXPENSES: Expense[] = [
  { id: 1, branchId: 1, categoryKu: 'کرێی باڵەخانە', amount: 1500000, currency: 'IQD', date: '2026-11-01', description: 'کرێی مانگی ١١ی لقی ١ مەرکەزی', recordedBy: 'کاروان حەمە' },
  { id: 2, branchId: 1, categoryKu: 'کارەبا و موەلیدە', amount: 350000, currency: 'IQD', date: '2026-11-03', description: 'مۆلیدەی گەڕەک و پارەی کارەبا', recordedBy: 'کاروان حەمە' },
  { id: 3, branchId: 2, categoryKu: 'ئینتەرنێت و پەیوەندی', amount: 65000, currency: 'IQD', date: '2026-11-04', description: 'ئابوونەی فایبەر ئۆپتیک مانگانە', recordedBy: 'ئاراس ئەحمەد' }
];
