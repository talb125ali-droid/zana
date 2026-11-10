<?php
/**
 * ZANA STORE MANAGEMENT SYSTEM - سیستەمی بەڕێوەبردنی کۆگاکانی زانا
 * Database Configuration & MySQLi Driver
 * 
 * Strict MySQLi Implementation with Prepared Statements & Transaction Support
 */

declare(strict_types=1);

// بارکردنی ڕێکخستنەکانی بنکەدراوە
define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_NAME', getenv('DB_NAME') ?: 'zana_store_db');
define('DB_PORT', (int)(getenv('DB_PORT') ?: 3306));
define('DB_CHARSET', 'utf8mb4');

class Database
{
    private static ?mysqli $connection = null;

    /**
     * گەڕاندنەوەی تاکە پەیوەندی پارێزراوی MySQLi (Singleton Pattern)
     */
    public static function getConnection(): mysqli
    {
        if (self::$connection === null) {
            // چالاککردنی دۆخی هەڵە لە MySQLi
            mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

            try {
                self::$connection = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);
                self::$connection->set_charset(DB_CHARSET);
                
                // ڕێکخستنی کاتی ناوچەیی بۆ عێراق / هەرێمی کوردستان (+03:00)
                self::$connection->query("SET time_zone = '+03:00'");
                self::$connection->query("SET sql_mode = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION'");
            } catch (mysqli_sql_exception $e) {
                // شاردنەوەی وشەی نهێنی و زانیاری هەستیار لە کاتی هەڵەدا
                error_log("هەڵەی پەیوەندی بە بنکەدراوە: " . $e->getMessage());
                die(json_encode([
                    'success' => false,
                    'message' => 'نەتوانرا پەیوەندی بە بنکەدراوەی زاناوە دروست بکرێت. تکایە دڵنیابە لە کارکردنی MySQL لە سێرڤەر.',
                    'error_code' => 500
                ], JSON_UNESCAPED_UNICODE));
            }
        }

        return self::$connection;
    }

    /**
     * جێبەجێکردنی پرسیاری ئامادەکراو بە شێوازی پارێزراو دژی SQL Injection
     */
    public static function executeQuery(string $sql, array $params = [], string $types = ""): mysqli_result|bool
    {
        $db = self::getConnection();
        
        if (empty($params)) {
            return $db->query($sql);
        }

        $stmt = $db->prepare($sql);
        if (!$stmt) {
            throw new Exception("هەڵە لە ئامادەکردنی پرسیار: " . $db->error);
        }

        if (empty($types)) {
            // دۆزینەوەی ئۆتۆماتیکی جۆری داتا
            $types = "";
            foreach ($params as $param) {
                if (is_int($param)) {
                    $types .= "i";
                } elseif (is_float($param)) {
                    $types .= "d";
                } elseif (is_string($param)) {
                    $types .= "s";
                } else {
                    $types .= "b";
                }
            }
        }

        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();

        return $result;
    }

    /**
     * هێنانی یەک دێڕ
     */
    public static function fetchOne(string $sql, array $params = [], string $types = ""): ?array
    {
        $res = self::executeQuery($sql, $params, $types);
        if ($res instanceof mysqli_result) {
            $row = $res->fetch_assoc();
            $res->free();
            return $row ?: null;
        }
        return null;
    }

    /**
     * هێنانی هەموو دێڕەکان
     */
    public static function fetchAll(string $sql, array $params = [], string $types = ""): array
    {
        $res = self::executeQuery($sql, $params, $types);
        if ($res instanceof mysqli_result) {
            $data = $res->fetch_all(MYSQLI_ASSOC);
            $res->free();
            return $data;
        }
        return [];
    }

    /**
     * دەستپێکردنی مامەڵەی دارایی (Database Transaction)
     */
    public static function beginTransaction(): void
    {
        self::getConnection()->begin_transaction();
    }

    /**
     * جێگیرکردنی مامەڵە (Commit)
     */
    public static function commit(): void
    {
        self::getConnection()->commit();
    }

    /**
     * پاشگەزبوونەوە لە مامەڵە لە کاتی هەڵەدا (Rollback)
     */
    public static function rollback(): void
    {
        self::getConnection()->rollback();
    }

    /**
     * وەرگرتنی دواین ئایدی داخڵکراو
     */
    public static function lastInsertId(): int|string
    {
        return self::getConnection()->insert_id;
    }
}
