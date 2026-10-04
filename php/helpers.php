<?php

declare(strict_types=1);


/* -----------------------------------------
   Messages (fa / en)
----------------------------------------- */

function requestLanguage(): string
{
    return (($_POST["lang"] ?? "fa") === "en") ? "en" : "fa";
}


function msg(string $key): string
{
    static $messages = [

        "method" => [
            "fa" => "روش درخواست مجاز نیست.",
            "en" => "Method not allowed."
        ],

        "required" => [
            "fa" => "فیلدهای ضروری را کامل کنید.",
            "en" => "Please fill in all required fields."
        ],

        "tooLong" => [
            "fa" => "مقدار واردشده بیش از حد طولانی است.",
            "en" => "The value is too long."
        ],

        "nationalCode" => [
            "fa" => "کد ملی معتبر نیست.",
            "en" => "Invalid national ID."
        ],

        "phone" => [
            "fa" => "شماره تلفن معتبر نیست.",
            "en" => "Invalid phone number."
        ],

        "email" => [
            "fa" => "ایمیل معتبر نیست.",
            "en" => "Invalid email address."
        ],

        "duplicate" => [
            "fa" => "این کد ملی قبلاً ثبت شده است.",
            "en" => "This national ID is already registered."
        ],

        "imageUpload" => [
            "fa" => "آپلود تصویر ناموفق بود.",
            "en" => "Image upload failed."
        ],

        "imageSize" => [
            "fa" => "حجم تصویر نباید بیشتر از 2MB باشد.",
            "en" => "The image must be 2 MB or smaller."
        ],

        "imageType" => [
            "fa" => "فرمت تصویر مجاز نیست.",
            "en" => "This image format is not allowed."
        ],

        "imageInvalid" => [
            "fa" => "فایل انتخاب‌شده تصویر معتبر نیست.",
            "en" => "The selected file is not a valid image."
        ],

        "saveFailed" => [
            "fa" => "ذخیره اطلاعات انجام نشد. لطفاً دوباره تلاش کنید.",
            "en" => "Your information could not be saved. Please try again."
        ],

        "success" => [
            "fa" => "اطلاعات با موفقیت ثبت شد.",
            "en" => "Your information was submitted successfully."
        ],
    ];

    return $messages[$key][requestLanguage()] ?? $key;
}


/* -----------------------------------------
   JSON response
----------------------------------------- */

function respond(
    int $status,
    bool $success,
    string $message,
    array $extra = []
): never {

    http_response_code($status);

    header("Content-Type: application/json; charset=utf-8");

    echo json_encode(
        array_merge(
            [
                "success" => $success,
                "message" => $message
            ],
            $extra
        ),
        JSON_UNESCAPED_UNICODE
    );

    exit;
}


function fail(
    int $status,
    string $messageKey,
    ?string $field = null
): never {

    respond(
        $status,
        false,
        msg($messageKey),
        $field !== null ? ["field" => $field] : []
    );
}


/* -----------------------------------------
   Input helpers
----------------------------------------- */

function postValue(string $key): string
{
    return trim((string)($_POST[$key] ?? ""));
}


function normalizeDigits(string $value): string
{
    return strtr(
        $value,
        [
            "۰" => "0", "۱" => "1", "۲" => "2", "۳" => "3", "۴" => "4",
            "۵" => "5", "۶" => "6", "۷" => "7", "۸" => "8", "۹" => "9",

            "٠" => "0", "١" => "1", "٢" => "2", "٣" => "3", "٤" => "4",
            "٥" => "5", "٦" => "6", "٧" => "7", "٨" => "8", "٩" => "9"
        ]
    );
}


function isValidPhone(string $phone): bool
{
    return (bool)preg_match("/^09\d{9}$/", $phone);
}


function isValidNationalCode(string $code): bool
{
    if (!preg_match("/^\d{10}$/", $code)) {
        return false;
    }

    // Reject 0000000000, 1111111111, ...
    if (preg_match("/^(\d)\1{9}$/", $code)) {
        return false;
    }

    $sum = 0;

    for ($i = 0; $i < 9; $i++) {
        $sum += ((int)$code[$i]) * (10 - $i);
    }

    $remainder = $sum % 11;

    $checkDigit = $remainder < 2
        ? $remainder
        : 11 - $remainder;

    return (int)$code[9] === $checkDigit;
}
