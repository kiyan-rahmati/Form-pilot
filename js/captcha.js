import { t } from "./i18n.js";

const CAPTCHA_LENGTH = 5;
const CAPTCHA_EXPIRE_TIME = 30;

const CHARACTERS =
    "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

let captchaCode = "";
let refreshTimer = null;
let refreshCooldown = 0;

const canvas = document.getElementById("captchaCanvas");
const refreshButton = document.getElementById("refreshCaptcha");
const timerElement = document.getElementById("captchaTimer");
const captchaInput = document.getElementById("captchaInput");


function randomCharacter() {
    const index = Math.floor(
        Math.random() * CHARACTERS.length
    );

    return CHARACTERS[index];
}


function generateCode() {
    let code = "";

    for (let i = 0; i < CAPTCHA_LENGTH; i++) {
        code += randomCharacter();
    }

    return code;
}


function drawCaptcha() {
    if (!canvas) {
        return;
    }

    const ctx = canvas.getContext("2d");

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(
        0,
        0,
        width,
        height
    );

    /*
     * Background
     */
    ctx.fillStyle = "#f2f4f7";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    /*
     * Noise lines
     */
    for (let i = 0; i < 7; i++) {
        ctx.beginPath();

        ctx.moveTo(
            Math.random() * width,
            Math.random() * height
        );

        ctx.lineTo(
            Math.random() * width,
            Math.random() * height
        );

        ctx.strokeStyle =
            `rgba(37, 99, 235, ${0.15 + Math.random() * 0.25})`;

        ctx.lineWidth =
            1 + Math.random() * 1.5;

        ctx.stroke();
    }


    /*
     * Noise dots
     */
    for (let i = 0; i < 35; i++) {
        ctx.beginPath();

        ctx.arc(
            Math.random() * width,
            Math.random() * height,
            Math.random() * 2,
            0,
            Math.PI * 2
        );

        ctx.fillStyle =
            "rgba(16, 24, 40, 0.2)";

        ctx.fill();
    }


    /*
     * CAPTCHA characters
     */
    const characterWidth =
        width / CAPTCHA_LENGTH;

    for (let i = 0; i < captchaCode.length; i++) {
        ctx.save();

        const x =
            characterWidth * i +
            characterWidth / 2;

        const y =
            height / 2 +
            10;

        const rotation =
            (Math.random() - 0.5) * 0.45;

        ctx.translate(x, y);
        ctx.rotate(rotation);

        ctx.font =
            "bold 28px Arial";

        ctx.textAlign =
            "center";

        ctx.textBaseline =
            "middle";

        ctx.fillStyle =
            "#101828";

        ctx.fillText(
            captchaCode[i],
            0,
            0
        );

        ctx.restore();
    }
}


export function generateCaptcha() {
    captchaCode = generateCode();

    if (captchaInput) {
        captchaInput.value = "";
        captchaInput.classList.remove("invalid");
    }

    drawCaptcha();
}


function startCooldown() {
    refreshCooldown =
        CAPTCHA_EXPIRE_TIME;

    if (refreshButton) {
        refreshButton.disabled = true;
    }

    updateTimer();

    clearInterval(refreshTimer);

    refreshTimer = setInterval(() => {
        refreshCooldown--;

        updateTimer();

        if (refreshCooldown <= 0) {
            clearInterval(refreshTimer);

            refreshTimer = null;

            if (refreshButton) {
                refreshButton.disabled = false;
            }

            if (timerElement) {
                timerElement.textContent = "";
            }
        }
    }, 1000);
}


function updateTimer() {
    if (!timerElement) {
        return;
    }

    if (refreshCooldown <= 0) {
        timerElement.textContent = "";
        return;
    }

    timerElement.textContent =
        t("refreshAfter", { n: refreshCooldown });
}


export function refreshCaptcha() {
    if (refreshCooldown > 0) {
        return;
    }

    generateCaptcha();

    startCooldown();
}


export function validateCaptcha() {
    if (!captchaInput) {
        return false;
    }

    const userCode =
        captchaInput.value
            .trim()
            .toUpperCase();

    return (
        userCode.length === CAPTCHA_LENGTH &&
        userCode === captchaCode
    );
}


export function initCaptcha() {
    generateCaptcha();

    if (!refreshButton) {
        return;
    }

    refreshButton.addEventListener(
        "click",
        refreshCaptcha
    );
}