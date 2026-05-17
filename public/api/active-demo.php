<?php

declare(strict_types=1);

require __DIR__ . '/_db.php';
require __DIR__ . '/_demo.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['message' => 'Method not allowed.'], 405);
}

try {
    $pdo = apiPdo();
    ensureDemoTables($pdo);

    $statement = $pdo->query(
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
            rr.created_at AS ranking_created_at,
            dap.updated_at AS demo_updated_at
         FROM demo_active_place dap
         INNER JOIN ranking_entries re ON re.id = dap.ranking_entry_id
         INNER JOIN ranking_runs rr ON rr.id = re.ranking_run_id
         WHERE dap.id = 1
         LIMIT 1"
    );

    $entry = $statement->fetch();

    if (!is_array($entry)) {
        jsonResponse(['active' => null]);
    }

    $payload = demoPlacePayload($entry);
    $payload['demoUpdatedAt'] = $entry['demo_updated_at'];

    jsonResponse(['active' => $payload]);
} catch (Throwable $error) {
    error_log($error->getMessage());

    jsonResponse(['message' => 'Nie udało się pobrać aktywnego demo.'], 500);
}
