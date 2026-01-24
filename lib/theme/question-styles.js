"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuestionStyles = createQuestionStyles;
exports.createOptionStyles = createOptionStyles;
const react_native_1 = require("react-native");
const index_1 = require("./index");
// Generate common question styles from theme
function createQuestionStyles(theme) {
    return react_native_1.StyleSheet.create({
        questionContainer: {
            gap: 16,
        },
        questionLabel: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text,
            lineHeight: 24,
        },
        questionDescription: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            lineHeight: 20,
            marginTop: -8,
        },
    });
}
// Generate option styles for single-select and multi-select
function createOptionStyles(theme) {
    return react_native_1.StyleSheet.create({
        optionsContainer: {
            gap: 8,
        },
        option: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 14,
            borderRadius: theme.borderRadius.option,
            borderWidth: 1,
            borderColor: (0, index_1.withOpacity)(theme.colors.primary, 0.12),
            backgroundColor: theme.colors.background,
            gap: 12,
        },
        optionSelected: {
            borderColor: theme.colors.primary,
            backgroundColor: (0, index_1.withOpacity)(theme.colors.primary, 0.02),
        },
        optionText: {
            fontSize: 16,
            color: theme.colors.text,
            flex: 1,
        },
        optionTextSelected: {
            fontWeight: '500',
        },
        otherInput: {
            borderWidth: 1,
            borderColor: (0, index_1.withOpacity)(theme.colors.primary, 0.12),
            borderRadius: theme.borderRadius.option,
            padding: 12,
            fontSize: 16,
            color: theme.colors.text,
            marginTop: 8,
        },
    });
}
