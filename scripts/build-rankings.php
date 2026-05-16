<?php

declare(strict_types=1);

const DEFAULT_DB_SOCKET = '/Applications/MAMP/tmp/mysql/mysql.sock';
const DEFAULT_DB_NAME = 'rankingtopten';
const DEFAULT_DB_USER = 'root';
const DEFAULT_DB_PASS = 'root';
const FORMULA_VERSION = 'rating_ln_reviews_v1';

function option(string $name, ?string $default = null): ?string
{
    static $options = null;

    if ($options === null) {
        $options = getopt('', [
            'categories:',
            'category:',
            'city:',
            'gl:',
            'hl:',
            'limit-categories:',
            'top:',
            'min-rating-count:',
            'dry-run',
        ]);
    }

    return array_key_exists($name, $options) ? (string) $options[$name] : $default;
}

function hasFlag(string $name): bool
{
    static $options = null;

    if ($options === null) {
        $options = getopt('', [
            'categories:',
            'category:',
            'city:',
            'gl:',
            'hl:',
            'limit-categories:',
            'top:',
            'min-rating-count:',
            'dry-run',
        ]);
    }

    return array_key_exists($name, $options);
}

function pdo(): PDO
{
    $dsn = sprintf(
        'mysql:unix_socket=%s;dbname=%s;charset=utf8mb4',
        DEFAULT_DB_SOCKET,
        DEFAULT_DB_NAME
    );

    return new PDO($dsn, DEFAULT_DB_USER, DEFAULT_DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
}

function readCategories(string $path): array
{
    if (!is_file($path)) {
        throw new RuntimeException("Categories file does not exist: {$path}");
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $categories = array_values(array_unique(array_map('trim', $lines ?: [])));

    return array_values(array_filter($categories, static fn (string $category): bool => $category !== ''));
}

function ensureRankingTables(PDO $pdo): void
{
    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS `ranking_runs` (
          `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
          `source_query_id` BIGINT UNSIGNED NOT NULL,
          `category_name` VARCHAR(190) NOT NULL,
          `city` VARCHAR(190) NOT NULL,
          `search_phrase` VARCHAR(255) NOT NULL,
          `formula_version` VARCHAR(64) NOT NULL DEFAULT 'rating_ln_reviews_v1',
          `top_limit` INT UNSIGNED NOT NULL DEFAULT 10,
          `min_rating_count` INT UNSIGNED NOT NULL DEFAULT 1,
          `places_considered` INT UNSIGNED NOT NULL DEFAULT 0,
          `entries_created` INT UNSIGNED NOT NULL DEFAULT 0,
          `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`),
          KEY `idx_ranking_runs_category_city` (`category_name`, `city`),
          KEY `idx_ranking_runs_search_phrase` (`search_phrase`),
          KEY `idx_ranking_runs_created_at` (`created_at`),
          CONSTRAINT `fk_ranking_runs_source_query`
            FOREIGN KEY (`source_query_id`) REFERENCES `serper_place_queries` (`id`)
            ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );

    $pdo->exec(
        "CREATE TABLE IF NOT EXISTS `ranking_entries` (
          `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
          `ranking_run_id` BIGINT UNSIGNED NOT NULL,
          `source_place_id` BIGINT UNSIGNED DEFAULT NULL,
          `position` INT UNSIGNED NOT NULL,
          `score` DECIMAL(12, 6) NOT NULL,
          `rating` DECIMAL(3, 2) NOT NULL,
          `rating_count` INT UNSIGNED NOT NULL,
          `title` VARCHAR(255) NOT NULL,
          `address` VARCHAR(500) DEFAULT NULL,
          `latitude` DECIMAL(10, 7) DEFAULT NULL,
          `longitude` DECIMAL(10, 7) DEFAULT NULL,
          `category` VARCHAR(255) DEFAULT NULL,
          `phone_number` VARCHAR(100) DEFAULT NULL,
          `website` VARCHAR(500) DEFAULT NULL,
          `cid` VARCHAR(64) DEFAULT NULL,
          `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`),
          UNIQUE KEY `uniq_ranking_position` (`ranking_run_id`, `position`),
          KEY `idx_ranking_entries_score` (`ranking_run_id`, `score`),
          KEY `idx_ranking_entries_cid` (`cid`),
          CONSTRAINT `fk_ranking_entries_run`
            FOREIGN KEY (`ranking_run_id`) REFERENCES `ranking_runs` (`id`)
            ON DELETE CASCADE,
          CONSTRAINT `fk_ranking_entries_source_place`
            FOREIGN KEY (`source_place_id`) REFERENCES `serper_places` (`id`)
            ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
    );
}

function findCompletedQuery(PDO $pdo, string $category, string $city, string $gl, string $hl): ?array
{
    $phrase = $category . ' ' . $city;
    $statement = $pdo->prepare(
        "SELECT *
         FROM serper_place_queries
         WHERE search_phrase = :search_phrase
           AND gl = :gl
           AND hl = :hl
           AND status = 'completed'
         ORDER BY finished_at DESC, id DESC
         LIMIT 1"
    );

    $statement->execute([
        'search_phrase' => $phrase,
        'gl' => $gl,
        'hl' => $hl,
    ]);

    $query = $statement->fetch();

    return is_array($query) ? $query : null;
}

function countEligiblePlaces(PDO $pdo, int $queryId, int $minRatingCount): int
{
    $statement = $pdo->prepare(
        "SELECT COUNT(*)
         FROM serper_places
         WHERE query_id = :query_id
           AND rating IS NOT NULL
           AND rating_count IS NOT NULL
           AND rating_count >= :min_rating_count"
    );

    $statement->bindValue('query_id', $queryId, PDO::PARAM_INT);
    $statement->bindValue('min_rating_count', $minRatingCount, PDO::PARAM_INT);
    $statement->execute();

    return (int) $statement->fetchColumn();
}

function fetchRankingPlaces(PDO $pdo, int $queryId, int $topLimit, int $minRatingCount): array
{
    $statement = $pdo->prepare(
        "SELECT
            id,
            title,
            address,
            latitude,
            longitude,
            rating,
            rating_count,
            category,
            phone_number,
            website,
            cid,
            rating * LN(rating_count + 1) AS score
         FROM serper_places
         WHERE query_id = :query_id
           AND rating IS NOT NULL
           AND rating_count IS NOT NULL
           AND rating_count >= :min_rating_count
         ORDER BY score DESC, rating DESC, rating_count DESC, serper_page ASC, serper_position ASC, id ASC
         LIMIT :top_limit"
    );

    $statement->bindValue('query_id', $queryId, PDO::PARAM_INT);
    $statement->bindValue('min_rating_count', $minRatingCount, PDO::PARAM_INT);
    $statement->bindValue('top_limit', $topLimit, PDO::PARAM_INT);
    $statement->execute();

    return $statement->fetchAll();
}

function createRankingRun(
    PDO $pdo,
    array $query,
    int $topLimit,
    int $minRatingCount,
    int $placesConsidered
): int {
    $statement = $pdo->prepare(
        "INSERT INTO ranking_runs
            (source_query_id, category_name, city, search_phrase, formula_version, top_limit, min_rating_count, places_considered)
         VALUES
            (:source_query_id, :category_name, :city, :search_phrase, :formula_version, :top_limit, :min_rating_count, :places_considered)"
    );

    $statement->execute([
        'source_query_id' => (int) $query['id'],
        'category_name' => (string) $query['category_name'],
        'city' => (string) $query['city'],
        'search_phrase' => (string) $query['search_phrase'],
        'formula_version' => FORMULA_VERSION,
        'top_limit' => $topLimit,
        'min_rating_count' => $minRatingCount,
        'places_considered' => $placesConsidered,
    ]);

    return (int) $pdo->lastInsertId();
}

function insertRankingEntries(PDO $pdo, int $rankingRunId, array $places): int
{
    $statement = $pdo->prepare(
        "INSERT INTO ranking_entries
            (ranking_run_id, source_place_id, position, score, rating, rating_count, title, address, latitude, longitude,
             category, phone_number, website, cid)
         VALUES
            (:ranking_run_id, :source_place_id, :position, :score, :rating, :rating_count, :title, :address, :latitude, :longitude,
             :category, :phone_number, :website, :cid)"
    );

    $position = 1;

    foreach ($places as $place) {
        $statement->execute([
            'ranking_run_id' => $rankingRunId,
            'source_place_id' => (int) $place['id'],
            'position' => $position,
            'score' => round((float) $place['score'], 6),
            'rating' => (float) $place['rating'],
            'rating_count' => (int) $place['rating_count'],
            'title' => (string) $place['title'],
            'address' => $place['address'],
            'latitude' => $place['latitude'],
            'longitude' => $place['longitude'],
            'category' => $place['category'],
            'phone_number' => $place['phone_number'],
            'website' => $place['website'],
            'cid' => $place['cid'],
        ]);

        $position++;
    }

    return $position - 1;
}

function updateRankingRunEntriesCount(PDO $pdo, int $rankingRunId, int $entriesCreated): void
{
    $statement = $pdo->prepare(
        'UPDATE ranking_runs SET entries_created = :entries_created WHERE id = :id'
    );

    $statement->execute([
        'entries_created' => $entriesCreated,
        'id' => $rankingRunId,
    ]);
}

$categoriesPath = option('categories', dirname(__DIR__) . '/categories.txt');
$selectedCategory = option('category');
$city = option('city', 'Poznań');
$gl = option('gl', 'pl');
$hl = option('hl', 'pl');
$limitCategories = (int) option('limit-categories', '0');
$topLimit = max(1, (int) option('top', '10'));
$minRatingCount = max(0, (int) option('min-rating-count', '1'));
$dryRun = hasFlag('dry-run');

$categories = $selectedCategory ? [$selectedCategory] : readCategories($categoriesPath);

if ($limitCategories > 0) {
    $categories = array_slice($categories, 0, $limitCategories);
}

$pdo = pdo();
ensureRankingTables($pdo);

foreach ($categories as $category) {
    $query = findCompletedQuery($pdo, $category, $city, $gl, $hl);
    $phrase = $category . ' ' . $city;

    if ($query === null) {
        echo "Skipping {$phrase}: no completed Serper query found." . PHP_EOL;
        continue;
    }

    $queryId = (int) $query['id'];
    $placesConsidered = countEligiblePlaces($pdo, $queryId, $minRatingCount);
    $places = fetchRankingPlaces($pdo, $queryId, $topLimit, $minRatingCount);

    if ($dryRun) {
        echo "Would build ranking for {$phrase}: {$placesConsidered} eligible places, " . count($places) . " entries." . PHP_EOL;
        continue;
    }

    $pdo->beginTransaction();

    try {
        $rankingRunId = createRankingRun($pdo, $query, $topLimit, $minRatingCount, $placesConsidered);
        $entriesCreated = insertRankingEntries($pdo, $rankingRunId, $places);
        updateRankingRunEntriesCount($pdo, $rankingRunId, $entriesCreated);
        $pdo->commit();

        echo "Built ranking #{$rankingRunId} for {$phrase}: {$entriesCreated} entries from {$placesConsidered} places." . PHP_EOL;
    } catch (Throwable $error) {
        $pdo->rollBack();
        throw $error;
    }
}
