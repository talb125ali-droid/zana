-- =====================================================================
-- ZANA STORE MANAGEMENT SYSTEM - سیستەمی بەڕێوەبردنی کۆگاکانی زانا
-- DATABASE ARCHITECTURE: PHASE 1 SCHEMA
-- Compatible with MySQL 8.0+ / MariaDB 10.5+
-- Charset: utf8mb4, Collation: utf8mb4_unicode_ci
-- Engine: InnoDB with Foreign Key Constraints & Safe Auditing
-- =====================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS `zana_store_db`;
CREATE DATABASE `zana_store_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `zana_store_db`;

-- ---------------------------------------------------------------------
-- 1. CURRENCIES & EXCHANGE RATES (سیستەمی دراوەکان و نرخی ئاڵوگۆڕ)
-- ---------------------------------------------------------------------
CREATE TABLE `currencies` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `code` VARCHAR(3) NOT NULL UNIQUE COMMENT 'کۆدی دراو وەک IQD یان USD',
    `name_ku` VARCHAR(100) NOT NULL COMMENT 'ناوی دراو بە کوردی (دیناری عێراقی، دۆلاری ئەمریکی)',
    `name_en` VARCHAR(100) NOT NULL COMMENT 'Currency name in English',
    `symbol_ku` VARCHAR(20) NOT NULL COMMENT 'هێما بە کوردی (د.ع، $)',
    `symbol_en` VARCHAR(20) NOT NULL COMMENT 'Symbol in English',
    `is_main` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'ئایا دراوی سەرەکی کۆمپانیایە؟ (1=بەڵێ)',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'دۆخی چالاکبوون',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `exchange_rates` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `from_currency_code` VARCHAR(3) NOT NULL COMMENT 'دراوی سەرچاوە',
    `to_currency_code` VARCHAR(3) NOT NULL COMMENT 'دراوی مەبەست',
    `rate` DECIMAL(18, 6) NOT NULL COMMENT 'نرخی ئاڵوگۆڕ (بۆ نموونە 1 دۆلار = 1530 دینار)',
    `effective_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'کاتی جێبەجێکردنی نرخ',
    `updated_by_user_id` INT UNSIGNED NULL COMMENT 'ئەو بەکارهێنەرەی نرخەکەی نوێکردووەتەوە',
    `notes` VARCHAR(255) NULL COMMENT 'تێبینی دەربارەی گۆڕانی نرخ',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_currency_pair` (`from_currency_code`, `to_currency_code`),
    INDEX `idx_effective_date` (`effective_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. BRANCHES (بەڕێوەبردنی لقەکان - شەش لق)
-- ---------------------------------------------------------------------
CREATE TABLE `branches` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `code` VARCHAR(20) NOT NULL UNIQUE COMMENT 'کۆدی کورت و بێهاوتای لق (وەک BR-01)',
    `name_ku` VARCHAR(150) NOT NULL COMMENT 'ناوی لق بە کوردی (وەک لقی ١ - زانا)',
    `name_en` VARCHAR(150) NULL COMMENT 'Branch name in English',
    `phone` VARCHAR(50) NOT NULL COMMENT 'ژمارەی تەلەفۆنی لق',
    `email` VARCHAR(100) NULL COMMENT 'ئیمەیڵی پەیوەندی لق',
    `address` TEXT NOT NULL COMMENT 'ناونیشانی فیزیکی لق',
    `city` VARCHAR(100) NOT NULL DEFAULT 'هەولێر' COMMENT 'شار',
    `manager_id` INT UNSIGNED NULL COMMENT 'بەڕێوەبەری سەرپەرشتیاری لق',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'دۆخی کارکردنی لق (1=چالاکە، 0=ناچالاکە)',
    `notes` TEXT NULL COMMENT 'تێبینی تایبەت بە لق',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_branch_status` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. ROLES & PERMISSIONS (سیستەمی ڕۆڵ و دەسەڵاتەکان - RBAC)
-- ---------------------------------------------------------------------
CREATE TABLE `roles` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name_ku` VARCHAR(100) NOT NULL COMMENT 'ناوی ڕۆڵ بە کوردی (بەڕێوەبەری گشتی، بەڕێوەبەری لق، کاشێر، کارمەندی کۆگا)',
    `name_en` VARCHAR(100) NOT NULL UNIQUE COMMENT 'Role slug: super_admin, branch_manager, cashier, inventory_staff',
    `description_ku` TEXT NULL COMMENT 'ڕوونکردنەوەی ئەرکەکانی ڕۆڵ بە زمانی کوردی',
    `is_system` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'ڕۆڵی بنەڕەتی سیستەم (سڕینەوەی قەدەغەیە)',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `permissions` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `module` VARCHAR(50) NOT NULL COMMENT 'بەشی پەیوەندیدار (branches, products, pos, sales, inventory, customers, suppliers, expenses, reports, settings)',
    `code` VARCHAR(100) NOT NULL UNIQUE COMMENT 'کۆدی دەسەڵات وەک pos.create, products.edit, reports.view_profit',
    `name_ku` VARCHAR(150) NOT NULL COMMENT 'ناوی دەسەڵات بە کوردی',
    `description_ku` VARCHAR(255) NULL COMMENT 'ڕوونکردنەوە بە کوردی',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_perm_module` (`module`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `role_permissions` (
    `role_id` INT UNSIGNED NOT NULL,
    `permission_id` INT UNSIGNED NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`role_id`, `permission_id`),
    CONSTRAINT `fk_rp_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_rp_permission` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. USERS & USER PERMISSIONS (بەکارهێنەرانی سیستەم)
-- ---------------------------------------------------------------------
CREATE TABLE `users` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `branch_id` INT UNSIGNED NULL COMMENT 'ئەو لقەی بەکارهێنەر پێوەی بەستراوەتەوە (بۆ بەڕێوەبەری گشتی NULLە یان سەرجەم لقەکان)',
    `role_id` INT UNSIGNED NOT NULL COMMENT 'ڕۆڵی سەرەکی بەکارهێنەر',
    `full_name` VARCHAR(150) NOT NULL COMMENT 'ناوی تەواوی بەکارهێنەر بە کوردی',
    `username` VARCHAR(50) NOT NULL UNIQUE COMMENT 'ناوی بەکارهێنەر بۆ چوونەژوورەوە',
    `email` VARCHAR(100) NULL UNIQUE COMMENT 'ئیمەیڵ',
    `phone` VARCHAR(50) NULL COMMENT 'ژمارەی تەلەفۆن',
    `password_hash` VARCHAR(255) NOT NULL COMMENT 'وشەی نهێنی بە شێوازی پارێزراوی bcrypt',
    `is_superadmin` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'ئایا بەڕێوەبەری گشتی سەرەکییە؟ (دەسەڵاتی بێسنوور)',
    `status` ENUM('active', 'inactive', 'suspended') NOT NULL DEFAULT 'active' COMMENT 'دۆخی هەژمار',
    `max_discount_percent` DECIMAL(5, 2) NOT NULL DEFAULT 0.00 COMMENT 'زۆرترین ڕێژەی داشکاندن کە کاشێر بۆی هەیە ئەنجامی بدات (%)',
    `can_give_debt` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'ئایا دەسەڵاتی فرۆشتن بە قەرزی هەیە؟',
    `last_login` DATETIME NULL COMMENT 'کاتی دواین چوونەژوورەوە',
    `last_login_ip` VARCHAR(45) NULL COMMENT 'ئایپی دواین چوونەژوورەوە',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_users_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
    INDEX `idx_user_branch` (`branch_id`),
    INDEX `idx_user_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- پەیوەندی دڵنیایی لق لەگەڵ بەڕێوەبەری لق
ALTER TABLE `branches`
    ADD CONSTRAINT `fk_branches_manager` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

CREATE TABLE `user_permissions` (
    `user_id` INT UNSIGNED NOT NULL,
    `permission_id` INT UNSIGNED NOT NULL,
    `is_granted` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1 = بەخشراوە، 0 = لێسەندراوەتەوە (override)',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_id`, `permission_id`),
    CONSTRAINT `fk_up_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_up_permission` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. CATEGORIES & BRANDS (پۆلەکان و براندەکان)
-- ---------------------------------------------------------------------
CREATE TABLE `categories` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `parent_id` INT UNSIGNED NULL COMMENT 'پۆلی سەرەکی (بۆ پۆلە لاوەکییەکان)',
    `name_ku` VARCHAR(150) NOT NULL COMMENT 'ناوی پۆل بە کوردی',
    `name_en` VARCHAR(150) NULL COMMENT 'Category name in English',
    `code` VARCHAR(50) NOT NULL UNIQUE COMMENT 'کۆدی ناسێنەری پۆل',
    `image` VARCHAR(255) NULL COMMENT 'وێنەی پۆل',
    `description` TEXT NULL COMMENT 'ڕوونکردنەوە دەربارەی پۆل',
    `sort_order` INT NOT NULL DEFAULT 0 COMMENT 'ڕیزبەندی نیشاندان لە POS',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'دۆخی چالاکبوون',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_category_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
    INDEX `idx_cat_parent` (`parent_id`),
    INDEX `idx_cat_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `brands` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name_ku` VARCHAR(150) NOT NULL COMMENT 'ناوی براند بە کوردی',
    `name_en` VARCHAR(150) NULL COMMENT 'Brand name in English',
    `code` VARCHAR(50) NULL COMMENT 'کۆدی براند',
    `logo` VARCHAR(255) NULL COMMENT 'لۆگۆی براند',
    `description` TEXT NULL COMMENT 'تێبینی دەربارەی براند',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_brand_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6. SUPPLIERS (دابینکەران و کۆمپانیاکانی کڕین)
-- ---------------------------------------------------------------------
CREATE TABLE `suppliers` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL COMMENT 'ناوی بازرگانی دابینکەر',
    `contact_person` VARCHAR(150) NULL COMMENT 'ناوی کەسی پەیوەندیدار',
    `phone` VARCHAR(50) NOT NULL COMMENT 'ژمارەی تەلەفۆن',
    `email` VARCHAR(100) NULL COMMENT 'ئیمەیڵ',
    `address` TEXT NULL COMMENT 'ناونیشانی دابینکەر',
    `opening_balance` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'باڵانسی سەرەتایی (قەرزداری/قەرزکردن)',
    `current_balance` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'باڵانسی ئێستای دابینکەر (قەرزی ئێمە لەسەری)',
    `notes` TEXT NULL COMMENT 'تێبینی زیاتر',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_supplier_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 7. PRODUCTS & VARIATIONS & BARCODES (بەرهەمەکان، مۆدێلەکان و بارکۆدەکان)
-- ---------------------------------------------------------------------
CREATE TABLE `products` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `category_id` INT UNSIGNED NOT NULL COMMENT 'پۆلی بەرهەم',
    `brand_id` INT UNSIGNED NULL COMMENT 'براندی بەرهەم',
    `supplier_id` INT UNSIGNED NULL COMMENT 'دابینکەری سەرەکی بەرهەم',
    `name_ku` VARCHAR(255) NOT NULL COMMENT 'ناوی بەرهەم بە زمانی کوردی',
    `name_en` VARCHAR(255) NULL COMMENT 'English product name (ئارەزوومەندانە)',
    `code` VARCHAR(100) NOT NULL UNIQUE COMMENT 'کۆدی بێهاوتای بەرهەم (وەک PRD-10023)',
    `barcode` VARCHAR(100) NOT NULL UNIQUE COMMENT 'بارکۆدی بنەڕەتی بەرهەم (بۆ سکانەری بارکۆد)',
    `description` TEXT NULL COMMENT 'وەسف و تایبەتمەندییەکانی بەرهەم',
    `purchase_price` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'نرخی کڕین (بۆ تێچوونی سەرەتایی)',
    `selling_price` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'نرخی فرۆشتنی تاک',
    `wholesale_price` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'نرخی کۆی بەرهەم',
    `min_stock_alert` INT UNSIGNED NOT NULL DEFAULT 5 COMMENT 'کەمترین ژمارەی کۆگا بۆ هۆشداری تەواوبوون',
    `image` VARCHAR(255) NULL COMMENT 'وێنەی سەرەکی بەرهەم',
    `unit` VARCHAR(50) NOT NULL DEFAULT 'دانە' COMMENT 'یەکەی پێوانە (دانە، مەتر، کارتۆن، سێت)',
    `has_variants` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'ئایا بەرهەمەکە جۆری جیاوازی قەبارە و ڕەنگی هەیە؟',
    `status` ENUM('active', 'inactive', 'discontinued') NOT NULL DEFAULT 'active' COMMENT 'دۆخی بەرهەم',
    `deleted_at` DATETIME NULL COMMENT 'سڕینەوەی کاتی (Soft Delete)',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_prod_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
    CONSTRAINT `fk_prod_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_prod_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`) ON DELETE SET NULL,
    INDEX `idx_prod_name_ku` (`name_ku`),
    INDEX `idx_prod_barcode` (`barcode`),
    INDEX `idx_prod_code` (`code`),
    INDEX `idx_prod_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `product_variants` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `product_id` INT UNSIGNED NOT NULL COMMENT 'بەرهەمی دایک',
    `sku` VARCHAR(100) NOT NULL UNIQUE COMMENT 'کۆدی تایبەت بە جۆری بەرهەم',
    `barcode` VARCHAR(100) NOT NULL UNIQUE COMMENT 'بارکۆدی تایبەت بەم قەبارە یان ڕەنگە',
    `size` VARCHAR(50) NULL COMMENT 'قەبارە (S, M, L, XL, 38, 40)',
    `color` VARCHAR(50) NULL COMMENT 'ڕەنگ (سوور، ڕەش، شین)',
    `model` VARCHAR(100) NULL COMMENT 'مۆدێل یان دیزاین',
    `package_type` VARCHAR(50) NULL COMMENT 'جۆری بەستەبەندی',
    `purchase_price` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'نرخی کڕینی ئەم جۆرە',
    `selling_price` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'نرخی فرۆشتنی ئەم جۆرە',
    `wholesale_price` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'نرخی کۆ',
    `image` VARCHAR(255) NULL,
    `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_variant_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
    INDEX `idx_variant_barcode` (`barcode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `barcodes` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `product_id` INT UNSIGNED NOT NULL,
    `variant_id` INT UNSIGNED NULL,
    `barcode` VARCHAR(100) NOT NULL UNIQUE COMMENT 'کۆدی بارکۆد (EAN-13 یان Code 128)',
    `barcode_type` VARCHAR(50) NOT NULL DEFAULT 'CODE128' COMMENT 'جۆری بارکۆد',
    `is_primary` TINYINT(1) NOT NULL DEFAULT 1 COMMENT 'ئایا بارکۆدی بنەڕەتییە؟',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_barcodes_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_barcodes_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE,
    INDEX `idx_barcode_lookup` (`barcode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 8. BRANCH INVENTORY & STOCK MOVEMENTS (کۆگای ٦ لق و مێژووی جووڵەی کاڵا)
-- ---------------------------------------------------------------------
CREATE TABLE `branch_inventory` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `branch_id` INT UNSIGNED NOT NULL COMMENT 'لقەکە (لە نێوان ٦ لقەکەدا)',
    `product_id` INT UNSIGNED NOT NULL COMMENT 'بەرهەم',
    `variant_id` INT UNSIGNED NULL COMMENT 'مۆدێلی بەرهەم (ئەگەر هەبێت)',
    `quantity` DECIMAL(12, 2) NOT NULL DEFAULT 0.00 COMMENT 'بڕی بەردەست لەم لقە',
    `min_stock_alert` INT UNSIGNED NOT NULL DEFAULT 5 COMMENT 'کەمترین بڕی هۆشداری تایبەت بەم لقە',
    `shelf_location` VARCHAR(100) NULL COMMENT 'شوێنی ڕەفە و شوێنی کاڵا لە کۆگای لق',
    `last_stocktake_date` DATETIME NULL COMMENT 'کاتی دواین سەرژمێری',
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uq_branch_product_variant` (`branch_id`, `product_id`, `variant_id`),
    CONSTRAINT `fk_inv_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_inv_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_inv_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE CASCADE,
    INDEX `idx_inv_qty` (`quantity`),
    INDEX `idx_inv_branch` (`branch_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `inventory_movements` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `branch_id` INT UNSIGNED NOT NULL COMMENT 'ئەو لقەی جووڵەکەی لێ ئەنجامدراوە',
    `product_id` INT UNSIGNED NOT NULL COMMENT 'بەرهەم',
    `variant_id` INT UNSIGNED NULL COMMENT 'مۆدێلی بەرهەم',
    `movement_type` ENUM(
        'sale',               -- فرۆشتن لە کاشێر
        'purchase',           -- کڕین و داخڵکردنی کاڵا
        'transfer_out',       -- ناردن بۆ لقێکی تر
        'transfer_in',        -- وەرگرتن لە لقێکی ترەوە
        'return_in',          -- گەڕانەوەی فرۆش لە کڕیارەوە
        'return_out',         -- گەڕانەوەی کڕین بۆ دابینکەر
        'adjustment',         -- دەستکاریکردنی قەبارە لە سەرژمێری
        'damaged',            -- تۆمارکردنی کاڵای شکا و تێکچوو
        'lost'                -- کاڵای ونبوو
    ) NOT NULL COMMENT 'جۆری جووڵەی کۆگا',
    `quantity` DECIMAL(12, 2) NOT NULL COMMENT 'بڕی گۆڕاو (+ بۆ زیادبوون، - بۆ کەمبوون)',
    `previous_qty` DECIMAL(12, 2) NOT NULL COMMENT 'بڕی پێشوو',
    `new_qty` DECIMAL(12, 2) NOT NULL COMMENT 'بڕی پاش جووڵە',
    `unit_cost` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'تێچووی دانە لە کاتی جووڵەکە',
    `reference_type` VARCHAR(50) NOT NULL COMMENT 'ناوی فایلی سەرچاوە: sale, purchase, transfer, return, stocktake',
    `reference_id` BIGINT UNSIGNED NOT NULL COMMENT 'ژمارەی ئایدی فاکتۆڕ یان حەواڵە',
    `user_id` INT UNSIGNED NOT NULL COMMENT 'ئەو کارمەندەی جووڵەکەی ئەنجامداوە',
    `notes` VARCHAR(255) NULL COMMENT 'هۆکار یان تێبینی تایبەت',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_mov_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
    CONSTRAINT `fk_mov_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
    CONSTRAINT `fk_mov_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    INDEX `idx_mov_ref` (`reference_type`, `reference_id`),
    INDEX `idx_mov_date` (`created_at`),
    INDEX `idx_mov_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 9. CUSTOMERS & DEBTS (کڕیاران، قەرزەکان و مامەڵەی دارایی کڕیار)
-- ---------------------------------------------------------------------
CREATE TABLE `customers` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `branch_id` INT UNSIGNED NULL COMMENT 'ئەو لقەی کڕیارەکەی تۆمارکردووە',
    `full_name` VARCHAR(150) NOT NULL COMMENT 'ناوی تەواوی کڕیار',
    `phone` VARCHAR(50) NOT NULL UNIQUE COMMENT 'ژمارەی مۆبایل (بێهاوتا بۆ گەڕان و پەیوەندی)',
    `address` TEXT NULL COMMENT 'ناونیشان',
    `credit_limit` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'ئاستی ڕێگەپێدراوی قەرز (0 = بێسنوور یان بەپێی متمانە)',
    `opening_balance` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'باڵانسی کۆن لە دەستپێکی سیستەم',
    `total_debt` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'سەرجەم قەرزە کەڵەکەبووەکان',
    `total_paid` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'سەرجەم پارەدانە وەرگیراوەکان',
    `current_balance` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'باڵانسی ماوە (قەرزی ماوە لای کڕیار)',
    `notes` TEXT NULL COMMENT 'تێبینی دەربارەی مامەڵەی کڕیار',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_cust_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL,
    INDEX `idx_cust_phone` (`phone`),
    INDEX `idx_cust_name` (`full_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `customer_transactions` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `customer_id` INT UNSIGNED NOT NULL,
    `branch_id` INT UNSIGNED NOT NULL,
    `user_id` INT UNSIGNED NOT NULL,
    `transaction_type` ENUM('sale_debt', 'payment', 'return_refund', 'opening_balance', 'adjustment') NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL COMMENT 'بڕی پارە بە دراوی مامەڵەکە',
    `currency_code` VARCHAR(3) NOT NULL DEFAULT 'IQD' COMMENT 'دراوی مامەڵە',
    `exchange_rate` DECIMAL(18, 6) NOT NULL DEFAULT 1.000000 COMMENT 'نرخی دراو بەرامبەر دراوی بنەڕەتی',
    `amount_main_currency` DECIMAL(15, 2) NOT NULL COMMENT 'بڕی پارە بە دراوی سەرەکی حسێبکراو',
    `payment_method` ENUM('cash', 'card', 'bank_transfer', 'cheque', 'credit_deduction') NOT NULL DEFAULT 'cash',
    `receipt_number` VARCHAR(100) NULL COMMENT 'ژمارەی پسوولەی وەرگرتنی پارە',
    `sale_id` BIGINT UNSIGNED NULL COMMENT 'ئەگەر پەیوەندیدار بێت بە فاکتۆری فرۆشتنەوە',
    `notes` TEXT NULL,
    `transaction_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_ct_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_ct_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
    CONSTRAINT `fk_ct_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    INDEX `idx_ct_date` (`transaction_date`),
    INDEX `idx_ct_cust` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 10. CASH REGISTERS & SHIFTS (قاسەی کاشێر و چوونەژوورەوەی شەفت)
-- ---------------------------------------------------------------------
CREATE TABLE `cash_registers` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `branch_id` INT UNSIGNED NOT NULL,
    `cashier_id` INT UNSIGNED NOT NULL,
    `register_name` VARCHAR(100) NOT NULL DEFAULT 'قاسەی سەرەکی' COMMENT 'ناوی قاسە یان مێزی کاشێر',
    `opening_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'کاتی دەستپێکردنی شەفت',
    `closing_time` DATETIME NULL COMMENT 'کاتی کۆتاییهاتن و داخرانی شەفت',
    `opening_balance_iqd` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'پارەی دەستپێک بە دینار',
    `opening_balance_usd` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'پارەی دەستپێک بە دۆلار',
    `expected_cash_iqd` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'پارەی چاوەڕوانکراو لە قاسە',
    `expected_cash_usd` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `closing_cash_iqd` DECIMAL(15, 2) NULL COMMENT 'پارەی فیعلی ژمێردراو لە کاتی داخستن',
    `closing_cash_usd` DECIMAL(15, 2) NULL,
    `difference_iqd` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'جیاوازی پارەی قاسە (کەم یان زیاد)',
    `difference_usd` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `status` ENUM('open', 'closed') NOT NULL DEFAULT 'open',
    `notes` TEXT NULL,
    CONSTRAINT `fk_cr_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
    CONSTRAINT `fk_cr_cashier` FOREIGN KEY (`cashier_id`) REFERENCES `users` (`id`),
    INDEX `idx_cr_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cash_transactions` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `cash_register_id` INT UNSIGNED NOT NULL,
    `branch_id` INT UNSIGNED NOT NULL,
    `user_id` INT UNSIGNED NOT NULL,
    `transaction_type` ENUM(
        'opening',         -- پارەی دەستپێکی قاسە
        'sale_cash',       -- فرۆشتنی نەقد
        'debt_collection', -- وەرگرتنەوەی قەرز لە کڕیار
        'expense',         -- مەسروفیاتی خێرا لە قاسەوە
        'deposit',         -- دانانی پارە لە قاسە
        'withdrawal',      -- پارە ڕاکێشان لە قاسە بۆ خەزێنە
        'closing'          -- داخستنی شەفت
    ) NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `currency_code` VARCHAR(3) NOT NULL DEFAULT 'IQD',
    `exchange_rate` DECIMAL(18, 6) NOT NULL DEFAULT 1.000000,
    `amount_main_currency` DECIMAL(15, 2) NOT NULL,
    `reference_type` VARCHAR(50) NULL COMMENT 'sale, expense, debt_payment',
    `reference_id` BIGINT UNSIGNED NULL,
    `notes` VARCHAR(255) NULL,
    `transaction_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_ctrans_register` FOREIGN KEY (`cash_register_id`) REFERENCES `cash_registers` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_ctrans_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
    CONSTRAINT `fk_ctrans_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 11. SALES, ITEMS & PAYMENTS (فاکتۆری فرۆشتن، کاڵاکان و پارەدان)
-- ---------------------------------------------------------------------
CREATE TABLE `sales` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `invoice_number` VARCHAR(50) NOT NULL UNIQUE COMMENT 'ژمارەی بێهاوتای پسوولەی فرۆشتن وەک INV-BR1-2026-0001',
    `branch_id` INT UNSIGNED NOT NULL COMMENT 'ئەو لقەی فرۆشتنەکەی ئەنجامداوە',
    `cashier_id` INT UNSIGNED NOT NULL COMMENT 'کاشێر',
    `customer_id` INT UNSIGNED NULL COMMENT 'کڕیار (ئەگەر کڕیاری نەقد بێت دەکرێت بێناونیشان بێت)',
    `cash_register_id` INT UNSIGNED NULL COMMENT 'شەفتی قاسە',
    `sale_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'کاتی فرۆشتن',
    `subtotal` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'کۆی گشتی پێش داشکاندن',
    `discount_type` ENUM('fixed', 'percent') NOT NULL DEFAULT 'fixed' COMMENT 'جۆری داشکاندن',
    `discount_value` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'بڕی داشکاندن',
    `discount_amount` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'کۆی پارەی داشکاندن',
    `tax_percent` DECIMAL(5, 2) NOT NULL DEFAULT 0.00 COMMENT 'ڕێژەی باج ئەگەر هەبێت',
    `tax_amount` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'بڕی باج',
    `total_amount` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'کۆی گشتی فاکتۆر دوای داشکاندن و باج',
    `cost_of_goods_sold` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'تێچووی کڕینی کاڵاکانی ناو ئەم فاکتۆرە (COGS Snapshot)',
    `gross_profit` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'قازانجی ناپوختە (Total Amount - COGS)',
    `paid_amount` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'بڕی پارەی وەرگیراو',
    `remaining_debt` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'قەرزی ماوە لەسەر کڕیار',
    `payment_status` ENUM('paid', 'partial', 'debt') NOT NULL DEFAULT 'paid' COMMENT 'دۆخی پارەدان',
    `primary_currency` VARCHAR(3) NOT NULL DEFAULT 'IQD' COMMENT 'دراوی سەرەکی فاکتۆر',
    `exchange_rate` DECIMAL(18, 6) NOT NULL DEFAULT 1.000000 COMMENT 'نرخی دراو لە کاتی فرۆشتن',
    `total_main_currency` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'کۆی فاکتۆر بە دراوی سەرەکی بۆ ڕاپۆرت',
    `status` ENUM('completed', 'returned', 'partially_returned', 'cancelled') NOT NULL DEFAULT 'completed',
    `notes` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_sales_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
    CONSTRAINT `fk_sales_cashier` FOREIGN KEY (`cashier_id`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_sales_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_sales_register` FOREIGN KEY (`cash_register_id`) REFERENCES `cash_registers` (`id`) ON DELETE SET NULL,
    INDEX `idx_sales_invoice` (`invoice_number`),
    INDEX `idx_sales_date` (`sale_date`),
    INDEX `idx_sales_branch` (`branch_id`),
    INDEX `idx_sales_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sale_items` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `sale_id` BIGINT UNSIGNED NOT NULL,
    `product_id` INT UNSIGNED NOT NULL,
    `variant_id` INT UNSIGNED NULL,
    `quantity` DECIMAL(12, 2) NOT NULL DEFAULT 1.00 COMMENT 'بڕی فرۆشراو',
    `unit_cost_snapshot` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'تێچووی کڕین لە ساتی ئەم فرۆشتنە بۆ ئەژمارکردنی دروستی قازانج',
    `unit_price` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'نرخی فرۆشتنی دانە',
    `discount_amount` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'داشکاندنی سەر ئەم دانەیە',
    `total_price` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'کۆی نرخی ئەم ڕیزە پاش داشکاندن',
    `total_cost` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'کۆی تێچووی ئەم ڕیزە (unit_cost_snapshot * quantity)',
    `gross_profit` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'قازانجی ناپوختی ئەم بەرهەمە',
    `returned_quantity` DECIMAL(12, 2) NOT NULL DEFAULT 0.00 COMMENT 'بڕی گەڕێنراوە لەم بەرهەمە',
    `is_fully_returned` TINYINT(1) NOT NULL DEFAULT 0,
    CONSTRAINT `fk_si_sale` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_si_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
    CONSTRAINT `fk_si_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL,
    INDEX `idx_si_sale` (`sale_id`),
    INDEX `idx_si_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `sale_payments` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `sale_id` BIGINT UNSIGNED NOT NULL,
    `branch_id` INT UNSIGNED NOT NULL,
    `cashier_id` INT UNSIGNED NOT NULL,
    `payment_method` ENUM('cash', 'card', 'mixed', 'credit') NOT NULL DEFAULT 'cash',
    `amount` DECIMAL(15, 2) NOT NULL COMMENT 'بڕی پارەی دراو بەم شێوازە',
    `currency_code` VARCHAR(3) NOT NULL DEFAULT 'IQD',
    `exchange_rate` DECIMAL(18, 6) NOT NULL DEFAULT 1.000000,
    `amount_main_currency` DECIMAL(15, 2) NOT NULL,
    `tendered_amount` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'پارەی ڕاستەقینەی پێدراو لەلایەن کڕیار',
    `change_amount` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'پارەی گەڕاوە بۆ کڕیار',
    `card_transaction_ref` VARCHAR(100) NULL COMMENT 'ژمارەی پسوولەی کارتی بانکی',
    `transaction_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_sp_sale` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_sp_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
    CONSTRAINT `fk_sp_cashier` FOREIGN KEY (`cashier_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 12. PURCHASES & SUPPLIER PAYMENTS (کڕینی کۆگا لە دابینکەران)
-- ---------------------------------------------------------------------
CREATE TABLE `purchases` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `invoice_number` VARCHAR(50) NOT NULL UNIQUE COMMENT 'ژمارەی پسوولەی کڕین لە دابینکەرەوە',
    `branch_id` INT UNSIGNED NOT NULL COMMENT 'ئەو لقەی کاڵاکانی بۆ کڕدراوە',
    `supplier_id` INT UNSIGNED NOT NULL COMMENT 'دابینکەر',
    `user_id` INT UNSIGNED NOT NULL COMMENT 'ئەو کارمەندەی کڕینەکەی تۆمارکردووە',
    `purchase_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `subtotal` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `discount_amount` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `shipping_cost` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'تێچوونی گواستنەوە و گەیاندن',
    `total_amount` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `paid_amount` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `remaining_debt` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'قەرزی ماوەی دابینکەر',
    `currency_code` VARCHAR(3) NOT NULL DEFAULT 'USD',
    `exchange_rate` DECIMAL(18, 6) NOT NULL DEFAULT 1.000000,
    `total_main_currency` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `status` ENUM('received', 'pending', 'cancelled') NOT NULL DEFAULT 'received',
    `notes` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_pur_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
    CONSTRAINT `fk_pur_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`),
    CONSTRAINT `fk_pur_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    INDEX `idx_pur_invoice` (`invoice_number`),
    INDEX `idx_pur_date` (`purchase_date`),
    INDEX `idx_pur_supplier` (`supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `purchase_items` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `purchase_id` BIGINT UNSIGNED NOT NULL,
    `product_id` INT UNSIGNED NOT NULL,
    `variant_id` INT UNSIGNED NULL,
    `quantity` DECIMAL(12, 2) NOT NULL,
    `purchase_cost` DECIMAL(15, 2) NOT NULL COMMENT 'نرخی کڕینی تاک',
    `discount_amount` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `total_cost` DECIMAL(15, 2) NOT NULL,
    `expiry_date` DATE NULL COMMENT 'بەرواری بەسەرچوون ئەگەر هەبێت (بۆ مەیکئەپ و پێست)',
    CONSTRAINT `fk_pi_purchase` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_pi_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
    CONSTRAINT `fk_pi_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `supplier_payments` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `supplier_id` INT UNSIGNED NOT NULL,
    `purchase_id` BIGINT UNSIGNED NULL,
    `branch_id` INT UNSIGNED NOT NULL,
    `user_id` INT UNSIGNED NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `currency_code` VARCHAR(3) NOT NULL DEFAULT 'USD',
    `exchange_rate` DECIMAL(18, 6) NOT NULL DEFAULT 1.000000,
    `amount_main_currency` DECIMAL(15, 2) NOT NULL,
    `payment_method` ENUM('cash', 'bank_transfer', 'cheque') NOT NULL DEFAULT 'cash',
    `receipt_number` VARCHAR(100) NULL,
    `payment_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `notes` TEXT NULL,
    CONSTRAINT `fk_spay_supplier` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`),
    CONSTRAINT `fk_spay_purchase` FOREIGN KEY (`purchase_id`) REFERENCES `purchases` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_spay_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
    CONSTRAINT `fk_spay_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 13. STOCK TRANSFERS BETWEEN BRANCHES (حەواڵەکردنی کاڵا لە نێوان لقەکان)
-- ---------------------------------------------------------------------
CREATE TABLE `stock_transfers` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `transfer_number` VARCHAR(50) NOT NULL UNIQUE COMMENT 'ژمارەی حەواڵە وەک TRF-2026-0001',
    `source_branch_id` INT UNSIGNED NOT NULL COMMENT 'لقی نێرەر',
    `destination_branch_id` INT UNSIGNED NOT NULL COMMENT 'لقی وەرگر',
    `requester_id` INT UNSIGNED NOT NULL COMMENT 'ئەو کارمەندەی داواکارییەکەی ناردووە',
    `approver_id` INT UNSIGNED NULL COMMENT 'ئەو بەڕێوەبەرەی پەسەندی کردووە',
    `dispatcher_id` INT UNSIGNED NULL COMMENT 'ئەو کارمەندەی کاڵاکەی لە لقی سەرچاوە دەرکردووە',
    `receiver_id` INT UNSIGNED NULL COMMENT 'ئەو کارمەندەی لە لقی مەبەست کاڵاکەی وەرگرتووە',
    `status` ENUM(
        'pending',      -- چاوەڕوانی پەسەندکردن
        'approved',     -- پەسەندکراو
        'dispatched',   -- لە ڕێگایە (لقی سەرچاوە کەمکراوەتەوە)
        'received',     -- وەرگیرا لە لقی مەبەست (حەواڵە تەواو بوو)
        'rejected',     -- ڕەتکرایەوە
        'cancelled'     -- هەڵوەشێنرایەوە
    ) NOT NULL DEFAULT 'pending',
    `request_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `dispatch_date` DATETIME NULL,
    `receive_date` DATETIME NULL,
    `notes` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_st_src_branch` FOREIGN KEY (`source_branch_id`) REFERENCES `branches` (`id`),
    CONSTRAINT `fk_st_dst_branch` FOREIGN KEY (`destination_branch_id`) REFERENCES `branches` (`id`),
    CONSTRAINT `fk_st_requester` FOREIGN KEY (`requester_id`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_st_approver` FOREIGN KEY (`approver_id`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_st_receiver` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`),
    INDEX `idx_st_status` (`status`),
    INDEX `idx_st_src` (`source_branch_id`),
    INDEX `idx_st_dst` (`destination_branch_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `stock_transfer_items` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `transfer_id` BIGINT UNSIGNED NOT NULL,
    `product_id` INT UNSIGNED NOT NULL,
    `variant_id` INT UNSIGNED NULL,
    `requested_quantity` DECIMAL(12, 2) NOT NULL,
    `dispatched_quantity` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `received_quantity` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `damaged_quantity` DECIMAL(12, 2) NOT NULL DEFAULT 0.00 COMMENT 'بڕی شکا یان تێکچوو لە کاتی گواستنەوە',
    `lost_quantity` DECIMAL(12, 2) NOT NULL DEFAULT 0.00 COMMENT 'بڕی ونبوو',
    `unit_cost` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `notes` VARCHAR(255) NULL,
    CONSTRAINT `fk_sti_transfer` FOREIGN KEY (`transfer_id`) REFERENCES `stock_transfers` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_sti_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
    CONSTRAINT `fk_sti_variant` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 14. SALES RETURNS & EXCHANGES (گەڕاندنەوە و گۆڕینەوەی کاڵا)
-- ---------------------------------------------------------------------
CREATE TABLE `returns` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `return_number` VARCHAR(50) NOT NULL UNIQUE COMMENT 'ژمارەی پسوولەی گەڕاندنەوە وەک RET-2026-0001',
    `sale_id` BIGINT UNSIGNED NOT NULL COMMENT 'فاکتۆری فرۆشتنی سەرەکی',
    `branch_id` INT UNSIGNED NOT NULL COMMENT 'ئەو لقەی گەڕاندنەوەکەی لێ ئەنجامدراوە',
    `cashier_id` INT UNSIGNED NOT NULL,
    `customer_id` INT UNSIGNED NULL,
    `return_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `total_refund_amount` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `refund_method` ENUM('cash', 'card', 'exchange', 'customer_credit') NOT NULL DEFAULT 'cash',
    `exchange_sale_id` BIGINT UNSIGNED NULL COMMENT 'فاکتۆری نوێ ئەگەر گۆڕینەوە (Exchange) بێت',
    `reason` VARCHAR(255) NOT NULL COMMENT 'هۆکاری گەڕاندنەوە',
    `notes` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_ret_sale` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`),
    CONSTRAINT `fk_ret_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
    CONSTRAINT `fk_ret_cashier` FOREIGN KEY (`cashier_id`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_ret_customer` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
    INDEX `idx_ret_sale` (`sale_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `return_items` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `return_id` BIGINT UNSIGNED NOT NULL,
    `sale_item_id` BIGINT UNSIGNED NOT NULL,
    `product_id` INT UNSIGNED NOT NULL,
    `variant_id` INT UNSIGNED NULL,
    `quantity` DECIMAL(12, 2) NOT NULL,
    `unit_refund_price` DECIMAL(15, 2) NOT NULL,
    `total_refund` DECIMAL(15, 2) NOT NULL,
    `return_cost_snapshot` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'تێچووی کڕینی کاڵای گەڕاوە بۆ ڕێکخستنی قازانج',
    `condition_status` ENUM('good', 'damaged', 'scrap') NOT NULL DEFAULT 'good' COMMENT 'دۆخی کاڵا (باش بۆ کۆگا، شکا، یان فەوتاو)',
    `action_taken` ENUM('restock', 'quarantine', 'dispose') NOT NULL DEFAULT 'restock' COMMENT 'ڕێکاری وەرگرتنەوە لە کۆگا',
    `notes` VARCHAR(255) NULL,
    CONSTRAINT `fk_ri_return` FOREIGN KEY (`return_id`) REFERENCES `returns` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_ri_sale_item` FOREIGN KEY (`sale_item_id`) REFERENCES `sale_items` (`id`),
    CONSTRAINT `fk_ri_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 15. EXPENSES & EXPENSE CATEGORIES (خەرجییەکان و هاوپۆلەکان)
-- ---------------------------------------------------------------------
CREATE TABLE `expense_categories` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name_ku` VARCHAR(150) NOT NULL COMMENT 'ناوی پۆلی خەرجی (کرێی دوکان، مووچە، کارەبا، ئینتەرنێت، گواستنەوە)',
    `name_en` VARCHAR(150) NULL,
    `code` VARCHAR(50) NOT NULL UNIQUE,
    `is_operational` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1 = خەرجی کارگێڕی بەردەوام (Operational Expense)',
    `is_active` TINYINT(1) NOT NULL DEFAULT 1,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `expenses` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `branch_id` INT UNSIGNED NOT NULL COMMENT 'ئەو لقەی خەرجییەکەی لێ کراوە',
    `category_id` INT UNSIGNED NOT NULL,
    `user_id` INT UNSIGNED NOT NULL,
    `cash_register_id` INT UNSIGNED NULL,
    `expense_date` DATE NOT NULL,
    `amount` DECIMAL(15, 2) NOT NULL,
    `currency_code` VARCHAR(3) NOT NULL DEFAULT 'IQD',
    `exchange_rate` DECIMAL(18, 6) NOT NULL DEFAULT 1.000000,
    `amount_main_currency` DECIMAL(15, 2) NOT NULL,
    `payment_method` ENUM('cash', 'bank_transfer', 'cheque') NOT NULL DEFAULT 'cash',
    `description` TEXT NOT NULL COMMENT 'وردەکاری هۆکاری خەرجی',
    `receipt_attachment` VARCHAR(255) NULL COMMENT 'فایلی وێنە یان پسوولەی وەسڵ',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_exp_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
    CONSTRAINT `fk_exp_cat` FOREIGN KEY (`category_id`) REFERENCES `expense_categories` (`id`),
    CONSTRAINT `fk_exp_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
    INDEX `idx_exp_date` (`expense_date`),
    INDEX `idx_exp_branch` (`branch_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 16. STOCKTAKES & AUDITS (سەرژمێری و پشکنینی کۆگا)
-- ---------------------------------------------------------------------
CREATE TABLE `stocktakes` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `stocktake_number` VARCHAR(50) NOT NULL UNIQUE,
    `branch_id` INT UNSIGNED NOT NULL,
    `conducted_by_id` INT UNSIGNED NOT NULL,
    `approved_by_id` INT UNSIGNED NULL,
    `status` ENUM('draft', 'in_progress', 'completed', 'approved', 'cancelled') NOT NULL DEFAULT 'draft',
    `start_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `end_date` DATETIME NULL,
    `total_system_qty` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `total_counted_qty` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `total_shortage_qty` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `total_surplus_qty` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `total_difference_cost` DECIMAL(15, 2) NOT NULL DEFAULT 0.00 COMMENT 'بەهای دارایی جیاوازی سەرژمێری',
    `notes` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_stk_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
    CONSTRAINT `fk_stk_conductor` FOREIGN KEY (`conducted_by_id`) REFERENCES `users` (`id`),
    CONSTRAINT `fk_stk_approver` FOREIGN KEY (`approved_by_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `stocktake_items` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `stocktake_id` INT UNSIGNED NOT NULL,
    `product_id` INT UNSIGNED NOT NULL,
    `variant_id` INT UNSIGNED NULL,
    `system_quantity` DECIMAL(12, 2) NOT NULL,
    `counted_quantity` DECIMAL(12, 2) NOT NULL,
    `difference_quantity` DECIMAL(12, 2) NOT NULL,
    `unit_cost` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `difference_cost` DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    `status` ENUM('match', 'shortage', 'surplus') NOT NULL,
    `is_adjusted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT 'ئایا کۆگای ڕاستەقینەی پێ نوێکراوەتەوە؟',
    `notes` VARCHAR(255) NULL,
    CONSTRAINT `fk_stki_stocktake` FOREIGN KEY (`stocktake_id`) REFERENCES `stocktakes` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_stki_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 17. NOTIFICATIONS & ALERTS (ئاگاداری و هۆشدارییەکان)
-- ---------------------------------------------------------------------
CREATE TABLE `notifications` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NULL COMMENT 'بەکارهێنەری دیاریکراو (ئەگەر NULL بێت بۆ سەرجەم بەڕێوەبەرانە)',
    `branch_id` INT UNSIGNED NULL COMMENT 'لق',
    `title_ku` VARCHAR(200) NOT NULL,
    `message_ku` TEXT NOT NULL,
    `type` ENUM('low_stock', 'transfer_request', 'debt_alert', 'cash_difference', 'system') NOT NULL,
    `reference_url` VARCHAR(255) NULL,
    `is_read` TINYINT(1) NOT NULL DEFAULT 0,
    `read_at` DATETIME NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_notif_user` (`user_id`, `is_read`),
    INDEX `idx_notif_date` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 18. AUDIT LOGS (تۆماری مێژوویی و پاراستنی ئاسایش)
-- ---------------------------------------------------------------------
CREATE TABLE `audit_logs` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT UNSIGNED NULL,
    `branch_id` INT UNSIGNED NULL,
    `action` VARCHAR(100) NOT NULL COMMENT 'create, update, delete, login, export, transfer_approve, adjust',
    `entity_type` VARCHAR(100) NOT NULL COMMENT 'sale, product, branch, expense, user, transfer',
    `entity_id` BIGINT UNSIGNED NULL,
    `old_values` JSON NULL COMMENT 'بەهاکانی پێشوو بە شێوەی JSON',
    `new_values` JSON NULL COMMENT 'بەها نوێیەکان بە شێوەی JSON',
    `ip_address` VARCHAR(45) NULL,
    `user_agent` TEXT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_audit_action` (`action`),
    INDEX `idx_audit_entity` (`entity_type`, `entity_id`),
    INDEX `idx_audit_date` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 19. SYSTEM SETTINGS & BACKUPS (ڕێکخستنەکانی سیستەم و باکئەپ)
-- ---------------------------------------------------------------------
CREATE TABLE `system_settings` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `setting_key` VARCHAR(100) NOT NULL UNIQUE,
    `setting_value` TEXT NULL,
    `setting_group` VARCHAR(50) NOT NULL DEFAULT 'general' COMMENT 'general, pos, financial, print, security',
    `description_ku` VARCHAR(255) NOT NULL,
    `is_public` TINYINT(1) NOT NULL DEFAULT 0,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `backup_logs` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `filename` VARCHAR(255) NOT NULL,
    `filesize_bytes` BIGINT NOT NULL,
    `backup_type` ENUM('manual', 'automated') NOT NULL DEFAULT 'manual',
    `created_by_user_id` INT UNSIGNED NOT NULL,
    `file_path` VARCHAR(255) NOT NULL,
    `status` ENUM('success', 'failed') NOT NULL DEFAULT 'success',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_backup_user` FOREIGN KEY (`created_by_user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 20. VIEWS FOR PROFIT & INVENTORY (دیمەنە ئامادەکراوەکان بۆ قازانج و کۆگا)
-- ---------------------------------------------------------------------
CREATE OR REPLACE VIEW `view_branch_inventory_summary` AS
SELECT 
    b.id AS branch_id,
    b.name_ku AS branch_name,
    COUNT(DISTINCT bi.product_id) AS total_distinct_products,
    COALESCE(SUM(bi.quantity), 0) AS total_units_in_stock,
    COALESCE(SUM(bi.quantity * p.purchase_price), 0) AS total_inventory_cost_value,
    COALESCE(SUM(bi.quantity * p.selling_price), 0) AS total_inventory_retail_value,
    COUNT(CASE WHEN bi.quantity <= bi.min_stock_alert THEN 1 END) AS low_stock_items_count
FROM branches b
LEFT JOIN branch_inventory bi ON b.id = bi.branch_id
LEFT JOIN products p ON bi.product_id = p.id AND p.deleted_at IS NULL
WHERE b.is_active = 1
GROUP BY b.id, b.name_ku;

CREATE OR REPLACE VIEW `view_branch_financial_performance` AS
SELECT 
    b.id AS branch_id,
    b.name_ku AS branch_name,
    COALESCE(SUM(s.total_main_currency), 0) AS total_sales_revenue,
    COALESCE(SUM(s.cost_of_goods_sold), 0) AS total_cogs,
    COALESCE(SUM(s.gross_profit), 0) AS total_gross_profit,
    (
        SELECT COALESCE(SUM(e.amount_main_currency), 0)
        FROM expenses e
        WHERE e.branch_id = b.id
    ) AS total_expenses,
    (
        COALESCE(SUM(s.gross_profit), 0) - (
            SELECT COALESCE(SUM(e.amount_main_currency), 0)
            FROM expenses e
            WHERE e.branch_id = b.id
        )
    ) AS net_profit
FROM branches b
LEFT JOIN sales s ON b.id = s.branch_id AND s.status = 'completed'
WHERE b.is_active = 1
GROUP BY b.id, b.name_ku;

SET FOREIGN_KEY_CHECKS = 1;
