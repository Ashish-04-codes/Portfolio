import React, { createContext, useContext, ReactNode } from 'react';
import { useTheme } from '../hooks';

interface ThemeContextType {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

/**
 * Theme context provider for managing dark mode
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Hook to use theme context
 */
export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
};
