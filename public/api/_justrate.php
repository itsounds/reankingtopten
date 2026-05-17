<?php

declare(strict_types=1);

const JUSTRATE_RATE_BASE_URL = 'https://justrate.it/rate/';

function justrateRateUrl(string $jid): string
{
    return JUSTRATE_RATE_BASE_URL . rawurlencode($jid);
}

function existingJustratePlace(PDO $pdo, ?string $cid): ?array
{
    if (!$cid) {
        return null;
    }

    $statement = $pdo->prepare('SELECT id, jid, cid, placeId FROM places WHERE cid = :cid LIMIT 1');
    $statement->execute(['cid' => $cid]);
    $place = $statement->fetch();

    return is_array($place) ? $place : null;
}

function ensureJustratePlace(PDO $pdo, array $entry): array
{
    $cid = trim((string) ($entry['cid'] ?? ''));

    if ($cid === '') {
        throw new RuntimeException('Ranking entry has no cid.');
    }

    $existing = existingJustratePlace($pdo, $cid);

    if ($existing !== null) {
        return [
            'id' => (int) $existing['id'],
            'jid' => (string) $existing['jid'],
            'rateUrl' => justrateRateUrl((string) $existing['jid']),
            'created' => false,
        ];
    }

    $jid = uniqueJid($pdo);
    $placeId = googlePlaceId($entry) ?: $cid;

    $statement = $pdo->prepare(
        "INSERT INTO places
            (jid, cid, placeId, title, address, latitude, longitude, rating, ratingCount, category, phoneNumber, website)
         VALUES
            (:jid, :cid, :place_id, :title, :address, :latitude, :longitude, :rating, :rating_count, :category, :phone_number, :website)"
    );

    $statement->execute([
        'jid' => $jid,
        'cid' => $cid,
        'place_id' => $placeId,
        'title' => nullableString($entry['title'] ?? null, 256),
        'address' => nullableString($entry['address'] ?? null, 256),
        'latitude' => $entry['latitude'] ?? null,
        'longitude' => $entry['longitude'] ?? null,
        'rating' => $entry['rating'] ?? null,
        'rating_count' => $entry['rating_count'] ?? null,
        'category' => nullableString($entry['category'] ?? null, 64),
        'phone_number' => nullableString($entry['phone_number'] ?? null, 16),
        'website' => nullableString($entry['website'] ?? null, 512),
    ]);

    return [
        'id' => (int) $pdo->lastInsertId(),
        'jid' => $jid,
        'rateUrl' => justrateRateUrl($jid),
        'created' => true,
    ];
}

function uniqueJid(PDO $pdo): string
{
    do {
        $jid = substr(bin2hex(random_bytes(4)), 0, 8);
        $statement = $pdo->prepare('SELECT COUNT(*) FROM places WHERE jid = :jid');
        $statement->execute(['jid' => $jid]);
        $exists = (int) $statement->fetchColumn() > 0;
    } while ($exists);

    return $jid;
}

function googlePlaceId(array $entry): ?string
{
    $apiKey = appConfigValue('google_places_api_key') ?: getenv('GOOGLE_PLACES_API_KEY');

    if (!$apiKey) {
        return null;
    }

    $input = trim((string) ($entry['title'] ?? '') . ' ' . (string) ($entry['address'] ?? ''));

    if ($input === '') {
        return null;
    }

    $query = http_build_query([
        'input' => $input,
        'inputtype' => 'textquery',
        'fields' => 'place_id',
        'key' => $apiKey,
    ]);
    $url = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/json?' . $query;
    $response = @file_get_contents($url);

    if ($response === false) {
        return null;
    }

    $decoded = json_decode($response, true);

    if (!is_array($decoded) || ($decoded['status'] ?? '') !== 'OK') {
        return null;
    }

    $placeId = $decoded['candidates'][0]['place_id'] ?? null;

    return is_string($placeId) && $placeId !== '' ? $placeId : null;
}

function nullableString(mixed $value, int $maxLength): ?string
{
    if ($value === null) {
        return null;
    }

    $string = trim((string) $value);

    if ($string === '') {
        return null;
    }

    return mb_substr($string, 0, $maxLength, 'UTF-8');
}
