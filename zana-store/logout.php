<?php
/**
 * ZANA STORE MANAGEMENT SYSTEM
 * دەرچوون لە سیستەم (Logout)
 */

require_once __DIR__ . '/app/config/config.php';
require_once __DIR__ . '/app/config/database.php';
require_once __DIR__ . '/app/config/security.php';
require_once __DIR__ . '/app/helpers/auth.php';

if (isLoggedIn()) {
    logAudit(currentUserId(), 'LOGOUT', 'users', currentUserId());
}

$_SESSION = [];

if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params["path"],
        $params["domain"],
        $params["secure"],
        $params["httponly"]
    );
}

session_destroy();

header('Location: login.php');
exit;
