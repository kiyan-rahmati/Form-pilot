<?php

declare(strict_types=1);

/**
 * Form Pilot configuration.
 *
 * Every database value can be overridden with an environment variable,
 * so credentials never have to live in the repository.
 */

$env = static function (string $name, string $default): string {
    $value = getenv($name);

    return $value === false ? $default : $value;
};

return [

    "db" => [
        "host" => $env("FP_DB_HOST", "127.0.0.1"),
        "port" => $env("FP_DB_PORT", "3306"),
        "name" => $env("FP_DB_NAME", "form_pilot"),
        "user" => $env("FP_DB_USER", "root"),
        "pass" => $env("FP_DB_PASS", ""),
    ],

    "paths" => [
        "uploads" => dirname(__DIR__) . "/uploads",
        "storage" => dirname(__DIR__) . "/storage",
    ],

    "max_image_bytes" => 2 * 1024 * 1024,
];
