<?php

declare(strict_types=1);

require __DIR__ . '/_db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed.'], 405);
}

$payload = requestPayload();

$entryId = isset($payload['entryId']) ? (int) $payload['entryId'] : 0;
$rankingRunId = isset($payload['rankingRunId']) ? (int) $payload['rankingRunId'] : 0;
$businessName = trimQuery($payload['businessName'] ?? null);
$address = trimQuery($payload['address'] ?? null);
$city = trimQuery($payload['city'] ?? null);
$categoryName = trimQuery($payload['categoryName'] ?? null);
$contactName = trimQuery($payload['contactName'] ?? null);
$standCount = isset($payload['standCount']) ? (int) $payload['standCount'] : 0;
$source = trimQuery($payload['source'] ?? 'b2b_landing');

if ($entryId < 1 || $rankingRunId < 1) {
    jsonResponse(['success' => false, 'message' => 'Wybierz lokal z listy podpowiedzi.'], 422);
}

if (mb_strlen($contactName, 'UTF-8') < 2) {
    jsonResponse(['success' => false, 'message' => 'Wpisz imię i nazwisko.'], 422);
}

if ($standCount < 1 || $standCount > 15) {
    jsonResponse(['success' => false, 'message' => 'Wybierz ilość standów od 1 do 15.'], 422);
}

if ($businessName === '') {
    jsonResponse(['success' => false, 'message' => 'Brak nazwy lokalu.'], 422);
}

try {
    $pdo = apiPdo();
    ensureStandOrdersTable($pdo);

    $entryStatement = $pdo->prepare(
        "SELECT
            re.id AS entry_id,
            re.ranking_run_id,
            re.title,
            re.address,
            rr.city,
            rr.category_name
         FROM ranking_entries re
         INNER JOIN ranking_runs rr ON rr.id = re.ranking_run_id
         WHERE re.id = :entry_id
           AND re.ranking_run_id = :ranking_run_id
         LIMIT 1"
    );
    $entryStatement->execute([
        'entry_id' => $entryId,
        'ranking_run_id' => $rankingRunId,
    ]);
    $entry = $entryStatement->fetch();

    if (!$entry) {
        jsonResponse(['success' => false, 'message' => 'Wybrany lokal nie został znaleziony w bazie.'], 404);
    }

    $resolvedName = (string) $entry['title'];
    $resolvedAddress = $entry['address'] !== null && $entry['address'] !== ''
        ? (string) $entry['address']
        : ($address !== '' ? $address : null);
    $resolvedCity = $entry['city'] !== null && $entry['city'] !== ''
        ? (string) $entry['city']
        : ($city !== '' ? $city : null);
    $resolvedCategory = $entry['category_name'] !== null && $entry['category_name'] !== ''
        ? (string) $entry['category_name']
        : ($categoryName !== '' ? $categoryName : null);

    $insert = $pdo->prepare(
        "INSERT INTO stand_orders (
            ranking_entry_id,
            ranking_run_id,
            business_name,
            business_address,
            city,
            category_name,
            contact_name,
            stand_count,
            status,
            source
         ) VALUES (
            :ranking_entry_id,
            :ranking_run_id,
            :business_name,
            :business_address,
            :city,
            :category_name,
            :contact_name,
            :stand_count,
            'new',
            :source
         )"
    );
    $insert->execute([
        'ranking_entry_id' => $entryId,
        'ranking_run_id' => $rankingRunId,
        'business_name' => $resolvedName,
        'business_address' => $resolvedAddress,
        'city' => $resolvedCity,
        'category_name' => $resolvedCategory,
        'contact_name' => $contactName,
        'stand_count' => $standCount,
        'source' => $source !== '' ? $source : 'b2b_landing',
    ]);

    jsonResponse([
        'success' => true,
        'message' => 'Zamówienie zostało zapisane.',
        'deliveryAddress' => $resolvedAddress ?? 'adres wskazany dla wybranego lokalu',
        'orderId' => (int) $pdo->lastInsertId(),
    ]);
} catch (Throwable $error) {
    error_log($error->getMessage());

    jsonResponse([
        'success' => false,
        'message' => 'Nie udało się zapisać zamówienia. Spróbuj ponownie za chwilę.',
    ], 500);
}

function ensureStandOrdersTable(PDO $pdo): void
{
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS stand_orders (
            id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            ranking_entry_id BIGINT UNSIGNED NOT NULL,
            ranking_run_id BIGINT UNSIGNED NOT NULL,
            business_name VARCHAR(255) NOT NULL,
            business_address VARCHAR(500) DEFAULT NULL,
            city VARCHAR(190) DEFAULT NULL,
            category_name VARCHAR(190) DEFAULT NULL,
            contact_name VARCHAR(255) NOT NULL,
            stand_count TINYINT UNSIGNED NOT NULL,
            status ENUM('new', 'processing', 'completed', 'cancelled') NOT NULL DEFAULT 'new',
            source VARCHAR(64) NOT NULL DEFAULT 'b2b_landing',
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            KEY idx_stand_orders_status (status),
            KEY idx_stand_orders_entry (ranking_entry_id),
            KEY idx_stand_orders_created_at (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
}
