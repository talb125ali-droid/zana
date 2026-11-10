<?php
/**
 * ZANA STORE MANAGEMENT SYSTEM
 * داشبۆردی سەرەکی (Main Dashboard)
 * Native PHP 8.2+ • MySQLi • RTL • Kurdish Sorani
 */

require_once __DIR__ . '/app/config/config.php';
require_once __DIR__ . '/app/config/database.php';
require_once __DIR__ . '/app/config/security.php';
require_once __DIR__ . '/app/helpers/auth.php';
require_once __DIR__ . '/app/helpers/functions.php';

requireAuth();

$db = Database::getInstance();

// Active branch handling
$activeBranchId = currentBranchId();
if (isSuperAdmin() && isset($_GET['branch'])) {
    $reqBranch = (int)$_GET['branch'];
    if ($reqBranch === 0) {
        $activeBranchId = null; // All branches
    } else {
        $activeBranchId = $reqBranch;
    }
}

// Fetch all branches
$branches = $db->fetchAll("SELECT * FROM branches ORDER BY id ASC");

// Financial metrics query
$branchFilter = $activeBranchId ? "WHERE s.branch_id = {$activeBranchId}" : "";
$branchFilterExp = $activeBranchId ? "WHERE e.branch_id = {$activeBranchId}" : "";
$branchFilterStock = $activeBranchId ? "WHERE bs.branch_id = {$activeBranchId}" : "";

// Total Sales & Gross Profit
$salesMetrics = $db->fetchOne(
    "SELECT 
        COALESCE(SUM(s.total_amount), 0) as total_sales,
        COALESCE(SUM(s.cost_of_goods_sold), 0) as total_cogs,
        COALESCE(SUM(s.gross_profit), 0) as total_gross_profit,
        COALESCE(SUM(s.remaining_debt), 0) as total_debts,
        COUNT(s.id) as total_invoices
     FROM sales s {$branchFilter}"
);

// Total Operating Expenses
$expenseMetrics = $db->fetchOne(
    "SELECT COALESCE(SUM(e.amount), 0) as total_expenses 
     FROM expenses e {$branchFilterExp}"
);

// Total Inventory Value
$inventoryMetrics = $db->fetchOne(
    "SELECT 
        COALESCE(SUM(bs.quantity * p.purchase_price), 0) as total_inventory_cost,
        COALESCE(SUM(bs.quantity * p.selling_price), 0) as total_inventory_retail,
        COALESCE(SUM(bs.quantity), 0) as total_items_count
     FROM branch_stock bs
     JOIN products p ON bs.product_id = p.id
     {$branchFilterStock}"
);

$netSales = (float)($salesMetrics['total_sales'] ?? 0);
$grossProfit = (float)($salesMetrics['total_gross_profit'] ?? 0);
$totalExpenses = (float)($expenseMetrics['total_expenses'] ?? 0);
$netProfit = $grossProfit - $totalExpenses;
$inventoryCost = (float)($inventoryMetrics['total_inventory_cost'] ?? 0);
$totalDebts = (float)($salesMetrics['total_debts'] ?? 0);

// Low Stock Alerts (< min_stock_alert)
$lowStockQuery = "
    SELECT p.name_ku, p.barcode, bs.quantity, p.min_stock_alert, b.name_ku as branch_name 
    FROM branch_stock bs
    JOIN products p ON bs.product_id = p.id
    JOIN branches b ON bs.branch_id = b.id
    WHERE bs.quantity <= p.min_stock_alert
";
if ($activeBranchId) {
    $lowStockQuery .= " AND bs.branch_id = {$activeBranchId}";
}
$lowStockQuery .= " ORDER BY bs.quantity ASC LIMIT 6";
$lowStockProducts = $db->fetchAll($lowStockQuery);

// Recent Sales Invoices
$recentSalesQuery = "
    SELECT s.invoice_number, s.total_amount, s.payment_method, s.created_at, 
           b.name_ku as branch_name, COALESCE(c.full_name, 'کڕیاری گشتی') as customer_name
    FROM sales s
    JOIN branches b ON s.branch_id = b.id
    LEFT JOIN customers c ON s.customer_id = c.id
";
if ($activeBranchId) {
    $recentSalesQuery .= " WHERE s.branch_id = {$activeBranchId}";
}
$recentSalesQuery .= " ORDER BY s.id DESC LIMIT 6";
$recentSales = $db->fetchAll($recentSalesQuery);
?>
<!DOCTYPE html>
<html lang="ckb" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>داشبۆرد • سیستەمی کۆگاکانی زانا</title>
    <!-- Bootstrap 5 RTL -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css">
    <!-- Font Awesome 6 -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <!-- Kurdish Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;600;700;900&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Noto Sans Arabic', sans-serif;
            background-color: #0b1120;
            color: #f1f5f9;
            min-height: 100vh;
        }
        .navbar-custom {
            background-color: #0f172a;
            border-bottom: 1px solid #1e293b;
        }
        .card-custom {
            background-color: #0f172a;
            border: 1px solid #1e293b;
            border-radius: 1rem;
        }
        .badge-amber {
            background-color: #f59e0b;
            color: #020617;
            font-weight: 700;
        }
        .btn-amber {
            background-color: #f59e0b;
            color: #020617;
            font-weight: 700;
            border: none;
        }
        .btn-amber:hover {
            background-color: #fbbf24;
            color: #020617;
        }
        .stat-value {
            font-family: monospace;
            font-weight: 900;
        }
    </style>
</head>
<body>

    <!-- Header / Navbar -->
    <nav class="navbar navbar-expand-lg navbar-custom sticky-top py-2.5">
        <div class="container-fluid px-4">
            <a class="navbar-brand text-white fw-bold d-flex align-items-center gap-2" href="index.php">
                <span class="p-2 rounded-3 bg-warning text-dark d-inline-flex"><i class="fa-solid fa-store"></i></span>
                <span>کۆگاکانی زانا</span>
                <span class="badge bg-secondary small">٦ لق</span>
            </a>

            <div class="d-flex align-items-center gap-3">
                <!-- Branch Switcher (for Super Admin) -->
                <?php if (isSuperAdmin()): ?>
                    <div class="dropdown">
                        <button class="btn btn-sm btn-outline-secondary text-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                            <i class="fa-solid fa-building me-1 text-warning"></i>
                            <?= $activeBranchId ? "لقی: " . e($branches[array_search($activeBranchId, array_column($branches, 'id'))]['name_ku'] ?? '') : 'هەموو لقەکان' ?>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end shadow">
                            <li><a class="dropdown-item <?= !$activeBranchId ? 'active' : '' ?>" href="index.php?branch=0">هەموو لقەکان پێکەوە</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <?php foreach ($branches as $br): ?>
                                <li>
                                    <a class="dropdown-item <?= $activeBranchId == $br['id'] ? 'active' : '' ?>" href="index.php?branch=<?= $br['id'] ?>">
                                        <?= e($br['name_ku']) ?> (<?= e($br['city']) ?>)
                                    </a>
                                </li>
                            <?php endforeach; ?>
                        </ul>
                    </div>
                <?php else: ?>
                    <span class="badge bg-dark border border-secondary text-light py-2 px-3">
                        <i class="fa-solid fa-location-dot text-warning me-1"></i> <?= e($_SESSION['branch_name_ku'] ?? '') ?>
                    </span>
                <?php endif; ?>

                <!-- User Profile & Logout -->
                <div class="d-flex align-items-center gap-2">
                    <span class="text-secondary small d-none d-md-inline"><?= e(currentUserName()) ?> (<?= e($_SESSION['role_name_ku'] ?? '') ?>)</span>
                    <a href="logout.php" class="btn btn-sm btn-outline-danger" title="دەرچوون">
                        <i class="fa-solid fa-right-from-bracket"></i>
                    </a>
                </div>
            </div>
        </div>
    </nav>

    <!-- Main Container -->
    <div class="container-fluid px-4 py-4">
        
        <!-- Welcome & Quick POS Banner -->
        <div class="card card-custom p-4 mb-4">
            <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
                <div>
                    <h2 class="h5 fw-bold text-white mb-1">سیستەمی گشتگیری بەڕێوەبردنی فرۆشگا و کۆگاکان</h2>
                    <p class="text-secondary small mb-0">
                        لقی چالاک: <strong class="text-warning"><?= $activeBranchId ? e($branches[array_search($activeBranchId, array_column($branches, 'id'))]['name_ku'] ?? '') : 'تەواوی ٦ لقەکە' ?></strong>
                        • دراوی بنەڕەتی: دیناری عێراقی (IQD) • بەهای دۆلار: 1,530 د.ع
                    </p>
                </div>
                <div class="d-flex gap-2">
                    <a href="../#pos" class="btn btn-amber px-4 py-2">
                        <i class="fa-solid fa-barcode ms-1"></i> پەڕەی کاشێر (POS)
                    </a>
                </div>
            </div>
        </div>

        <!-- 6 KPI Financial Cards -->
        <div class="row g-3 mb-4">
            <div class="col-6 col-lg-2">
                <div class="card card-custom p-3 h-100">
                    <span class="text-secondary small">کۆی فرۆشراو (Net Sales)</span>
                    <div class="stat-value text-white fs-5 mt-1"><?= formatIqd($netSales) ?></div>
                    <span class="badge bg-primary bg-opacity-25 text-primary mt-2 small"><?= (int)($salesMetrics['total_invoices'] ?? 0) ?> فاکتۆر</span>
                </div>
            </div>
            <div class="col-6 col-lg-2">
                <div class="card card-custom p-3 h-100">
                    <span class="text-secondary small">تێچووی کاڵا (COGS)</span>
                    <div class="stat-value text-white fs-5 mt-1"><?= formatIqd((float)($salesMetrics['total_cogs'] ?? 0)) ?></div>
                    <span class="text-secondary small mt-2">تێچووی کۆگا</span>
                </div>
            </div>
            <div class="col-6 col-lg-2">
                <div class="card card-custom p-3 h-100">
                    <span class="text-secondary small">قازانجی ناپوخت (Gross)</span>
                    <div class="stat-value text-warning fs-5 mt-1"><?= formatIqd($grossProfit) ?></div>
                    <span class="text-secondary small mt-2">فرۆش - تێچوو</span>
                </div>
            </div>
            <div class="col-6 col-lg-2">
                <div class="card card-custom p-3 h-100">
                    <span class="text-secondary small">خەرجی گشتی (Expenses)</span>
                    <div class="stat-value text-danger fs-5 mt-1"><?= formatIqd($totalExpenses) ?></div>
                    <span class="text-secondary small mt-2">کرێ، مووچە، هتد</span>
                </div>
            </div>
            <div class="col-6 col-lg-2">
                <div class="card card-custom p-3 h-100">
                    <span class="text-secondary small">قازانجی پوخت (Net Profit)</span>
                    <div class="stat-value text-success fs-5 mt-1"><?= formatIqd($netProfit) ?></div>
                    <span class="badge bg-success bg-opacity-25 text-success mt-2 small">قازانجی کۆتایی</span>
                </div>
            </div>
            <div class="col-6 col-lg-2">
                <div class="card card-custom p-3 h-100">
                    <span class="text-secondary small">قەرزی کڕیاران (Debts)</span>
                    <div class="stat-value text-info fs-5 mt-1"><?= formatIqd($totalDebts) ?></div>
                    <span class="text-secondary small mt-2">قەرزی نەگەڕاوە</span>
                </div>
            </div>
        </div>

        <!-- 6 Branches Overview Grid -->
        <div class="row g-4 mb-4">
            <div class="col-12 col-xl-8">
                <div class="card card-custom p-4 h-100">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h3 class="h6 fw-bold text-white mb-0">
                            <i class="fa-solid fa-building text-warning ms-1"></i> دۆخی شەش لقی فیزیکی زانا
                        </h3>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-dark table-hover table-borderless align-middle small mb-0">
                            <thead>
                                <tr class="text-secondary border-bottom border-secondary">
                                    <th>ناوی لق</th>
                                    <th>شار</th>
                                    <th>کۆد</th>
                                    <th>تەلەفۆن</th>
                                    <th>دۆخ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($branches as $b): ?>
                                    <tr>
                                        <td class="fw-bold text-light"><?= e($b['name_ku']) ?></td>
                                        <td class="text-secondary"><?= e($b['city']) ?></td>
                                        <td><span class="badge bg-dark border border-secondary font-monospace"><?= e($b['code']) ?></span></td>
                                        <td class="text-secondary font-monospace"><?= e($b['phone'] ?? '-') ?></td>
                                        <td><span class="badge bg-success bg-opacity-25 text-success">چالاک</span></td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Low Stock Warnings -->
            <div class="col-12 col-xl-4">
                <div class="card card-custom p-4 h-100">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h3 class="h6 fw-bold text-white mb-0">
                            <i class="fa-solid fa-triangle-exclamation text-danger ms-1"></i> ئاگاداری کەمی کۆگا
                        </h3>
                    </div>
                    <?php if (empty($lowStockProducts)): ?>
                        <div class="text-center py-4 text-secondary small">
                            کۆگاکان پڕن و هیچ بەرهەمێک نەگەیشتووەتە ئاستی مەترسیدار.
                        </div>
                    <?php else: ?>
                        <div class="list-group list-group-flush bg-transparent">
                            <?php foreach ($lowStockProducts as $lsp): ?>
                                <div class="list-group-item bg-transparent text-light border-secondary px-0 py-2 d-flex justify-content-between align-items-center">
                                    <div>
                                        <div class="fw-bold small"><?= e($lsp['name_ku']) ?></div>
                                        <div class="text-secondary font-monospace" style="font-size: 0.75rem;">
                                            <?= e($lsp['branch_name']) ?> • بارکۆد: <?= e($lsp['barcode']) ?>
                                        </div>
                                    </div>
                                    <span class="badge bg-danger font-monospace"><?= (int)$lsp['quantity'] ?> دانە</span>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>

    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
