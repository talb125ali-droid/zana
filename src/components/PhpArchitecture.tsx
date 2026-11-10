import React, { useState } from 'react';
import { Folder, FileCode, Check, Copy, Code2, Server } from 'lucide-react';

export const PhpArchitecture: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string>('database.php');
  const [copied, setCopied] = useState(false);

  const fileSnippets: Record<string, { path: string; descKu: string; code: string }> = {
    'database.php': {
      path: '/zana-store/app/config/database.php',
      descKu: 'پەیوەندی پارێزراوی MySQLi بە کلاسی Singleton و پشتگیری تەواوی Prepared Statements و Transaction',
      code: `<?php
declare(strict_types=1);

define('DB_HOST', getenv('DB_HOST') ?: '127.0.0.1');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_NAME', getenv('DB_NAME') ?: 'zana_store_db');
define('DB_PORT', (int)(getenv('DB_PORT') ?: 3306));
define('DB_CHARSET', 'utf8mb4');

class Database
{
    private static ?mysqli $connection = null;

    public static function getConnection(): mysqli
    {
        if (self::$connection === null) {
            mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
            try {
                self::$connection = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);
                self::$connection->set_charset(DB_CHARSET);
                self::$connection->query("SET time_zone = '+03:00'");
                self::$connection->query("SET sql_mode = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION'");
            } catch (mysqli_sql_exception $e) {
                error_log("DB Connection Error: " . $e->getMessage());
                die(json_encode([
                    'success' => false,
                    'message' => 'نەتوانرا پەیوەندی بە بنکەدراوەی زاناوە دروست بکرێت.'
                ], JSON_UNESCAPED_UNICODE));
            }
        }
        return self::$connection;
    }

    public static function executeQuery(string $sql, array $params = [], string $types = ""): mysqli_result|bool
    {
        $db = self::getConnection();
        if (empty($params)) return $db->query($sql);

        $stmt = $db->prepare($sql);
        if (!$stmt) throw new Exception("Prepare failed: " . $db->error);

        if (empty($types)) {
            $types = "";
            foreach ($params as $p) {
                $types .= is_int($p) ? "i" : (is_float($p) ? "d" : "s");
            }
        }
        $stmt->bind_param($types, ...$params);
        $stmt->execute();
        $result = $stmt->get_result();
        $stmt->close();
        return $result;
    }

    public static function beginTransaction(): void { self::getConnection()->begin_transaction(); }
    public static function commit(): void { self::getConnection()->commit(); }
    public static function rollback(): void { self::getConnection()->rollback(); }
}`
    },
    'security.php': {
      path: '/zana-store/app/config/security.php',
      descKu: 'کۆنترۆڵی ئاسایشی CSRF Token، پاککردنەوەی XSS لە دەقەکان، هاشکردنی نهێنی بە bcrypt و تۆماری Audit Logs',
      code: `<?php
declare(strict_types=1);

class Security
{
    public static function generateCsrfToken(): string
    {
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['csrf_token'];
    }

    public static function validateCsrfToken(?string $token): bool
    {
        if (empty($_SESSION['csrf_token']) || empty($token)) return false;
        return hash_equals($_SESSION['csrf_token'], $token);
    }

    public static function clean(mixed $data): string
    {
        if ($data === null) return '';
        return htmlspecialchars(trim((string)$data), ENT_QUOTES, 'UTF-8');
    }

    public static function hashPassword(string $password): string
    {
        return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
    }

    public static function verifyPassword(string $password, string $hash): bool
    {
        return password_verify($password, $hash);
    }
}`
    },
    'auth.php': {
      path: '/zana-store/app/helpers/auth.php',
      descKu: 'سیستەمی RBAC بۆ پشکنینی دەسەڵاتەکان can() و ڕێگری تەواو لە چوونە ناو زانیاری لقی تر enforceBranchAccess()',
      code: `<?php
declare(strict_types=1);

class Auth
{
    public static function isSuperAdmin(): bool
    {
        return !empty($_SESSION['is_superadmin']);
    }

    public static function can(string $permissionCode): bool
    {
        if (!isset($_SESSION['user_id'])) return false;
        if (self::isSuperAdmin()) return true;

        $userId = (int)$_SESSION['user_id'];
        $roleId = (int)($_SESSION['role_id'] ?? 0);

        // پشکنینی ڕاستەوخۆ لە خشتەی role_permissions
        $perm = Database::fetchOne(
            "SELECT 1 FROM role_permissions rp 
             JOIN permissions p ON rp.permission_id = p.id 
             WHERE rp.role_id = ? AND p.code = ?",
            [$roleId, $permissionCode]
        );
        return $perm !== null;
    }

    public static function enforceBranchAccess(int $targetBranchId): void
    {
        if (self::isSuperAdmin()) return; // بەڕێوەبەری گشتی دەسەڵاتی بۆ هەموو لقەکان هەیە

        $userBranchId = (int)($_SESSION['branch_id'] ?? 0);
        if ($userBranchId !== $targetBranchId) {
            http_response_code(403);
            die(json_encode([
                'success' => false,
                'message' => 'دەسەڵاتت نییە بۆ دەستکاریکردنی زانیاری لقەکانی تر!'
            ], JSON_UNESCAPED_UNICODE));
        }
    }
}`
    },
    'functions.php': {
      path: '/zana-store/app/helpers/functions.php',
      descKu: 'یاساکانی ژمێریاری قازانجی ناپوختە (Gross Profit)، قازانجی پوختە (Net Profit)، داڕشتنی دراو، و دروستکردنی بارکۆد',
      code: `<?php
declare(strict_types=1);

function format_money(float|int|string $amount, string $currency = 'IQD'): string
{
    $val = (float)$amount;
    if ($currency === 'IQD') {
        return number_format($val, 0, '.', ',') . ' د.ع';
    } elseif ($currency === 'USD') {
        return '$' . number_format($val, 2, '.', ',');
    }
    return number_format($val, 2, '.', ',') . ' ' . $currency;
}

function calculate_gross_profit(float $netSales, float $cogs): float
{
    return round($netSales - $cogs, 2);
}

function calculate_net_profit(float $grossProfit, float $operatingExpenses): float
{
    return round($grossProfit - $operatingExpenses, 2);
}

function generate_unique_barcode(string $prefix = 'ZN'): string
{
    return $prefix . date('ymd') . str_pad((string)random_int(1000, 9999), 4, '0', STR_PAD_LEFT);
}`
    }
  };

  const current = fileSnippets[selectedFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-1">
          <Server className="w-5 h-5 text-amber-400" />
          <h3 className="text-xl font-bold text-white">نژیاروانی باکێندی PHP و پەڕگەکانی سیستەم</h3>
        </div>
        <p className="text-xs text-slate-300">
          پڕۆژەکە بە شێوازی Clean Modular Architecture لە فۆڵدەری `/zana-store/` بنیات نراوە، بەبێ فرەیموۆرک (Native PHP 8.2+) و بە پەیوەندی دڵنیایی MySQLi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Project Tree Selector */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4">
          <h4 className="text-xs font-bold text-slate-400 flex items-center gap-2">
            <Folder className="w-4 h-4 text-amber-400" />
            <span>پێکهاتەی فۆڵدەرەکانی /zana-store/</span>
          </h4>

          <div className="space-y-1.5 font-mono text-xs">
            <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-800 text-slate-400">
              📁 /zana-store/
            </div>
            <div className="pr-3 space-y-1">
              <div className="text-slate-500 text-[11px]">📁 app/</div>
              <div className="pr-3 space-y-1">
                <button
                  onClick={() => setSelectedFile('database.php')}
                  className={`w-full text-right p-2 rounded-lg flex items-center justify-between transition-all ${
                    selectedFile === 'database.php'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-amber-400" />
                    database.php
                  </span>
                  <span className="text-[10px] text-slate-500">MySQLi</span>
                </button>

                <button
                  onClick={() => setSelectedFile('security.php')}
                  className={`w-full text-right p-2 rounded-lg flex items-center justify-between transition-all ${
                    selectedFile === 'security.php'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-amber-400" />
                    security.php
                  </span>
                  <span className="text-[10px] text-slate-500">CSRF/XSS</span>
                </button>
              </div>

              <div className="text-slate-500 text-[11px]">📁 helpers/</div>
              <div className="pr-3 space-y-1">
                <button
                  onClick={() => setSelectedFile('auth.php')}
                  className={`w-full text-right p-2 rounded-lg flex items-center justify-between transition-all ${
                    selectedFile === 'auth.php'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-amber-400" />
                    auth.php
                  </span>
                  <span className="text-[10px] text-slate-500">RBAC</span>
                </button>

                <button
                  onClick={() => setSelectedFile('functions.php')}
                  className={`w-full text-right p-2 rounded-lg flex items-center justify-between transition-all ${
                    selectedFile === 'functions.php'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-amber-400" />
                    functions.php
                  </span>
                  <span className="text-[10px] text-slate-500">Finance</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Code Content */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <div className="bg-slate-800/80 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
            <div>
              <div className="font-mono text-xs font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-amber-400" />
                <span>{current.path}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">{current.descKu}</p>
            </div>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium transition-all flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'کۆپی کرا!' : 'کۆپیکردن'}</span>
            </button>
          </div>

          <div className="p-5 font-mono text-xs text-slate-300 bg-slate-950/90 overflow-x-auto leading-relaxed max-h-[500px]">
            <pre className="text-left font-mono" dir="ltr">
              {current.code}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
