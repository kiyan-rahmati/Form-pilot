import { getLanguage, t } from "./i18n.js";

let provinces = [];
let cities = [];

let selectedProvince = null;
let selectedCity = null;

const provinceInput = document.getElementById("province");
const cityInput = document.getElementById("city");

const provinceSuggestions = document.getElementById("provinceSuggestions");
const citySuggestions = document.getElementById("citySuggestions");

const locationStatus = document.getElementById("locationStatus");

function normalize(value) {
    return String(value || "")
        .toLowerCase()
        .trim()
        .replace(/ي/g, "ی")
        .replace(/ى/g, "ی")
        .replace(/ك/g, "ک")
        .replace(/\u200c/g, "")
        .replace(/\s+/g, " ");
}

function matches(item, query) {
    if (!query) return true;

    const normalizedQuery = normalize(query);

    const fa = normalize(item.fa);
    const en = normalize(item.en);

    return (
        fa.includes(normalizedQuery) ||
        en.includes(normalizedQuery)
    );
}

function getLabel(item) {
    return getLanguage() === "fa"
        ? item.fa
        : item.en;
}

/* -----------------------------
   Load provinces & cities
----------------------------- */

export async function loadLocations() {
    if (locationStatus) {
        locationStatus.textContent = t("loadingLocations");
    }

    try {
        const [provincesResponse, citiesResponse] = await Promise.all([
            fetch("./data/provinces.json"),
            fetch("./data/cities.json")
        ]);

        if (!provincesResponse.ok) {
            throw new Error(`Provinces HTTP ${provincesResponse.status}`);
        }

        if (!citiesResponse.ok) {
            throw new Error(`Cities HTTP ${citiesResponse.status}`);
        }

        const provincesData = await provincesResponse.json();
        const citiesData = await citiesResponse.json();

        if (!Array.isArray(provincesData)) {
            throw new Error("Invalid provinces data");
        }

        if (!Array.isArray(citiesData)) {
            throw new Error("Invalid cities data");
        }

        provinces = provincesData;
        cities = citiesData;

        if (locationStatus) {
            locationStatus.textContent = t("locationsReady");
        }

        setupAutocomplete();

    } catch (error) {
        console.error("Location loading error:", error);

        if (locationStatus) {
            locationStatus.textContent = t("locationError");
        }
    }
}

/* -----------------------------
   Province suggestions
----------------------------- */

function showProvinceSuggestions() {
    if (!provinceSuggestions) return;

    const query = provinceInput?.value || "";

    const results = provinces
        .filter(province => matches(province, query))
        .slice(0, 12);

    provinceSuggestions.innerHTML = "";

    if (results.length === 0) {
        showEmptyMessage(provinceSuggestions);
        provinceSuggestions.classList.add("show");
        return;
    }

    results.forEach(province => {
        const item = document.createElement("button");

        item.type = "button";
        item.className = "autocomplete-item";

        item.textContent = getLabel(province);

        item.addEventListener("click", () => {
            selectProvince(province);
        });

        provinceSuggestions.appendChild(item);
    });

    provinceSuggestions.classList.add("show");
}

/* -----------------------------
   City suggestions
----------------------------- */

function showCitySuggestions() {
    if (!citySuggestions) return;

    if (!selectedProvince) {
        citySuggestions.classList.remove("show");
        return;
    }

    const query = cityInput?.value || "";

    const provinceCities = cities.filter(
        city => Number(city.province_id) === Number(selectedProvince.id)
    );

    const results = provinceCities
        .filter(city => matches(city, query))
        .slice(0, 12);

    citySuggestions.innerHTML = "";

    if (results.length === 0) {
        showEmptyMessage(citySuggestions);
        citySuggestions.classList.add("show");
        return;
    }

    results.forEach(city => {
        const item = document.createElement("button");

        item.type = "button";
        item.className = "autocomplete-item";

        item.textContent = getLabel(city);

        item.addEventListener("click", () => {
            selectCity(city);
        });

        citySuggestions.appendChild(item);
    });

    citySuggestions.classList.add("show");
}

/* -----------------------------
   Empty state
----------------------------- */

function showEmptyMessage(container) {
    const empty = document.createElement("div");

    empty.className = "autocomplete-empty";
    empty.textContent = t("noResults");

    container.appendChild(empty);
}

/* -----------------------------
   Select province
----------------------------- */

function selectProvince(province) {
    selectedProvince = province;
    selectedCity = null;

    if (provinceInput) {
        provinceInput.value = getLabel(province);
    }

    if (cityInput) {
        cityInput.disabled = false;
        cityInput.value = "";
        cityInput.placeholder = t("cityPlaceholder");
    }

    hideSuggestions();

    clearInvalid(provinceInput);
    clearInvalid(cityInput);
}

/* -----------------------------
   Select city
----------------------------- */

function selectCity(city) {
    selectedCity = city;

    if (cityInput) {
        cityInput.value = getLabel(city);
    }

    citySuggestions?.classList.remove("show");

    clearInvalid(cityInput);
}

/* -----------------------------
   Setup autocomplete
----------------------------- */

function setupAutocomplete() {
    if (!provinceInput || !cityInput) return;

    /* Province input */

    provinceInput.addEventListener("input", () => {
        selectedProvince = null;
        selectedCity = null;

        if (cityInput) {
            cityInput.value = "";
            cityInput.disabled = true;
            cityInput.placeholder = t("cityPlaceholder");
        }

        showProvinceSuggestions();
    });

    provinceInput.addEventListener("focus", () => {
        showProvinceSuggestions();
    });

    /* City input */

    cityInput.addEventListener("input", () => {
        selectedCity = null;

        showCitySuggestions();
    });

    cityInput.addEventListener("focus", () => {
        showCitySuggestions();
    });

    /* Close suggestions */

    document.addEventListener("click", event => {
        const target = event.target;

        if (
            !provinceInput.contains(target) &&
            !provinceSuggestions?.contains(target)
        ) {
            provinceSuggestions?.classList.remove("show");
        }

        if (
            !cityInput.contains(target) &&
            !citySuggestions?.contains(target)
        ) {
            citySuggestions?.classList.remove("show");
        }
    });
}

/* -----------------------------
   Hide suggestions
----------------------------- */

function hideSuggestions() {
    provinceSuggestions?.classList.remove("show");
    citySuggestions?.classList.remove("show");
}

/* -----------------------------
   Clear invalid state
----------------------------- */

function clearInvalid(element) {
    if (!element) return;

    element.classList.remove("invalid");

    const error = element.parentElement?.querySelector(".field-error");

    if (error) {
        error.textContent = "";
    }
}

/* -----------------------------
   Refresh labels after language
----------------------------- */

export function refreshLocationLabels() {
    if (!provinces.length) return;

    if (selectedProvince && provinceInput) {
        provinceInput.value = getLabel(selectedProvince);
    }

    if (selectedCity && cityInput) {
        cityInput.value = getLabel(selectedCity);
    }

    if (cityInput && !selectedProvince) {
        cityInput.placeholder = t("cityPlaceholder");
    }

    if (provinceSuggestions?.classList.contains("show")) {
        showProvinceSuggestions();
    }

    if (citySuggestions?.classList.contains("show")) {
        showCitySuggestions();
    }

    if (locationStatus) {
        locationStatus.textContent = t("locationsReady");
    }
}

/* -----------------------------
   Validation helpers
----------------------------- */

export function isProvinceSelected() {
    return selectedProvince !== null;
}

export function isCitySelected() {
    return selectedCity !== null;
}

/* -----------------------------
   Reset
----------------------------- */

export function resetLocations() {
    selectedProvince = null;
    selectedCity = null;

    if (provinceInput) {
        provinceInput.value = "";
    }

    if (cityInput) {
        cityInput.value = "";
        cityInput.disabled = true;
        cityInput.placeholder = t("cityPlaceholder");
    }

    hideSuggestions();
}