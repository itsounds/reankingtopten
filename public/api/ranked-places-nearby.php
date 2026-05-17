<?php

declare(strict_types=1);

require __DIR__ . '/_db.php';
require __DIR__ . '/_demo.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['message' => 'Method not allowed.'], 405);
}

requireDemoToken($_GET['token'] ?? null);

$userLat = filter_var($_GET['lat'] ?? null, FILTER_VALIDATE_FLOAT);
$userLng = filter_var($_GET['lng'] ?? null, FILTER_VALIDATE_FLOAT);
$radiusKm = filter_var($_GET['radius_km'] ?? 0.5, FILTER_VALIDATE_FLOAT);

if ($userLat === false || $userLng === false) {
    jsonResponse(['message' => 'Missing user location.'], 422);
}

if ($radiusKm === false || $radiusKm <= 0) {
    $radiusKm = 0.5;
}

try {
    $pdo = apiPdo();
    $statement = $pdo->query(
        "SELECT
            re.id AS entry_id,
            re.ranking_run_id,
            re.position,
            re.score,
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
         WHERE re.latitude IS NOT NULL
           AND re.longitude IS NOT NULL"
    );

    $places = [];
    $seen = [];

    foreach ($statement->fetchAll() as $entry) {
        $distanceKm = distanceKm(
            (float) $userLat,
            (float) $userLng,
            (float) $entry['latitude'],
            (float) $entry['longitude']
        );

        if ($distanceKm > $radiusKm) {
            continue;
        }

        $dedupeKey = mb_strtolower(
            (string) $entry['title'] . '|' . (string) $entry['address'],
            'UTF-8'
        );

        $payload = demoPlacePayload($entry);
        $payload['distanceKm'] = round($distanceKm, 3);

        if (!isset($seen[$dedupeKey])) {
            $seen[$dedupeKey] = count($places);
            $places[] = $payload;
            continue;
        }

        $existingIndex = $seen[$dedupeKey];

        if ($payload['position'] < $places[$existingIndex]['position']) {
            $places[$existingIndex] = $payload;
        }
    }

    usort(
        $places,
        static fn (array $a, array $b): int => [$a['distanceKm'], $a['position']] <=> [$b['distanceKm'], $b['position']]
    );

    jsonResponse([
        'places' => $places,
        'radiusKm' => (float) $radiusKm,
    ]);
} catch (Throwable $error) {
    error_log($error->getMessage());

    jsonResponse(['message' => 'Nie udało się pobrać lokali z rankingu.'], 500);
}

function distanceKm(float $fromLat, float $fromLng, float $toLat, float $toLng): float
{
    $earthRadiusKm = 6371.0;
    $latDelta = deg2rad($toLat - $fromLat);
    $lngDelta = deg2rad($toLng - $fromLng);
    $fromLatRad = deg2rad($fromLat);
    $toLatRad = deg2rad($toLat);

    $a = sin($latDelta / 2) ** 2
        + cos($fromLatRad) * cos($toLatRad) * sin($lngDelta / 2) ** 2;

    return $earthRadiusKm * 2 * atan2(sqrt($a), sqrt(1 - $a));
}
