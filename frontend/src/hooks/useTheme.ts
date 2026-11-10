import {useCallback, useEffect, useState} from "react";

export type Theme = "base" | "dracula";

const THEME_STORAGE_KEY = "asty-theme";
const THEME_ATTRIBUTE = "data-theme";

const isTheme = (value: string | null | undefined): value is Theme => (
    value === "base" || value === "dracula"
);

const getInitialTheme = (): Theme => {
    if (typeof document === "undefined") {
        return "base";
    }

    const documentTheme = document.documentElement.getAttribute(THEME_ATTRIBUTE);

    if (isTheme(documentTheme)) {
        return documentTheme;
    }

    try {
        const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

        if (isTheme(storedTheme)) {
            return storedTheme;
        }
    } catch {
        // Storage can be unavailable in private or restricted contexts.
    }

    return "base";
};

/**
 * Applies the selected theme to the document root so the whole stylesheet can
 * react through CSS custom properties. The choice survives reloads.
 */
export const useTheme = () => {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);

        const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
        themeColor?.setAttribute("content", theme === "dracula" ? "#282a36" : "#fbf7fb");

        try {
            window.localStorage.setItem(THEME_STORAGE_KEY, theme);
        } catch {
            // Persisting the preference is optional.
        }
    }, [theme]);

    const selectTheme = useCallback((nextTheme: Theme) => {
        setTheme(nextTheme);
    }, []);

    return {
        theme,
        setTheme: selectTheme,
    };
};
