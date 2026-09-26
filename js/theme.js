const STORAGE_KEY = "formPilotTheme";

const root = document.documentElement;
const themeButton = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");


function getPreferredTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY);

    if (savedTheme === "dark" || savedTheme === "light") {
        return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}


function applyTheme(theme) {
    root.dataset.theme = theme;

    if (themeIcon) {
        themeIcon.textContent =
            theme === "dark"
                ? "☀"
                : "☾";
    }

    if (themeButton) {
        themeButton.setAttribute(
            "aria-label",
            theme === "dark"
                ? "Switch to light theme"
                : "Switch to dark theme"
        );

        themeButton.setAttribute(
            "title",
            theme === "dark"
                ? "Light Mode"
                : "Dark Mode"
        );
    }

    localStorage.setItem(
        STORAGE_KEY,
        theme
    );

    const themeMeta =
        document.querySelector(
            'meta[name="theme-color"]'
        );

    if (themeMeta) {
        themeMeta.setAttribute(
            "content",
            theme === "dark"
                ? "#080b12"
                : "#f4f6fa"
        );
    }
}


export function initTheme() {
    const initialTheme =
        getPreferredTheme();

    applyTheme(initialTheme);

    if (!themeButton) {
        return;
    }

    themeButton.addEventListener(
        "click",
        () => {
            const currentTheme =
                root.dataset.theme || "light";

            const nextTheme =
                currentTheme === "dark"
                    ? "light"
                    : "dark";

            applyTheme(nextTheme);
        }
    );
}