<?php
/**
 * ZANA STORE MANAGEMENT SYSTEM - سیستەمی بەڕێوەبردنی کۆگاکانی زانا
 * Authentication & Authorization (RBAC) Helper
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/config.php';

class Auth
{
    /**
     * ئایا بەکارهێنەر ئێستا چووەتە ژوورەوە؟
     */
    public static function check(): bool
    {
        return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
    }

    /**
     * وەرگرتنی زانیاری بەکارهێنەری ئێستا
     */
    public static function user(): ?array
    {
        if (!self::check()) {
            return null;
        }

        $userId = (int)$_SESSION['user_id'];
        return Database::fetchOne(
            "SELECT u.*, r.name_ku AS role_name_ku, r.name_en AS role_slug, b.name_ku AS branch_name_ku 
             FROM users u 
             JOIN roles r ON u.role_id = r.id 
             LEFT JOIN branches b ON u.branch_id = b.id 
             WHERE u.id = ? AND u.status = 'active'",
            [$userId]
        );
    }

    /**
     * ئایا بەکارهێنەر بەڕێوەبەری گشتییە؟ (Super Admin)
     */
    public static function isSuperAdmin(): bool
    {
        if (!self::check()) {
            return false;
        }
        return (bool)($_SESSION['is_superadmin'] ?? false);
    }

    /**
     * پشکنینی دەسەڵاتێکی دیاریکراو (Permission Check)
     */
    public static function can(string $permissionCode): bool
    {
        if (!self::check()) {
            return false;
        }

        // بەڕێوەبەری گشتی هەموو دەسەڵاتەکانی هەیە
        if (self::isSuperAdmin()) {
            return true;
        }

        $userId = (int)$_SESSION['user_id'];

        // پشکنینی تایبەت بە بەکارهێنەر (User Override)
        $override = Database::fetchOne(
            "SELECT is_granted FROM user_permissions up 
             JOIN permissions p ON up.permission_id = p.id 
             WHERE up.user_id = ? AND p.code = ?",
            [$userId, $permissionCode]
        );

        if ($override !== null) {
            return (bool)$override['is_granted'];
        }

        // پشکنینی دەسەڵاتی ڕۆڵ
        $roleId = (int)($_SESSION['role_id'] ?? 0);
        $rolePerm = Database::fetchOne(
            "SELECT 1 FROM role_permissions rp 
             JOIN permissions p ON rp.permission_id = p.id 
             WHERE rp.role_id = ? AND p.code = ?",
            [$roleId, $permissionCode]
        );

        return $rolePerm !== null;
    }

    /**
     * ڕێگریکردن لە دەستگەیشتن بە زانیاری لقی تر (Branch Scoping)
     */
    public static function enforceBranchAccess(int $targetBranchId): void
    {
        if (self::isSuperAdmin()) {
            return; // بەڕێوەبەری گشتی بۆ هەموو لقەکان ڕێگەپێدراوە
        }

        $userBranchId = (int)($_SESSION['branch_id'] ?? 0);
        if ($userBranchId !== $targetBranchId) {
            http_response_code(403);
            die(json_encode([
                'success' => false,
                'message' => 'دەسەڵاتت نییە بۆ بینین یان دەستکاریکردنی زانیارییەکانی ئەم لقە!'
            ], JSON_UNESCAPED_UNICODE));
        }
    }
}
