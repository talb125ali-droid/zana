<?php
/**
 * ZANA STORE MANAGEMENT SYSTEM
 * خەرجییەکان و شەفتی قاسە (Expenses & Cash Shifts)
 * Native PHP 8.2+ • MySQLi • RTL • Kurdish Sorani
 */

require_once __DIR__ . '/app/config/config.php';
require_once __DIR__ . '/app/config/database.php';
require_once __DIR__ . '/app/config/security.php';
require_once __DIR__ . '/app/helpers/auth.php';
require_once __DIR__ . '/app/helpers/functions.php';

requireAuth();

$db = Database::getInstance();
$branchId = currentBranchId() ?? 1;
$message = '';
$error = '';

// Handle Add Expense
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'add_expense') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        $error = 'تۆکنی CSRF نادروستە.';
    } else {
        $category = cleanInput($_POST['category'] ?? '');
        $amount = (float)($_POST['amount'] ?? 0);
        $description = cleanInput($_POST['description'] ?? '');

        if (empty($category) || $amount <= 0) {
            $error = 'تکایە بەشی خەرجی و بڕی پارە دیاری بکە.';
        } else {
            try {
                $db->execute(
                    "INSERT INTO expenses (branch_id, category, amount, currency, expense_date, description, recorded_by)
                     VALUES (?, ?, ?, 'IQD', CURDATE(), ?, ?)",
                    [$branchId, $category, $amount, $description, currentUserId()],
                    'isdsi'
                );
                $message = "خەرجی بە بڕی " . formatIqd($amount) . " بە سەرکەوتوویی تۆمارکرا!";
            } catch (Exception $e) {
                $error = "هەڵە لە تۆمارکردنی خەرجی: " . $e->getMessage();
            }
        }
    }
}

// Fetch expenses for active branch
$expenses = $db->fetchAll(
    "SELECT e.*, u.full_name as recorder_name 
     FROM expenses e 
     LEFT JOIN users u ON e.recorded_by = u.id
     WHERE e.branch_id = ?
     ORDER BY e.id DESC LIMIT 25",
    [$branchId],
    'i'
);

$totalBranchExpenses = array_sum(array_column($expenses, 'amount'));
?>
<!DOCTYPE html>
<html lang="ckb" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>خەرجییەکان و قاسە • کۆگاکانی زانا</title>
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
                <span class="p-2 rounded-3 bg-warning text-dark"><i class="fa-solid fa-wallet"></i></span>
                <span>کۆگاکانی زانا • خەرجییەکان</span>
            </a>
            <div class="d-flex gap-2">
                <a href="index.php" class="btn btn-sm btn-outline-light"><i class="fa-solid fa-arrow-right ms-1"></i> داشبۆرد</a>
                <a href="pos.php" class="btn btn-sm btn-amber"><i class="fa-solid fa-barcode ms-1"></i> خاڵی فرۆشتن (POS)</a>
            </div>
        </div>
    </nav>

    <div class="container-fluid px-4 py-4">
        <?php if ($message): ?>
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="fa-solid fa-check-circle me-1"></i> <?= e($message) ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        <?php endif; ?>
        <?php if ($error): ?>
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <i class="fa-solid fa-circle-exclamation me-1"></i> <?= e($error) ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        <?php endif; ?>

        <div class="row g-4">
            <!-- Left: Add Expense Form -->
            <div class="col-12 col-lg-4">
                <div class="card card-custom p-4">
                    <h2 class="h6 fw-bold text-white mb-3">
                        <i class="fa-solid fa-receipt text-warning ms-1"></i> تۆمارکردنی خەرجی نوێ
                    </h2>
                    <form method="POST" action="expenses.php">
                        <input type="hidden" name="action" value="add_expense">
                        <input type="hidden" name="csrf_token" value="<?= generateCsrfToken() ?>">

                        <div class="mb-3">
                            <label class="form-label small text-secondary">جۆری خەرجی:</label>
                            <select name="category" class="form-select bg-dark border-secondary text-light" required>
                                <option value="کرێی دووکان">کرێی دووکان و باڵەخانە</option>
                                <option value="مووچەی کارمەندان">مووچەی کارمەندان</option>
                                <option value="کارەبا و مۆلیدە">کارەبا و مۆلیدە</option>
                                <option value="ئاو و خزمەتگوزاری">ئاو و خزمەتگوزاری</option>
                                <option value="گواستنەوە و هاتووچۆ">گواستنەوە و بارکردن</option>
                                <option value="چاککردنەوە و پەرەپێدان">چاککردنەوە و پەرەپێدان</option>
                                <option value="ڕیکلام و بازاڕگەری">ڕیکلام و سپۆنسەر</option>
                                <option value="خەرجی گشتی">خەرجی گشتی تر</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small text-secondary">بڕی خەرجی (دیناری عێراقی):</label>
                            <input type="number" name="amount" min="1000" step="500" class="form-control bg-dark border-secondary text-white font-monospace" placeholder="50000" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small text-secondary">ڕوونکردنەوە و تێبینی:</label>
                            <input type="text" name="description" class="form-control bg-dark border-secondary text-white" placeholder="پارەی مانگی ١١، وەسڵی کارەبا...">
                        </div>

                        <button type="submit" class="btn btn-amber w-100 py-2">
                            <i class="fa-solid fa-save ms-1"></i> تۆمارکردنی خەرجی
                        </button>
                    </form>
                </div>
            </div>

            <!-- Right: Expenses History Table -->
            <div class="col-12 col-lg-8">
                <div class="card card-custom p-4">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h2 class="h6 fw-bold text-white mb-0">
                            <i class="fa-solid fa-list-ul text-warning ms-1"></i> خەرجییە تۆمارکراوەکانی لق
                        </h2>
                        <span class="badge bg-danger bg-opacity-25 text-danger font-monospace fs-6">
                            کۆ: <?= formatIqd($totalBranchExpenses) ?>
                        </span>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-dark table-hover table-borderless align-middle small mb-0">
                            <thead>
                                <tr class="text-secondary border-bottom border-secondary">
                                    <th>جۆری خەرجی</th>
                                    <th>بڕ</th>
                                    <th>بەروار</th>
                                    <th>تۆمارکراوە لەلایەن</th>
                                    <th>تێبینی</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if (empty($expenses)): ?>
                                    <tr><td colspan="5" class="text-center py-4 text-secondary">هیچ خەرجییەک لەم لقە تۆمار نەکراوە.</td></tr>
                                <?php else: ?>
                                    <?php foreach ($expenses as $e): ?>
                                        <tr>
                                            <td class="fw-bold text-light"><?= e($e['category']) ?></td>
                                            <td class="font-monospace text-danger fw-bold"><?= formatIqd((float)$e['amount']) ?></td>
                                            <td class="font-monospace text-secondary"><?= e($e['expense_date']) ?></td>
                                            <td class="text-secondary"><?= e($e['recorder_name'] ?? 'ئەدمین') ?></td>
                                            <td class="text-secondary"><?= e($e['description'] ?? '-') ?></td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
