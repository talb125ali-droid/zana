<?php
/**
 * ZANA STORE MANAGEMENT SYSTEM - سیستەمی بەڕێوەبردنی کۆگاکانی زانا
 * General Application Configuration
 */

declare(strict_types=1);

// دەستپێکردنی دانیشتن بە مەرجی پارێزراو
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.cookie_samesite', 'Lax');
    session_start();
}

// زانیاری بنەڕەتی سیستەم
define('APP_NAME_KU', 'سیستەمی بەڕێوەبردنی کۆگاکانی زانا');
define('APP_NAME_EN', 'Zana Store Management System');
define('APP_VERSION', '1.0.0 (Phase 1)');
define('BASE_URL', getenv('APP_URL') ?: 'http://localhost/zana-store');

// دراوەکان
define('DEFAULT_CURRENCY', 'IQD');
define('SECONDARY_CURRENCY', 'USD');
define('DEFAULT_EXCHANGE_RATE', 1530.00);

// ڕێساکانی بەکارهێنەر و پاراستن
define('PASSWORD_MIN_LENGTH', 8);
define('MAX_LOGIN_ATTEMPTS', 5);
define('LOGIN_LOCKOUT_MINUTES', 15);

// ڕێساکانی کۆگا
define('ALLOW_NEGATIVE_STOCK', false); // قەدەغەکردنی بڕی نێگەتیڤی کۆگا
define('DEFAULT_MIN_STOCK_ALERT', 5);
define('BARCODE_TYPE', 'CODE128');

// لقەکان (ژمارەی بنەڕەتی)
define('TOTAL_DEFAULT_BRANCHES', 6);
