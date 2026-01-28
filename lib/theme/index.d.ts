import React from 'react';
import { Theme } from '../types';
export declare const DEFAULT_THEME: Theme;
export declare function withOpacity(hexColor: string, opacity: number): string;
interface ThemeProviderProps {
    theme: Theme;
    children: React.ReactNode;
}
export declare const ThemeProvider: React.FC<ThemeProviderProps>;
export declare function useTheme(): Theme;
export declare function mergeTheme(partialTheme?: Partial<Theme> & {
    borderRadius?: number | Theme['borderRadius'];
}): Theme;
export {};
//# sourceMappingURL=index.d.ts.map