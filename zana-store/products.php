<?php
/**
 * ZANA STORE MANAGEMENT SYSTEM
 * بەڕێوەبردنی بەرهەم و کۆگا (Products & Inventory)
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

// Handle Add Product
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'add_product') {
    if (!verifyCsrfToken($_POST['csrf_token'] ?? '')) {
        $error = 'تۆکنی CSRF نادروستە.';
    } else {
        $nameKu = cleanInput($_POST['name_ku'] ?? '');
        $nameEn = cleanInput($_POST['name_en'] ?? '');
        $code = cleanInput($_POST['code'] ?? '');
        $barcode = cleanInput($_POST['barcode'] ?? '');
        $categoryId = (int)($_POST['category_id'] ?? 1);
        $purchasePrice = (float)($_POST['purchase_price'] ?? 0);
        $sellingPrice = (float)($_POST['selling_price'] ?? 0);
        $initialStock = (int)($_POST['initial_stock'] ?? 0);
        $minStock = (int)($_POST['min_stock_alert'] ?? 5);

        if (empty($nameKu) || empty($barcode) || $sellingPrice <= 0) {
            $error = 'تکایە ناوی بەرهەم، بارکۆد و نرخی فرۆشتن بە دروستی بنووسە.';
        } else {
            $db->beginTransaction();
            try {
                $db->execute(
                    "INSERT INTO products (category_id, name_ku, name_en, code, barcode, purchase_price, selling_price, min_stock_alert, status)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')",
                    [$categoryId, $nameKu, $nameEn, $code, $barcode, $purchasePrice, $sellingPrice, $minStock],
                    'issssddi'
                );
                $newProdId = $db->lastInsertId();

                // Allocate stock to active branch
                $db->execute(
                    "INSERT INTO branch_stock (branch_id, product_id, quantity) VALUES (?, ?, ?)",
                    [$branchId, $newProdId, $initialStock],
                    'iii'
                );

                $db->commit();
                $message = "بەرهەمی '{$nameKu}' بە سەرکەوتوویی زیادکرا!";
            } catch (Exception $e) {
                $db->rollback();
                $error = "هەڵە لە زیادکردنی بەرهەم: " . $e->getMessage();
            }
        }
    }
}

// Fetch categories
$categories = $db->fetchAll("SELECT * FROM categories ORDER BY id ASC");

// Fetch products with stock
$search = cleanInput($_GET['q'] ?? '');
$filterCat = (int)($_GET['category'] ?? 0);

$query = "
    SELECT p.*, c.name_ku as category_name, COALESCE(bs.quantity, 0) as stock_qty 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN branch_stock bs ON p.id = bs.product_id AND bs.branch_id = ?
    WHERE p.status = 'active'
";
$params = [$branchId];
$types = 'i';

if (!empty($search)) {
    $query .= " AND (p.name_ku LIKE ? OR p.barcode LIKE ? OR p.code LIKE ?)";
    $like = "%{$search}%";
    $params[] = $like;
    $params[] = $like;
    $params[] = $like;
    $types .= 'sss';
}
if ($filterCat > 0) {
    $query .= " AND p.category_id = ?";
    $params[] = $filterCat;
    $types .= 'i';
}
$query .= " ORDER BY p.id DESC";

$products = $db->fetchAll($query, $params, $types);
?>
<!DOCTYPE html>
<html lang="ckb" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>بەرهەم و کۆگا • کۆگاکانی زانا</title>
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
                <span class="p-2 rounded-3 bg-warning text-dark"><i class="fa-solid fa-boxes-stacked"></i></span>
                <span>کۆگاکانی زانا • بەرهەمەکان</span>
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
            <!-- Left: Add New Product -->
            <div class="col-12 col-lg-4">
                <div class="card card-custom p-4">
                    <h2 class="h6 fw-bold text-white mb-3">
                        <i class="fa-solid fa-plus-circle text-warning ms-1"></i> تۆمارکردنی بەرهەمی نوێ
                    </h2>
                    <form method="POST" action="products.php">
                        <input type="hidden" name="action" value="add_product">
                        <input type="hidden" name="csrf_token" value="<?= generateCsrfToken() ?>">

                        <div class="mb-3">
                            <label class="form-label small text-secondary">ناوی بەرهەم بە کوردی:</label>
                            <input type="text" name="name_ku" class="form-control bg-dark border-secondary text-white" placeholder="نموونە: عەتری دیۆر سۆڤاج 100ml" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small text-secondary">ناوی بەرهەم بە ئینگلیزی (ئارەزوومەندانە):</label>
                            <input type="text" name="name_en" class="form-control bg-dark border-secondary text-white" placeholder="Dior Sauvage 100ml">
                        </div>
                        <div class="row g-2 mb-3">
                            <div class="col-6">
                                <label class="form-label small text-secondary">کۆد:</label>
                                <input type="text" name="code" class="form-control bg-dark border-secondary text-white font-monospace" placeholder="PRD-105" required>
                            </div>
                            <div class="col-6">
                                <label class="form-label small text-secondary">بارکۆد:</label>
                                <input type="text" name="barcode" class="form-control bg-dark border-secondary text-white font-monospace" placeholder="869100100999" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small text-secondary">بەش (Category):</label>
                            <select name="category_id" class="form-select bg-dark border-secondary text-light">
                                <?php foreach ($categories as $cat): ?>
                                    <option value="<?= $cat['id'] ?>"><?= e($cat['name_ku']) ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="row g-2 mb-3">
                            <div class="col-6">
                                <label class="form-label small text-secondary">نرخی کڕین (تێچوو):</label>
                                <input type="number" name="purchase_price" class="form-control bg-dark border-secondary text-white font-monospace" placeholder="15000" required>
                            </div>
                            <div class="col-6">
                                <label class="form-label small text-secondary">نرخی فرۆشتن:</label>
                                <input type="number" name="selling_price" class="form-control bg-dark border-secondary text-white font-monospace" placeholder="25000" required>
                            </div>
                        </div>
                        <div class="row g-2 mb-3">
                            <div class="col-6">
                                <label class="form-label small text-secondary">بڕی سەرەتایی لە کۆگا:</label>
                                <input type="number" name="initial_stock" value="10" class="form-control bg-dark border-secondary text-white font-monospace">
                            </div>
                            <div class="col-6">
                                <label class="form-label small text-secondary">ئاگاداری کەمی کۆگا:</label>
                                <input type="number" name="min_stock_alert" value="5" class="form-control bg-dark border-secondary text-white font-monospace">
                            </div>
                        </div>

                        <button type="submit" class="btn btn-amber w-100 py-2">
                            <i class="fa-solid fa-floppy-disk ms-1"></i> پاشەکەوتکردنی بەرهەم
                        </button>
                    </form>
                </div>
            </div>

            <!-- Right: Products List -->
            <div class="col-12 col-lg-8">
                <div class="card card-custom p-4">
                    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
                        <h2 class="h6 fw-bold text-white mb-0">
                            <i class="fa-solid fa-layer-group text-warning ms-1"></i> کەتەلۆگی بەرهەمەکان (<?= count($products) ?> بەرهەم)
                        </h2>
                        <form method="GET" action="products.php" class="d-flex gap-2">
                            <input type="text" name="q" value="<?= e($search) ?>" class="form-control form-control-sm bg-dark border-secondary text-white" placeholder="گەڕان بەپێی ناو یان بارکۆد...">
                            <select name="category" class="form-select form-select-sm bg-dark border-secondary text-light">
                                <option value="0">هەموو بەشەکان</option>
                                <?php foreach ($categories as $c): ?>
                                    <option value="<?= $c['id'] ?>" <?= $filterCat == $c['id'] ? 'selected' : '' ?>><?= e($c['name_ku']) ?></option>
                                <?php endforeach; ?>
                            </select>
                            <button type="submit" class="btn btn-sm btn-outline-warning">گەڕان</button>
                        </form>
                    </div>

                    <div class="table-responsive">
                        <table class="table table-dark table-hover table-borderless align-middle small mb-0">
                            <thead>
                                <tr class="text-secondary border-bottom border-secondary">
                                    <th>بەرهەم</th>
                                    <th>بەش</th>
                                    <th>بارکۆد</th>
                                    <th>نرخی کڕین</th>
                                    <th>نرخی فرۆشتن</th>
                                    <th>کۆگا</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($products as $p): ?>
                                    <tr>
                                        <td>
                                            <div class="fw-bold text-light"><?= e($p['name_ku']) ?></div>
                                            <div class="text-secondary font-monospace" style="font-size:0.75rem;"><?= e($p['code']) ?></div>
                                        </td>
                                        <td class="text-secondary"><?= e($p['category_name']) ?></td>
                                        <td><span class="font-monospace text-warning"><?= e($p['barcode']) ?></span></td>
                                        <td class="font-monospace text-secondary"><?= formatIqd((float)$p['purchase_price']) ?></td>
                                        <td class="font-monospace text-light fw-bold"><?= formatIqd((float)$p['selling_price']) ?></td>
                                        <td>
                                            <?php if ((int)$p['stock_qty'] <= (int)$p['min_stock_alert']): ?>
                                                <span class="badge bg-danger font-monospace"><?= (int)$p['stock_qty'] ?> دانە</span>
                                            <?php else: ?>
                                                <span class="badge bg-success bg-opacity-25 text-success font-monospace"><?= (int)$p['stock_qty'] ?> دانە</span>
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
