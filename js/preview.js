import { t } from "./i18n.js";

/* =====================================
   Live preview card
   Mirrors what the person types, so they
   can see the result before submitting.
===================================== */

const watched = [
    "firstName",
    "lastName",
    "fatherName",
    "nationalCode",
    "phone",
    "province",
    "city"
];

const el = id => document.getElementById(id);

let avatarURL = "";


function value(id) {
    return el(id)?.value.trim() ?? "";
}


function firstLetter(text) {
    return Array.from(text)[0] ?? "";
}


function setLine(id, text, placeholder) {
    const node = el(id);

    if (!node) return;

    node.textContent = text || placeholder;
    node.classList.toggle("is-empty", !text);
}


function groupCode(code) {
    // 0012345678 -> 001 234 5678
    const digits = code.replace(/\s/g, "");

    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;

    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
}


export function renderPreview() {
    const first = value("firstName");
    const last = value("lastName");
    const father = value("fatherName");

    setLine("pvName", `${first} ${last}`.trim(), t("pvName"));

    setLine(
        "pvFather",
        father ? t("pvFather", { name: father }) : "",
        t("pvFatherEmpty")
    );

    setLine("pvCode", groupCode(value("nationalCode")), "— — —");
    setLine("pvPhone", value("phone"), "09— — —");

    const city = value("city");
    const province = value("province");

    setLine(
        "pvLocation",
        [city, province].filter(Boolean).join(" · "),
        t("pvLocation")
    );

    const initials = el("pvInitials");

    if (initials) {
        initials.textContent =
            firstLetter(first) + firstLetter(last) || "FP";
    }

    const avatar = el("pvAvatar");
    const photo = el("pvPhoto");

    if (avatar && photo) {
        photo.src = avatarURL;
        photo.hidden = !avatarURL;
        avatar.classList.toggle("has-photo", Boolean(avatarURL));
    }
}


export function setPreviewPhoto(url) {
    avatarURL = url || "";
    renderPreview();
}


export function initPreview() {
    watched.forEach(id => {
        const input = el(id);

        input?.addEventListener("input", renderPreview);
        input?.addEventListener("change", renderPreview);
    });

    renderPreview();
}
