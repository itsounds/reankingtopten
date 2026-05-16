<?php

declare(strict_types=1);

require __DIR__ . '/_db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['found' => false, 'message' => 'Method not allowed.'], 405);
}

$payload = requestPayload();
$businessName = trimQuery($payload['businessName'] ?? $payload['q'] ?? null);

if (mb_strlen($businessName, 'UTF-8') < 2) {
    jsonResponse([
        'found' => false,
        'message' => 'Wpisz nazwę lokalu.',
    ], 422);
}

try {
    $pdo = apiPdo();
    $statement = $pdo->prepare(
        "SELECT
            re.id AS entry_id,
            re.ranking_run_id,
            re.position,
            re.score,
            re.rating,
            re.rating_count,
            re.title,
            re.address,
            re.category AS place_category,
            rr.category_name,
            rr.city,
            rr.search_phrase,
            rr.created_at AS ranking_created_at
         FROM ranking_entries re
         INNER JOIN ranking_runs rr ON rr.id = re.ranking_run_id
         WHERE re.title LIKE :query
         ORDER BY re.position ASC, re.score DESC, re.rating DESC, re.rating_count DESC, rr.created_at DESC
         LIMIT 1"
    );

    $statement->execute([
        'query' => '%' . $businessName . '%',
    ]);

    $match = $statement->fetch();

    if (!is_array($match)) {
        jsonResponse([
            'found' => false,
            'message' => 'Niestety lokal nie znajduje się w rankingu top 10 w swojej kategorii',
        ]);
    }

    $runId = (int) $match['ranking_run_id'];
    $entryId = (int) $match['entry_id'];

    jsonResponse([
        'found' => true,
        'redirectUrl' => publicRankingUrl($runId, $entryId),
        'match' => [
            'entryId' => $entryId,
            'rankingRunId' => $runId,
            'position' => (int) $match['position'],
            'score' => (float) $match['score'],
            'rating' => (float) $match['rating'],
            'ratingCount' => (int) $match['rating_count'],
            'title' => $match['title'],
            'address' => $match['address'],
            'placeCategory' => $match['place_category'],
            'categoryName' => $match['category_name'],
            'city' => $match['city'],
            'searchPhrase' => $match['search_phrase'],
            'rankingCreatedAt' => $match['ranking_created_at'],
        ],
    ]);
} catch (Throwable $error) {
    error_log($error->getMessage());

    jsonResponse([
        'found' => false,
        'message' => 'Nie udało się sprawdzić lokalu. Spróbuj ponownie za chwilę.',
    ], 500);
}
