<?php
/**
 * ZANA STORE MANAGEMENT SYSTEM - سیستەمی بەڕێوەبردنی کۆگاکانی زانا
 * Security Helpers: CSRF, XSS Prevention, and Input Sanitization
 */

declare(strict_types=1);

class Security
{
    /**
     * دروستکردنی کلیل بۆ ڕێگریکردن لە هێرشی CSRF
     */
    public static function generateCsrfToken(): string
    {
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }

    /**
     * پشتڕاستکردنەوەی کلیلی CSRF
     */
    public static function validateCsrfToken(?string $token): bool
    {
        if (empty($_SESSION['csrf_token']) || empty($token)) {
            return false;
        }
        return hash_equals($_SESSION['csrf_token'], $token);
    }

    /**
     * پاککردنەوەی دەق لە کۆدە مەترسیدارەکانی XSS
     */
    public static function clean(mixed $data): string
    {
        if ($data === null) {
            return '';
        }
        return htmlspecialchars(trim((string)$data), ENT_QUOTES, 'UTF-8');
    }

    /**
     * دروستکردنی وشەی نهێنی پارێزراو (Bcrypt)
     */
    public static function hashPassword(string $password): string
    {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    }

    /**
     * پشکنینی دروستی وشەی نهێنی
     */
    public static function verifyPassword(string $password, string $hash): bool
    {
        return password_verify($password, $hash);
    }

    /**
     * تۆمارکردنی لۆگی ئەمنی لە خشتەی audit_logs
     */
    public static function logAudit(
        string $action, 
        string $entityType, 
        ?int $entityId = null, 
        ?array $oldValues = null, 
        ?array $newValues = null, 
        ?int $branchId = null
    ): void {
        require_once __DIR__ . '/database.php';
        
        $userId = $_SESSION['user_id'] ?? null;
        $ip = $_SERVER['REMOTE_ADDR'] ?? '127.0.0.1';
        $agent = $_SERVER['HTTP_USER_AGENT'] ?? '';

        $sql = "INSERT INTO audit_logs 
                (user_id, branch_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $oldJson = $oldValues ? json_encode($oldValues, JSON_UNESCAPED_UNICODE) : null;
        $newJson = $newValues ? json_encode($newValues, JSON_UNESCAPED_UNICODE) : null;

        try {
            Database::executeQuery($sql, [
                $userId,
                $branchId,
                $action,
                $entityType,
                $entityId,
                $oldJson,
                $newJson,
                $ip,
                $agent
            ]);
        } catch (Exception $e) {
            error_log("هەڵە لە تۆمارکردنی ئاودیت: " . $e->getMessage());
        }
    }
}
