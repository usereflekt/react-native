import { TextStyle, ViewStyle } from 'react-native';
import { Theme } from '../types';
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
export declare function createQuestionStyles(theme: Theme): QuestionStyles;
export declare function createOptionStyles(theme: Theme): OptionStyles;
//# sourceMappingURL=question-styles.d.ts.map