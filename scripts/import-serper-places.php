<?php

declare(strict_types=1);

const DEFAULT_DB_SOCKET = '/Applications/MAMP/tmp/mysql/mysql.sock';
const DEFAULT_DB_NAME = 'rankingtopten';
const DEFAULT_DB_USER = 'root';
const DEFAULT_DB_PASS = 'root';
const SERPER_ENDPOINT = 'https://google.serper.dev/places';

function option(string $name, ?string $default = null): ?string
{
    static $options = null;

    if ($options === null) {
        $options = getopt('', [
            'api-key:',
            'categories:',
            'category:',
            'city:',
            'gl:',
            'hl:',
            'limit-categories:',
            'max-pages:',
            'sleep-ms:',
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
            'api-key:',
            'categories:',
            'category:',
            'city:',
            'gl:',
            'hl:',
            'limit-categories:',
            'max-pages:',
            'sleep-ms:',
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

function serperRequest(string $apiKey, array $payload): array
{
    $curl = curl_init();

    curl_setopt_array($curl, [
        CURLOPT_URL => SERPER_ENDPOINT,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
        CURLOPT_HTTPHEADER => [
            'X-API-KEY: ' . $apiKey,
            'Content-Type: application/json',
        ],
    ]);

    $response = curl_exec($curl);
    $error = curl_error($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);

    curl_close($curl);

    if ($response === false || $error !== '') {
        throw new RuntimeException('Serper cURL error: ' . $error);
    }

    if ($status < 200 || $status >= 300) {
        throw new RuntimeException("Serper HTTP {$status}: {$response}");
    }

    $decoded = json_decode($response, true);

    if (!is_array($decoded)) {
        throw new RuntimeException('Serper returned invalid JSON: ' . $response);
    }

    return $decoded;
}

function startQuery(PDO $pdo, string $category, string $city, string $phrase, string $gl, string $hl): int
{
    $statement = $pdo->prepare(
        "INSERT INTO serper_place_queries
            (category_name, city, search_phrase, gl, hl, status, started_at, pages_fetched, places_found, last_error)
         VALUES
            (:category_name, :city, :search_phrase, :gl, :hl, 'running', NOW(), 0, 0, NULL)
         ON DUPLICATE KEY UPDATE
            category_name = VALUES(category_name),
            city = VALUES(city),
            status = 'running',
            started_at = NOW(),
            finished_at = NULL,
            pages_fetched = 0,
            places_found = 0,
            last_page_count = NULL,
            last_error = NULL"
    );

    $statement->execute([
        'category_name' => $category,
        'city' => $city,
        'search_phrase' => $phrase,
        'gl' => $gl,
        'hl' => $hl,
    ]);

    $select = $pdo->prepare(
        'SELECT id FROM serper_place_queries WHERE search_phrase = :search_phrase AND gl = :gl AND hl = :hl LIMIT 1'
    );
    $select->execute([
        'search_phrase' => $phrase,
        'gl' => $gl,
        'hl' => $hl,
    ]);

    $id = $select->fetchColumn();

    if ($id === false) {
        throw new RuntimeException('Could not create or load query row.');
    }

    return (int) $id;
}

function finishQuery(PDO $pdo, int $queryId, string $status, int $pagesFetched, int $placesFound, ?int $lastPageCount, ?string $error = null): void
{
    $statement = $pdo->prepare(
        "UPDATE serper_place_queries
         SET status = :status,
             pages_fetched = :pages_fetched,
             places_found = :places_found,
             last_page_count = :last_page_count,
             last_error = :last_error,
             finished_at = NOW()
         WHERE id = :id"
    );

    $statement->execute([
        'status' => $status,
        'pages_fetched' => $pagesFetched,
        'places_found' => $placesFound,
        'last_page_count' => $lastPageCount,
        'last_error' => $error,
        'id' => $queryId,
    ]);
}

function savePlace(PDO $pdo, int $queryId, string $phrase, int $page, int $position, array $place): void
{
    $statement = $pdo->prepare(
        "INSERT INTO serper_places
            (query_id, search_phrase, serper_page, serper_position, title, address, latitude, longitude,
             rating, rating_count, category, phone_number, website, cid, raw_json)
         VALUES
            (:query_id, :search_phrase, :serper_page, :serper_position, :title, :address, :latitude, :longitude,
             :rating, :rating_count, :category, :phone_number, :website, :cid, :raw_json)
         ON DUPLICATE KEY UPDATE
            serper_page = VALUES(serper_page),
            serper_position = VALUES(serper_position),
            title = VALUES(title),
            address = VALUES(address),
            latitude = VALUES(latitude),
            longitude = VALUES(longitude),
            rating = VALUES(rating),
            rating_count = VALUES(rating_count),
            category = VALUES(category),
            phone_number = VALUES(phone_number),
            website = VALUES(website),
            raw_json = VALUES(raw_json)"
    );

    $statement->execute([
        'query_id' => $queryId,
        'search_phrase' => $phrase,
        'serper_page' => $page,
        'serper_position' => $position,
        'title' => (string) ($place['title'] ?? ''),
        'address' => $place['address'] ?? null,
        'latitude' => $place['latitude'] ?? null,
        'longitude' => $place['longitude'] ?? null,
        'rating' => $place['rating'] ?? null,
        'rating_count' => $place['ratingCount'] ?? null,
        'category' => $place['category'] ?? null,
        'phone_number' => $place['phoneNumber'] ?? null,
        'website' => $place['website'] ?? null,
        'cid' => $place['cid'] ?? null,
        'raw_json' => json_encode($place, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
    ]);
}

$apiKey = option('api-key') ?: getenv('SERPER_API_KEY');
$categoriesPath = option('categories', dirname(__DIR__) . '/categories.txt');
$selectedCategory = option('category');
$city = option('city', 'Poznań');
$gl = option('gl', 'pl');
$hl = option('hl', 'pl');
$limitCategories = (int) option('limit-categories', '0');
$maxPages = (int) option('max-pages', '0');
$sleepMs = (int) option('sleep-ms', '250');
$dryRun = hasFlag('dry-run');

if (!$apiKey && !$dryRun) {
    throw new RuntimeException('Missing API key. Use SERPER_API_KEY env var or --api-key=...');
}

$categories = $selectedCategory ? [$selectedCategory] : readCategories($categoriesPath);

if ($limitCategories > 0) {
    $categories = array_slice($categories, 0, $limitCategories);
}

if ($dryRun) {
    foreach ($categories as $category) {
        echo $category . ' ' . $city . PHP_EOL;
    }

    exit(0);
}

$pdo = pdo();

foreach ($categories as $category) {
    $phrase = $category . ' ' . $city;
    $queryId = startQuery($pdo, $category, $city, $phrase, $gl, $hl);
    $pagesFetched = 0;
    $placesFound = 0;
    $lastPageCount = null;

    echo "Fetching: {$phrase}" . PHP_EOL;

    try {
        for ($page = 1; ; $page++) {
            if ($maxPages > 0 && $page > $maxPages) {
                break;
            }

            $payload = [
                'q' => $phrase,
                'gl' => $gl,
                'hl' => $hl,
                'page' => $page,
            ];

            $data = serperRequest($apiKey, $payload);
            $places = is_array($data['places'] ?? null) ? $data['places'] : [];
            $count = count($places);
            $lastPageCount = $count;
            $pagesFetched++;

            echo "  page {$page}: {$count} places" . PHP_EOL;

            foreach ($places as $index => $place) {
                if (!is_array($place)) {
                    continue;
                }

                savePlace($pdo, $queryId, $phrase, $page, $index + 1, $place);
                $placesFound++;
            }

            if ($count < 10) {
                break;
            }

            if ($sleepMs > 0) {
                usleep($sleepMs * 1000);
            }
        }

        finishQuery($pdo, $queryId, 'completed', $pagesFetched, $placesFound, $lastPageCount);
    } catch (Throwable $error) {
        finishQuery($pdo, $queryId, 'failed', $pagesFetched, $placesFound, $lastPageCount, $error->getMessage());
        fwrite(STDERR, "  failed: {$error->getMessage()}" . PHP_EOL);
    }
}
