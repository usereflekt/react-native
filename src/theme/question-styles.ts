import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Theme } from '../types';
import { withOpacity } from './index';

export interface QuestionStyles {
  questionContainer: ViewStyle;
  questionLabel: TextStyle;
  questionDescription: TextStyle;
}

export interface OptionStyles {
  optionsContainer: ViewStyle;
  option: ViewStyle;
  optionSelected: ViewStyle;
  optionText: TextStyle;
  optionTextSelected: TextStyle;
  otherInput: TextStyle;
}

// Generate common question styles from theme
export function createQuestionStyles(theme: Theme): QuestionStyles {
  return StyleSheet.create({
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
export function createOptionStyles(theme: Theme): OptionStyles {
  return StyleSheet.create({
    optionsContainer: {
      gap: 8,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      borderRadius: theme.borderRadius.option,
      borderWidth: 1,
      borderColor: withOpacity(theme.colors.primary, 0.12),
      backgroundColor: theme.colors.background,
      gap: 12,
    },
    optionSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: withOpacity(theme.colors.primary, 0.02),
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
      borderColor: withOpacity(theme.colors.primary, 0.12),
      borderRadius: theme.borderRadius.option,
      padding: 12,
      fontSize: 16,
      color: theme.colors.text,
      marginTop: 8,
    },
  });
}
