<?php

declare(strict_types=1);

const DEMO_MAP_TOKEN = 'RankingTopTen123#';

function isDemoTokenValid(?string $token): bool
{
    $normalized = rtrim(trim((string) $token), '#');

    return $normalized === rtrim(DEMO_MAP_TOKEN, '#');
}

function requireDemoToken(?string $token): void
{
    if (!isDemoTokenValid($token)) {
        jsonResponse(['message' => 'Unauthorized.'], 403);
    }
}

function ensureDemoTables(PDO $pdo): void
{
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS `demo_active_place` (
          `id` TINYINT UNSIGNED NOT NULL DEFAULT 1,
          `ranking_entry_id` BIGINT UNSIGNED NOT NULL,
          `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`),
          KEY `idx_demo_active_place_entry` (`ranking_entry_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
}

function demoPlacePayload(array $entry): array
{
    return [
        'entryId' => (int) $entry['entry_id'],
        'rankingRunId' => (int) $entry['ranking_run_id'],
        'title' => $entry['title'],
        'address' => $entry['address'],
        'cid' => $entry['cid'] ?? null,
        'latitude' => $entry['latitude'] !== null ? (float) $entry['latitude'] : null,
        'longitude' => $entry['longitude'] !== null ? (float) $entry['longitude'] : null,
        'category' => $entry['category'],
        'searchPhrase' => $entry['search_phrase'],
        'position' => (int) $entry['position'],
        'rating' => (float) $entry['rating'],
        'ratingCount' => (int) $entry['rating_count'],
        'rankingCreatedAt' => $entry['ranking_created_at'],
    ];
}
