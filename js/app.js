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

import { validateForm } from "./validation.js";

import { initTheme } from "./theme.js";


const form = document.getElementById("registerForm");

const languageButton = document.getElementById("languageToggle");

const successMessage = document.getElementById("successMessage");


/* -----------------------------
   Initial setup
----------------------------- */

setLanguage(getLanguage());

initTheme();

initCaptcha();

loadLocations();


/* -----------------------------
   Language switch
----------------------------- */

if (languageButton) {

    languageButton.addEventListener("click", () => {

        const currentLanguage = getLanguage();

        const nextLanguage =
            currentLanguage === "fa"
                ? "en"
                : "fa";

        setLanguage(nextLanguage);

        refreshLocationLabels();

    });

}


/* -----------------------------
   Form submit
----------------------------- */

if (form) {

    form.addEventListener("submit", event => {

        event.preventDefault();

        if (successMessage) {
            successMessage.textContent = "";
        }

        const isValid = validateForm();

        if (!isValid) {
            return;
        }


        /* -------------------------
           Temporary frontend submit
           PHP connection can be added
           later.
        ------------------------- */

        if (successMessage) {
            successMessage.textContent = t("success");
        }


        form.reset();

        resetLocations();

        generateCaptcha();

    });

}