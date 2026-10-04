<?php

declare(strict_types=1);

/**
 * Storage layer.
 *
 * saveSubmission() tries MySQL first. If the database is unreachable
 * (server down, missing driver, wrong credentials, unknown schema...)
 * the record is written to storage/submissions.json instead, so a
 * submission is never lost just because the database is unavailable.
 */

final class DuplicateNationalCode extends RuntimeException
{
}


/* -----------------------------------------
   MySQL
----------------------------------------- */

function connectDatabase(array $db): ?PDO
{
    try {

        $dsn = sprintf(
            "mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4",
            $db["host"],
            $db["port"],
            $db["name"]
        );

        return new PDO(
            $dsn,
            $db["user"],
            $db["pass"],
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::ATTR_TIMEOUT => 2
            ]
        );

    } catch (Throwable $e) {

        error_log("Form Pilot: database unavailable - " . $e->getMessage());

        return null;
    }
}


function ensureSchema(PDO $pdo): void
{
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id            INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
            public_id     CHAR(16)     NOT NULL,
            first_name    VARCHAR(100) NOT NULL,
            last_name     VARCHAR(100) NOT NULL,
            father_name   VARCHAR(100) NOT NULL,
            national_code CHAR(10)     NOT NULL,
            phone         VARCHAR(11)  NOT NULL,
            email         VARCHAR(190) NOT NULL,
            province      VARCHAR(100) NOT NULL,
            city          VARCHAR(100) NOT NULL,
            address       TEXT         NOT NULL,
            image         VARCHAR(64)  NULL,
            created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
            UNIQUE KEY uq_users_national_code (national_code),
            UNIQUE KEY uq_users_public_id (public_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
}


function saveToDatabase(PDO $pdo, array $record): void
{
    $statement = $pdo->prepare("
        INSERT INTO users (
            public_id, first_name, last_name, father_name, national_code,
            phone, email, province, city, address, image
        ) VALUES (
            :public_id, :first_name, :last_name, :father_name, :national_code,
            :phone, :email, :province, :city, :address, :image
        )
    ");

    try {

        $statement->execute([
            ":public_id"     => $record["id"],
            ":first_name"    => $record["firstName"],
            ":last_name"     => $record["lastName"],
            ":father_name"   => $record["fatherName"],
            ":national_code" => $record["nationalCode"],
            ":phone"         => $record["phone"],
            ":email"         => $record["email"],
            ":province"      => $record["province"],
            ":city"          => $record["city"],
            ":address"       => $record["address"],
            ":image"         => $record["image"]
        ]);

    } catch (PDOException $e) {

        // 1062 = duplicate entry for a UNIQUE key
        if ((int)($e->errorInfo[1] ?? 0) === 1062) {
            throw new DuplicateNationalCode();
        }

        throw $e;
    }
}


/* -----------------------------------------
   JSON file (fallback)
----------------------------------------- */

function saveToJsonFile(string $directory, array $record): void
{
    if (
        !is_dir($directory) &&
        !mkdir($directory, 0755, true) &&
        !is_dir($directory)
    ) {
        throw new RuntimeException("Cannot create storage directory.");
    }

    $handle = fopen($directory . "/submissions.json", "c+");

    if ($handle === false) {
        throw new RuntimeException("Cannot open submissions file.");
    }

    try {

        // The lock covers read + write, so two simultaneous
        // submissions can't overwrite each other.
        if (!flock($handle, LOCK_EX)) {
            throw new RuntimeException("Cannot lock submissions file.");
        }

        $raw = trim((string)stream_get_contents($handle));

        $records = [];

        if ($raw !== "") {

            $records = json_decode($raw, true);

            // Never overwrite a file we can't understand.
            if (!is_array($records)) {
                throw new RuntimeException("Submissions file is corrupted.");
            }
        }

        foreach ($records as $existing) {

            if (($existing["nationalCode"] ?? null) === $record["nationalCode"]) {
                throw new DuplicateNationalCode();
            }
        }

        $records[] = $record;

        $json = json_encode(
            $records,
            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR
        );

        rewind($handle);
        ftruncate($handle, 0);
        fwrite($handle, $json);
        fflush($handle);

    } finally {

        flock($handle, LOCK_UN);
        fclose($handle);
    }
}


/* -----------------------------------------
   Public entry point
----------------------------------------- */

/**
 * @return string "database" or "file" - where the record ended up
 * @throws DuplicateNationalCode
 * @throws RuntimeException when neither storage worked
 */
function saveSubmission(array $config, array $record): string
{
    $pdo = connectDatabase($config["db"]);

    if ($pdo !== null) {

        try {

            ensureSchema($pdo);
            saveToDatabase($pdo, $record);

            return "database";

        } catch (DuplicateNationalCode $e) {

            throw $e;

        } catch (Throwable $e) {

            error_log("Form Pilot: database save failed - " . $e->getMessage());
        }
    }

    saveToJsonFile($config["paths"]["storage"], $record);

    return "file";
}
