<?php
/**
 * ZANA STORE MANAGEMENT SYSTEM
 * بەڕێوەبردنی شەش لقەکە (Branch Management)
 * Native PHP 8.2+ • MySQLi • RTL • Kurdish Sorani
 */

require_once __DIR__ . '/app/config/config.php';
require_once __DIR__ . '/app/config/database.php';
require_once __DIR__ . '/app/config/security.php';
require_once __DIR__ . '/app/helpers/auth.php';
require_once __DIR__ . '/app/helpers/functions.php';

requireAuth();

if (!isSuperAdmin()) {
    die("<div dir='rtl' style='padding:2rem;font-family:sans-serif;color:red;'>تەنها بەڕێوەبەری گشتی (Super Admin) دەسەڵاتی دەستکاری لقەکانی هەیە.</div>");
}

$db = Database::getInstance();
$message = '';
$error = '';

// Handle Add Branch
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'add_branch') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        $error = 'تۆکنی CSRF نادروستە.';
    } else {
        $code = cleanInput($_POST['code'] ?? '');
        $nameKu = cleanInput($_POST['name_ku'] ?? '');
        $city = cleanInput($_POST['city'] ?? '');
        $address = cleanInput($_POST['address'] ?? '');
        $phone = cleanInput($_POST['phone'] ?? '');

        if (empty($code) || empty($nameKu) || empty($city)) {
            $error = 'تکایە خانە سەرەکییەکان پڕبکەرەوە.';
        } else {
            try {
                $db->execute(
                    "INSERT INTO branches (code, name_ku, city, address, phone, is_active) VALUES (?, ?, ?, ?, ?, 1)",
                    [$code, $nameKu, $city, $address, $phone],
                    'sssss'
                );
                $message = "لقی نوێ '{$nameKu}' بە سەرکەوتوویی زیادکرا!";
            } catch (Exception $e) {
                $error = "هەڵە لە زیادکردنی لق: " . $e->getMessage();
            }
        }
    }
}

// Handle Edit Branch
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'edit_branch') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        $error = 'تۆکنی CSRF نادروستە.';
    } else {
        $bId = (int)($_POST['branch_id'] ?? 0);
        $code = cleanInput($_POST['code'] ?? '');
        $nameKu = cleanInput($_POST['name_ku'] ?? '');
        $city = cleanInput($_POST['city'] ?? '');
        $address = cleanInput($_POST['address'] ?? '');
        $phone = cleanInput($_POST['phone'] ?? '');

        if ($bId > 0 && !empty($code) && !empty($nameKu)) {
            $db->execute(
                "UPDATE branches SET code = ?, name_ku = ?, city = ?, address = ?, phone = ? WHERE id = ?",
                [$code, $nameKu, $city, $address, $phone, $bId],
                'sssssi'
            );
            $message = "زانیاری لقەکە بە سەرکەوتوویی نوێکرایەوە!";
        }
    }
}

// Handle Delete Branch
if (isset($_GET['delete_branch'])) {
    $bId = (int)$_GET['delete_branch'];
    if ($bId > 0) {
        $db->execute("DELETE FROM branches WHERE id = ?", [$bId], 'i');
        header('Location: branches.php');
        exit;
    }
}

// Handle Toggle Status
if (isset($_GET['toggle_status'])) {
    $bId = (int)$_GET['toggle_status'];
    $db->execute("UPDATE branches SET is_active = IF(is_active=1, 0, 1) WHERE id = ?", [$bId], 'i');
    header('Location: branches.php');
    exit;
}

// Fetch all branches with performance metrics
$branches = $db->fetchAll(
    "SELECT b.*, 
            COUNT(DISTINCT u.id) as user_count,
            COALESCE(SUM(s.total_amount), 0) as total_sales,
            COALESCE(SUM(s.gross_profit), 0) as total_profit,
            COALESCE(SUM(bs.quantity), 0) as total_inventory_items
     FROM branches b
     LEFT JOIN users u ON b.id = u.branch_id
     LEFT JOIN sales s ON b.id = s.branch_id
     LEFT JOIN branch_stock bs ON b.id = bs.branch_id
     GROUP BY b.id
     ORDER BY b.id ASC"
);
?>
<!DOCTYPE html>
<html lang="ckb" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>بەڕێوەبردنی لقەکان • کۆگاکانی زانا</title>
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
                <span class="p-2 rounded-3 bg-warning text-dark"><i class="fa-solid fa-store"></i></span>
                <span>کۆگاکانی زانا • بەڕێوەبردنی لقەکان</span>
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
            <!-- Left: Add New Branch -->
            <div class="col-12 col-lg-4">
                <div class="card card-custom p-4">
                    <h2 class="h6 fw-bold text-white mb-3">
                        <i class="fa-solid fa-plus-circle text-warning ms-1"></i> زیادکردنی لقی نوێ
                    </h2>
                    <form method="POST" action="branches.php">
                        <input type="hidden" name="action" value="add_branch">
                        <input type="hidden" name="csrf_token" value="<?= generateCsrfToken() ?>">

                        <div class="mb-3">
                            <label class="form-label small text-secondary">کۆدی لق (نموونە: BR-07):</label>
                            <input type="text" name="code" class="form-control bg-dark border-secondary text-white font-monospace" placeholder="BR-07" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small text-secondary">ناوی لق بە کوردی:</label>
                            <input type="text" name="name_ku" class="form-control bg-dark border-secondary text-white" placeholder="لقی ٧ - زانا (زاخۆ)" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small text-secondary">شار:</label>
                            <input type="text" name="city" class="form-control bg-dark border-secondary text-white" placeholder="هەولێر / سلێمانی / دهۆک..." required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small text-secondary">ناونیشانی تەواو:</label>
                            <input type="text" name="address" class="form-control bg-dark border-secondary text-white" placeholder="شەقامی سەرەکی، بەرامبەر مۆڵ...">
                        </div>
                        <div class="mb-3">
                            <label class="form-label small text-secondary">تەلەفۆن:</label>
                            <input type="text" name="phone" class="form-control bg-dark border-secondary text-white font-monospace" placeholder="0750 123 4567">
                        </div>

                        <button type="submit" class="btn btn-amber w-100 py-2">
                            <i class="fa-solid fa-building ms-1"></i> زیادکردنی لق
                        </button>
                    </form>
                </div>
            </div>

            <!-- Right: 6 Branches Performance Table -->
            <div class="col-12 col-lg-8">
                <div class="card card-custom p-4">
                    <h2 class="h6 fw-bold text-white mb-3">
                        <i class="fa-solid fa-list-check text-warning ms-1"></i> سەرجەم لقەکانی بازرگانی زانا (<?= count($branches) ?> لق)
                    </h2>

                    <div class="table-responsive">
                        <table class="table table-dark table-hover table-borderless align-middle small mb-0">
                            <thead>
                                <tr class="text-secondary border-bottom border-secondary">
                                    <th>کۆد</th>
                                    <th>ناوی لق</th>
                                    <th>شار</th>
                                    <th>کارمەند</th>
                                    <th>کاڵای کۆگا</th>
                                    <th>کۆی فرۆشتن</th>
                                    <th>قازانج</th>
                                    <th>دۆخ</th>
                                    <th>کردار</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($branches as $b): ?>
                                    <tr>
                                        <td><span class="badge bg-dark border border-secondary font-monospace"><?= e($b['code']) ?></span></td>
                                        <td class="fw-bold text-light"><?= e($b['name_ku']) ?></td>
                                        <td class="text-secondary"><?= e($b['city']) ?></td>
                                        <td class="font-monospace"><?= (int)$b['user_count'] ?></td>
                                        <td class="font-monospace"><?= (int)$b['total_inventory_items'] ?></td>
                                        <td class="font-monospace text-warning"><?= formatIqd((float)$b['total_sales']) ?></td>
                                        <td class="font-monospace text-success"><?= formatIqd((float)$b['total_profit']) ?></td>
                                        <td>
                                            <?php if ($b['is_active']): ?>
                                                <span class="badge bg-success bg-opacity-25 text-success">چالاک</span>
                                            <?php else: ?>
                                                <span class="badge bg-danger bg-opacity-25 text-danger">ناچالاک</span>
                                            <?php endif; ?>
                                        </td>
                                        <td>
                                            <a href="branches.php?toggle_status=<?= $b['id'] ?>" class="btn btn-sm btn-outline-secondary py-0 px-2" title="گۆڕینی دۆخ">
                                                <i class="fa-solid fa-power-off"></i>
                                            </a>
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
