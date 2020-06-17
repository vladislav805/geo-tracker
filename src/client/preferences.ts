const KEY_DARK_THEME = 'dark_theme';

export const isDarkTheme = (): boolean => localStorage.getItem(KEY_DARK_THEME) === 'true' ?? window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;

export const toggleDarkTheme = (state: boolean): void => {
    localStorage.setItem(KEY_DARK_THEME, String(state));

    applyDarkTheme();
};


const applyDarkTheme = (): void => {
    document.body.classList.toggle('theme__dark', isDarkTheme());
};

export const initPreferences = (): void => {
    applyDarkTheme();
};
