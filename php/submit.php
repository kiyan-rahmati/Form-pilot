<?php

declare(strict_types=1);

require_once __DIR__ . "/config.php";
require_once __DIR__ . "/helpers.php";


/*
|--------------------------------------------------------------------------
| Only POST requests are allowed
|--------------------------------------------------------------------------
*/

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    http_response_code(405);

    jsonResponse(
        false,
        "Invalid request method."
    );
}


/*
|--------------------------------------------------------------------------
| Receive form data
|--------------------------------------------------------------------------
*/

$firstName = postValue("firstName");
$lastName = postValue("lastName");
$fatherName = postValue("fatherName");

$nationalCode = normalizeDigits(
    postValue("nationalCode")
);

$phone = normalizeDigits(
    postValue("phone")
);

$email = postValue("email");

$province = postValue("province");
$city = postValue("city");

$address = postValue("address");


/*
|--------------------------------------------------------------------------
| Required fields
|--------------------------------------------------------------------------
*/

$requiredFields = [
    "firstName" => $firstName,
    "lastName" => $lastName,
    "fatherName" => $fatherName,
    "nationalCode" => $nationalCode,
    "phone" => $phone,
    "email" => $email,
    "province" => $province,
    "city" => $city,
    "address" => $address
];


foreach ($requiredFields as $field => $value) {

    if ($value === "") {

        http_response_code(422);

        jsonResponse(
            false,
            "Please fill in all required fields.",
            [
                "field" => $field
            ]
        );
    }
}


/*
|--------------------------------------------------------------------------
| National code validation
|--------------------------------------------------------------------------
*/

if (!isValidNationalCode($nationalCode)) {

    http_response_code(422);

    jsonResponse(
        false,
        "Invalid national ID."
    );
}


/*
|--------------------------------------------------------------------------
| Phone validation
|--------------------------------------------------------------------------
*/

if (!isValidPhone($phone)) {

    http_response_code(422);

    jsonResponse(
        false,
        "Invalid phone number."
    );
}


/*
|--------------------------------------------------------------------------
| Email validation
|--------------------------------------------------------------------------
*/

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

    http_response_code(422);

    jsonResponse(
        false,
        "Invalid email address."
    );
}


/*
|--------------------------------------------------------------------------
| Insert into database
|--------------------------------------------------------------------------
*/

try {

    $sql = "
        INSERT INTO users (
            first_name,
            last_name,
            father_name,
            national_code,
            phone,
            email,
            province,
            city,
            address
        )

        VALUES (
            :first_name,
            :last_name,
            :father_name,
            :national_code,
            :phone,
            :email,
            :province,
            :city,
            :address
        )
    ";

    $statement = $pdo->prepare($sql);

    $statement->execute([
        ":first_name" => $firstName,
        ":last_name" => $lastName,
        ":father_name" => $fatherName,
        ":national_code" => $nationalCode,
        ":phone" => $phone,
        ":email" => $email,
        ":province" => $province,
        ":city" => $city,
        ":address" => $address
    ]);


    /*
    |--------------------------------------------------------------------------
    | Success
    |--------------------------------------------------------------------------
    */

    jsonResponse(
        true,
        "Information submitted successfully."
    );


} catch (PDOException $e) {

    /*
    |--------------------------------------------------------------------------
    | Duplicate national code
    |--------------------------------------------------------------------------
    */

    if ($e->getCode() === "23000") {

        http_response_code(409);

        jsonResponse(
            false,
            "This national ID is already registered."
        );
    }


    /*
    |--------------------------------------------------------------------------
    | General database error
    |--------------------------------------------------------------------------
    */

    error_log(
        "Form Pilot Database Error: " . $e->getMessage()
    );

    http_response_code(500);

    jsonResponse(
        false,
        "Could not save the information."
    );
}