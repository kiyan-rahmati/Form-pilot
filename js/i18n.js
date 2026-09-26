const translations = {
    fa: {
        title: "فرم ثبت اطلاعات",
        subtitle: "اطلاعات خود را با دقت وارد کنید",

        firstName: "نام",
        lastName: "نام خانوادگی",
        fatherName: "نام پدر",
        nationalCode: "کد ملی",
        phone: "تلفن همراه",
        email: "ایمیل",
        province: "استان",
        city: "شهر",
        address: "آدرس",
        captcha: "کد امنیتی",

        firstNamePlaceholder: "نام خود را وارد کنید",
        lastNamePlaceholder: "نام خانوادگی",
        fatherNamePlaceholder: "نام پدر",
        nationalCodePlaceholder: "۱۰ رقم",
        phonePlaceholder: "09123456789",
        emailPlaceholder: "example@email.com",
        provincePlaceholder: "استان را جستجو کنید",
        cityPlaceholder: "ابتدا استان را انتخاب کنید",
        addressPlaceholder: "آدرس کامل خود را وارد کنید",
        captchaPlaceholder: "کد تصویر را وارد کنید",

        submit: "ثبت اطلاعات",

        refreshAfter: "تازه‌سازی مجدد تا {n} ثانیه دیگر",

        required: "این فیلد الزامی است",
        invalidNationalCode: "کد ملی معتبر نیست",
        invalidPhone: "شماره تلفن معتبر نیست",
        invalidEmail: "ایمیل معتبر نیست",

        selectProvince: "استان را از لیست انتخاب کنید",
        selectCity: "شهر را از لیست انتخاب کنید",

        invalidCaptcha: "کد امنیتی صحیح نیست",

        loadingLocations: "در حال بارگذاری استان‌ها و شهرها...",
        locationsReady: "استان‌ها و شهرها آماده هستند",
        locationError: "بارگذاری اطلاعات شهرها انجام نشد",

        noResults: "موردی پیدا نشد",

        success: "اطلاعات با موفقیت ثبت شد ✓",

        secureForm: "فرم امن و ساده"
    },

    en: {
        title: "Registration Form",
        subtitle: "Please enter your information carefully",

        firstName: "First Name",
        lastName: "Last Name",
        fatherName: "Father's Name",
        nationalCode: "National ID",
        phone: "Phone",
        email: "Email",
        province: "Province",
        city: "City",
        address: "Address",
        captcha: "Security Code",

        firstNamePlaceholder: "Enter your first name",
        lastNamePlaceholder: "Enter your last name",
        fatherNamePlaceholder: "Enter father's name",
        nationalCodePlaceholder: "10 digits",
        phonePlaceholder: "09123456789",
        emailPlaceholder: "example@email.com",
        provincePlaceholder: "Search province",
        cityPlaceholder: "Select a province first",
        addressPlaceholder: "Enter your full address",
        captchaPlaceholder: "Enter the code",

        submit: "Submit",

        refreshAfter: "Refresh available in {n} seconds",

        required: "This field is required",
        invalidNationalCode: "Invalid national ID",
        invalidPhone: "Invalid phone number",
        invalidEmail: "Invalid email address",

        selectProvince: "Select a province from the list",
        selectCity: "Select a city from the list",

        invalidCaptcha: "Invalid security code",

        loadingLocations: "Loading provinces and cities...",
        locationsReady: "Provinces and cities are ready",
        locationError: "Could not load location data",

        noResults: "No results found",

        success: "Information submitted successfully ✓",

        secureForm: "Simple & secure form"
    }
};


let currentLanguage =
    localStorage.getItem("formPilotLanguage") || "fa";


export function t(key, values = {}) {
    let text = translations[currentLanguage]?.[key] ?? key;

    Object.entries(values).forEach(([name, value]) => {
        text = text.replace(
            new RegExp(`\\{${name}\\}`, "g"),
            value
        );
    });

    return text;
}


export function getLanguage() {
    return currentLanguage;
}


export function setLanguage(language) {
    if (!translations[language]) {
        return;
    }

    currentLanguage = language;

    localStorage.setItem(
        "formPilotLanguage",
        currentLanguage
    );

    document.documentElement.lang = currentLanguage;

    document.documentElement.dir =
        currentLanguage === "fa"
            ? "rtl"
            : "ltr";

    document
        .querySelectorAll("[data-i18n]")
        .forEach(element => {
            const key = element.dataset.i18n;

            if (translations[currentLanguage][key]) {
                element.textContent =
                    translations[currentLanguage][key];
            }
        });

    document
        .querySelectorAll("[data-i18n-placeholder]")
        .forEach(element => {
            const key =
                element.dataset.i18nPlaceholder;

            if (translations[currentLanguage][key]) {
                element.placeholder =
                    translations[currentLanguage][key];
            }
        });

    const languageButton =
        document.getElementById("languageToggle");

    if (languageButton) {
        languageButton.textContent =
            currentLanguage === "fa"
                ? "EN"
                : "FA";
    }
}