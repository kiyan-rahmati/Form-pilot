const translations = {

    fa: {
        title: "فرم ثبت اطلاعات",
        subtitle: "همه‌ی فیلدها الزامی‌اند، به‌جز تصویر پروفایل.",

        sectionIdentity: "اطلاعات هویتی",
        sectionContact: "راه‌های ارتباط",
        sectionLocation: "محل سکونت",
        sectionVerify: "تصویر و تأیید",

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

        imageLabel: "تصویر پروفایل",
        imageButton: "انتخاب تصویر",
        imageChange: "تغییر تصویر",
        imageHint: "JPG، PNG یا WebP تا ۲ مگابایت",
        imageTypeError: "فقط JPG، PNG و WebP مجاز هستند.",
        imageSizeError: "حجم تصویر نباید بیشتر از 2MB باشد.",

        submit: "ثبت اطلاعات",
        submitting: "در حال ثبت...",
        refreshCaptcha: "کد جدید",

        refreshAfter: "کد جدید تا {n} ثانیه دیگر",

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

        serverError: "ارتباط با سرور برقرار نشد. اتصال اینترنت را بررسی و دوباره تلاش کنید.",

        successTitle: "اطلاعات شما ثبت شد",
        successText: "نیازی به اقدام دیگری نیست. این کد را برای پیگیری نگه دارید.",
        trackingCode: "کد پیگیری",
        newSubmission: "ثبت فرم جدید",

        previewLabel: "پیش‌نمایش زنده",
        previewHint: "با پر کردن فرم، کارت کامل می‌شود.",
        pvName: "نام و نام خانوادگی",
        pvFather: "نام پدر: {name}",
        pvFatherEmpty: "نام پدر",
        pvCode: "کد ملی",
        pvPhone: "موبایل",
        pvLocation: "استان و شهر",

        secureForm: "فرم امن و ساده"
    },

    en: {
        title: "Registration Form",
        subtitle: "All fields are required except the profile photo.",

        sectionIdentity: "Identity",
        sectionContact: "Contact",
        sectionLocation: "Location",
        sectionVerify: "Photo and verification",

        firstName: "First name",
        lastName: "Last name",
        fatherName: "Father's name",
        nationalCode: "National ID",
        phone: "Phone",
        email: "Email",
        province: "Province",
        city: "City",
        address: "Address",
        captcha: "Security code",

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

        imageLabel: "Profile photo",
        imageButton: "Choose photo",
        imageChange: "Change photo",
        imageHint: "JPG, PNG or WebP, up to 2 MB",
        imageTypeError: "Only JPG, PNG and WebP files are allowed.",
        imageSizeError: "The image must be 2 MB or smaller.",

        submit: "Submit information",
        submitting: "Submitting...",
        refreshCaptcha: "New code",

        refreshAfter: "New code available in {n} s",

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

        serverError: "Could not reach the server. Check your connection and try again.",

        successTitle: "Your information was submitted",
        successText: "Nothing else to do. Keep this code if you need to follow up.",
        trackingCode: "Tracking code",
        newSubmission: "Submit another form",

        previewLabel: "Live preview",
        previewHint: "The card fills in as you complete the form.",
        pvName: "First and last name",
        pvFather: "Father: {name}",
        pvFatherEmpty: "Father's name",
        pvCode: "National ID",
        pvPhone: "Mobile",
        pvLocation: "Province and city",

        secureForm: "Simple & secure form"
    }
};


let currentLanguage =
    localStorage.getItem("formPilotLanguage") || "fa";

if (!translations[currentLanguage]) {
    currentLanguage = "fa";
}


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

    localStorage.setItem("formPilotLanguage", currentLanguage);

    document.documentElement.lang = currentLanguage;

    document.documentElement.dir =
        currentLanguage === "fa" ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach(element => {
        const text = translations[currentLanguage][element.dataset.i18n];

        if (text) {
            element.textContent = text;
        }
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach(element => {
        const text =
            translations[currentLanguage][element.dataset.i18nPlaceholder];

        if (text) {
            element.placeholder = text;
        }
    });

    const languageButton = document.getElementById("languageToggle");

    if (languageButton) {
        languageButton.textContent =
            currentLanguage === "fa" ? "EN" : "FA";

        languageButton.setAttribute(
            "aria-label",
            currentLanguage === "fa"
                ? "Switch to English"
                : "تغییر زبان به فارسی"
        );
    }
}
