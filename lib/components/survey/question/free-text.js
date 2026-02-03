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
exports.default = SurveyFreeTextQuestion;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const theme_1 = require("../../../theme");
const question_styles_1 = require("../../../theme/question-styles");
function SurveyFreeTextQuestion({ question, answer, onAnswer, }) {
    const theme = (0, theme_1.useTheme)();
    const questionStyles = (0, react_1.useMemo)(() => (0, question_styles_1.createQuestionStyles)(theme), [theme]);
    const themedStyles = (0, react_1.useMemo)(() => react_native_1.StyleSheet.create({
        textInput: {
            borderWidth: 1,
            borderColor: (0, theme_1.withOpacity)(theme.colors.primary, 0.12),
            borderRadius: theme.borderRadius.input,
            padding: 12,
            fontSize: 16,
            color: theme.colors.text,
            minHeight: 100,
            textAlignVertical: "top",
        },
    }), [theme]);
    const handleFreeTextChange = (text) => {
        onAnswer({
            questionId: question.id,
            answer: text,
        });
    };
    return (<react_native_1.View style={questionStyles.questionContainer}>
      <react_native_1.Text style={questionStyles.questionLabel}>{question.label}</react_native_1.Text>
      {question.description && (<react_native_1.Text style={questionStyles.questionDescription}>{question.description}</react_native_1.Text>)}
      <react_native_1.TextInput style={themedStyles.textInput} value={typeof answer?.answer === "string" ? answer.answer : ""} onChangeText={handleFreeTextChange} placeholder="Type your answer here..." placeholderTextColor={theme.colors.textSecondary} multiline submitBehavior="blurAndSubmit" numberOfLines={4}/>
    </react_native_1.View>);
}
