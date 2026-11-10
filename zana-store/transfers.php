<?php
/**
 * ZANA STORE MANAGEMENT SYSTEM
 * حەواڵەی نێوان ٦ لقەکە (Inter-branch Transfers)
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

// Handle Create Transfer Request
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'create_transfer') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        $error = 'تۆکنی CSRF نادروستە.';
    } else {
        $sourceBranch = (int)($_POST['source_branch_id'] ?? 0);
        $destBranch = (int)($_POST['dest_branch_id'] ?? 0);
        $productId = (int)($_POST['product_id'] ?? 0);
        $quantity = (int)($_POST['quantity'] ?? 0);
        $notes = cleanInput($_POST['notes'] ?? '');

        if ($sourceBranch <= 0 || $destBranch <= 0 || $sourceBranch === $destBranch || $productId <= 0 || $quantity <= 0) {
            $error = 'تکایە هەردوو لقی سەرچاوە و مەبەست و بڕی کاڵا دیاریبکە.';
        } else {
            // Verify stock in source branch
            $srcStock = $db->fetchOne(
                "SELECT quantity FROM branch_stock WHERE branch_id = ? AND product_id = ?",
                [$sourceBranch, $productId],
                'ii'
            );
            $available = (int)($srcStock['quantity'] ?? 0);

            if ($available < $quantity) {
                $error = "بڕی بەردەست لە لقی سەرچاوە تەنها {$available} دانەیە!";
            } else {
                $transferNum = 'TRF-' . substr(time(), -6);
                $db->beginTransaction();
                try {
                    $db->execute(
                        "INSERT INTO stock_transfers (transfer_number, source_branch_id, destination_branch_id, requester_id, status, notes)
                         VALUES (?, ?, ?, ?, 'pending', ?)",
                        [$transferNum, $sourceBranch, $destBranch, currentUserId(), $notes],
                        'siiis'
                    );
                    $tId = $db->lastInsertId();

                    $db->execute(
                        "INSERT INTO stock_transfer_items (transfer_id, product_id, requested_qty) VALUES (?, ?, ?)",
                        [$tId, $productId, $quantity],
                        'iii'
                    );

                    $db->commit();
                    $message = "داواکاری حەواڵەی {$transferNum} بە سەرکەوتوویی دروستکرا!";
                } catch (Exception $e) {
                    $db->rollback();
                    $error = "هەڵە لە دروستکردنی حەواڵە: " . $e->getMessage();
                }
            }
        }
    }
}

// Handle Approve / Receive Transfer
if (isset($_GET['receive_id'])) {
    $tId = (int)$_GET['receive_id'];
    $transfer = $db->fetchOne("SELECT * FROM stock_transfers WHERE id = ? AND status != 'received'", [$tId], 'i');
    if ($transfer) {
        $items = $db->fetchAll("SELECT * FROM stock_transfer_items WHERE transfer_id = ?", [$tId], 'i');
        $db->beginTransaction();
        try {
            foreach ($items as $item) {
                $pId = (int)$item['product_id'];
                $qty = (int)$item['requested_qty'];

                // Deduct from source branch
                $db->execute(
                    "UPDATE branch_stock SET quantity = GREATEST(0, quantity - ?) WHERE branch_id = ? AND product_id = ?",
                    [$qty, $transfer['source_branch_id'], $pId],
                    'iii'
                );

                // Add to destination branch
                $exists = $db->fetchOne(
                    "SELECT id FROM branch_stock WHERE branch_id = ? AND product_id = ?",
                    [$transfer['destination_branch_id'], $pId],
                    'ii'
                );
                if ($exists) {
                    $db->execute(
                        "UPDATE branch_stock SET quantity = quantity + ? WHERE branch_id = ? AND product_id = ?",
                        [$qty, $transfer['destination_branch_id'], $pId],
                        'iii'
                    );
                } else {
                    $db->execute(
                        "INSERT INTO branch_stock (branch_id, product_id, quantity) VALUES (?, ?, ?)",
                        [$transfer['destination_branch_id'], $pId, $qty],
                        'iii'
                    );
                }
            }

            $db->execute(
                "UPDATE stock_transfers SET status = 'received', received_at = NOW(), receiver_id = ? WHERE id = ?",
                [currentUserId(), $tId],
                'ii'
            );

            $db->commit();
            $message = "حەواڵە وەرگیرا و باڵانسی کۆگای هەردوو لق بە سەرکەوتوویی نوێکرایەوە!";
        } catch (Exception $e) {
            $db->rollback();
            $error = "هەڵە لە وەرگرتنی حەواڵە: " . $e->getMessage();
        }
    }
}

// Fetch branches & products
$branches = $db->fetchAll("SELECT id, name_ku, code FROM branches WHERE is_active = 1 ORDER BY id ASC");
$products = $db->fetchAll("SELECT id, name_ku, barcode FROM products WHERE status = 'active' ORDER BY name_ku ASC");

// Fetch transfers
$transfers = $db->fetchAll(
    "SELECT st.*, 
            sb.name_ku as source_name, 
            db.name_ku as dest_name, 
            u.full_name as requester_name
     FROM stock_transfers st
     JOIN branches sb ON st.source_branch_id = sb.id
     JOIN branches db ON st.destination_branch_id = db.id
     LEFT JOIN users u ON st.requester_id = u.id
     ORDER BY st.id DESC LIMIT 20"
);
?>
<!DOCTYPE html>
<html lang="ckb" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>حەواڵەی کۆگا • کۆگاکانی زانا</title>
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
                <span class="p-2 rounded-3 bg-warning text-dark"><i class="fa-solid fa-arrow-right-arrow-left"></i></span>
                <span>کۆگاکانی زانا • حەواڵەی نێوان لقەکان</span>
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
            <!-- Left: Create Transfer -->
            <div class="col-12 col-lg-4">
                <div class="card card-custom p-4">
                    <h2 class="h6 fw-bold text-white mb-3">
                        <i class="fa-solid fa-paper-plane text-warning ms-1"></i> داواکاری حەواڵەی کاڵا
                    </h2>
                    <form method="POST" action="transfers.php">
                        <input type="hidden" name="action" value="create_transfer">
                        <input type="hidden" name="csrf_token" value="<?= generateCsrfToken() ?>">

                        <div class="mb-3">
                            <label class="form-label small text-secondary">لە لقی (سەرچاوە):</label>
                            <select name="source_branch_id" class="form-select bg-dark border-secondary text-light">
                                <?php foreach ($branches as $b): ?>
                                    <option value="<?= $b['id'] ?>"><?= e($b['name_ku']) ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small text-secondary">بۆ لقی (مەبەست):</label>
                            <select name="dest_branch_id" class="form-select bg-dark border-secondary text-light">
                                <?php foreach ($branches as $b): ?>
                                    <option value="<?= $b['id'] ?>"><?= e($b['name_ku']) ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small text-secondary">کاڵا:</label>
                            <select name="product_id" class="form-select bg-dark border-secondary text-light">
                                <?php foreach ($products as $p): ?>
                                    <option value="<?= $p['id'] ?>"><?= e($p['name_ku']) ?> (<?= e($p['barcode']) ?>)</option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small text-secondary">بڕی داواکراو (دانە):</label>
                            <input type="number" name="quantity" min="1" value="5" class="form-control bg-dark border-secondary text-white font-monospace" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small text-secondary">تێبینی:</label>
                            <input type="text" name="notes" class="form-control bg-dark border-secondary text-white" placeholder="هۆکاری گواستنەوە...">
                        </div>

                        <button type="submit" class="btn btn-amber w-100 py-2">
                            <i class="fa-solid fa-truck-fast ms-1"></i> دروستکردنی داواکاری حەواڵە
                        </button>
                    </form>
                </div>
            </div>

            <!-- Right: Transfers History -->
            <div class="col-12 col-lg-8">
                <div class="card card-custom p-4">
                    <h2 class="h6 fw-bold text-white mb-3">
                        <i class="fa-solid fa-clock-rotate-left text-warning ms-1"></i> مێژووی حەواڵەکان
                    </h2>

                    <div class="table-responsive">
                        <table class="table table-dark table-hover table-borderless align-middle small mb-0">
                            <thead>
                                <tr class="text-secondary border-bottom border-secondary">
                                    <th>ژمارەی پسوولە</th>
                                    <th>لە لق</th>
                                    <th>بۆ لق</th>
                                    <th>داواکار</th>
                                    <th>بەروار</th>
                                    <th>دۆخ</th>
                                    <th>کردار</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($transfers as $t): ?>
                                    <tr>
                                        <td><span class="font-monospace text-warning fw-bold"><?= e($t['transfer_number']) ?></span></td>
                                        <td class="text-light"><?= e($t['source_name']) ?></td>
                                        <td class="text-light"><?= e($t['dest_name']) ?></td>
                                        <td class="text-secondary"><?= e($t['requester_name']) ?></td>
                                        <td class="text-secondary font-monospace"><?= substr($t['created_at'], 0, 10) ?></td>
                                        <td>
                                            <?php if ($t['status'] === 'received'): ?>
                                                <span class="badge bg-success bg-opacity-25 text-success">وەرگیراوە</span>
                                            <?php else: ?>
                                                <span class="badge bg-warning bg-opacity-25 text-warning">لە چاوەڕوانیدا</span>
                                            <?php endif; ?>
                                        </td>
                                        <td>
                                            <?php if ($t['status'] !== 'received'): ?>
                                                <a href="transfers.php?receive_id=<?= $t['id'] ?>" class="btn btn-sm btn-outline-success py-0 px-2" title="وەرگرتنی کاڵا">
                                                    <i class="fa-solid fa-check ms-1"></i> وەرگرتن
                                                </a>
                                            <?php else: ?>
                                                <i class="fa-solid fa-circle-check text-success"></i>
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
