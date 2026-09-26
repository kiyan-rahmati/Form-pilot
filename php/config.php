<?php

declare(strict_types=1);

$host = "127.0.0.1";
$port = "3306";
$dbname = "form_pilot";
$username = "root";
$password = "";

$dsn = "mysql:host={$host};port={$port};dbname={$dbname};charset=utf8mb4";

try {
    $pdo = new PDO(
        $dsn,
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
} catch (PDOException $e) {

    http_response_code(500);

    header("Content-Type: application/json; charset=utf-8");

    echo json_encode(
        [
            "success" => false,
            "message" => "Database connection failed."
        ],
        JSON_UNESCAPED_UNICODE
    );

    exit;
}