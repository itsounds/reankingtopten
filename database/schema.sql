CREATE DATABASE IF NOT EXISTS `rankingtopten`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `rankingtopten`;

CREATE TABLE IF NOT EXISTS `serper_place_queries` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_name` VARCHAR(190) NOT NULL,
  `city` VARCHAR(190) NOT NULL,
  `search_phrase` VARCHAR(255) NOT NULL,
  `gl` VARCHAR(8) NOT NULL DEFAULT 'pl',
  `hl` VARCHAR(8) NOT NULL DEFAULT 'pl',
  `status` ENUM('pending', 'running', 'completed', 'failed') NOT NULL DEFAULT 'pending',
  `pages_fetched` INT UNSIGNED NOT NULL DEFAULT 0,
  `places_found` INT UNSIGNED NOT NULL DEFAULT 0,
  `last_page_count` INT UNSIGNED DEFAULT NULL,
  `last_error` TEXT DEFAULT NULL,
  `started_at` DATETIME DEFAULT NULL,
  `finished_at` DATETIME DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_search_phrase` (`search_phrase`, `gl`, `hl`),
  KEY `idx_category_city` (`category_name`, `city`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `serper_places` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `query_id` BIGINT UNSIGNED NOT NULL,
  `search_phrase` VARCHAR(255) NOT NULL,
  `serper_page` INT UNSIGNED NOT NULL,
  `serper_position` INT UNSIGNED NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `address` VARCHAR(500) DEFAULT NULL,
  `latitude` DECIMAL(10, 7) DEFAULT NULL,
  `longitude` DECIMAL(10, 7) DEFAULT NULL,
  `rating` DECIMAL(3, 2) DEFAULT NULL,
  `rating_count` INT UNSIGNED DEFAULT NULL,
  `category` VARCHAR(255) DEFAULT NULL,
  `phone_number` VARCHAR(100) DEFAULT NULL,
  `website` VARCHAR(500) DEFAULT NULL,
  `cid` VARCHAR(64) DEFAULT NULL,
  `raw_json` LONGTEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_query_cid` (`query_id`, `cid`),
  KEY `idx_search_phrase` (`search_phrase`),
  KEY `idx_cid` (`cid`),
  KEY `idx_rating` (`rating`, `rating_count`),
  CONSTRAINT `fk_serper_places_query`
    FOREIGN KEY (`query_id`) REFERENCES `serper_place_queries` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ranking_runs` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ranking_entries` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `demo_active_place` (
  `id` TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `ranking_entry_id` BIGINT UNSIGNED NOT NULL,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_demo_active_place_entry` (`ranking_entry_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
