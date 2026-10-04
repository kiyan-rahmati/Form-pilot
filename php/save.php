<?php

declare(strict_types=1);

require_once __DIR__ . "/helpers.php";
require_once __DIR__ . "/storage.php";

$config = require __DIR__ . "/config.php";


/* -----------------------------------------
   Request method
----------------------------------------- */

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    fail(405, "method");
}


/* -----------------------------------------
   Read & normalize input
----------------------------------------- */

$input = [
    "firstName"    => postValue("firstName"),
    "lastName"     => postValue("lastName"),
    "fatherName"   => postValue("fatherName"),
    "nationalCode" => normalizeDigits(postValue("nationalCode")),
    "phone"        => preg_replace("/[\s\-]/", "", normalizeDigits(postValue("phone"))),
    "email"        => postValue("email"),
    "province"     => postValue("province"),
    "city"         => postValue("city"),
    "address"      => postValue("address"),
];


foreach ($input as $field => $value) {

    if ($value === "") {
        fail(422, "required", $field);
    }
}


/* -----------------------------------------
   Validation
----------------------------------------- */

$maxLength = [
    "firstName"  => 100,
    "lastName"   => 100,
    "fatherName" => 100,
    "email"      => 190,
    "province"   => 100,
    "city"       => 100,
    "address"    => 1000,
];

foreach ($maxLength as $field => $limit) {

    if (mb_strlen($input[$field]) > $limit) {
        fail(422, "tooLong", $field);
    }
}

if (!isValidNationalCode($input["nationalCode"])) {
    fail(422, "nationalCode", "nationalCode");
}

if (!isValidPhone($input["phone"])) {
    fail(422, "phone", "phone");
}

if (!filter_var($input["email"], FILTER_VALIDATE_EMAIL)) {
    fail(422, "email", "email");
}


/* -----------------------------------------
   Profile image (optional)
----------------------------------------- */

$imageName = null;
$imagePath = null;

if (
    isset($_FILES["profileImage"]) &&
    $_FILES["profileImage"]["error"] !== UPLOAD_ERR_NO_FILE
) {

    $file = $_FILES["profileImage"];

    if (
        $file["error"] === UPLOAD_ERR_INI_SIZE ||
        $file["error"] === UPLOAD_ERR_FORM_SIZE
    ) {
        fail(422, "imageSize", "profileImage");
    }

    if ($file["error"] !== UPLOAD_ERR_OK) {
        fail(400, "imageUpload", "profileImage");
    }

    if ($file["size"] > $config["max_image_bytes"]) {
        fail(422, "imageSize", "profileImage");
    }

    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file["tmp_name"]);

    $allowedTypes = [
        "image/jpeg" => "jpg",
        "image/png"  => "png",
        "image/webp" => "webp",
    ];

    if (!isset($allowedTypes[$mime])) {
        fail(422, "imageType", "profileImage");
    }

    if (@getimagesize($file["tmp_name"]) === false) {
        fail(422, "imageInvalid", "profileImage");
    }

    $uploadDirectory = $config["paths"]["uploads"];

    if (
        !is_dir($uploadDirectory) &&
        !mkdir($uploadDirectory, 0755, true) &&
        !is_dir($uploadDirectory)
    ) {
        fail(500, "saveFailed");
    }

    $imageName = bin2hex(random_bytes(16)) . "." . $allowedTypes[$mime];
    $imagePath = $uploadDirectory . "/" . $imageName;

    if (!move_uploaded_file($file["tmp_name"], $imagePath)) {
        fail(500, "saveFailed");
    }
}


/* -----------------------------------------
   Save (MySQL, or JSON file when the DB is down)
----------------------------------------- */

$record = [
    "id"           => bin2hex(random_bytes(8)),
    "created_at"   => date("c"),
    "firstName"    => $input["firstName"],
    "lastName"     => $input["lastName"],
    "fatherName"   => $input["fatherName"],
    "nationalCode" => $input["nationalCode"],
    "phone"        => $input["phone"],
    "email"        => $input["email"],
    "province"     => $input["province"],
    "city"         => $input["city"],
    "address"      => $input["address"],
    "image"        => $imageName,
];


try {

    $storedIn = saveSubmission($config, $record);

} catch (DuplicateNationalCode $e) {

    // Don't keep an image that belongs to a rejected submission.
    if ($imagePath !== null) {
        @unlink($imagePath);
    }

    fail(409, "duplicate", "nationalCode");

} catch (Throwable $e) {

    error_log("Form Pilot: could not save submission - " . $e->getMessage());

    if ($imagePath !== null) {
        @unlink($imagePath);
    }

    fail(500, "saveFailed");
}


respond(
    200,
    true,
    msg("success"),
    [
        "data" => [
            "id"      => $record["id"],
            "storage" => $storedIn
        ]
    ]
);
