<?php

declare(strict_types=1);

require __DIR__ . '/_db.php';
require __DIR__ . '/_demo.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['message' => 'Method not allowed.'], 405);
}

$payload = requestPayload();
requireDemoToken($payload['token'] ?? null);

$entryId = (int) ($payload['entryId'] ?? 0);

if ($entryId <= 0) {
    jsonResponse(['message' => 'Missing ranking entry id.'], 422);
}

try {
    $pdo = apiPdo();
    ensureDemoTables($pdo);

    $select = $pdo->prepare(
        "SELECT
            re.id AS entry_id,
            re.ranking_run_id,
            re.position,
            re.rating,
            re.rating_count,
            re.title,
            re.address,
            re.latitude,
            re.longitude,
            re.category,
            rr.search_phrase,
            rr.created_at AS ranking_created_at
         FROM ranking_entries re
         INNER JOIN ranking_runs rr ON rr.id = re.ranking_run_id
         WHERE re.id = :id
         LIMIT 1"
    );
    $select->bindValue('id', $entryId, PDO::PARAM_INT);
    $select->execute();
    $entry = $select->fetch();

    if (!is_array($entry)) {
        jsonResponse(['message' => 'Ranking entry not found.'], 404);
    }

    $statement = $pdo->prepare(
        "INSERT INTO demo_active_place (id, ranking_entry_id)
         VALUES (1, :ranking_entry_id)
         ON DUPLICATE KEY UPDATE
            ranking_entry_id = VALUES(ranking_entry_id),
            updated_at = CURRENT_TIMESTAMP"
    );
    $statement->bindValue('ranking_entry_id', $entryId, PDO::PARAM_INT);
    $statement->execute();

    jsonResponse([
        'active' => demoPlacePayload($entry),
    ]);
} catch (Throwable $error) {
    error_log($error->getMessage());

    jsonResponse(['message' => 'Nie udało się ustawić aktywnego demo.'], 500);
}
