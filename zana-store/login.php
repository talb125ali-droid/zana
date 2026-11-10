<?php
/**
 * ZANA STORE MANAGEMENT SYSTEM
 * چوونەژوورەوەی سیستەم (Login Page)
 * Native PHP 8.2+ • MySQLi • RTL • Kurdish Sorani
 */

require_once __DIR__ . '/app/config/config.php';
require_once __DIR__ . '/app/config/database.php';
require_once __DIR__ . '/app/config/security.php';
require_once __DIR__ . '/app/helpers/auth.php';
require_once __DIR__ . '/app/helpers/functions.php';

// If already logged in, redirect to dashboard
if (isLoggedIn()) {
    header('Location: index.php');
    exit;
}

$error = '';
$db = Database::getInstance();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $csrfToken = $_POST['csrf_token'] ?? '';
    if (!verifyCsrfToken($csrfToken)) {
        $error = 'تۆکنی پاراستن (CSRF) هەڵەیە. تکایە دووبارە هەوڵبدەرەوە.';
    } else {
        $username = cleanInput($_POST['username'] ?? '');
        $password = $_POST['password'] ?? '';

        if (empty($username) || empty($password)) {
            $error = 'تکایە ناوی بەکارهێنەر و وشەی نهێنی بنووسە.';
        } else {
            // Find active user
            $user = $db->fetchOne(
                "SELECT u.*, r.name as role_name, r.name_ku as role_name_ku, b.name_ku as branch_name_ku 
                 FROM users u 
                 JOIN roles r ON u.role_id = r.id 
                 LEFT JOIN branches b ON u.branch_id = b.id 
                 WHERE u.username = ? AND u.status = 'active' LIMIT 1",
                [$username],
                's'
            );

            if ($user && verifyPassword($password, $user['password_hash'])) {
                // Fetch permissions
                $perms = $db->fetchAll(
                    "SELECT p.slug FROM permissions p 
                     JOIN role_permissions rp ON p.id = rp.permission_id 
                     WHERE rp.role_id = ?",
                    [$user['role_id']],
                    'i'
                );
                $permSlugs = array_column($perms, 'slug');

                // Set session
                $_SESSION['user_id'] = (int)$user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['full_name'] = $user['full_name'];
                $_SESSION['role_id'] = (int)$user['role_id'];
                $_SESSION['role_name'] = $user['role_name'];
                $_SESSION['role_name_ku'] = $user['role_name_ku'];
                $_SESSION['branch_id'] = $user['branch_id'] ? (int)$user['branch_id'] : null;
                $_SESSION['branch_name_ku'] = $user['branch_name_ku'] ?? 'هەموو لقەکان';
                $_SESSION['permissions'] = $permSlugs;
                $_SESSION['logged_in'] = true;

                // Log audit
                logAudit((int)$user['id'], 'LOGIN', 'users', (int)$user['id'], null, ['ip' => $_SERVER['REMOTE_ADDR'] ?? '']);

                header('Location: index.php');
                exit;
            } else {
                $error = 'ناوی بەکارهێنەر یان وشەی نهێنی هەڵەیە.';
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="ckb" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>چوونەژوورەوە • سیستەمی کۆگاکانی زانا</title>
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
            background: linear-gradient(135deg, #090d16 0%, #0f172a 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #f8fafc;
        }
        .login-card {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 1.5rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            width: 100%;
            max-width: 440px;
        }
        .btn-amber {
            background-color: #f59e0b;
            color: #020617;
            font-weight: 700;
            border: none;
            transition: all 0.2s;
        }
        .btn-amber:hover {
            background-color: #fbbf24;
            color: #020617;
            box-shadow: 0 0 20px rgba(245, 158, 11, 0.4);
        }
        .form-control {
            background-color: #0b1120;
            border: 1px solid #334155;
            color: #f8fafc;
            border-radius: 0.75rem;
            padding: 0.75rem 1rem;
        }
        .form-control:focus {
            background-color: #0b1120;
            border-color: #f59e0b;
            color: #ffffff;
            box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.25);
        }
    </style>
</head>
<body>
    <div class="login-card p-4 p-sm-5 m-3">
        <div class="text-center mb-4">
            <div class="d-inline-flex align-items-center justify-content-center bg-warning bg-opacity-10 text-warning rounded-circle p-3 mb-3" style="width: 72px; height: 72px;">
                <i class="fa-solid fa-store fa-2x"></i>
            </div>
            <h1 class="h4 fw-bold text-white mb-1">سیستەمی کۆگاکانی زانا</h1>
            <p class="text-secondary small mb-0">بەڕێوەبردنی ٦ لقی بازرگانی و کۆگاکان</p>
        </div>

        <?php if (!empty($error)): ?>
            <div class="alert alert-danger d-flex align-items-center small py-2 px-3 rounded-3" role="alert">
                <i class="fa-solid fa-circle-exclamation ms-2"></i>
                <div><?= e($error) ?></div>
            </div>
        <?php endif; ?>

        <form method="POST" action="login.php">
            <input type="hidden" name="csrf_token" value="<?= generateCsrfToken() ?>">

            <div class="mb-3">
                <label class="form-label small fw-bold text-light">ناوی بەکارهێنەر:</label>
                <div class="input-group">
                    <span class="input-group-text bg-dark border-secondary text-secondary">
                        <i class="fa-solid fa-user"></i>
                    </span>
                    <input type="text" name="username" class="form-control" placeholder="admin" required autofocus>
                </div>
            </div>

            <div class="mb-4">
                <label class="form-label small fw-bold text-light">وشەی نهێنی:</label>
                <div class="input-group">
                    <span class="input-group-text bg-dark border-secondary text-secondary">
                        <i class="fa-solid fa-lock"></i>
                    </span>
                    <input type="password" name="password" class="form-control" placeholder="••••••••" required>
                </div>
            </div>

            <button type="submit" class="btn btn-amber w-full py-2.5 rounded-3 mb-3">
                <i class="fa-solid fa-right-to-bracket ms-1"></i> چوونەژوورەوە بۆ سیستەم
            </button>

            <div class="text-center">
                <small class="text-secondary">
                    هەژماری بنەڕەتی بەڕێوەبەر: <span class="text-warning font-monospace">admin</span> / <span class="text-warning font-monospace">Admin@123456</span>
                </small>
            </div>
        </form>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
