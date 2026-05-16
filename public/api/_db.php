<?php

declare(strict_types=1);

const LOCAL_DB_SOCKET = '/Applications/MAMP/tmp/mysql/mysql.sock';
const LOCAL_DB_NAME = 'rankingtopten';
const LOCAL_DB_USER = 'root';
const LOCAL_DB_PASS = 'root';

function apiPdo(): PDO
{
    $config = dbConfig();
    $dsn = isset($config['socket'])
        ? sprintf('mysql:unix_socket=%s;dbname=%s;charset=utf8mb4', $config['socket'], $config['name'])
        : sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $config['host'], $config['name']);

    return new PDO($dsn, $config['user'], $config['pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
}

function dbConfig(): array
{
    $externalConfigPaths = [
        dirname(__DIR__, 3) . '/db-config.php',
        dirname(__DIR__, 2) . '/db-config.php',
    ];

    foreach ($externalConfigPaths as $externalConfig) {
        if (is_file($externalConfig)) {
            $config = require $externalConfig;

            if (is_array($config)) {
                return $config;
            }
        }
    }

    $envHost = getenv('RANKINGTOPTEN_DB_HOST') ?: null;
    $envName = getenv('RANKINGTOPTEN_DB_NAME') ?: null;
    $envUser = getenv('RANKINGTOPTEN_DB_USER') ?: null;
    $envPass = getenv('RANKINGTOPTEN_DB_PASS') ?: null;

    if ($envHost && $envName && $envUser && $envPass) {
        return [
            'host' => $envHost,
            'name' => $envName,
            'user' => $envUser,
            'pass' => $envPass,
        ];
    }

    $host = strtolower((string) ($_SERVER['HTTP_HOST'] ?? ''));
    $isProduction = str_contains($host, 'rankingtop10.com');
    $isLocal = $host === ''
        || str_contains($host, '.local')
        || str_contains($host, 'localhost')
        || str_contains($host, '127.0.0.1');

    if ($isProduction) {
        throw new RuntimeException(
            'Missing production DB config. Create db-config.php next to the app directory or set RANKINGTOPTEN_DB_* env vars.'
        );
    }

    if ($isLocal) {
        return [
            'socket' => LOCAL_DB_SOCKET,
            'name' => LOCAL_DB_NAME,
            'user' => LOCAL_DB_USER,
            'pass' => LOCAL_DB_PASS,
        ];
    }

    throw new RuntimeException('Unknown environment for database configuration.');
}

function jsonResponse(array $payload, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store, max-age=0');

    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function requestPayload(): array
{
    $rawBody = file_get_contents('php://input');
    $decoded = $rawBody !== false && $rawBody !== '' ? json_decode($rawBody, true) : null;

    return is_array($decoded) ? $decoded : $_REQUEST;
}

function trimQuery(?string $value): string
{
    return trim((string) $value);
}

function publicRankingUrl(int $runId, int $entryId): string
{
    return '/lokal/?run_id=' . $runId . '&entry_id=' . $entryId;
}
