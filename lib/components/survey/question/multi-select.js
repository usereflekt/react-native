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
exports.default = SurveyMultiSelectQuestion;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_svg_1 = __importStar(require("react-native-svg"));
const theme_1 = require("../../../theme");
const question_styles_1 = require("../../../theme/question-styles");
function SurveyMultiSelectQuestion({ question, answer, onAnswer, }) {
    const theme = (0, theme_1.useTheme)();
    const questionStyles = (0, react_1.useMemo)(() => (0, question_styles_1.createQuestionStyles)(theme), [theme]);
    const optionStyles = (0, react_1.useMemo)(() => (0, question_styles_1.createOptionStyles)(theme), [theme]);
    const [otherText, setOtherText] = (0, react_1.useState)(answer?.otherText ?? "");
    const themedStyles = (0, react_1.useMemo)(() => react_native_1.StyleSheet.create({
        checkbox: {
            width: 24,
            height: 24,
            borderRadius: 6,
            borderWidth: 2,
            borderColor: theme.colors.textSecondary,
            alignItems: "center",
            justifyContent: "center",
        },
        checkboxSelected: {
            borderColor: theme.colors.primary,
            backgroundColor: theme.colors.primary,
        },
    }), [theme]);
    const handleMultiSelect = (optionId) => {
        const currentAnswers = Array.isArray(answer?.answer) ? answer.answer : [];
        const newAnswers = currentAnswers.includes(optionId)
            ? currentAnswers.filter((id) => id !== optionId)
            : [...currentAnswers, optionId];
        onAnswer({
            questionId: question.id,
            answer: newAnswers,
            otherText,
        });
    };
    const handleOtherSelect = () => {
        const currentAnswers = Array.isArray(answer?.answer) ? answer.answer : [];
        const withoutOther = currentAnswers.filter((id) => id !== "other");
        const newAnswers = currentAnswers.includes("other") ? withoutOther : [...withoutOther, "other"];
        onAnswer({
            questionId: question.id,
            answer: newAnswers,
            otherText: otherText,
        });
    };
    const options = question.selectConfig?.options || [];
    const allowOther = question.selectConfig?.allowOther || false;
    const currentAnswers = Array.isArray(answer?.answer) ? answer.answer : [];
    function CheckBoxOption({ onPress, label, isSelected }) {
        return (<react_native_1.TouchableOpacity onPress={onPress} style={[optionStyles.option, isSelected && optionStyles.optionSelected]}>
        <react_native_1.View style={[
                themedStyles.checkbox,
                isSelected && themedStyles.checkboxSelected,
            ]}>
          {isSelected && (<react_native_svg_1.default width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={theme.colors.primaryForeground} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <react_native_svg_1.Path d="M20 6 9 17l-5-5"/>
            </react_native_svg_1.default>)}
        </react_native_1.View>
        <react_native_1.Text style={[optionStyles.optionText, isSelected && optionStyles.optionTextSelected]}>
          {label}
        </react_native_1.Text>
      </react_native_1.TouchableOpacity>);
    }
    return (<react_native_1.View style={questionStyles.questionContainer}>
      <react_native_1.Text style={questionStyles.questionLabel}>{question.label}</react_native_1.Text>
      {question.description && (<react_native_1.Text style={questionStyles.questionDescription}>{question.description}</react_native_1.Text>)}
      <react_native_1.View style={optionStyles.optionsContainer}>
        {options.map((option) => <CheckBoxOption key={option.id} onPress={() => handleMultiSelect(option.id)} label={option.label} isSelected={currentAnswers.includes(option.id)}/>)}
        {allowOther && (<react_native_1.View>
            <CheckBoxOption onPress={handleOtherSelect} label="Other" isSelected={currentAnswers.includes("other")}/>
            {currentAnswers.includes("other") && (<react_native_1.TextInput style={optionStyles.otherInput} value={otherText} onChangeText={(text) => {
                    setOtherText(text);
                    const current = Array.isArray(answer?.answer) && answer.answer ? answer.answer : [];
                    onAnswer({
                        questionId: question.id,
                        answer: current,
                        otherText: text,
                    });
                }} placeholder="Please specify..." placeholderTextColor={theme.colors.textSecondary}/>)}
          </react_native_1.View>)}
      </react_native_1.View>
    </react_native_1.View>);
}
//# sourceMappingURL=multi-select.js.map