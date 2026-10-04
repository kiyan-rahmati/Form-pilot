import { getLanguage, setLanguage, t } from "./i18n.js";

import {
    loadLocations,
    refreshLocationLabels,
    resetLocations
} from "./autocomplete.js";

import {
    initCaptcha,
    generateCaptcha
} from "./captcha.js";

import { validateForm, showError } from "./validation.js";

import { initTheme } from "./theme.js";

import {
    initPreview,
    renderPreview,
    setPreviewPhoto
} from "./preview.js";


/* =====================================
   Elements
===================================== */

const form = document.getElementById("registerForm");
const formView = document.getElementById("formView");
const successView = document.getElementById("successView");

const submitButton = form.querySelector(".submit-button");
const submitLabel = submitButton.querySelector("[data-i18n]");

const formAlert = document.getElementById("formAlert");
const trackingCode = document.getElementById("trackingCode");
const newSubmissionButton = document.getElementById("newSubmission");

const languageButton = document.getElementById("languageToggle");

const imageInput = document.getElementById("profileImage");
const imageUploadButton = document.getElementById("imageUploadButton");
const imageUploadStatus = document.getElementById("imageUploadStatus");
const imageThumb = document.getElementById("imagePreview");


/* =====================================
   Profile image
===================================== */

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp"
];

let imageURL = "";
let imageErrorKey = "";


function releaseImageURL() {
    if (imageURL) {
        URL.revokeObjectURL(imageURL);
        imageURL = "";
    }
}


function renderImageStatus() {
    const file = imageInput.files[0];

    imageUploadStatus.classList.toggle("is-error", Boolean(imageErrorKey));

    if (imageErrorKey) {
        imageUploadStatus.textContent = t(imageErrorKey);
    } else if (file) {
        imageUploadStatus.textContent =
            `${file.name} • ${(file.size / 1024 / 1024).toFixed(2)} MB`;
    } else {
        imageUploadStatus.textContent = t("imageHint");
    }

    imageUploadButton.textContent =
        t(file ? "imageChange" : "imageButton");
}


function resetImageUpload() {
    imageInput.value = "";
    imageErrorKey = "";

    releaseImageURL();

    imageThumb.removeAttribute("src");
    imageThumb.hidden = true;

    setPreviewPhoto("");
    renderImageStatus();
}


imageUploadButton.addEventListener("click", () => imageInput.click());

imageInput.addEventListener("change", () => {

    const file = imageInput.files[0];

    if (!file) {
        resetImageUpload();
        return;
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        resetImageUpload();
        imageErrorKey = "imageTypeError";
        renderImageStatus();
        return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
        resetImageUpload();
        imageErrorKey = "imageSizeError";
        renderImageStatus();
        return;
    }

    imageErrorKey = "";

    releaseImageURL();
    imageURL = URL.createObjectURL(file);

    imageThumb.src = imageURL;
    imageThumb.hidden = false;

    setPreviewPhoto(imageURL);
    renderImageStatus();
});


/* =====================================
   Initial setup
===================================== */

setLanguage(getLanguage());
renderImageStatus();

initTheme();
initCaptcha();
initPreview();
loadLocations();


/* =====================================
   Language switch
===================================== */

languageButton.addEventListener("click", () => {

    setLanguage(getLanguage() === "fa" ? "en" : "fa");

    refreshLocationLabels();
    renderImageStatus();
    renderPreview();
});


/* =====================================
   Form state helpers
===================================== */

function showAlert(message) {
    formAlert.textContent = message;
    formAlert.hidden = !message;
}


function setSubmitting(isSubmitting) {
    submitButton.disabled = isSubmitting;
    submitButton.classList.toggle("is-loading", isSubmitting);

    submitLabel.dataset.i18n = isSubmitting ? "submitting" : "submit";
    submitLabel.textContent = t(isSubmitting ? "submitting" : "submit");
}


function showSuccess(id) {
    trackingCode.textContent = id ? id.toUpperCase() : "";

    formView.hidden = true;
    successView.hidden = false;

    successView.querySelector("h2").focus();
}


function resetForm() {
    form.reset();

    resetImageUpload();
    resetLocations();
    generateCaptcha();
    renderPreview();

    showAlert("");

    successView.hidden = true;
    formView.hidden = false;

    document.getElementById("firstName").focus();
}


newSubmissionButton.addEventListener("click", resetForm);


/* =====================================
   Submit (AJAX)
===================================== */

form.addEventListener("submit", async event => {

    event.preventDefault();

    showAlert("");

    if (!validateForm()) {
        return;
    }

    setSubmitting(true);

    try {

        const formData = new FormData(form);

        // Lets the server answer in the language of the page.
        formData.append("lang", getLanguage());

        const response = await fetch("./php/save.php", {
            method: "POST",
            body: formData
        });

        let result;

        try {
            result = await response.json();
        } catch {
            throw new Error(t("serverError"));
        }

        if (!response.ok || !result.success) {

            // Point at the field the server rejected, if it named one.
            const field = result.field && document.getElementById(result.field);

            if (field) {
                showError(result.field, result.message);
                field.focus();
            } else {
                showAlert(result.message || t("serverError"));
            }

            return;
        }

        showSuccess(result.data?.id);

    } catch (error) {

        console.error(error);

        showAlert(
            error instanceof TypeError
                ? t("serverError")
                : error.message || t("serverError")
        );

    } finally {

        setSubmitting(false);
    }
});
