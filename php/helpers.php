<?php

declare(strict_types=1);


/**
 * Return JSON response
 */
function jsonResponse(
    bool $success,
    string $message,
    array $data = []
): void {

    header("Content-Type: application/json; charset=utf-8");

    echo json_encode(
        [
            "success" => $success,
            "message" => $message,
            "data" => $data
        ],
        JSON_UNESCAPED_UNICODE
    );

    exit;
}


/**
 * Get POST value safely
 */
function postValue(string $key): string
{
    return trim((string)($_POST[$key] ?? ""));
}


/**
 * Normalize Persian / Arabic digits to English digits
 */
function normalizeDigits(string $value): string
{
    $persian = [
        "۰", "۱", "۲", "۳", "۴",
        "۵", "۶", "۷", "۸", "۹"
    ];

    $arabic = [
        "٠", "١", "٢", "٣", "٤",
        "٥", "٦", "٧", "٨", "٩"
    ];

    $english = [
        "0", "1", "2", "3", "4",
        "5", "6", "7", "8", "9"
    ];

    $value = str_replace($persian, $english, $value);
    $value = str_replace($arabic, $english, $value);

    return $value;
}


/**
 * Validate Iranian mobile number
 */
function isValidPhone(string $phone): bool
{
    $phone = normalizeDigits($phone);

    $phone = preg_replace(
        "/[\s\-]/u",
        "",
        $phone
    );

    return (bool)preg_match(
        "/^09\d{9}$/",
        $phone
    );
}


/**
 * Validate Iranian national code
 */
function isValidNationalCode(string $code): bool
{
    $code = normalizeDigits($code);

    $code = preg_replace(
        "/\s/u",
        "",
        $code
    );

    if (!preg_match("/^\d{10}$/", $code)) {
        return false;
    }

    if (preg_match("/^(\d)\1{9}$/", $code)) {
        return false;
    }

    $digits = array_map(
        "intval",
        str_split($code)
    );

    $sum = 0;

    for ($i = 0; $i < 9; $i++) {
        $sum += $digits[$i] * (10 - $i);
    }

    $remainder = $sum % 11;

    $checkDigit = $digits[9];

    if ($remainder < 2) {
        return $checkDigit === $remainder;
    }

    return $checkDigit === (11 - $remainder);
}