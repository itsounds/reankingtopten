<?php

declare(strict_types=1);

require __DIR__ . '/_db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['suggestions' => [], 'message' => 'Method not allowed.'], 405);
}

$query = trimQuery($_GET['q'] ?? null);

if (mb_strlen($query, 'UTF-8') < 2) {
    jsonResponse(['suggestions' => []]);
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
            rr.category_name,
            rr.city,
            rr.search_phrase,
            rr.created_at AS ranking_created_at
         FROM ranking_entries re
         INNER JOIN ranking_runs rr ON rr.id = re.ranking_run_id
         WHERE re.title LIKE :query
         ORDER BY re.position ASC, re.score DESC, re.rating DESC, re.rating_count DESC, rr.created_at DESC
         LIMIT 30"
    );

    $statement->execute([
        'query' => '%' . $query . '%',
    ]);

    $suggestions = [];
    $seen = [];

    foreach ($statement->fetchAll() as $match) {
        $dedupeKey = mb_strtolower((string) $match['title'] . '|' . (string) $match['address'], 'UTF-8');

        if (isset($seen[$dedupeKey])) {
            continue;
        }

        $seen[$dedupeKey] = true;
        $runId = (int) $match['ranking_run_id'];
        $entryId = (int) $match['entry_id'];

        $suggestions[] = [
            'entryId' => $entryId,
            'rankingRunId' => $runId,
            'title' => $match['title'],
            'address' => $match['address'],
            'position' => (int) $match['position'],
            'score' => (float) $match['score'],
            'rating' => (float) $match['rating'],
            'ratingCount' => (int) $match['rating_count'],
            'categoryName' => $match['category_name'],
            'city' => $match['city'],
            'searchPhrase' => $match['search_phrase'],
            'rankingCreatedAt' => $match['ranking_created_at'],
            'redirectUrl' => publicRankingUrl($runId, $entryId),
        ];

        if (count($suggestions) >= 8) {
            break;
        }
    }

    jsonResponse(['suggestions' => $suggestions]);
} catch (Throwable $error) {
    error_log($error->getMessage());

    jsonResponse([
        'suggestions' => [],
        'message' => 'Nie udało się pobrać podpowiedzi.',
    ], 500);
}
