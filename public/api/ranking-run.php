<?php

declare(strict_types=1);

require __DIR__ . '/_db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['message' => 'Method not allowed.'], 405);
}

$runId = (int) ($_GET['run_id'] ?? 0);

if ($runId <= 0) {
    jsonResponse(['message' => 'Missing ranking run id.'], 422);
}

try {
    $pdo = apiPdo();
    $runStatement = $pdo->prepare(
        "SELECT
            id,
            source_query_id,
            category_name,
            city,
            search_phrase,
            formula_version,
            top_limit,
            min_rating_count,
            places_considered,
            entries_created,
            created_at
         FROM ranking_runs
         WHERE id = :id
         LIMIT 1"
    );
    $runStatement->bindValue('id', $runId, PDO::PARAM_INT);
    $runStatement->execute();
    $run = $runStatement->fetch();

    if (!is_array($run)) {
        jsonResponse(['message' => 'Ranking not found.'], 404);
    }

    $entriesStatement = $pdo->prepare(
        "SELECT
            id,
            source_place_id,
            position,
            score,
            rating,
            rating_count,
            title,
            address,
            latitude,
            longitude,
            category,
            phone_number,
            website,
            cid,
            created_at
         FROM ranking_entries
         WHERE ranking_run_id = :ranking_run_id
         ORDER BY position ASC"
    );
    $entriesStatement->bindValue('ranking_run_id', $runId, PDO::PARAM_INT);
    $entriesStatement->execute();

    $entries = array_map(static function (array $entry): array {
        return [
            'id' => (int) $entry['id'],
            'sourcePlaceId' => $entry['source_place_id'] !== null ? (int) $entry['source_place_id'] : null,
            'position' => (int) $entry['position'],
            'score' => (float) $entry['score'],
            'rating' => (float) $entry['rating'],
            'ratingCount' => (int) $entry['rating_count'],
            'title' => $entry['title'],
            'address' => $entry['address'],
            'latitude' => $entry['latitude'] !== null ? (float) $entry['latitude'] : null,
            'longitude' => $entry['longitude'] !== null ? (float) $entry['longitude'] : null,
            'category' => $entry['category'],
            'phoneNumber' => $entry['phone_number'],
            'website' => $entry['website'],
            'cid' => $entry['cid'],
            'createdAt' => $entry['created_at'],
        ];
    }, $entriesStatement->fetchAll());

    jsonResponse([
        'ranking' => [
            'id' => (int) $run['id'],
            'sourceQueryId' => (int) $run['source_query_id'],
            'categoryName' => $run['category_name'],
            'city' => $run['city'],
            'searchPhrase' => $run['search_phrase'],
            'formulaVersion' => $run['formula_version'],
            'topLimit' => (int) $run['top_limit'],
            'minRatingCount' => (int) $run['min_rating_count'],
            'placesConsidered' => (int) $run['places_considered'],
            'entriesCreated' => (int) $run['entries_created'],
            'createdAt' => $run['created_at'],
        ],
        'entries' => $entries,
    ]);
} catch (Throwable $error) {
    error_log($error->getMessage());

    jsonResponse([
        'message' => 'Nie udało się pobrać rankingu.',
    ], 500);
}
