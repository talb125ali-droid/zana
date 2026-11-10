<?php
/**
 * ZANA STORE MANAGEMENT SYSTEM
 * خاڵی فرۆشتن (POS Interface)
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

// Fetch branch info
$branch = $db->fetchOne("SELECT * FROM branches WHERE id = ?", [$branchId], 'i');

// Fetch top products for fast click
$topProducts = $db->fetchAll(
    "SELECT p.*, COALESCE(bs.quantity, 0) as stock_qty 
     FROM products p 
     LEFT JOIN branch_stock bs ON p.id = bs.product_id AND bs.branch_id = ?
     WHERE p.status = 'active'
     ORDER BY p.id ASC LIMIT 16",
    [$branchId],
    'i'
);

// Fetch customers
$customers = $db->fetchAll("SELECT id, full_name, phone, current_balance FROM customers ORDER BY full_name ASC");
?>
<!DOCTYPE html>
<html lang="ckb" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>خاڵی فرۆشتن (POS) • کۆگاکانی زانا</title>
    <!-- Bootstrap 5 RTL -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css">
    <!-- Font Awesome -->
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
            height: 100vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        .pos-header {
            background-color: #0f172a;
            border-bottom: 1px solid #1e293b;
        }
        .card-custom {
            background-color: #0f172a;
            border: 1px solid #1e293b;
            border-radius: 1rem;
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
        .product-tile {
            background-color: #1e293b;
            border: 1px solid #334155;
            border-radius: 0.75rem;
            cursor: pointer;
            transition: all 0.15s;
        }
        .product-tile:hover {
            border-color: #f59e0b;
            background-color: #334155;
            transform: translateY(-2px);
        }
    </style>
</head>
<body>

    <!-- POS Header -->
    <header class="pos-header py-2 px-4 d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-3">
            <a href="index.php" class="btn btn-sm btn-outline-secondary text-light">
                <i class="fa-solid fa-arrow-right"></i> گەڕانەوە بۆ داشبۆرد
            </a>
            <h1 class="h6 fw-bold text-white mb-0">
                <i class="fa-solid fa-barcode text-warning ms-1"></i> خاڵی فرۆشتن: <span class="text-warning"><?= e($branch['name_ku'] ?? 'لقی سەرەکی') ?></span>
            </h1>
        </div>
        <div class="d-flex align-items-center gap-3">
            <span class="text-secondary small">کاشێر: <strong><?= e(currentUserName()) ?></strong></span>
            <span class="badge bg-success bg-opacity-25 text-success">قاسە کراوەیە</span>
        </div>
    </header>

    <!-- POS Main Screen -->
    <div class="flex-grow-1 p-3 overflow-hidden">
        <div class="row h-100 g-3">
            
            <!-- Left Column: Products & Barcode Search -->
            <div class="col-12 col-lg-7 d-flex flex-column h-100">
                <!-- Barcode Input Box -->
                <div class="card card-custom p-3 mb-3">
                    <div class="input-group">
                        <span class="input-group-text bg-dark border-secondary text-warning">
                            <i class="fa-solid fa-barcode fa-lg"></i>
                        </span>
                        <input type="text" id="barcodeInput" class="form-control bg-dark border-secondary text-white font-monospace" placeholder="بارکۆد لێبدە یان بە ئامێری بارکۆد سکان بکە..." autofocus>
                    </div>
                </div>

                <!-- Fast Product Grid -->
                <div class="card card-custom p-3 flex-grow-1 overflow-auto">
                    <h2 class="h6 fw-bold text-secondary mb-3">کاڵا خێراکان:</h2>
                    <div class="row g-2">
                        <?php foreach ($topProducts as $tp): ?>
                            <div class="col-6 col-sm-4 col-md-3">
                                <div class="product-tile p-2.5 h-100 d-flex flex-column justify-content-between" onclick="addToCart(<?= htmlspecialchars(json_encode($tp)) ?>)">
                                    <div>
                                        <div class="fw-bold small text-light text-truncate"><?= e($tp['name_ku']) ?></div>
                                        <div class="text-secondary font-monospace" style="font-size: 0.75rem;"><?= e($tp['barcode']) ?></div>
                                    </div>
                                    <div class="mt-2 d-flex justify-content-between align-items-center">
                                        <span class="text-warning font-monospace small fw-bold"><?= formatIqd((float)$tp['selling_price']) ?></span>
                                        <span class="badge bg-dark border border-secondary" style="font-size: 0.7rem;"><?= (int)$tp['stock_qty'] ?> لە کۆگا</span>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>

            <!-- Right Column: Cart & Checkout -->
            <div class="col-12 col-lg-5 d-flex flex-column h-100">
                <div class="card card-custom p-3 d-flex flex-column h-100">
                    <!-- Customer Selector -->
                    <div class="mb-3">
                        <label class="form-label small text-secondary fw-bold">کڕیار:</label>
                        <select id="customerSelect" class="form-select bg-dark border-secondary text-light small">
                            <option value="">کڕیاری گشتی (نەختینە)</option>
                            <?php foreach ($customers as $c): ?>
                                <option value="<?= $c['id'] ?>">
                                    <?= e($c['full_name']) ?> (قەرز: <?= formatIqd((float)$c['current_balance']) ?>)
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </div>

                    <!-- Cart Items Table -->
                    <div class="flex-grow-1 overflow-auto border-top border-bottom border-secondary py-2 my-2">
                        <table class="table table-dark table-borderless small mb-0">
                            <thead>
                                <tr class="text-secondary border-bottom border-secondary">
                                    <th>کاڵا</th>
                                    <th class="text-center">بڕ</th>
                                    <th>نرخ</th>
                                    <th>کۆ</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody id="cartTableBody">
                                <!-- JS Populated -->
                            </tbody>
                        </table>
                    </div>

                    <!-- Summary & Checkout Buttons -->
                    <div class="pt-2">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <span class="text-secondary small">کۆی بەرایی:</span>
                            <span id="cartSubtotal" class="font-monospace fw-bold text-light">0 د.ع</span>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <span class="text-secondary small">داشکاندن:</span>
                            <input type="number" id="discountInput" value="0" class="form-control form-control-sm bg-dark border-secondary text-white text-center font-monospace w-25" onchange="renderCart()">
                        </div>
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="fw-bold text-white">کۆی کۆتایی بۆ دان:</span>
                            <span id="cartFinalTotal" class="font-monospace fw-bold text-warning fs-5">0 د.ع</span>
                        </div>

                        <div class="row g-2 mb-2">
                            <div class="col-6">
                                <button type="button" class="btn btn-outline-secondary w-100 btn-sm text-light" onclick="clearCart()">
                                    <i class="fa-solid fa-trash ms-1"></i> بەتاڵکردنەوە
                                </button>
                            </div>
                            <div class="col-6">
                                <button type="button" class="btn btn-amber w-100 btn-sm" onclick="completeSale('cash')">
                                    <i class="fa-solid fa-money-bill-wave ms-1"></i> دان بە کاش
                                </button>
                            </div>
                        </div>

                        <div class="row g-2">
                            <div class="col-6">
                                <button type="button" class="btn btn-outline-info w-100 btn-sm" onclick="completeSale('card')">
                                    <i class="fa-solid fa-credit-card ms-1"></i> دان بە کارت
                                </button>
                            </div>
                            <div class="col-6">
                                <button type="button" class="btn btn-outline-danger w-100 btn-sm" onclick="completeSale('debt')">
                                    <i class="fa-solid fa-file-invoice-dollar ms-1"></i> تۆمار بە قەرز
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </div>

    <!-- Front-end JS for POS cart and barcode listener -->
    <script>
        let cart = [];

        const barcodeInput = document.getElementById('barcodeInput');
        barcodeInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const code = this.value.trim();
                if (!code) return;

                fetch(`api/pos_api.php?action=scan&barcode=${encodeURIComponent(code)}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) {
                            addToCart(data.product);
                            barcodeInput.value = '';
                        } else {
                            alert(data.error);
                            barcodeInput.select();
                        }
                    })
                    .catch(() => alert('هەڵە لە پەیوەندی سێرڤەر'));
            }
        });

        function addToCart(product) {
            const existing = cart.find(i => i.product.id === product.id);
            if (existing) {
                existing.quantity++;
            } else {
                cart.push({
                    product: product,
                    quantity: 1,
                    unitPrice: parseFloat(product.selling_price)
                });
            }
            renderCart();
        }

        function updateQty(id, delta) {
            const item = cart.find(i => i.product.id === id);
            if (!item) return;
            item.quantity += delta;
            if (item.quantity <= 0) {
                cart = cart.filter(i => i.product.id !== id);
            }
            renderCart();
        }

        function clearCart() {
            cart = [];
            renderCart();
        }

        function renderCart() {
            const tbody = document.getElementById('cartTableBody');
            tbody.innerHTML = '';

            let subtotal = 0;
            cart.forEach(item => {
                const total = item.quantity * item.unitPrice;
                subtotal += total;

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="text-light fw-bold">${item.product.name_ku}</td>
                    <td class="text-center font-monospace">
                        <button class="btn btn-sm btn-dark px-1.5 py-0" onclick="updateQty(${item.product.id}, -1)">-</button>
                        <span class="mx-1">${item.quantity}</span>
                        <button class="btn btn-sm btn-dark px-1.5 py-0" onclick="updateQty(${item.product.id}, 1)">+</button>
                    </td>
                    <td class="font-monospace text-secondary">${item.unitPrice.toLocaleString()}</td>
                    <td class="font-monospace text-warning fw-bold">${total.toLocaleString()}</td>
                    <td><button class="btn btn-sm btn-outline-danger p-0 px-1" onclick="updateQty(${item.product.id}, -item.quantity)"><i class="fa-solid fa-xmark"></i></button></td>
                `;
                tbody.appendChild(tr);
            });

            const discount = parseFloat(document.getElementById('discountInput').value) || 0;
            const finalTotal = Math.max(0, subtotal - discount);

            document.getElementById('cartSubtotal').innerText = subtotal.toLocaleString() + ' د.ع';
            document.getElementById('cartFinalTotal').innerText = finalTotal.toLocaleString() + ' د.ع';
        }

        function completeSale(method) {
            if (cart.length === 0) {
                alert('سەبەتەی فرۆشتن بەتاڵە!');
                return;
            }

            const customerId = document.getElementById('customerSelect').value;
            if (method === 'debt' && !customerId) {
                alert('بۆ تۆمارکردنی قەرز، تکایە کڕیار دیاریبکە!');
                return;
            }

            const discount = parseFloat(document.getElementById('discountInput').value) || 0;
            const subtotal = cart.reduce((sum, i) => sum + (i.quantity * i.unitPrice), 0);
            const total = Math.max(0, subtotal - discount);
            const paid = method === 'debt' ? 0 : total;

            const payload = {
                customer_id: customerId,
                payment_method: method,
                discount: discount,
                paid_amount: paid,
                items: cart.map(i => ({ product_id: i.product.id, quantity: i.quantity }))
            };

            fetch('api/pos_api.php?action=checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    alert(`فاکتۆری ${data.invoice_number} بە سەرکەوتوویی دەرکرا!\nکۆی گشتی: ${data.total_amount.toLocaleString()} د.ع`);
                    clearCart();
                    barcodeInput.focus();
                } else {
                    alert('هەڵە: ' + data.error);
                }
            })
            .catch(() => alert('هەڵە لە پەیوەندی سێرڤەر'));
        }
    </script>
</body>
</html>
