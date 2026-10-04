import { t } from "./i18n.js";
import {
    isProvinceSelected,
    isCitySelected
} from "./autocomplete.js";

import { validateCaptcha } from "./captcha.js";


/* ================================
   Form fields
================================ */

const fields = [
    "firstName",
    "lastName",
    "fatherName",
    "nationalCode",
    "phone",
    "email",
    "province",
    "city",
    "address"
];


/* ================================
   Get element value
================================ */

function getValue(id) {
    const element =
        document.getElementById(id);

    return element
        ? element.value.trim()
        : "";
}


/* ================================
   Normalize Persian / Arabic digits
================================ */

function normalizeDigits(value) {
    return String(value)
        .replace(/[۰-۹]/g, digit =>
            String(
                "۰۱۲۳۴۵۶۷۸۹".indexOf(digit)
            )
        )
        .replace(/[٠-٩]/g, digit =>
            String(
                "٠١٢٣٤٥٦٧٨٩".indexOf(digit)
            )
        );
}


/* ================================
   Show field error
================================ */

export function showError(id, message) {
    const input =
        document.getElementById(id);

    if (!input) {
        return;
    }

    input.classList.add(
        "invalid"
    );

    const container =
        input.parentElement;

    let error =
        container.querySelector(
            ".field-error"
        );

    if (!error) {
        error =
            document.createElement("div");

        error.className =
            "field-error";

        container.appendChild(error);
    }

    error.textContent =
        message;
}


/* ================================
   Remove field error
================================ */

function clearError(id) {
    const input =
        document.getElementById(id);

    if (!input) {
        return;
    }

    input.classList.remove(
        "invalid"
    );

    const error =
        input.parentElement?.querySelector(
            ".field-error"
        );

    if (error) {
        error.textContent = "";
    }
}


/* ================================
   Clear all errors
================================ */

function clearAllErrors() {
    fields.forEach(clearError);

    clearError("captchaInput");
}


/* ================================
   Required field
================================ */

function validateRequired() {
    let valid = true;

    fields.forEach(id => {
        const value =
            getValue(id);

        if (!value) {
            showError(
                id,
                t("required")
            );

            valid = false;
        }
    });

    return valid;
}


/* ================================
   National ID validation
================================ */

function validateNationalCode(code) {
    code =
        normalizeDigits(code)
            .replace(/\s/g, "");

    if (!/^\d{10}$/.test(code)) {
        return false;
    }

    /* Reject repeated digits */

    if (
        /^(\d)\1{9}$/.test(code)
    ) {
        return false;
    }

    const digits =
        code.split("").map(Number);

    let sum = 0;

    for (let i = 0; i < 9; i++) {
        sum +=
            digits[i] *
            (10 - i);
    }

    const remainder =
        sum % 11;

    const checkDigit =
        digits[9];

    if (remainder < 2) {
        return checkDigit === remainder;
    }

    return (
        checkDigit ===
        11 - remainder
    );
}


/* ================================
   Phone validation
================================ */

function validatePhone(phone) {
    phone =
        normalizeDigits(phone)
            .replace(/\s|-/g, "");

    return /^09\d{9}$/.test(phone);
}


/* ================================
   Email validation
================================ */

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);
}


/* ================================
   Province validation
================================ */

function validateProvince() {
    if (!isProvinceSelected()) {
        showError(
            "province",
            t("selectProvince")
        );

        return false;
    }

    return true;
}


/* ================================
   City validation
================================ */

function validateCity() {
    if (!isCitySelected()) {
        showError(
            "city",
            t("selectCity")
        );

        return false;
    }

    return true;
}


/* ================================
   Main validation
================================ */

export function validateForm() {
    clearAllErrors();

    let valid = true;


    /* Required fields */

    if (!validateRequired()) {
        valid = false;
    }


    /* Province */

    if (!validateProvince()) {
        valid = false;
    }


    /* City */

    if (!validateCity()) {
        valid = false;
    }


    /* National ID */

    const nationalCode =
        getValue("nationalCode");

    if (
        nationalCode &&
        !validateNationalCode(
            nationalCode
        )
    ) {
        showError(
            "nationalCode",
            t("invalidNationalCode")
        );

        valid = false;
    }


    /* Phone */

    const phone =
        getValue("phone");

    if (
        phone &&
        !validatePhone(phone)
    ) {
        showError(
            "phone",
            t("invalidPhone")
        );

        valid = false;
    }


    /* Email */

    const email =
        getValue("email");

    if (
        email &&
        !validateEmail(email)
    ) {
        showError(
            "email",
            t("invalidEmail")
        );

        valid = false;
    }


    /* CAPTCHA */

    if (!validateCaptcha()) {
        showError(
            "captchaInput",
            t("invalidCaptcha")
        );

        valid = false;
    }


    /* Focus first invalid field */

    if (!valid) {
        const firstInvalid =
            document.querySelector(
                ".invalid"
            );

        firstInvalid?.focus();
    }

    return valid;
}


/* ================================
   Live validation
================================ */

fields.forEach(id => {
    const input =
        document.getElementById(id);

    if (!input) {
        return;
    }

    input.addEventListener(
        "input",
        () => {
            clearError(id);
        }
    );
});


const captchaInput =
    document.getElementById(
        "captchaInput"
    );

if (captchaInput) {
    captchaInput.addEventListener(
        "input",
        () => {
            clearError(
                "captchaInput"
            );
        }
    );
}