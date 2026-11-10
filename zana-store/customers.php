<?php
/**
 * ZANA STORE MANAGEMENT SYSTEM
 * کڕیاران و بەڕێوەبردنی قەرز (Customers & Debt Ledger)
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

// Handle Add Customer
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'add_customer') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        $error = 'تۆکنی CSRF نادروستە.';
    } else {
        $fullName = cleanInput($_POST['full_name'] ?? '');
        $phone = cleanInput($_POST['phone'] ?? '');
        $address = cleanInput($_POST['address'] ?? '');
        $creditLimit = (float)($_POST['credit_limit'] ?? 1000000);

        if (empty($fullName) || empty($phone)) {
            $error = 'تکایە ناوی کڕیار و ژمارەی مۆبایل بنووسە.';
        } else {
            try {
                $db->execute(
                    "INSERT INTO customers (full_name, phone, address, credit_limit, current_balance, total_debt, total_paid)
                     VALUES (?, ?, ?, ?, 0, 0, 0)",
                    [$fullName, $phone, $address, $creditLimit],
                    'sssd'
                );
                $message = "کڕیار '{$fullName}' بە سەرکەوتوویی تۆمارکرا!";
            } catch (Exception $e) {
                $error = "هەڵە لە تۆمارکردنی کڕیار: " . $e->getMessage();
            }
        }
    }
}

// Handle Record Debt Payment
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'record_payment') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        $error = 'تۆکنی CSRF نادروستە.';
    } else {
        $customerId = (int)($_POST['customer_id'] ?? 0);
        $amount = (float)($_POST['amount'] ?? 0);
        $notes = cleanInput($_POST['notes'] ?? 'دانەوەی قەرز لە کاشێر');

        if ($customerId <= 0 || $amount <= 0) {
            $error = 'تکایە بڕی پارەی دراو دیاری بکە.';
        } else {
            $db->beginTransaction();
            try {
                // Deduct balance
                $db->execute(
                    "UPDATE customers SET current_balance = GREATEST(0, current_balance - ?), total_paid = total_paid + ? WHERE id = ?",
                    [$amount, $amount, $customerId],
                    'ddi'
                );

                // Insert ledger record
                $db->execute(
                    "INSERT INTO customer_transactions (customer_id, branch_id, type, amount, notes)
                     VALUES (?, ?, 'payment', ?, ?)",
                    [$customerId, $branchId, $amount, $notes],
                    'iids'
                );

                $db->commit();
                $message = "بڕی " . formatIqd($amount) . " قەرز وەرگیرایەوە و لە هەژماری کڕیار داشکێنرا!";
            } catch (Exception $e) {
                $db->rollback();
                $error = "هەڵە لە وەرگرتنی پارە: " . $e->getMessage();
            }
        }
    }
}

// Fetch all customers with debt
$customers = $db->fetchAll("SELECT * FROM customers ORDER BY current_balance DESC, full_name ASC");

// Total debts across all customers
$totalDebts = array_sum(array_column($customers, 'current_balance'));
?>
<!DOCTYPE html>
<html lang="ckb" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>کڕیاران و قەرز • کۆگاکانی زانا</title>
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
                <span class="p-2 rounded-3 bg-warning text-dark"><i class="fa-solid fa-users"></i></span>
                <span>کۆگاکانی زانا • کڕیاران و قەرزەکان</span>
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

        <!-- Debt Overview Banner -->
        <div class="card card-custom p-3 mb-4 d-flex flex-row justify-content-between align-items-center">
            <div>
                <span class="text-secondary small">کۆی گشتی قەرزی کڕیاران لای زانا:</span>
                <div class="h4 font-monospace fw-bold text-danger mb-0"><?= formatIqd($totalDebts) ?></div>
            </div>
            <span class="badge bg-danger bg-opacity-25 text-danger fs-6"><?= count($customers) ?> کڕیار</span>
        </div>

        <div class="row g-4">
            <!-- Left: Add Customer & Settle Debt -->
            <div class="col-12 col-lg-4 space-y-4">
                <!-- Settle Debt Form -->
                <div class="card card-custom p-4 mb-4">
                    <h2 class="h6 fw-bold text-white mb-3">
                        <i class="fa-solid fa-hand-holding-dollar text-success ms-1"></i> وەرگرتنەوەی پارەی قەرز
                    </h2>
                    <form method="POST" action="customers.php">
                        <input type="hidden" name="action" value="record_payment">
                        <input type="hidden" name="csrf_token" value="<?= generateCsrfToken() ?>">

                        <div class="mb-3">
                            <label class="form-label small text-secondary">کڕیار:</label>
                            <select name="customer_id" class="form-select bg-dark border-secondary text-light" required>
                                <option value="">کڕیار هەڵبژێرە...</option>
                                <?php foreach ($customers as $c): ?>
                                    <option value="<?= $c['id'] ?>">
                                        <?= e($c['full_name']) ?> (قەرز: <?= formatIqd((float)$c['current_balance']) ?>)
                                    </option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small text-secondary">بڕی پارەی وەرگیراو (دینار):</label>
                            <input type="number" name="amount" min="1000" step="500" class="form-control bg-dark border-secondary text-white font-monospace" placeholder="50000" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small text-secondary">تێبینی:</label>
                            <input type="text" name="notes" class="form-control bg-dark border-secondary text-white" placeholder="وەرگرتنی قیست یان پارەی کاش...">
                        </div>

                        <button type="submit" class="btn btn-success w-100 py-2">
                            <i class="fa-solid fa-check ms-1"></i> تۆمارکردنی وەرگرتنی قەرز
                        </button>
                    </form>
                </div>

                <!-- Add Customer Form -->
                <div class="card card-custom p-4">
                    <h2 class="h6 fw-bold text-white mb-3">
                        <i class="fa-solid fa-user-plus text-warning ms-1"></i> تۆمارکردنی کڕیاری نوێ
                    </h2>
                    <form method="POST" action="customers.php">
                        <input type="hidden" name="action" value="add_customer">
                        <input type="hidden" name="csrf_token" value="<?= generateCsrfToken() ?>">

                        <div class="mb-3">
                            <label class="form-label small text-secondary">ناوی سیانی:</label>
                            <input type="text" name="full_name" class="form-control bg-dark border-secondary text-white" placeholder="ئازاد کەریم حسێن" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small text-secondary">ژمارەی مۆبایل:</label>
                            <input type="text" name="phone" class="form-control bg-dark border-secondary text-white font-monospace" placeholder="0750 123 4567" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small text-secondary">ناونیشان:</label>
                            <input type="text" name="address" class="form-control bg-dark border-secondary text-white" placeholder="هەولێر، ڕاستی...">
                        </div>
                        <div class="mb-3">
                            <label class="form-label small text-secondary">سنووری ڕێگەپێدراوی قەرز (Credit Limit):</label>
                            <input type="number" name="credit_limit" value="1000000" class="form-control bg-dark border-secondary text-white font-monospace">
                        </div>

                        <button type="submit" class="btn btn-amber w-100 py-2">
                            <i class="fa-solid fa-save ms-1"></i> پاشەکەوتکردنی کڕیار
                        </button>
                    </form>
                </div>
            </div>

            <!-- Right: Customers Ledger Table -->
            <div class="col-12 col-lg-8">
                <div class="card card-custom p-4">
                    <h2 class="h6 fw-bold text-white mb-3">
                        <i class="fa-solid fa-address-book text-warning ms-1"></i> لیستی کڕیاران و باڵانسی قەرزەکان
                    </h2>

                    <div class="table-responsive">
                        <table class="table table-dark table-hover table-borderless align-middle small mb-0">
                            <thead>
                                <tr class="text-secondary border-bottom border-secondary">
                                    <th>ناوی کڕیار</th>
                                    <th>تەلەفۆن</th>
                                    <th>کۆی قەرز</th>
                                    <th>پارەی داوە</th>
                                    <th>قەرزی ماوە</th>
                                    <th>دۆخ</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($customers as $c): ?>
                                    <tr>
                                        <td class="fw-bold text-light"><?= e($c['full_name']) ?></td>
                                        <td class="font-monospace text-secondary"><?= e($c['phone']) ?></td>
                                        <td class="font-monospace text-secondary"><?= formatIqd((float)$c['total_debt']) ?></td>
                                        <td class="font-monospace text-success"><?= formatIqd((float)$c['total_paid']) ?></td>
                                        <td class="font-monospace fw-bold <?= (float)$c['current_balance'] > 0 ? 'text-danger' : 'text-secondary' ?>">
                                            <?= formatIqd((float)$c['current_balance']) ?>
                                        </td>
                                        <td>
                                            <?php if ((float)$c['current_balance'] > 0): ?>
                                                <span class="badge bg-danger bg-opacity-25 text-danger">قەرزدارە</span>
                                            <?php else: ?>
                                                <span class="badge bg-success bg-opacity-25 text-success">تەواوە</span>
                                            <?php endif; ?>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
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
