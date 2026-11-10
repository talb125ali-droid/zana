<?php
/**
 * ZANA STORE MANAGEMENT SYSTEM - سیستەمی بەڕێوەبردنی کۆگاکانی زانا
 * Core Application Functions (Formatting, Math, Barcode, Currency)
 */

declare(strict_types=1);

/**
 * ڕێکخستنی بڕی پارە بە دیناری عێراقی یان دۆلار
 */
function format_money(float|int|string $amount, string $currency = 'IQD'): string
{
    $val = (float)$amount;
    if ($currency === 'IQD') {
        return number_format($val, 0, '.', ',') . ' د.ع';
    } elseif ($currency === 'USD') {
        return '$' . number_format($val, 2, '.', ',');
    }
    return number_format($val, 2, '.', ',') . ' ' . $currency;
}

/**
 * گۆڕینی دۆلار بۆ دینار بەپێی نرخی فەرمی
 */
function usd_to_iqd(float $usdAmount, float $rate = 1530.00): float
{
    return round($usdAmount * $rate, 0);
}

/**
 * گۆڕینی دینار بۆ دۆلار
 */
function iqd_to_usd(float $iqdAmount, float $rate = 1530.00): float
{
    if ($rate <= 0) return 0.0;
    return round($iqdAmount / $rate, 2);
}

/**
 * دروستکردنی بارکۆدی ئۆتۆماتیکی بێهاوتا بە شێوازی EAN-13 یان تایبەت
 */
function generate_unique_barcode(string $prefix = 'ZN'): string
{
    // شێوازی کاتی و ژمارەی هەڕەمەکی بۆ ئەوەی دووبارە نەبێتەوە
    return $prefix . date('ymd') . str_pad((string)random_int(1000, 9999), 4, '0', STR_PAD_LEFT);
}

/**
 * ئەژمارکردنی قازانجی ناپوختە (Gross Profit)
 * Gross Profit = Net Sales - Cost of Goods Sold (COGS)
 */
function calculate_gross_profit(float $netSales, float $cogs): float
{
    return round($netSales - $cogs, 2);
}

/**
 * ئەژمارکردنی قازانجی پوختە (Net Profit)
 * Net Profit = Gross Profit - Operating Expenses
 */
function calculate_net_profit(float $grossProfit, float $operatingExpenses): float
{
    return round($grossProfit - $operatingExpenses, 2);
}

/**
 * دەرکردنی وەڵامی JSON بۆ Fetch API / AJAX
 */
function json_response(bool $success, string $message, array $data = [], int $statusCode = 200): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data,
        'timestamp' => date('Y-m-d H:i:s')
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
