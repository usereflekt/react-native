import React, { createContext, useContext } from 'react';
import { Theme } from '../types';

// Default theme values matching current hardcoded colors
export const DEFAULT_THEME: Theme = {
  colors: {
    background: '#ffffff',
    text: '#171717',
    textSecondary: '#8e8e93',
    primary: '#171717',
    primaryForeground: '#f6f6f6',
  },
  borderRadius: {
    sheet: 24,
    button: 12,
    option: 12,
    input: 12,
  },
};

// Convert hex color to rgba with opacity
export function withOpacity(hexColor: string, opacity: number): string {
  // Handle hex colors
  if (hexColor.startsWith('#')) {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  // If already rgba, try to modify opacity
  if (hexColor.startsWith('rgba')) {
    return hexColor.replace(/[\d.]+\)$/, `${opacity})`);
  }
  
  // If rgb, convert to rgba
  if (hexColor.startsWith('rgb(')) {
    return hexColor.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
  }
  
  return hexColor;
}

// Theme context
const ThemeContext = createContext<Theme>(DEFAULT_THEME);

// Theme provider props
interface ThemeProviderProps {
  theme: Theme;
  children: React.ReactNode;
}

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ theme, children }) => {
  return React.createElement(ThemeContext.Provider, { value: theme }, children);
};

// Hook to access theme
export function useTheme(): Theme {
  return useContext(ThemeContext);
}

// Merge partial theme with defaults (for backward compatibility)
export function mergeTheme(partialTheme?: Partial<Theme> & { borderRadius?: number | Theme['borderRadius'] }): Theme {
  if (!partialTheme) {
    return DEFAULT_THEME;
  }

  // Handle legacy borderRadius as single number
  let borderRadius: Theme['borderRadius'];
  if (typeof partialTheme.borderRadius === 'number') {
    borderRadius = {
      sheet: partialTheme.borderRadius,
      button: DEFAULT_THEME.borderRadius.button,
      option: DEFAULT_THEME.borderRadius.option,
      input: DEFAULT_THEME.borderRadius.input,
    };
  } else {
    borderRadius = {
      ...DEFAULT_THEME.borderRadius,
      ...partialTheme.borderRadius,
    };
  }

  return {
    colors: {
      ...DEFAULT_THEME.colors,
      ...partialTheme.colors,
    },
    borderRadius,
  };
}
