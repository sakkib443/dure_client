import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ThemeConfig {
    // Colors
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    backgroundColor: string;
    surfaceColor: string;
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    successColor: string;
    warningColor: string;
    errorColor: string;

    // Typography
    fontFamily: string;
    headingFont: string;

    // Mode
    darkMode: boolean;
}

const defaultTheme: ThemeConfig = {
    primaryColor: '#800000',
    secondaryColor: '#E4525C',
    accentColor: '#FF6B6B',
    backgroundColor: '#E3DEDB',
    surfaceColor: '#E3DEDB',
    textPrimary: '#000000',
    textSecondary: '#111111',
    textMuted: '#444444',
    successColor: '#22C55E',
    warningColor: '#F59E0B',
    errorColor: '#EF4444',
    fontFamily: "'Roboto', sans-serif",
    headingFont: "'Roboto', sans-serif",
    darkMode: false,
};

interface ThemeState {
    config: ThemeConfig;
    isLoading: boolean;
}

const initialState: ThemeState = {
    config: defaultTheme,
    isLoading: false,
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        updateTheme: (state, action: PayloadAction<Partial<ThemeConfig>>) => {
            state.config = { ...state.config, ...action.payload };
        },

        resetTheme: (state) => {
            state.config = defaultTheme;
        },

        toggleDarkMode: (state) => {
            state.config.darkMode = !state.config.darkMode;

            if (state.config.darkMode) {
                state.config.backgroundColor = '#0F172A';
                state.config.surfaceColor = '#1E293B';
                state.config.textPrimary = '#F8FAFC';
                state.config.textSecondary = '#CBD5E1';
                state.config.textMuted = '#64748B';
            } else {
                state.config.backgroundColor = '#E3DEDB';
                state.config.surfaceColor = '#E3DEDB';
                state.config.textPrimary = '#000000';
                state.config.textSecondary = '#111111';
                state.config.textMuted = '#444444';
            }
        },

        setThemeFromAPI: (state, action: PayloadAction<Partial<ThemeConfig>>) => {
            state.config = { ...defaultTheme, ...action.payload };
            state.isLoading = false;
        },

        setThemeLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
    },
});

export const {
    updateTheme,
    resetTheme,
    toggleDarkMode,
    setThemeFromAPI,
    setThemeLoading
} = themeSlice.actions;

export { defaultTheme };
export default themeSlice.reducer;
