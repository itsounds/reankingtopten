<?php

declare(strict_types=1);

const DB_SOCKET = '/Applications/MAMP/tmp/mysql/mysql.sock';
const DB_NAME = 'rankingtopten';
const DB_USER = 'root';
const DB_PASS = 'root';

function apiPdo(): PDO
{
    $dsn = sprintf('mysql:unix_socket=%s;dbname=%s;charset=utf8mb4', DB_SOCKET, DB_NAME);

    return new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
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
