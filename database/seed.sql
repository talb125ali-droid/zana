-- =====================================================================
-- ZANA STORE MANAGEMENT SYSTEM - سیستەمی بەڕێوەبردنی کۆگاکانی زانا
-- DATABASE SEED DATA: PHASE 1
-- Initial Setup: 6 Branches, Roles, Permissions, Admin, Currencies, Categories
-- =====================================================================

USE `zana_store_db`;

-- ---------------------------------------------------------------------
-- 1. CURRENCIES & EXCHANGE RATES
-- ---------------------------------------------------------------------
INSERT INTO `currencies` (`id`, `code`, `name_ku`, `name_en`, `symbol_ku`, `symbol_en`, `is_main`, `is_active`) VALUES
(1, 'IQD', 'دیناری عێراقی', 'Iraqi Dinar', 'د.ع', 'IQD', 1, 1),
(2, 'USD', 'دۆلاری ئەمریکی', 'US Dollar', '$', 'USD', 0, 1);

INSERT INTO `exchange_rates` (`from_currency_code`, `to_currency_code`, `rate`, `effective_date`, `notes`) VALUES
('USD', 'IQD', 1530.000000, NOW(), 'نرخی سەرەتایی فەرمی سیستەم بۆ دۆلار بەرامبەر دینار');

-- ---------------------------------------------------------------------
-- 2. SIX BRANCHES (٦ لقی سەرەکی زانا)
-- ---------------------------------------------------------------------
INSERT INTO `branches` (`id`, `code`, `name_ku`, `name_en`, `phone`, `email`, `address`, `city`, `is_active`, `notes`) VALUES
(1, 'BR-01', 'لقی ١ - زانا (مەرکەزی)', 'Branch 1 - Zana Central', '07501112231', 'branch1@zana-store.com', 'شەقامی ٦٠ مەتری، نزیک فامیلی مۆڵ', 'هەولێر', 1, 'لقی سەرەکی و کۆگای ناوەندی شاری هەولێر'),
(2, 'BR-02', 'لقی ٢ - زانا (ئیسکان)', 'Branch 2 - Zana Iskan', '07501112232', 'branch2@zana-store.com', 'شەقامی ئیسکان، بازاڕی زانا', 'هەولێر', 1, 'لقی تایبەت بە جوانکاری و عەتر'),
(3, 'BR-03', 'لقی ٣ - زانا (بەختیاری)', 'Branch 3 - Zana Bakhtiyari', '07501112233', 'branch3@zana-store.com', 'گەڕەکی بەختیاری، تەنیشت پارکی سامی عەبدولڕەحمان', 'هەولێر', 1, 'لقی پۆشاک و کەلوپەلی ناوماڵ'),
(4, 'BR-04', 'لقی ٤ - زانا (سلێمانی)', 'Branch 4 - Zana Sulaymaniyah', '07702223341', 'branch4@zana-store.com', 'شەقامی سالم، نزیک باخی گشتی', 'سلێمانی', 1, 'لقی سەرەکی شاری سلێمانی'),
(5, 'BR-05', 'لقی ٥ - زانا (دهۆک)', 'Branch 5 - Zana Duhok', '07503334451', 'branch5@zana-store.com', 'شەقامی KRO، سەنتەری شاری دهۆک', 'دهۆک', 1, 'لقی سەرەکی شاری دهۆک'),
(6, 'BR-06', 'لقی ٦ - زانا (کەرکووک)', 'Branch 6 - Zana Kirkuk', '07704445561', 'branch6@zana-store.com', 'شەقامی کۆماری، نزیک قەڵا', 'کەرکووک', 1, 'لقی گشتی و تاکفرۆشی کەرکووک');

-- ---------------------------------------------------------------------
-- 3. ROLES (ڕۆڵە بنەڕەتییەکانی سیستەم)
-- ---------------------------------------------------------------------
INSERT INTO `roles` (`id`, `name_ku`, `name_en`, `description_ku`, `is_system`) VALUES
(1, 'بەڕێوەبەری گشتی', 'super_admin', 'دەسەڵاتی تەواو و ڕەهای هەیە بەسەر هەموو لقەکان، ڕاپۆرتەکان، کۆگاکان و دارایی', 1),
(2, 'بەڕێوەبەری لق', 'branch_manager', 'بەڕێوەبردنی لقی دیاریکراوی خۆی، چاودێری فرۆش، کارمەندان و ڕاپۆرتی لقەکەی', 1),
(3, 'کاشێر', 'cashier', 'سکانکردنی بارکۆد، دەرکردنی فاکتۆری فرۆشتن، وەرگرتنی پارەی نەقد و قەرز بە سنووردارکراوی', 1),
(4, 'کارمەندی کۆگا', 'inventory_staff', 'داخڵکردنی کاڵای نوێ، سەرژمێری کۆگا، داواکاری و ئامادەکردنی حەواڵەی نێوان لقەکان', 1);

-- ---------------------------------------------------------------------
-- 4. GRANULAR PERMISSIONS (دەسەڵاتە وردەکان)
-- ---------------------------------------------------------------------
INSERT INTO `permissions` (`id`, `module`, `code`, `name_ku`, `description_ku`) VALUES
-- لقەکان (Branches)
(1, 'branches', 'branches.view', 'بینینی لقەکان', 'دەسەڵاتی بینینی زانیاری لقەکان'),
(2, 'branches', 'branches.create', 'زیادکردنی لقی نوێ', 'تۆمارکردنی لقی نوێ لە سیستەم'),
(3, 'branches', 'branches.edit', 'دەستکاریکردنی لق', 'گۆڕینی ناونیشان و زانیاری لقەکان'),
(4, 'branches', 'branches.delete', 'ناچالاککردنی لق', 'ناچالاککردن یان سڕینەوەی لق'),

-- بەکارهێنەران و ڕۆڵەکان (Users & Roles)
(5, 'users', 'users.view', 'بینینی بەکارهێنەران', 'بینینی لیستی کارمەندان'),
(6, 'users', 'users.create', 'دروستکردنی بەکارهێنەر', 'زیادکردنی کارمەند و کاشێری نوێ'),
(7, 'users', 'users.edit', 'دەستکاریکردنی بەکارهێنەر', 'گۆڕینی زانیاری و وشەی نهێنی کارمەندان'),
(8, 'users', 'users.delete', 'سڕینەوەی بەکارهێنەر', 'ناچالاککردنی هەژماری کارمەند'),
(9, 'users', 'roles.manage', 'بەڕێوەبردنی ڕۆڵەکان', 'دەستکاریکردنی دەسەڵاتەکانی هەر ڕۆڵێک'),

-- بەرهەمەکان و بارکۆد (Products & Barcodes)
(10, 'products', 'products.view', 'بینینی بەرهەمەکان', 'بینینی لیستی بەرهەمەکان لە لق'),
(11, 'products', 'products.create', 'تۆمارکردنی بەرهەمی نوێ', 'زیادکردنی کاڵای نوێ بۆ سیستەم'),
(12, 'products', 'products.edit', 'دەستکاریکردنی بەرهەم', 'گۆڕینی نرخ و زانیاری بەرهەم'),
(13, 'products', 'products.delete', 'سڕینەوەی بەرهەم', 'سڕینەوەی بەرهەم لە سیستەم'),
(14, 'products', 'barcode.generate', 'دروستکردنی بارکۆد', 'بەرهەمهێنان و چاپکردنی لێبڵی بارکۆد'),
(15, 'products', 'categories.manage', 'بەڕێوەبردنی پۆلەکان', 'زیادکردن و دەستکاریکردنی پۆل و براند'),

-- خاڵی فرۆشتن و کاشێر (POS & Sales)
(16, 'pos', 'pos.access', 'چوونەژوورەوەی POS', 'دەسەڵاتی کارکردن لەسەر شاشەی کاشێر'),
(17, 'pos', 'pos.apply_discount', 'دانانی داشکاندن', 'پێدانی داشکاندن لە فاکتۆر بەپێی ڕێژەی ڕێگەپێدراو'),
(18, 'pos', 'pos.credit_sale', 'فرۆشتن بە قەرز', 'تۆمارکردنی فرۆشتن بە شێوەی قەرز بۆ کڕیار'),
(19, 'sales', 'sales.view', 'بینینی فاکتۆرەکانی فرۆشتن', 'بینینی ئەرشیفی فرۆشتنەکان'),
(20, 'sales', 'sales.view_all_branches', 'بینینی فرۆشتنی هەموو لقەکان', 'دەسەڵاتی تایبەت بۆ بەڕێوەبەری گشتی'),
(21, 'sales', 'sales.cancel', 'هەڵوەشاندنەوەی فاکتۆر', 'دەسەڵاتی بەتاڵکردنەوەی فرۆشتن بە ڕێگەپێدان'),
(22, 'returns', 'returns.create', 'گەڕاندنەوەی کاڵا', 'تۆمارکردنی گەڕاندنەوە یان گۆڕینەوەی فرۆش'),

-- کۆگا و حەواڵەی نێوان لقەکان (Inventory & Stock Transfers)
(23, 'inventory', 'inventory.view', 'بینینی کۆگا', 'بینینی باڵانسی کاڵاکانی کۆگا لە لق'),
(24, 'inventory', 'inventory.view_all_branches', 'بینینی کۆگای هەموو لقەکان', 'بینینی بڕی کاڵاکان لە سەرجەم ٦ لقەکە'),
(25, 'inventory', 'transfers.request', 'داواکردنی حەواڵەی کاڵا', 'ناردنی داواکاری گواستنەوەی کاڵا لە لقێکەوە بۆ لقێکی تر'),
(26, 'inventory', 'transfers.approve', 'پەسەندکردنی حەواڵە', 'ڕەزامەندی لەسەر ناردنی کاڵا لە نێوان لقەکان'),
(27, 'inventory', 'transfers.receive', 'وەرگرتنی حەواڵە', 'تەئکیدکردنەوەی گەیشتنی کاڵا بە لقی مەبەست'),
(28, 'inventory', 'stocktake.perform', 'ئەنجامدانی سەرژمێری', 'ژماردنی فیعلی کاڵاکان و تۆمارکردنی جیاوازی'),
(29, 'inventory', 'stocktake.adjust', 'چاکسازی باڵانسی کۆگا', 'ڕێکخستنەوەی فەرمی کۆگا دوای سەرژمێری'),

-- کڕین و دابینکەران (Purchases & Suppliers)
(30, 'purchases', 'purchases.view', 'بینینی فاکتۆرەکانی کڕین', 'بینینی مێژووی کڕینەکان'),
(31, 'purchases', 'purchases.create', 'تۆمارکردنی کڕینی نوێ', 'داخڵکردنی فاکتۆری کڕین لە دابینکەر'),
(32, 'suppliers', 'suppliers.manage', 'بەڕێوەبردنی دابینکەران', 'تۆمارکردن، دەستکاریکردن و پارەدانی دابینکەر'),

-- کڕیاران و قەرزەکان (Customers & Debts)
(33, 'customers', 'customers.manage', 'بەڕێوەبردنی کڕیاران', 'تۆمارکردنی کڕیار، ناونیشان و مۆبایل'),
(34, 'customers', 'debts.collect', 'وەرگرتنەوەی قەرز', 'تۆمارکردنی پسوولەی وەرگرتنی پارەی قەرز'),
(35, 'customers', 'debts.view_statement', 'بینینی ڕاپۆرتی کڕیار', 'بینینی مێژووی حیسابی کڕیار و قەرزەکان'),

-- خەرجییەکان و قاسە (Expenses & Cash Register)
(36, 'expenses', 'expenses.view', 'بینینی خەرجییەکان', 'بینینی خەرجییەکانی لق'),
(37, 'expenses', 'expenses.create', 'تۆمارکردنی خەرجی', 'داخڵکردنی مەسروفیاتی نوێ و وەسڵ'),
(38, 'cash', 'cash.open_close', 'کردنەوە و داخستنی قاسە', 'بەڕێوەبردنی شەفتی ڕۆژانەی کاشێر'),
(39, 'cash', 'cash.reconcile', 'چاودێری جیاوازی قاسە', 'پشکنینی جیاوازی پارەی چاوەڕوانکراو و فیعلی'),

-- ڕاپۆرتە داراییەکان و قازانج (Reports & Profit Analysis)
(40, 'reports', 'reports.sales', 'ڕاپۆرتی فرۆشتن', 'بینینی ڕاپۆرتی ڕۆژانە و مانگانەی فرۆشتن'),
(41, 'reports', 'reports.inventory', 'ڕاپۆرتی کۆگا', 'ڕاپۆرتی کاڵا کەمبووەکان و کاڵا خێرا و هێواشەکان'),
(42, 'reports', 'reports.profit_gross', 'بینینی قازانجی ناپوختە', 'بینینی Gross Profit و تێچووی فرۆش COGS'),
(43, 'reports', 'reports.profit_net', 'بینینی قازانجی پوختە (Net Profit)', 'بینینی Net Profit ی هەموو لقەکان یان لقی دیاریکراو'),
(44, 'reports', 'reports.branches_compare', 'بەراوردی نێوان ٦ لقەکە', 'بەراوردکردنی داهات، قازانج و چالاکی لقەکان'),

-- ڕێکخستنەکان و ئاسایش (Settings & Security)
(45, 'settings', 'settings.manage', 'ڕێکخستنەکانی سیستەم', 'گۆڕینی نرخی ئاڵوگۆڕ، زانیاری کۆمپانیا و چاپکەر'),
(46, 'settings', 'backups.manage', 'باکئەپ و گەڕاندنەوە', 'دروستکردن، دابەزاندن و گەڕاندنەوەی باکئەپی بنکەدراوە'),
(47, 'settings', 'audit.view', 'بینینی لۆگە ئەمنییەکان', 'بینینی جووڵە و دەستکارییەکانی هەموو بەکارهێنەران');

-- ---------------------------------------------------------------------
-- 5. ROLE-PERMISSION MAPPINGS
-- ---------------------------------------------------------------------
-- بەڕێوەبەری گشتی (Super Admin): هەموو دەسەڵاتەکان
INSERT INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 1, `id` FROM `permissions`;

-- بەڕێوەبەری لق (Branch Manager): بەڕێوەبردنی کارەکانی لقی خۆی
INSERT INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 2, `id` FROM `permissions` WHERE `code` IN (
    'branches.view',
    'users.view', 'users.create', 'users.edit',
    'products.view', 'products.create', 'products.edit', 'barcode.generate',
    'pos.access', 'pos.apply_discount', 'pos.credit_sale', 'sales.view',
    'returns.create',
    'inventory.view', 'transfers.request', 'transfers.approve', 'transfers.receive', 'stocktake.perform',
    'purchases.view', 'purchases.create', 'suppliers.manage',
    'customers.manage', 'debts.collect', 'debts.view_statement',
    'expenses.view', 'expenses.create', 'cash.open_close', 'cash.reconcile',
    'reports.sales', 'reports.inventory', 'reports.profit_gross'
);

-- کاشێر (Cashier): فرۆشتن، سکان، پسوولە، وەرگرتنەوە
INSERT INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 3, `id` FROM `permissions` WHERE `code` IN (
    'products.view',
    'pos.access', 'pos.apply_discount', 'sales.view',
    'returns.create',
    'customers.manage', 'debts.collect',
    'cash.open_close'
);

-- کارمەندی کۆگا (Inventory Staff): کۆگا، حەواڵە، سەرژمێری
INSERT INTO `role_permissions` (`role_id`, `permission_id`)
SELECT 4, `id` FROM `permissions` WHERE `code` IN (
    'products.view', 'products.create', 'products.edit', 'barcode.generate',
    'inventory.view', 'transfers.request', 'transfers.receive', 'stocktake.perform',
    'purchases.view', 'purchases.create', 'suppliers.manage'
);

-- ---------------------------------------------------------------------
-- 6. DEFAULT SUPER ADMIN USER (هەژماری سەرەکی بەڕێوەبەری گشتی)
-- Username: admin
-- Password default: Admin@123456 (BCRYPT HASH)
-- ---------------------------------------------------------------------
INSERT INTO `users` (
    `id`, `branch_id`, `role_id`, `full_name`, `username`, `email`, `phone`, 
    `password_hash`, `is_superadmin`, `status`, `max_discount_percent`, `can_give_debt`
) VALUES (
    1, 
    NULL, -- گشتگیر بۆ هەموو لقەکان
    1,    -- بەڕێوەبەری گشتی
    'زانا عەزیز (بەڕێوەبەری گشتی)', 
    'admin', 
    'admin@zana-store.com', 
    '07501002030', 
    -- Hash for 'Admin@123456' generated via password_hash('Admin@123456', PASSWORD_BCRYPT)
    '$2y$12$tU6m6X4qWjC99uFkEvJ8e.p4rIoxh25oD4z2u3Vb.x5WzE1EwXW7G', 
    1, 
    'active', 
    100.00, 
    1
);

-- دروستکردنی نموونەی بەڕێوەبەر و کاشێر بۆ لقی ١ تا ٦
INSERT INTO `users` (
    `id`, `branch_id`, `role_id`, `full_name`, `username`, `email`, `phone`, 
    `password_hash`, `is_superadmin`, `status`, `max_discount_percent`, `can_give_debt`
) VALUES 
(2, 1, 2, 'کاروان حەمە (بەڕێوەبەری لقی ١)', 'manager_br1', 'manager1@zana-store.com', '07502003040', '$2y$12$tU6m6X4qWjC99uFkEvJ8e.p4rIoxh25oD4z2u3Vb.x5WzE1EwXW7G', 0, 'active', 25.00, 1),
(3, 1, 3, 'سەروەر عوسمان (کاشێری لقی ١)', 'cashier_br1', 'cashier1@zana-store.com', '07503004050', '$2y$12$tU6m6X4qWjC99uFkEvJ8e.p4rIoxh25oD4z2u3Vb.x5WzE1EwXW7G', 0, 'active', 10.00, 0),

(4, 2, 2, 'ئاراس ئەحمەد (بەڕێوەبەری لقی ٢)', 'manager_br2', 'manager2@zana-store.com', '07502003042', '$2y$12$tU6m6X4qWjC99uFkEvJ8e.p4rIoxh25oD4z2u3Vb.x5WzE1EwXW7G', 0, 'active', 25.00, 1),
(5, 2, 3, 'دانا مەجید (کاشێری لقی ٢)', 'cashier_br2', 'cashier2@zana-store.com', '07503004052', '$2y$12$tU6m6X4qWjC99uFkEvJ8e.p4rIoxh25oD4z2u3Vb.x5WzE1EwXW7G', 0, 'active', 10.00, 0),

(6, 3, 2, 'ڕەوەند فەرهاد (بەڕێوەبەری لقی ٣)', 'manager_br3', 'manager3@zana-store.com', '07502003043', '$2y$12$tU6m6X4qWjC99uFkEvJ8e.p4rIoxh25oD4z2u3Vb.x5WzE1EwXW7G', 0, 'active', 25.00, 1),
(7, 3, 3, 'ڕێبین سالار (کاشێری لقی ٣)', 'cashier_br3', 'cashier3@zana-store.com', '07503004053', '$2y$12$tU6m6X4qWjC99uFkEvJ8e.p4rIoxh25oD4z2u3Vb.x5WzE1EwXW7G', 0, 'active', 10.00, 0),

(8, 4, 2, 'بەرهەم کەریم (بەڕێوەبەری لقی ٤)', 'manager_br4', 'manager4@zana-store.com', '07702003044', '$2y$12$tU6m6X4qWjC99uFkEvJ8e.p4rIoxh25oD4z2u3Vb.x5WzE1EwXW7G', 0, 'active', 25.00, 1),
(9, 4, 3, 'شاخەوان عومەر (کاشێری لقی ٤)', 'cashier_br4', 'cashier4@zana-store.com', '07703004054', '$2y$12$tU6m6X4qWjC99uFkEvJ8e.p4rIoxh25oD4z2u3Vb.x5WzE1EwXW7G', 0, 'active', 10.00, 0),

(10, 5, 2, 'دڵشاد نێچیرڤان (بەڕێوەبەری لقی ٥)', 'manager_br5', 'manager5@zana-store.com', '07502003045', '$2y$12$tU6m6X4qWjC99uFkEvJ8e.p4rIoxh25oD4z2u3Vb.x5WzE1EwXW7G', 0, 'active', 25.00, 1),
(11, 5, 3, 'ڕێبوار سەعید (کاشێری لقی ٥)', 'cashier_br5', 'cashier5@zana-store.com', '07503004055', '$2y$12$tU6m6X4qWjC99uFkEvJ8e.p4rIoxh25oD4z2u3Vb.x5WzE1EwXW7G', 0, 'active', 10.00, 0),

(12, 6, 2, 'عەلی مەحموود (بەڕێوەبەری لقی ٦)', 'manager_br6', 'manager6@zana-store.com', '07702003046', '$2y$12$tU6m6X4qWjC99uFkEvJ8e.p4rIoxh25oD4z2u3Vb.x5WzE1EwXW7G', 0, 'active', 25.00, 1),
(13, 6, 3, 'یوسف ڕەشید (کاشێری لقی ٦)', 'cashier_br6', 'cashier6@zana-store.com', '07703004056', '$2y$12$tU6m6X4qWjC99uFkEvJ8e.p4rIoxh25oD4z2u3Vb.x5WzE1EwXW7G', 0, 'active', 10.00, 0);

UPDATE `branches` SET `manager_id` = 2 WHERE `id` = 1;
UPDATE `branches` SET `manager_id` = 4 WHERE `id` = 2;
UPDATE `branches` SET `manager_id` = 6 WHERE `id` = 3;
UPDATE `branches` SET `manager_id` = 8 WHERE `id` = 4;
UPDATE `branches` SET `manager_id` = 10 WHERE `id` = 5;
UPDATE `branches` SET `manager_id` = 12 WHERE `id` = 6;

-- ---------------------------------------------------------------------
-- 7. DEFAULT CATEGORIES (پۆلە سەرەکییەکانی بازرگانی زانا)
-- ---------------------------------------------------------------------
INSERT INTO `categories` (`id`, `parent_id`, `name_ku`, `name_en`, `code`, `sort_order`, `description`) VALUES
(1, NULL, 'جوانکاری و مەیکئەپ', 'Cosmetics & Makeup', 'CAT-COSMETICS', 1, 'بەرهەمەکانی میکیاژ، بۆیاخ، فاوەندەیشن و ماکیاژی ڕووخسار'),
(2, NULL, 'چاودێری پێست و کەسی', 'Skincare & Personal Care', 'CAT-SKINCARE', 2, 'کریم، شۆردنی ڕووخسار، دژەخۆر و کرێمی شێدارکەرەوە'),
(3, NULL, 'بۆن و عەتر', 'Perfumes & Beauty', 'CAT-PERFUMES', 3, 'عەتری ئافرەتان و پیاوان، بۆنی لەش و دیۆدرانت'),
(4, NULL, 'جلوبەرگ و پۆشاک', 'Clothing & Fashion', 'CAT-CLOTHING', 4, 'جلوبەرگی ئافرەتان، پیاوان، کچانە و کوڕانە'),
(5, NULL, 'ئێکسسوارات', 'Accessories', 'CAT-ACCESSORIES', 5, 'کاتژمێر، ملوانکە، بازن، گوارە و دەستبەند'),
(6, NULL, 'جانتا و جانتای پشت', 'Bags & Backpacks', 'CAT-BAGS', 6, 'جانتای دەست، جانتای گەشت و جانتای قوتابخانە'),
(7, NULL, 'ڕازاندنەوەی ماڵ', 'Home Decoration', 'CAT-HOMEDECOR', 7, 'تابلۆ، مۆمدان، گوڵدان و کەلوپەلی جوانی دیزاینی ماڵ'),
(8, NULL, 'گوڵ و ڕووەکی دەستکرد', 'Artificial Flowers & Plants', 'CAT-FLOWERS', 8, 'گوڵی دەستکرد، دار و سەوزایی ڕازاوەی ناوماڵ'),
(9, NULL, 'کەلوپەلی ناوماڵ و ئەساس', 'Furniture & Household', 'CAT-FURNITURE', 9, 'کەلوپەلی پێویستی ژوور، دیزاینی ناوماڵ و ئامرازەکان'),
(10, NULL, 'قوماش و پەرۆ', 'Fabrics & Textiles', 'CAT-FABRICS', 10, 'جۆرەها قوماشی مۆدێل بەرز، پەردە و قوماشی نەخشدار');

-- پۆلە لاوەکییەکان (Subcategories)
INSERT INTO `categories` (`id`, `parent_id`, `name_ku`, `name_en`, `code`, `sort_order`, `description`) VALUES
(11, 1, 'سوراوی لێو', 'Lipstick', 'CAT-COSM-LIP', 1, 'سوراوی مات، بریسکەدار و شل'),
(12, 1, 'فاوەندەیشن و پاودەر', 'Foundation & Powder', 'CAT-COSM-FOUND', 2, 'فاوەندەیشنی پێست و پاودەری جوانکاری'),
(13, 3, 'عەتری فەرەنسی', 'French Perfumes', 'CAT-PERF-FR', 1, 'بۆنی بنەڕەتی فەرەنسی بە کوالێتی بەرز'),
(14, 4, 'عەزی و جلوبەرگی ئافرەتان', 'Women Dresses', 'CAT-CLOTH-WOMEN', 1, 'پۆشاکی تایبەتی خانمان بۆ بۆنەکان');

-- ---------------------------------------------------------------------
-- 8. DEFAULT BRANDS (براندە دیارەکان)
-- ---------------------------------------------------------------------
INSERT INTO `brands` (`id`, `name_ku`, `name_en`, `code`, `description`) VALUES
(1, 'شانێل', 'Chanel', 'BRD-CHANEL', 'براندی ناوداری جیهانی بۆ عەتر و جوانکاری'),
(2, 'دیۆر', 'Dior', 'BRD-DIOR', 'براندی پێشەنگی جلوبەرگ، بۆن و میکیاژ'),
(3, 'لۆریال', 'L’Oréal', 'BRD-LOREAL', 'بەرهەمەکانی چاودێری قژ و پێست'),
(4, 'ماک', 'M.A.C', 'BRD-MAC', 'کۆسمێتیکی پسپۆڕانەی مەیکئەپ'),
(5, 'هودا بیوتی', 'Huda Beauty', 'BRD-HUDA', 'مارکەی بەناوبانگی ڕۆژهەڵاتی ناوەڕاست و جیهان'),
(6, 'زارا هۆم', 'Zara Home', 'BRD-ZARAHOME', 'کەلوپەلی ڕازاندنەوە و دیزاینی ناوماڵ');

-- ---------------------------------------------------------------------
-- 9. DEFAULT EXPENSE CATEGORIES (پۆلەکانی خەرجی)
-- ---------------------------------------------------------------------
INSERT INTO `expense_categories` (`id`, `name_ku`, `name_en`, `code`, `is_operational`) VALUES
(1, 'کرێی دوکان و باڵەخانە', 'Shop & Building Rent', 'EXP-RENT', 1),
(2, 'مووچەی کارمەندان', 'Staff Salaries', 'EXP-SALARY', 1),
(3, 'کارەبا و موەلیدە', 'Electricity & Generator', 'EXP-ELECTRICITY', 1),
(4, 'ئینتەرنێت و پەیوەندییەکان', 'Internet & Communications', 'EXP-INTERNET', 1),
(5, 'تێچووی گواستنەوە و بەنزین', 'Transportation & Fuel', 'EXP-TRANSPORT', 1),
(6, 'چاککردنەوە و نۆژەنکردنەوە', 'Maintenance & Repairs', 'EXP-MAINT', 1),
(7, 'کەلوپەلی بەستەبەندی و نایلۆن', 'Packaging Materials', 'EXP-PACKAGING', 1),
(8, 'خەرجی میوانداری و پاکوخاوێنی', 'Hospitality & Cleaning', 'EXP-HOSPITALITY', 1),
(9, 'خەرجییە گشتی و جۆراوجۆرەکان', 'General Miscellaneous', 'EXP-MISC', 1);

-- ---------------------------------------------------------------------
-- 10. SYSTEM SETTINGS (ڕێکخستنە سەرەکییەکانی سیستەمی زانا)
-- ---------------------------------------------------------------------
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `setting_group`, `description_ku`, `is_public`) VALUES
('company_name_ku', 'کۆمەڵگەی بازرگانی زانا', 'general', 'ناوی فەرمی کۆمپانیا بە زمانی کوردی', 1),
('company_name_en', 'Zana Commercial Group', 'general', 'Company English Name', 1),
('company_phone', '0750 111 2233', 'general', 'ژمارەی تەلەفۆنی مەرکەزی', 1),
('company_logo', 'assets/images/logo.png', 'general', 'فایلی لۆگۆی کۆمپانیا', 1),
('main_currency', 'IQD', 'financial', 'دراوی بنەڕەتی بۆ حیساباتی دارایی و قازانج', 1),
('secondary_currency', 'USD', 'financial', 'دراوی دووەم بۆ وەرگرتنی پارە لە کاشێر', 1),
('default_exchange_rate', '1530', 'financial', 'نرخی دیاریکراوی دۆلار بە دینار', 1),
('tax_enabled', '0', 'pos', 'چالاککردنی باجی فرۆشتن (1=بەڵێ، 0=نەخێر)', 1),
('tax_rate_percent', '0', 'pos', 'ڕێژەی باجی سەدی لەسەر فاکتۆر', 1),
('allow_negative_stock', '0', 'pos', 'ڕێگەدان بە فرۆشتنی کاڵایەک کاتێک لە کۆگا سفرە (0=قەدەغەیە)', 0),
('receipt_printer_width', '80mm', 'print', 'قەبارەی چاپکەری وەسڵەکانی کاشێر (80mm یان 58mm)', 1),
('receipt_header_ku', 'بەخێربێن بۆ کۆگاکانی زانا', 'print', 'سەردێڕی سەرەوەی پسوولەی فرۆشتن', 1),
('receipt_footer_ku', 'سوپاس بۆ سەردانەکەتان - کاڵای فرۆشراو تا ٤٨ کاتژمێر دەگۆڕدرێتەوە بە هەبوونی ئەم پسوولەیە', 'print', 'دەقی خوارەوەی وەسڵی فرۆشتن', 1),
('barcode_standard', 'CODE128', 'pos', 'شێوازی فەرمی بەرهەمهێنانی بارکۆدی ناوخۆیی', 1),
('auto_backup_enabled', '1', 'security', 'ئەنجامدانی باکئەپی ئۆتۆماتیکی ڕۆژانە', 0);
