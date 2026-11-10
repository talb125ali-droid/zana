import { TableDef, BranchDef, PermissionDef, CategorySeedDef } from '../types/schema';

export const BRANCHES_DATA: BranchDef[] = [
  {
    id: 1,
    code: 'BR-01',
    nameKu: 'لقی ١ - زانا (مەرکەزی)',
    nameEn: 'Branch 1 - Zana Central',
    phone: '0750 111 2231',
    email: 'branch1@zana-store.com',
    address: 'شەقامی ٦٠ مەتری، نزیک فامیلی مۆڵ',
    city: 'هەولێر',
    manager: 'کاروان حەمە',
    isActive: true,
    specialtyKu: 'لقی سەرەکی و کۆگای ناوەندی و سەرجەم بەرهەمەکان'
  },
  {
    id: 2,
    code: 'BR-02',
    nameKu: 'لقی ٢ - زانا (ئیسکان)',
    nameEn: 'Branch 2 - Zana Iskan',
    phone: '0750 111 2232',
    email: 'branch2@zana-store.com',
    address: 'شەقامی ئیسکان، بازاڕی زانا',
    city: 'هەولێر',
    manager: 'ئاراس ئەحمەد',
    isActive: true,
    specialtyKu: 'تایبەتمەند لە جوانکاری، میکیاژ و عەتری فەرەنسی'
  },
  {
    id: 3,
    code: 'BR-03',
    nameKu: 'لقی ٣ - زانا (بەختیاری)',
    nameEn: 'Branch 3 - Zana Bakhtiyari',
    phone: '0750 111 2233',
    email: 'branch3@zana-store.com',
    address: 'گەڕەکی بەختیاری، تەنیشت پارکی سامی عەبدولڕەحمان',
    city: 'هەولێر',
    manager: 'ڕەوەند فەرهاد',
    isActive: true,
    specialtyKu: 'پۆشاکی مۆدێل بەرز، ئێکسسوارات و جانتا'
  },
  {
    id: 4,
    code: 'BR-04',
    nameKu: 'لقی ٤ - زانا (سلێمانی)',
    nameEn: 'Branch 4 - Zana Sulaymaniyah',
    phone: '0770 222 3341',
    email: 'branch4@zana-store.com',
    address: 'شەقامی سالم، نزیک باخی گشتی',
    city: 'سلێمانی',
    manager: 'بەرهەم کەریم',
    isActive: true,
    specialtyKu: 'لقی سەرەکی پارێزگای سلێمانی و کەلوپەلی ناوماڵ'
  },
  {
    id: 5,
    code: 'BR-05',
    nameKu: 'لقی ٥ - زانا (دهۆک)',
    nameEn: 'Branch 5 - Zana Duhok',
    phone: '0750 333 4451',
    email: 'branch5@zana-store.com',
    address: 'شەقامی KRO، سەنتەری شاری دهۆک',
    city: 'دهۆک',
    manager: 'دڵشاد نێچیرڤان',
    isActive: true,
    specialtyKu: 'لقی سەرەکی پارێزگای دهۆک و چاودێری پێست'
  },
  {
    id: 6,
    code: 'BR-06',
    nameKu: 'لقی ٦ - زانا (کەرکووک)',
    nameEn: 'Branch 6 - Zana Kirkuk',
    phone: '0770 444 5561',
    email: 'branch6@zana-store.com',
    address: 'شەقامی کۆماری، نزیک قەڵات',
    city: 'کەرکووک',
    manager: 'عەلی مەحموود',
    isActive: true,
    specialtyKu: 'لقی گشتی، قوماش، پەردە و ڕازاندنەوەی ماڵ'
  }
];

export const CATEGORIES_DATA: CategorySeedDef[] = [
  {
    id: 1,
    nameKu: 'جوانکاری و مەیکئەپ',
    nameEn: 'Cosmetics & Makeup',
    code: 'CAT-COSMETICS',
    icon: 'Sparkles',
    descriptionKu: 'سوراوی لێو، فاوەندەیشن، ماسکارا، ئایلەینەر، پاودەری ڕووخسار و بلۆشەر',
    subcategories: ['سوراوی لێو (Lipstick)', 'فاوەندەیشن و پاودەر (Foundation)', 'ماکیاژی چاو (Eye Makeup)']
  },
  {
    id: 2,
    nameKu: 'چاودێری پێست و کەسی',
    nameEn: 'Skincare & Personal Care',
    code: 'CAT-SKINCARE',
    icon: 'Heart',
    descriptionKu: 'کریم و سیرۆمی دژە پیری، پاککەرەوەی پێست، دژەخۆر، شێدارکەرەوە و لۆشن',
    subcategories: ['کرێمی دژەخۆر', 'سیرۆمی ڤیتامین C و هیالۆرۆنیک', 'شێدارکەرەوەی دەست و لەش']
  },
  {
    id: 3,
    nameKu: 'بۆن و عەتر',
    nameEn: 'Perfumes & Beauty',
    code: 'CAT-PERFUMES',
    icon: 'Flame',
    descriptionKu: 'عەتری فەرەنسی، عەتری پیاوان، خانمان، بۆنی قژ و لەش و زەیتی بۆنخۆشکەر',
    subcategories: ['عەتری فەرەنسی خانمان', 'عەتری پیاوان', 'بۆنی لەش و دیۆدرانت']
  },
  {
    id: 4,
    nameKu: 'جلوبەرگ و پۆشاک',
    nameEn: 'Clothing & Fashion',
    code: 'CAT-CLOTHING',
    icon: 'Shirt',
    descriptionKu: 'پۆشاکی وەرزی، مۆدێلی خانمان و پیاوان، چاکەت، کراس و جلی فەرمی',
    subcategories: ['عەزی و جلی خانمان', 'کراس و چاکەتی پیاوان', 'پۆشاکی وەرزی زستان و هاوین']
  },
  {
    id: 5,
    nameKu: 'ئێکسسوارات',
    nameEn: 'Accessories',
    code: 'CAT-ACCESSORIES',
    icon: 'Watch',
    descriptionKu: 'کاتژمێری ئۆرجینال، ملوانکە، بازن، گوارە، چاویلکەی خۆر و قایش',
    subcategories: ['کاتژمێری دەست', 'زیڕ و زیوی سەردەمیانە', 'چاویلکەی خۆر']
  },
  {
    id: 6,
    nameKu: 'جانتا و جانتای پشت',
    nameEn: 'Bags & Backpacks',
    code: 'CAT-BAGS',
    icon: 'Briefcase',
    descriptionKu: 'جانتای چەرمی دەست، جانتای کچانە، جانتای سەفەر و جانتای خوێندنگە',
    subcategories: ['جانتای دەستی خانمان', 'جانتای پشتی سەفەر', 'جانتای چەرمی فەرمی']
  },
  {
    id: 7,
    nameKu: 'ڕازاندنەوەی ماڵ',
    nameEn: 'Home Decoration',
    code: 'CAT-HOMEDECOR',
    icon: 'Home',
    descriptionKu: 'تابلۆی دیزاین، گوڵدان، مۆمدان، ئاوێنەی دیکۆر و کاتژمێری دیواری',
    subcategories: ['گوڵدانی کریستاڵ', 'تابلۆی قەبارە گەورە', 'مۆمدان و ڕووناککەرەوەی دیکۆر']
  },
  {
    id: 8,
    nameKu: 'گوڵ و ڕووەکی دەستکرد',
    nameEn: 'Artificial Flowers & Plants',
    code: 'CAT-FLOWERS',
    icon: 'Flower2',
    descriptionKu: 'داری دەستکرد، گوڵی ڕازاوە، سەوزایی ناوماڵ و باخچەی داخراو',
    subcategories: ['گوڵی گوڵدانی', 'داری سەوزی دەستکرد', 'تاجەگوڵ و چڵە ڕەنگاوڕەنگەکان']
  },
  {
    id: 9,
    nameKu: 'کەلوپەلی ناوماڵ و ئەساس',
    nameEn: 'Furniture & Household',
    code: 'CAT-FURNITURE',
    icon: 'Armchair',
    descriptionKu: 'مێز و کورسی دیکۆر، ڕەفە، کۆمۆد و کەلوپەلی پێویستی ژووری دانیشتن',
    subcategories: ['مێزی قاوە و دیکۆر', 'ڕەفەی کتێب و جوانکاری', 'کورسی و پۆفی مۆدێرن']
  },
  {
    id: 10,
    nameKu: 'قوماش و پەرۆ',
    nameEn: 'Fabrics & Textiles',
    code: 'CAT-FABRICS',
    icon: 'Layers',
    descriptionKu: 'قوماشی نەخشدار، قوماشی کوردی و جیهانی، قوماشی پەردە و بەرگی ئەساس',
    subcategories: ['قوماشی نەخشداری بۆنەکان', 'پەردەی دیزاین', 'قوماشی هەمەچەشن']
  }
];

export const TABLES_DATA: TableDef[] = [
  {
    name: 'branches',
    nameKu: 'لقەکان (شەش لق)',
    category: 'core',
    categoryKu: 'بنەڕەتی و لقەکان',
    descriptionKu: 'زانیاری ٦ لقی فیزیکی زانا، شوێن، شار، بەڕێوەبەر و دۆخی چالاکبوون',
    columns: [
      { name: 'id', type: 'INT UNSIGNED', isPrimary: true, nullable: false, descriptionKu: 'ناسێنەری سەرەکی بێهاوتا' },
      { name: 'code', type: 'VARCHAR(20)', nullable: false, descriptionKu: 'کۆدی کورت وەک BR-01' },
      { name: 'name_ku', type: 'VARCHAR(150)', nullable: false, descriptionKu: 'ناوی لق بە کوردی' },
      { name: 'name_en', type: 'VARCHAR(150)', nullable: true, descriptionKu: 'ناوی لق بە ئینگلیزی' },
      { name: 'phone', type: 'VARCHAR(50)', nullable: false, descriptionKu: 'ژمارەی مۆبایلی لق' },
      { name: 'address', type: 'TEXT', nullable: false, descriptionKu: 'ناونیشانی فیزیکی لق' },
      { name: 'city', type: 'VARCHAR(100)', nullable: false, defaultVal: "'هەولێر'", descriptionKu: 'شاری لق' },
      { name: 'manager_id', type: 'INT UNSIGNED', isForeignKey: true, references: 'users(id)', nullable: true, descriptionKu: 'بەڕێوەبەری سەرپەرشتیاری لق' },
      { name: 'is_active', type: 'TINYINT(1)', nullable: false, defaultVal: '1', descriptionKu: 'دۆخی کارکردنی لق' }
    ],
    indexes: ['PRIMARY (id)', 'UNIQUE (code)', 'INDEX (is_active)', 'FK (manager_id)']
  },
  {
    name: 'users',
    nameKu: 'بەکارهێنەرانی سیستەم',
    category: 'core',
    categoryKu: 'بنەڕەتی و لقەکان',
    descriptionKu: 'هەژماری کارمەندان، کاشێرەکان، بەڕێوەبەرانی لق و بەڕێوەبەری گشتی بە وشەی نهێنی پارێزراوی bcrypt',
    columns: [
      { name: 'id', type: 'INT UNSIGNED', isPrimary: true, nullable: false, descriptionKu: 'ناسێنەری بەکارهێنەر' },
      { name: 'branch_id', type: 'INT UNSIGNED', isForeignKey: true, references: 'branches(id)', nullable: true, descriptionKu: 'ئەو لقەی بەکارهێنەری پێوە بەستراوەتەوە (NULL بۆ سەرپەرشتیاری گشتی)' },
      { name: 'role_id', type: 'INT UNSIGNED', isForeignKey: true, references: 'roles(id)', nullable: false, descriptionKu: 'ڕۆڵی بەکارهێنەر' },
      { name: 'full_name', type: 'VARCHAR(150)', nullable: false, descriptionKu: 'ناوی تەواوی کارمەند' },
      { name: 'username', type: 'VARCHAR(50)', nullable: false, descriptionKu: 'ناوی بەکارهێنەر بۆ چوونەژوورەوە' },
      { name: 'password_hash', type: 'VARCHAR(255)', nullable: false, descriptionKu: 'وشەی نهێنی بە متۆدی bcrypt' },
      { name: 'is_superadmin', type: 'TINYINT(1)', nullable: false, defaultVal: '0', descriptionKu: 'ئایا بەڕێوەبەری سەرەکییە بە دەسەڵاتی تەواو؟' },
      { name: 'status', type: "ENUM('active','inactive','suspended')", nullable: false, defaultVal: "'active'", descriptionKu: 'دۆخی هەژمار' },
      { name: 'max_discount_percent', type: 'DECIMAL(5,2)', nullable: false, defaultVal: '0.00', descriptionKu: 'بەرزترین ڕێژەی داشکاندن بۆ کاشێر (%)' },
      { name: 'can_give_debt', type: 'TINYINT(1)', nullable: false, defaultVal: '0', descriptionKu: 'دەسەڵاتی فرۆشتن بە قەرز' }
    ],
    indexes: ['PRIMARY (id)', 'UNIQUE (username)', 'INDEX (branch_id)', 'INDEX (status)']
  },
  {
    name: 'roles',
    nameKu: 'ڕۆڵەکان (RBAC)',
    category: 'core',
    categoryKu: 'بنەڕەتی و لقەکان',
    descriptionKu: 'چوار ڕۆڵی بنەڕەتی: بەڕێوەبەری گشتی، بەڕێوەبەری لق، کاشێر، کارمەندی کۆگا',
    columns: [
      { name: 'id', type: 'INT UNSIGNED', isPrimary: true, nullable: false, descriptionKu: 'ناسێنەری ڕۆڵ' },
      { name: 'name_ku', type: 'VARCHAR(100)', nullable: false, descriptionKu: 'ناوی ڕۆڵ بە کوردی' },
      { name: 'name_en', type: 'VARCHAR(100)', nullable: false, descriptionKu: 'کۆدی ڕۆڵ بە ئینگلیزی (slug)' },
      { name: 'description_ku', type: 'TEXT', nullable: true, descriptionKu: 'ڕوونکردنەوەی ئەرکەکان' },
      { name: 'is_system', type: 'TINYINT(1)', nullable: false, defaultVal: '0', descriptionKu: 'ڕۆڵی بنەڕەتی سیستەمە؟' }
    ],
    indexes: ['PRIMARY (id)', 'UNIQUE (name_en)']
  },
  {
    name: 'permissions',
    nameKu: 'دەسەڵاتە وردەکان',
    category: 'core',
    categoryKu: 'بنەڕەتی و لقەکان',
    descriptionKu: '٤٧ دەسەڵاتی جیاواز بۆ کۆنترۆڵکردنی بەشەکان، فۆڕمەکان و ڕاپۆرتەکان بە تاک بە تاک',
    columns: [
      { name: 'id', type: 'INT UNSIGNED', isPrimary: true, nullable: false, descriptionKu: 'ناسێنەری دەسەڵات' },
      { name: 'module', type: 'VARCHAR(50)', nullable: false, descriptionKu: 'بەشی پەیوەندیدار وەک pos, sales, reports' },
      { name: 'code', type: 'VARCHAR(100)', nullable: false, descriptionKu: 'کۆدی دەسەڵات وەک pos.credit_sale' },
      { name: 'name_ku', type: 'VARCHAR(150)', nullable: false, descriptionKu: 'ناوی دەسەڵات بە زمانی کوردی' }
    ],
    indexes: ['PRIMARY (id)', 'UNIQUE (code)', 'INDEX (module)']
  },
  {
    name: 'products',
    nameKu: 'بەرهەمەکان',
    category: 'products',
    categoryKu: 'بەرهەم و بارکۆد',
    descriptionKu: 'زانیاری گشتی بەرهەم، ناوی کوردی و ئینگلیزی، بارکۆد، نرخی کڕین، نرخی تاک و کۆ، و سنووری هۆشداری',
    columns: [
      { name: 'id', type: 'INT UNSIGNED', isPrimary: true, nullable: false, descriptionKu: 'ناسێنەری بەرهەم' },
      { name: 'category_id', type: 'INT UNSIGNED', isForeignKey: true, references: 'categories(id)', nullable: false, descriptionKu: 'پۆلی بەرهەم' },
      { name: 'brand_id', type: 'INT UNSIGNED', isForeignKey: true, references: 'brands(id)', nullable: true, descriptionKu: 'مارکە یان براند' },
      { name: 'supplier_id', type: 'INT UNSIGNED', isForeignKey: true, references: 'suppliers(id)', nullable: true, descriptionKu: 'دابینکەری سەرەکی' },
      { name: 'name_ku', type: 'VARCHAR(255)', nullable: false, descriptionKu: 'ناوی بەرهەم بە کوردی' },
      { name: 'name_en', type: 'VARCHAR(255)', nullable: true, descriptionKu: 'ناوی بەرهەم بە ئینگلیزی' },
      { name: 'code', type: 'VARCHAR(100)', nullable: false, descriptionKu: 'کۆدی بێهاوتای بەرهەم (SKU)' },
      { name: 'barcode', type: 'VARCHAR(100)', nullable: false, descriptionKu: 'بارکۆدی سەرەکی بەرهەم' },
      { name: 'purchase_price', type: 'DECIMAL(15,2)', nullable: false, defaultVal: '0.00', descriptionKu: 'نرخی بنەڕەتی کڕین' },
      { name: 'selling_price', type: 'DECIMAL(15,2)', nullable: false, defaultVal: '0.00', descriptionKu: 'نرخی فرۆشتنی تاک' },
      { name: 'wholesale_price', type: 'DECIMAL(15,2)', nullable: false, defaultVal: '0.00', descriptionKu: 'نرخی فرۆشتنی کۆ' },
      { name: 'min_stock_alert', type: 'INT UNSIGNED', nullable: false, defaultVal: '5', descriptionKu: 'کەمترین بڕی هۆشداری' },
      { name: 'has_variants', type: 'TINYINT(1)', nullable: false, defaultVal: '0', descriptionKu: 'ئایا ڕەنگ و قەبارەی جیاوازی هەیە؟' },
      { name: 'status', type: "ENUM('active','inactive','discontinued')", nullable: false, defaultVal: "'active'", descriptionKu: 'دۆخی بەرهەم' }
    ],
    indexes: ['PRIMARY (id)', 'UNIQUE (code)', 'UNIQUE (barcode)', 'INDEX (name_ku)', 'INDEX (category_id)']
  },
  {
    name: 'product_variants',
    nameKu: 'مۆدێل و جۆرەکانی بەرهەم',
    category: 'products',
    categoryKu: 'بەرهەم و بارکۆد',
    descriptionKu: 'تایبەتمەندییە جیاوازەکانی وەک قەبارە (Size)، ڕەنگ (Color)، مۆدێل و بارکۆدی تایبەت',
    columns: [
      { name: 'id', type: 'INT UNSIGNED', isPrimary: true, nullable: false, descriptionKu: 'ناسێنەری جۆری بەرهەم' },
      { name: 'product_id', type: 'INT UNSIGNED', isForeignKey: true, references: 'products(id)', nullable: false, descriptionKu: 'بەرهەمی دایک' },
      { name: 'sku', type: 'VARCHAR(100)', nullable: false, descriptionKu: 'کۆدی جیاکەرەوە' },
      { name: 'barcode', type: 'VARCHAR(100)', nullable: false, descriptionKu: 'بارکۆدی تایبەت بەم مۆدێلە' },
      { name: 'size', type: 'VARCHAR(50)', nullable: true, descriptionKu: 'قەبارە وەک S, M, L, XL' },
      { name: 'color', type: 'VARCHAR(50)', nullable: true, descriptionKu: 'ڕەنگ وەک سوور، ڕەش' },
      { name: 'selling_price', type: 'DECIMAL(15,2)', nullable: false, defaultVal: '0.00', descriptionKu: 'نرخی تایبەتی ئەم مۆدێلە' }
    ],
    indexes: ['PRIMARY (id)', 'UNIQUE (sku)', 'UNIQUE (barcode)', 'INDEX (product_id)']
  },
  {
    name: 'branch_inventory',
    nameKu: 'کۆگای سەربەخۆی لقەکان',
    category: 'inventory',
    categoryKu: 'کۆگا و حەواڵەکان',
    descriptionKu: 'بڕی بەردەستی هەر بەرهەمێک لە هەر یەک لە ٦ لقەکە بە جیاوازی، شوێنی ڕەفە، و ئاستی کەمبوونەوە',
    columns: [
      { name: 'id', type: 'INT UNSIGNED', isPrimary: true, nullable: false, descriptionKu: 'ناسێنەر' },
      { name: 'branch_id', type: 'INT UNSIGNED', isForeignKey: true, references: 'branches(id)', nullable: false, descriptionKu: 'لقی دیاریکراو' },
      { name: 'product_id', type: 'INT UNSIGNED', isForeignKey: true, references: 'products(id)', nullable: false, descriptionKu: 'بەرهەم' },
      { name: 'variant_id', type: 'INT UNSIGNED', isForeignKey: true, references: 'product_variants(id)', nullable: true, descriptionKu: 'مۆدێلی بەرهەم' },
      { name: 'quantity', type: 'DECIMAL(12,2)', nullable: false, defaultVal: '0.00', descriptionKu: 'بڕی بەردەست لەم لقە' },
      { name: 'min_stock_alert', type: 'INT UNSIGNED', nullable: false, defaultVal: '5', descriptionKu: 'سنووری هۆشداری لق' },
      { name: 'shelf_location', type: 'VARCHAR(100)', nullable: true, descriptionKu: 'شوێنی ڕەفە لە کۆگای لق' }
    ],
    indexes: ['PRIMARY (id)', 'UNIQUE (branch_id, product_id, variant_id)', 'INDEX (quantity)', 'INDEX (branch_id)']
  },
  {
    name: 'inventory_movements',
    nameKu: 'تۆماری جووڵەی کاڵا',
    category: 'inventory',
    categoryKu: 'کۆگا و حەواڵەکان',
    descriptionKu: 'تۆماری وردی هەموو کاڵایەکی هاتوو یان دەرچوو (فرۆش، کڕین، حەواڵە، شکا، سەرژمێری)',
    columns: [
      { name: 'id', type: 'BIGINT UNSIGNED', isPrimary: true, nullable: false, descriptionKu: 'ناسێنەری جووڵە' },
      { name: 'branch_id', type: 'INT UNSIGNED', isForeignKey: true, references: 'branches(id)', nullable: false, descriptionKu: 'لقی پەیوەندیدار' },
      { name: 'product_id', type: 'INT UNSIGNED', isForeignKey: true, references: 'products(id)', nullable: false, descriptionKu: 'بەرهەم' },
      { name: 'movement_type', type: "ENUM('sale','purchase','transfer_out','transfer_in','return_in','adjustment','damaged','lost')", nullable: false, descriptionKu: 'جۆری جووڵە' },
      { name: 'quantity', type: 'DECIMAL(12,2)', nullable: false, descriptionKu: 'بڕی گۆڕاو (+/-)' },
      { name: 'previous_qty', type: 'DECIMAL(12,2)', nullable: false, descriptionKu: 'بڕی پێشوو لە لق' },
      { name: 'new_qty', type: 'DECIMAL(12,2)', nullable: false, descriptionKu: 'بڕی نوێ لە لق' },
      { name: 'unit_cost', type: 'DECIMAL(15,2)', nullable: false, defaultVal: '0.00', descriptionKu: 'تێچووی دانە' },
      { name: 'reference_type', type: 'VARCHAR(50)', nullable: false, descriptionKu: 'فاکتۆر، حەواڵە، سەرژمێری' },
      { name: 'reference_id', type: 'BIGINT UNSIGNED', nullable: false, descriptionKu: 'ئایدی فاکتۆر' }
    ],
    indexes: ['PRIMARY (id)', 'INDEX (branch_id)', 'INDEX (product_id)', 'INDEX (reference_type, reference_id)']
  },
  {
    name: 'stock_transfers',
    nameKu: 'حەواڵەی نێوان لقەکان',
    category: 'inventory',
    categoryKu: 'کۆگا و حەواڵەکان',
    descriptionKu: 'گواستنەوەی کاڵا لە نێوان ٦ لقەکە لەگەڵ دۆخی چاوەڕوانی، پەسەندکردن، ناردن و وەرگرتن',
    columns: [
      { name: 'id', type: 'BIGINT UNSIGNED', isPrimary: true, nullable: false, descriptionKu: 'ناسێنەری حەواڵە' },
      { name: 'transfer_number', type: 'VARCHAR(50)', nullable: false, descriptionKu: 'ژمارەی پسوولەی حەواڵە' },
      { name: 'source_branch_id', type: 'INT UNSIGNED', isForeignKey: true, references: 'branches(id)', nullable: false, descriptionKu: 'لقی نێرەر' },
      { name: 'destination_branch_id', type: 'INT UNSIGNED', isForeignKey: true, references: 'branches(id)', nullable: false, descriptionKu: 'لقی وەرگر' },
      { name: 'requester_id', type: 'INT UNSIGNED', isForeignKey: true, references: 'users(id)', nullable: false, descriptionKu: 'داواکار' },
      { name: 'approver_id', type: 'INT UNSIGNED', isForeignKey: true, references: 'users(id)', nullable: true, descriptionKu: 'پەسەندکەر' },
      { name: 'receiver_id', type: 'INT UNSIGNED', isForeignKey: true, references: 'users(id)', nullable: true, descriptionKu: 'وەرگر' },
      { name: 'status', type: "ENUM('pending','approved','dispatched','received','rejected')", nullable: false, defaultVal: "'pending'", descriptionKu: 'دۆخی حەواڵە' }
    ],
    indexes: ['PRIMARY (id)', 'UNIQUE (transfer_number)', 'INDEX (source_branch_id)', 'INDEX (destination_branch_id)']
  },
  {
    name: 'sales',
    nameKu: 'فاکتۆری فرۆشتن (POS)',
    category: 'sales',
    categoryKu: 'فرۆشتن و POS',
    descriptionKu: 'تۆماری تەواوی فرۆشتن، کاشێر، کڕیار، پارەی وەرگیراو، قەرز، تێچووی کڕین (COGS) و قازانجی ناپوختە',
    columns: [
      { name: 'id', type: 'BIGINT UNSIGNED', isPrimary: true, nullable: false, descriptionKu: 'ناسێنەری فاکتۆر' },
      { name: 'invoice_number', type: 'VARCHAR(50)', nullable: false, descriptionKu: 'ژمارەی بێهاوتای پسوولە' },
      { name: 'branch_id', type: 'INT UNSIGNED', isForeignKey: true, references: 'branches(id)', nullable: false, descriptionKu: 'لقی فرۆشیار' },
      { name: 'cashier_id', type: 'INT UNSIGNED', isForeignKey: true, references: 'users(id)', nullable: false, descriptionKu: 'کاشێر' },
      { name: 'customer_id', type: 'INT UNSIGNED', isForeignKey: true, references: 'customers(id)', nullable: true, descriptionKu: 'کڕیار' },
      { name: 'total_amount', type: 'DECIMAL(15,2)', nullable: false, defaultVal: '0.00', descriptionKu: 'کۆی گشتی فاکتۆر' },
      { name: 'cost_of_goods_sold', type: 'DECIMAL(15,2)', nullable: false, defaultVal: '0.00', descriptionKu: 'تێچووی کڕینی کاڵاکان (COGS)' },
      { name: 'gross_profit', type: 'DECIMAL(15,2)', nullable: false, defaultVal: '0.00', descriptionKu: 'قازانجی ناپوختەی فاکتۆر' },
      { name: 'paid_amount', type: 'DECIMAL(15,2)', nullable: false, defaultVal: '0.00', descriptionKu: 'پارەی دراو' },
      { name: 'remaining_debt', type: 'DECIMAL(15,2)', nullable: false, defaultVal: '0.00', descriptionKu: 'قەرزی ماوە' },
      { name: 'payment_status', type: "ENUM('paid','partial','debt')", nullable: false, defaultVal: "'paid'", descriptionKu: 'دۆخی پارەدان' },
      { name: 'primary_currency', type: 'VARCHAR(3)', nullable: false, defaultVal: "'IQD'", descriptionKu: 'دراوی فاکتۆر' },
      { name: 'status', type: "ENUM('completed','returned','cancelled')", nullable: false, defaultVal: "'completed'", descriptionKu: 'دۆخی فاکتۆر' }
    ],
    indexes: ['PRIMARY (id)', 'UNIQUE (invoice_number)', 'INDEX (branch_id)', 'INDEX (cashier_id)', 'INDEX (sale_date)']
  },
  {
    name: 'sale_items',
    nameKu: 'کاڵاکانی ناو فاکتۆر',
    category: 'sales',
    categoryKu: 'فرۆشتن و POS',
    descriptionKu: 'هەر بەرهەمێک لەگەڵ ژمارە، نرخی فرۆش، و گرنگتر لە هەمووی snapshot ی تێچووی کڕین بۆ ژمێریاری بێ هەڵە',
    columns: [
      { name: 'id', type: 'BIGINT UNSIGNED', isPrimary: true, nullable: false, descriptionKu: 'ناسێنەر' },
      { name: 'sale_id', type: 'BIGINT UNSIGNED', isForeignKey: true, references: 'sales(id)', nullable: false, descriptionKu: 'فاکتۆری سەرەکی' },
      { name: 'product_id', type: 'INT UNSIGNED', isForeignKey: true, references: 'products(id)', nullable: false, descriptionKu: 'بەرهەم' },
      { name: 'quantity', type: 'DECIMAL(12,2)', nullable: false, defaultVal: '1.00', descriptionKu: 'بڕی فرۆشراو' },
      { name: 'unit_cost_snapshot', type: 'DECIMAL(15,2)', nullable: false, defaultVal: '0.00', descriptionKu: 'تێچووی کڕین لە ساتی ئەم فرۆشتنە' },
      { name: 'unit_price', type: 'DECIMAL(15,2)', nullable: false, defaultVal: '0.00', descriptionKu: 'نرخی فرۆشتنی دانە' },
      { name: 'total_price', type: 'DECIMAL(15,2)', nullable: false, defaultVal: '0.00', descriptionKu: 'کۆی نرخی ڕیز' },
      { name: 'gross_profit', type: 'DECIMAL(15,2)', nullable: false, defaultVal: '0.00', descriptionKu: 'قازانجی ناپوختەی ئەم کاڵایە' }
    ],
    indexes: ['PRIMARY (id)', 'INDEX (sale_id)', 'INDEX (product_id)']
  },
  {
    name: 'customers',
    nameKu: 'کڕیاران و قەرزەکان',
    category: 'finance',
    categoryKu: 'دارایی و قەرزەکان',
    descriptionKu: 'تۆماری ناوی کڕیار، مۆبایل، باڵانسی قەرز، ئاستی ڕێگەپێدراوی قەرز (Credit Limit) و پارەدان',
    columns: [
      { name: 'id', type: 'INT UNSIGNED', isPrimary: true, nullable: false, descriptionKu: 'ناسێنەر' },
      { name: 'branch_id', type: 'INT UNSIGNED', isForeignKey: true, references: 'branches(id)', nullable: true, descriptionKu: 'لقی تۆمارکەر' },
      { name: 'full_name', type: 'VARCHAR(150)', nullable: false, descriptionKu: 'ناوی تەواوی کڕیار' },
      { name: 'phone', type: 'VARCHAR(50)', nullable: false, descriptionKu: 'ژمارەی مۆبایل (بێهاوتا)' },
      { name: 'credit_limit', type: 'DECIMAL(15,2)', nullable: false, defaultVal: '0.00', descriptionKu: 'بەرزترین ئاستی قەرز' },
      { name: 'total_debt', type: 'DECIMAL(15,2)', nullable: false, defaultVal: '0.00', descriptionKu: 'کۆی قەرز' },
      { name: 'total_paid', type: 'DECIMAL(15,2)', nullable: false, defaultVal: '0.00', descriptionKu: 'کۆی پارەدراو' },
      { name: 'current_balance', type: 'DECIMAL(15,2)', nullable: false, defaultVal: '0.00', descriptionKu: 'قەرزی ماوە' }
    ],
    indexes: ['PRIMARY (id)', 'UNIQUE (phone)', 'INDEX (full_name)', 'INDEX (branch_id)']
  },
  {
    name: 'expenses',
    nameKu: 'خەرجییەکانی لق',
    category: 'finance',
    categoryKu: 'دارایی و قەرزەکان',
    descriptionKu: 'خەرجییەکانی هەر لقێک بە جیا (کرێ، مووچە، کارەبا، ئینتەرنێت) بۆ دەرکردنی قازانجی پوختە (Net Profit)',
    columns: [
      { name: 'id', type: 'BIGINT UNSIGNED', isPrimary: true, nullable: false, descriptionKu: 'ناسێنەر' },
      { name: 'branch_id', type: 'INT UNSIGNED', isForeignKey: true, references: 'branches(id)', nullable: false, descriptionKu: 'لق' },
      { name: 'category_id', type: 'INT UNSIGNED', isForeignKey: true, references: 'expense_categories(id)', nullable: false, descriptionKu: 'جۆری خەرجی' },
      { name: 'user_id', type: 'INT UNSIGNED', isForeignKey: true, references: 'users(id)', nullable: false, descriptionKu: 'تۆمارکەر' },
      { name: 'amount', type: 'DECIMAL(15,2)', nullable: false, descriptionKu: 'بڕی خەرجی' },
      { name: 'currency_code', type: 'VARCHAR(3)', nullable: false, defaultVal: "'IQD'", descriptionKu: 'دراو' },
      { name: 'amount_main_currency', type: 'DECIMAL(15,2)', nullable: false, descriptionKu: 'بڕی خەرجی بە دراوی بنەڕەتی' },
      { name: 'description', type: 'TEXT', nullable: false, descriptionKu: 'ڕوونکردنەوەی خەرجی' }
    ],
    indexes: ['PRIMARY (id)', 'INDEX (branch_id)', 'INDEX (category_id)', 'INDEX (expense_date)']
  },
  {
    name: 'cash_registers',
    nameKu: 'قاسە و شەفتی کاشێر',
    category: 'finance',
    categoryKu: 'دارایی و قەرزەکان',
    descriptionKu: 'چاودێری پارەی دەستپێک، فرۆشتنی نەقد، وەرگرتنی قەرز، پارەی فیعلی ژمێردراو و جیاوازی پارەی قاسە',
    columns: [
      { name: 'id', type: 'INT UNSIGNED', isPrimary: true, nullable: false, descriptionKu: 'ناسێنەری شەفت' },
      { name: 'branch_id', type: 'INT UNSIGNED', isForeignKey: true, references: 'branches(id)', nullable: false, descriptionKu: 'لق' },
      { name: 'cashier_id', type: 'INT UNSIGNED', isForeignKey: true, references: 'users(id)', nullable: false, descriptionKu: 'کاشێر' },
      { name: 'opening_balance_iqd', type: 'DECIMAL(15,2)', nullable: false, defaultVal: '0.00', descriptionKu: 'پارەی دەستپێک' },
      { name: 'expected_cash_iqd', type: 'DECIMAL(15,2)', nullable: false, defaultVal: '0.00', descriptionKu: 'پارەی چاوەڕوانکراو' },
      { name: 'closing_cash_iqd', type: 'DECIMAL(15,2)', nullable: true, descriptionKu: 'پارەی ژمێردراو' },
      { name: 'difference_iqd', type: 'DECIMAL(15,2)', nullable: false, defaultVal: '0.00', descriptionKu: 'جیاوازی پارە' },
      { name: 'status', type: "ENUM('open','closed')", nullable: false, defaultVal: "'open'", descriptionKu: 'دۆخی شەفت' }
    ],
    indexes: ['PRIMARY (id)', 'INDEX (branch_id)', 'INDEX (cashier_id)', 'INDEX (status)']
  },
  {
    name: 'audit_logs',
    nameKu: 'تۆماری ئەمنی (Audit Logs)',
    category: 'system',
    categoryKu: 'سیستەم و ئاسایش',
    descriptionKu: 'تۆمارکردنی هەر هەنگاوێک بە بەروار، بەکارهێنەر، کردار، بەهای پێشوو و بەهای نوێ بە شێوەی پارێزراو',
    columns: [
      { name: 'id', type: 'BIGINT UNSIGNED', isPrimary: true, nullable: false, descriptionKu: 'ناسێنەر' },
      { name: 'user_id', type: 'INT UNSIGNED', isForeignKey: true, references: 'users(id)', nullable: true, descriptionKu: 'بەکارهێنەر' },
      { name: 'branch_id', type: 'INT UNSIGNED', isForeignKey: true, references: 'branches(id)', nullable: true, descriptionKu: 'لق' },
      { name: 'action', type: 'VARCHAR(100)', nullable: false, descriptionKu: 'کردار وەک login, update, delete' },
      { name: 'entity_type', type: 'VARCHAR(100)', nullable: false, descriptionKu: 'بەشی دەستکاریکراو' },
      { name: 'old_values', type: 'JSON', nullable: true, descriptionKu: 'داتای پێشوو' },
      { name: 'new_values', type: 'JSON', nullable: true, descriptionKu: 'داتای نوێ' },
      { name: 'ip_address', type: 'VARCHAR(45)', nullable: true, descriptionKu: 'ئایپی ئامێر' }
    ],
    indexes: ['PRIMARY (id)', 'INDEX (action)', 'INDEX (entity_type)', 'INDEX (created_at)']
  }
];

export const PERMISSIONS_DATA: PermissionDef[] = [
  { id: 1, module: 'branches', code: 'branches.view', nameKu: 'بینینی زانیاری لقەکان', superAdmin: true, branchManager: true, cashier: false, inventoryStaff: false },
  { id: 2, module: 'branches', code: 'branches.create', nameKu: 'زیادکردنی لقی نوێ', superAdmin: true, branchManager: false, cashier: false, inventoryStaff: false },
  { id: 3, module: 'branches', code: 'branches.edit', nameKu: 'دەستکاریکردنی لق', superAdmin: true, branchManager: false, cashier: false, inventoryStaff: false },
  { id: 5, module: 'users', code: 'users.view', nameKu: 'بینینی بەکارهێنەران', superAdmin: true, branchManager: true, cashier: false, inventoryStaff: false },
  { id: 6, module: 'users', code: 'users.create', nameKu: 'زیادکردنی کارمەند', superAdmin: true, branchManager: true, cashier: false, inventoryStaff: false },
  { id: 9, module: 'users', code: 'roles.manage', nameKu: 'بەڕێوەبردنی دەسەڵاتەکان', superAdmin: true, branchManager: false, cashier: false, inventoryStaff: false },
  { id: 10, module: 'products', code: 'products.view', nameKu: 'بینینی بەرهەمەکان', superAdmin: true, branchManager: true, cashier: true, inventoryStaff: true },
  { id: 11, module: 'products', code: 'products.create', nameKu: 'تۆمارکردنی بەرهەمی نوێ', superAdmin: true, branchManager: true, cashier: false, inventoryStaff: true },
  { id: 14, module: 'products', code: 'barcode.generate', nameKu: 'بەرهەمهێنان و چاپی بارکۆد', superAdmin: true, branchManager: true, cashier: false, inventoryStaff: true },
  { id: 16, module: 'pos', code: 'pos.access', nameKu: 'چوونەژوورەوەی POS و کاشێر', superAdmin: true, branchManager: true, cashier: true, inventoryStaff: false },
  { id: 17, module: 'pos', code: 'pos.apply_discount', nameKu: 'پێدانی داشکاندن لە فرۆشتن', superAdmin: true, branchManager: true, cashier: true, inventoryStaff: false },
  { id: 18, module: 'pos', code: 'pos.credit_sale', nameKu: 'فرۆشتن بە قەرز', superAdmin: true, branchManager: true, cashier: false, inventoryStaff: false },
  { id: 20, module: 'sales', code: 'sales.view_all_branches', nameKu: 'بینینی فرۆشتنی هەموو ٦ لقەکە', superAdmin: true, branchManager: false, cashier: false, inventoryStaff: false },
  { id: 22, module: 'returns', code: 'returns.create', nameKu: 'گەڕاندنەوە و گۆڕینەوەی کاڵا', superAdmin: true, branchManager: true, cashier: true, inventoryStaff: false },
  { id: 24, module: 'inventory', code: 'inventory.view_all_branches', nameKu: 'بینینی کۆگای سەرجەم لقەکان', superAdmin: true, branchManager: false, cashier: false, inventoryStaff: false },
  { id: 25, module: 'inventory', code: 'transfers.request', nameKu: 'داواکردنی حەواڵەی کاڵا', superAdmin: true, branchManager: true, cashier: false, inventoryStaff: true },
  { id: 26, module: 'inventory', code: 'transfers.approve', nameKu: 'پەسەندکردنی حەواڵەی نێوان لقەکان', superAdmin: true, branchManager: true, cashier: false, inventoryStaff: false },
  { id: 28, module: 'inventory', code: 'stocktake.perform', nameKu: 'سەرژمێری کۆگا', superAdmin: true, branchManager: true, cashier: false, inventoryStaff: true },
  { id: 31, module: 'purchases', code: 'purchases.create', nameKu: 'تۆمارکردنی کڕین لە دابینکەر', superAdmin: true, branchManager: true, cashier: false, inventoryStaff: true },
  { id: 33, module: 'customers', code: 'customers.manage', nameKu: 'بەڕێوەبردنی کڕیاران', superAdmin: true, branchManager: true, cashier: true, inventoryStaff: false },
  { id: 34, module: 'customers', code: 'debts.collect', nameKu: 'وەرگرتنەوەی قەرزی کڕیار', superAdmin: true, branchManager: true, cashier: true, inventoryStaff: false },
  { id: 37, module: 'expenses', code: 'expenses.create', nameKu: 'تۆمارکردنی خەرجی لق', superAdmin: true, branchManager: true, cashier: false, inventoryStaff: false },
  { id: 38, module: 'cash', code: 'cash.open_close', nameKu: 'کردنەوە و داخستنی قاسەی کاشێر', superAdmin: true, branchManager: true, cashier: true, inventoryStaff: false },
  { id: 42, module: 'reports', code: 'reports.profit_gross', nameKu: 'ڕاپۆرتی قازانجی ناپوختە (Gross Profit)', superAdmin: true, branchManager: true, cashier: false, inventoryStaff: false },
  { id: 43, module: 'reports', code: 'reports.profit_net', nameKu: 'ڕاپۆرتی قازانجی پوختەی لق (Net Profit)', superAdmin: true, branchManager: false, cashier: false, inventoryStaff: false },
  { id: 44, module: 'reports', code: 'reports.branches_compare', nameKu: 'بەراوردی دارایی ٦ لقەکە', superAdmin: true, branchManager: false, cashier: false, inventoryStaff: false },
  { id: 46, module: 'settings', code: 'backups.manage', nameKu: 'دروستکردن و گەڕاندنەوەی باکئەپ', superAdmin: true, branchManager: false, cashier: false, inventoryStaff: false }
];
