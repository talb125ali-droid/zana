<?php
/**
 * ZANA STORE MANAGEMENT SYSTEM
 * ڕاپۆرتە داراییەکان و قازانج (Financial Reports & Profit Calculation)
 * Native PHP 8.2+ • MySQLi • RTL • Kurdish Sorani
 */

require_once __DIR__ . '/app/config/config.php';
require_once __DIR__ . '/app/config/database.php';
require_once __DIR__ . '/app/config/security.php';
require_once __DIR__ . '/app/helpers/auth.php';
require_once __DIR__ . '/app/helpers/functions.php';

requireAuth();

$db = Database::getInstance();

// Handle CSV Export
if (isset($_GET['export']) && $_GET['export'] === 'csv') {
    header('Content-Type: text/csv; charset=UTF-8');
    header('Content-Disposition: attachment; filename="zana_financial_report_' . date('Y-m-d') . '.csv"');
    
    // Output UTF-8 BOM for Excel Kurdish rendering
    echo "\xEF\xBB\xBF";
    $output = fopen('php://output', 'w');
    fputcsv($output, ['ناوی لق', 'شار', 'کۆی فرۆشراو', 'تێچووی کۆگا (COGS)', 'قازانجی خاو (Gross)', 'خەرجییەکان', 'قازانجی پاک (Net)']);

    $branchStats = $db->fetchAll(
        "SELECT b.name_ku, b.city,
                COALESCE(SUM(s.total_amount), 0) as total_sales,
                COALESCE(SUM(s.cost_of_goods_sold), 0) as total_cogs,
                COALESCE(SUM(s.gross_profit), 0) as total_gross,
                COALESCE(SUM(e.amount), 0) as total_expenses,
                COALESCE(SUM(s.gross_profit), 0) - COALESCE(SUM(e.amount), 0) as net_profit
         FROM branches b
         LEFT JOIN sales s ON b.id = s.branch_id
         LEFT JOIN expenses e ON b.id = e.branch_id
         GROUP BY b.id
         ORDER BY b.id ASC"
    );

    foreach ($branchStats as $bs) {
        fputcsv($output, [
            $bs['name_ku'],
            $bs['city'],
            $bs['total_sales'],
            $bs['total_cogs'],
            $bs['total_gross'],
            $bs['total_expenses'],
            $bs['net_profit']
        ]);
    }
    fclose($output);
    exit;
}

// Global Financial Metrics
$salesMetrics = $db->fetchOne(
    "SELECT 
        COALESCE(SUM(total_amount), 0) as net_sales,
        COALESCE(SUM(cost_of_goods_sold), 0) as total_cogs,
        COALESCE(SUM(gross_profit), 0) as gross_profit,
        COUNT(id) as total_invoices
     FROM sales"
);

$expenseMetrics = $db->fetchOne("SELECT COALESCE(SUM(amount), 0) as total_expenses FROM expenses");

$netSales = (float)($salesMetrics['net_sales'] ?? 0);
$cogs = (float)($salesMetrics['total_cogs'] ?? 0);
$grossProfit = (float)($salesMetrics['gross_profit'] ?? 0);
$expenses = (float)($expenseMetrics['total_expenses'] ?? 0);
$netProfit = $grossProfit - $expenses;

// 6 Branches Matrix
$branches = $db->fetchAll(
    "SELECT b.id, b.name_ku, b.city,
            COALESCE(SUM(s.total_amount), 0) as total_sales,
            COALESCE(SUM(s.cost_of_goods_sold), 0) as total_cogs,
            COALESCE(SUM(s.gross_profit), 0) as total_gross,
            (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE branch_id = b.id) as total_expenses
     FROM branches b
     LEFT JOIN sales s ON b.id = s.branch_id
     GROUP BY b.id
     ORDER BY b.id ASC"
);

// Top Selling Products
$topProducts = $db->fetchAll(
    "SELECT p.name_ku, p.barcode, 
            COALESCE(SUM(si.quantity), 0) as sold_qty,
            COALESCE(SUM(si.total_price), 0) as total_revenue,
            COALESCE(SUM(si.gross_profit), 0) as total_profit
     FROM products p
     JOIN sale_items si ON p.id = si.product_id
     GROUP BY p.id
     ORDER BY sold_qty DESC LIMIT 8"
);
?>
<!DOCTYPE html>
<html lang="ckb" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ڕاپۆرتە داراییەکان و قازانج • کۆگاکانی زانا</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;600;700;900&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Noto Sans Arabic', sans-serif; background-color: #0b1120; color: #f1f5f9; min-height: 100vh; }
        .card-custom { background-color: #0f172a; border: 1px solid #1e293b; border-radius: 1rem; }
        .btn-amber { background-color: #f59e0b; color: #020617; font-weight: 700; border: none; }
        .btn-amber:hover { background-color: #fbbf24; color: #020617; }
    </style>
</head>
<body>
    <nav class="navbar navbar-dark bg-dark border-bottom border-secondary py-2.5 px-4">
        <div class="container-fluid">
            <a class="navbar-brand fw-bold text-white d-flex align-items-center gap-2" href="index.php">
                <span class="p-2 rounded-3 bg-warning text-dark"><i class="fa-solid fa-chart-line"></i></span>
                <span>کۆگاکانی زانا • ڕاپۆرتە داراییەکان و قازانج</span>
            </a>
            <div class="d-flex gap-2">
                <a href="reports.php?export=csv" class="btn btn-sm btn-outline-success">
                    <i class="fa-solid fa-file-excel ms-1"></i> هەناردەکردن بۆ Excel
                </a>
                <button onclick="window.print()" class="btn btn-sm btn-outline-light">
                    <i class="fa-solid fa-print ms-1"></i> چاپکردن
                </button>
                <a href="index.php" class="btn btn-sm btn-amber"><i class="fa-solid fa-arrow-right ms-1"></i> داشبۆرد</a>
            </div>
        </div>
    </nav>

    <div class="container-fluid px-4 py-4">

        <!-- Profit Formula Banner -->
        <div class="card card-custom p-4 mb-4 border-warning border-opacity-25 bg-warning bg-opacity-10">
            <h2 class="h6 fw-bold text-warning mb-1">
                <i class="fa-solid fa-calculator ms-1"></i> شێوازی یاسایی هەژمارکردنی قازانج بەپێی مادەی دارایی ٩:
            </h2>
            <div class="small text-light d-flex flex-wrap gap-4 mt-2">
                <div>• <strong class="text-white">قازانجی ناپوختە (Gross Profit)</strong> = داهاتی فرۆشتن (Net Sales) - تێچووی کڕینی کاڵای فرۆشراو (COGS)</div>
                <div>• <strong class="text-white">قازانجی پوختە (Net Profit)</strong> = قازانجی ناپوختە - سەرجەم خەرجییەکان (کرێ، مووچە، کارەبا)</div>
            </div>
        </div>

        <!-- KPI Scorecards -->
        <div class="row g-3 mb-4">
            <div class="col-6 col-lg-3">
                <div class="card card-custom p-3 h-100">
                    <span class="text-secondary small">کۆی فرۆشراو (Net Sales)</span>
                    <div class="h4 font-monospace fw-bold text-white mt-1"><?= formatIqd($netSales) ?></div>
                    <span class="badge bg-primary bg-opacity-25 text-primary mt-1 small"><?= (int)($salesMetrics['total_invoices'] ?? 0) ?> فاکتۆری فرۆشتن</span>
                </div>
            </div>
            <div class="col-6 col-lg-3">
                <div class="card card-custom p-3 h-100">
                    <span class="text-secondary small">تێچووی کاڵای فرۆشراو (COGS)</span>
                    <div class="h4 font-monospace fw-bold text-light mt-1"><?= formatIqd($cogs) ?></div>
                    <span class="text-secondary small mt-1">تێچووی کڕینی کۆگا</span>
                </div>
            </div>
            <div class="col-6 col-lg-3">
                <div class="card card-custom p-3 h-100 border-warning border-opacity-50">
                    <span class="text-warning small fw-bold">قازانجی ناپوختە (Gross Profit)</span>
                    <div class="h4 font-monospace fw-bold text-warning mt-1"><?= formatIqd($grossProfit) ?></div>
                    <span class="text-secondary small mt-1">پێش دەرکردنی خەرجی</span>
                </div>
            </div>
            <div class="col-6 col-lg-3">
                <div class="card card-custom p-3 h-100 border-success border-opacity-50">
                    <span class="text-success small fw-bold">قازانجی پوختەی زانا (Net Profit)</span>
                    <div class="h4 font-monospace fw-bold text-success mt-1"><?= formatIqd($netProfit) ?></div>
                    <span class="badge bg-success bg-opacity-25 text-success mt-1 small">دوای داشکاندنی خەرجی (<?= formatIqd($expenses) ?>)</span>
                </div>
            </div>
        </div>

        <!-- 6 Branches Matrix -->
        <div class="card card-custom p-4 mb-4">
            <h2 class="h6 fw-bold text-white mb-3">
                <i class="fa-solid fa-building text-warning ms-1"></i> بەراوردی داهات و قازانجی شەش لقەکە (Branch Performance Matrix)
            </h2>
            <div class="table-responsive">
                <table class="table table-dark table-hover table-borderless align-middle small mb-0">
                    <thead>
                        <tr class="text-secondary border-bottom border-secondary">
                            <th>ناوی لق</th>
                            <th>شار</th>
                            <th>داهاتی فرۆشتن</th>
                            <th>تێچووی کاڵا (COGS)</th>
                            <th>قازانجی ناپوختە (Gross)</th>
                            <th>خەرجییەکان</th>
                            <th>قازانجی پوختە (Net Profit)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($branches as $br): ?>
                            <?php 
                                $bGross = (float)$br['total_gross'];
                                $bExp = (float)$br['total_expenses'];
                                $bNet = $bGross - $bExp;
                            ?>
                            <tr>
                                <td class="fw-bold text-light"><?= e($br['name_ku']) ?></td>
                                <td class="text-secondary"><?= e($br['city']) ?></td>
                                <td class="font-monospace text-light"><?= formatIqd((float)$br['total_sales']) ?></td>
                                <td class="font-monospace text-secondary"><?= formatIqd((float)$br['total_cogs']) ?></td>
                                <td class="font-monospace text-warning fw-bold"><?= formatIqd($bGross) ?></td>
                                <td class="font-monospace text-danger"><?= formatIqd($bExp) ?></td>
                                <td class="font-monospace fw-bold <?= $bNet >= 0 ? 'text-success' : 'text-danger' ?>">
                                    <?= formatIqd($bNet) ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Top Selling Products -->
        <div class="card card-custom p-4">
            <h2 class="h6 fw-bold text-white mb-3">
                <i class="fa-solid fa-trophy text-warning ms-1"></i> پڕفرۆشترین بەرهەمەکانی فرۆشگاکانی زانا
            </h2>
            <div class="row g-3">
                <?php foreach ($topProducts as $idx => $tp): ?>
                    <div class="col-12 col-sm-6 col-lg-3">
                        <div class="p-3 rounded-3 bg-dark border border-secondary">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <span class="badge bg-warning text-dark font-monospace">#<?= $idx + 1 ?></span>
                                <span class="text-secondary font-monospace small"><?= e($tp['barcode']) ?></span>
                            </div>
                            <div class="fw-bold small text-light text-truncate"><?= e($tp['name_ku']) ?></div>
                            <div class="d-flex justify-content-between align-items-center mt-2 small">
                                <span class="text-secondary">فرۆشراو: <strong class="text-warning font-monospace"><?= (int)$tp['sold_qty'] ?></strong> دانە</span>
                                <span class="text-success font-monospace fw-bold">+<?= formatIqd((float)$tp['total_profit']) ?></span>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>

    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
