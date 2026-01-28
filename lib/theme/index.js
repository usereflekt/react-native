"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeProvider = exports.DEFAULT_THEME = void 0;
exports.withOpacity = withOpacity;
exports.useTheme = useTheme;
exports.mergeTheme = mergeTheme;
const react_1 = __importStar(require("react"));
// Default theme values matching current hardcoded colors
exports.DEFAULT_THEME = {
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
function withOpacity(hexColor, opacity) {
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
const ThemeContext = (0, react_1.createContext)(exports.DEFAULT_THEME);
// Theme provider component
const ThemeProvider = ({ theme, children }) => {
    return react_1.default.createElement(ThemeContext.Provider, { value: theme }, children);
};
exports.ThemeProvider = ThemeProvider;
// Hook to access theme
function useTheme() {
    return (0, react_1.useContext)(ThemeContext);
}
// Merge partial theme with defaults (for backward compatibility)
function mergeTheme(partialTheme) {
    if (!partialTheme) {
        return exports.DEFAULT_THEME;
    }
    // Handle legacy borderRadius as single number
    let borderRadius;
    if (typeof partialTheme.borderRadius === 'number') {
        borderRadius = {
            sheet: partialTheme.borderRadius,
            button: exports.DEFAULT_THEME.borderRadius.button,
            option: exports.DEFAULT_THEME.borderRadius.option,
            input: exports.DEFAULT_THEME.borderRadius.input,
        };
    }
    else {
        borderRadius = {
            ...exports.DEFAULT_THEME.borderRadius,
            ...partialTheme.borderRadius,
        };
    }
    return {
        colors: {
            ...exports.DEFAULT_THEME.colors,
            ...partialTheme.colors,
        },
        borderRadius,
    };
}
//# sourceMappingURL=index.js.map