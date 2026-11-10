<?php
/**
 * ZANA STORE MANAGEMENT SYSTEM
 * خاڵی فرۆشتن API (POS AJAX API)
 * Native PHP 8.2+ • MySQLi • JSON Response
 */

header('Content-Type: application/json; charset=UTF-8');

require_once __DIR__ . '/../app/config/config.php';
require_once __DIR__ . '/../app/config/database.php';
require_once __DIR__ . '/../app/config/security.php';
require_once __DIR__ . '/../app/helpers/auth.php';
require_once __DIR__ . '/../app/helpers/functions.php';

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'error' => 'تکایە سەرەتا بچۆ ژوورەوە']);
    exit;
}

$action = $_GET['action'] ?? '';
$db = Database::getInstance();
$branchId = currentBranchId() ?? 1;

// 1. Scan Barcode / Search Product
if ($action === 'scan') {
    $barcode = cleanInput($_GET['barcode'] ?? '');
    if (empty($barcode)) {
        echo json_encode(['success' => false, 'error' => 'بارکۆد دیاری نەکراوە']);
        exit;
    }

    $product = $db->fetchOne(
        "SELECT p.*, COALESCE(bs.quantity, 0) as stock_qty 
         FROM products p 
         LEFT JOIN branch_stock bs ON p.id = bs.product_id AND bs.branch_id = ?
         WHERE p.barcode = ? AND p.status = 'active' LIMIT 1",
        [$branchId, $barcode],
        'is'
    );

    if ($product) {
        echo json_encode(['success' => true, 'product' => $product]);
    } else {
        echo json_encode(['success' => false, 'error' => 'بەرهەم نەدۆزرایەوە بەم بارکۆدە']);
    }
    exit;
}

// 2. Complete Sale Checkout (AJAX POST)
if ($action === 'checkout' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input || empty($input['items'])) {
        echo json_encode(['success' => false, 'error' => 'سەبەتەی فرۆشتن بەتاڵە']);
        exit;
    }

    $customerId = !empty($input['customer_id']) ? (int)$input['customer_id'] : null;
    $paymentMethod = $input['payment_method'] ?? 'cash';
    $discount = (float)($input['discount'] ?? 0);
    $paidAmount = (float)($input['paid_amount'] ?? 0);
    $items = $input['items'];

    $db->beginTransaction();

    try {
        $subtotal = 0;
        $totalCogs = 0;

        foreach ($items as $item) {
            $pId = (int)$item['product_id'];
            $qty = (int)$item['quantity'];

            // Fetch current product price & cost
            $p = $db->fetchOne("SELECT purchase_price, selling_price FROM products WHERE id = ?", [$pId], 'i');
            if (!$p) throw new Exception("بەرهەم نەدۆزرایەوە: ID {$pId}");

            // Verify stock
            $stock = $db->fetchOne(
                "SELECT quantity FROM branch_stock WHERE product_id = ? AND branch_id = ?",
                [$pId, $branchId],
                'ii'
            );
            $currQty = (int)($stock['quantity'] ?? 0);
            if ($currQty < $qty) {
                throw new Exception("بڕی پێویست لە کۆگا بەردەست نییە بۆ کاڵا");
            }

            $lineTotal = $qty * (float)$p['selling_price'];
            $lineCogs = $qty * (float)$p['purchase_price'];

            $subtotal += $lineTotal;
            $totalCogs += $lineCogs;
        }

        $totalAmount = max(0, $subtotal - $discount);
        $grossProfit = max(0, $totalAmount - $totalCogs);
        $remainingDebt = max(0, $totalAmount - $paidAmount);

        $branch = $db->fetchOne("SELECT code FROM branches WHERE id = ?", [$branchId], 'i');
        $branchCode = $branch['code'] ?? 'BR01';
        $invoiceNum = "INV-{$branchCode}-" . substr(time(), -6);

        // Insert sale header
        $db->execute(
            "INSERT INTO sales (invoice_number, branch_id, cashier_id, customer_id, subtotal, discount, total_amount, cost_of_goods_sold, gross_profit, paid_amount, remaining_debt, payment_method, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed')",
            [
                $invoiceNum,
                $branchId,
                currentUserId(),
                $customerId,
                $subtotal,
                $discount,
                $totalAmount,
                $totalCogs,
                $grossProfit,
                $paidAmount,
                $remainingDebt,
                $paymentMethod
            ],
            'siiiddddddds'
        );

        $saleId = $db->lastInsertId();

        // Insert sale items and deduct branch stock
        foreach ($items as $item) {
            $pId = (int)$item['product_id'];
            $qty = (int)$item['quantity'];
            $p = $db->fetchOne("SELECT purchase_price, selling_price FROM products WHERE id = ?", [$pId], 'i');

            $unitPrice = (float)$p['selling_price'];
            $unitCost = (float)$p['purchase_price'];
            $lineTotal = $qty * $unitPrice;
            $lineGross = $lineTotal - ($qty * $unitCost);

            $db->execute(
                "INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, unit_cost, total_price, gross_profit)
                 VALUES (?, ?, ?, ?, ?, ?, ?)",
                [$saleId, $pId, $qty, $unitPrice, $unitCost, $lineTotal, $lineGross],
                'iiidddd'
            );

            // Deduct stock
            $db->execute(
                "UPDATE branch_stock SET quantity = quantity - ? WHERE product_id = ? AND branch_id = ?",
                [$qty, $pId, $branchId],
                'iii'
            );
        }

        // If debt, update customer account balance
        if ($customerId && $remainingDebt > 0) {
            $db->execute(
                "UPDATE customers SET total_debt = total_debt + ?, current_balance = current_balance + ? WHERE id = ?",
                [$remainingDebt, $remainingDebt, $customerId],
                'ddi'
            );
        }

        $db->commit();

        echo json_encode([
            'success' => true,
            'invoice_number' => $invoiceNum,
            'total_amount' => $totalAmount,
            'paid_amount' => $paidAmount,
            'remaining_debt' => $remainingDebt
        ]);
    } catch (Exception $e) {
        $db->rollback();
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
    exit;
}

echo json_encode(['success' => false, 'error' => 'کردار نادیارە']);
