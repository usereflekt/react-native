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
exports.default = SurveySingleSelectQuestion;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const theme_1 = require("../../../theme");
const question_styles_1 = require("../../../theme/question-styles");
function SurveySingleSelectQuestion({ question, answer, onAnswer, }) {
    const theme = (0, theme_1.useTheme)();
    const questionStyles = (0, react_1.useMemo)(() => (0, question_styles_1.createQuestionStyles)(theme), [theme]);
    const optionStyles = (0, react_1.useMemo)(() => (0, question_styles_1.createOptionStyles)(theme), [theme]);
    const [otherText, setOtherText] = (0, react_1.useState)(answer?.otherText ?? "");
    const themedStyles = (0, react_1.useMemo)(() => react_native_1.StyleSheet.create({
        radio: {
            width: 16,
            height: 16,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: theme.colors.textSecondary,
            alignItems: "center",
            justifyContent: "center",
        },
        radioInner: {
            width: 16,
            height: 16,
            borderRadius: 10,
            backgroundColor: theme.colors.primary,
        },
    }), [theme]);
    const handleSingleSelect = (optionId) => {
        const current = answer?.answer;
        if (current === optionId) {
            onAnswer({
                questionId: question.id,
                answer: "",
            });
        }
        else {
            onAnswer({
                questionId: question.id,
                answer: optionId,
            });
        }
    };
    const handleOtherSelect = () => {
        const current = answer?.answer;
        if (current === "other") {
            onAnswer({
                questionId: question.id,
                answer: "",
            });
            return;
        }
        onAnswer({
            questionId: question.id,
            answer: "other",
            otherText: otherText,
        });
    };
    const options = question.selectConfig?.options || [];
    const allowOther = question.selectConfig?.allowOther || false;
    return (<react_native_1.View style={questionStyles.questionContainer}>
      <react_native_1.Text style={questionStyles.questionLabel}>{question.label}</react_native_1.Text>
      {question.description && (<react_native_1.Text style={questionStyles.questionDescription}>{question.description}</react_native_1.Text>)}
      <react_native_1.View style={optionStyles.optionsContainer}>
        {options.map((option) => {
            const isSelected = answer?.answer === option.id;
            return (<react_native_1.TouchableOpacity key={option.id} onPress={() => handleSingleSelect(option.id)} style={[optionStyles.option, isSelected && optionStyles.optionSelected]}>
              <react_native_1.View style={themedStyles.radio}>
                {isSelected && <react_native_1.View style={themedStyles.radioInner}/>}
              </react_native_1.View>
              <react_native_1.Text style={[optionStyles.optionText, isSelected && optionStyles.optionTextSelected]}>
                {option.label}
              </react_native_1.Text>
            </react_native_1.TouchableOpacity>);
        })}
        {allowOther && (<react_native_1.View>
            <react_native_1.TouchableOpacity onPress={handleOtherSelect} style={[
                optionStyles.option,
                answer?.answer === "other" && optionStyles.optionSelected,
            ]}>
              <react_native_1.View style={themedStyles.radio}>
                {answer?.answer === "other" && <react_native_1.View style={themedStyles.radioInner}/>}
              </react_native_1.View>
              <react_native_1.Text style={[
                optionStyles.optionText,
                answer?.answer === "other" && optionStyles.optionTextSelected,
            ]}>
                Other
              </react_native_1.Text>
            </react_native_1.TouchableOpacity>
            {answer?.answer === "other" && (<react_native_1.TextInput style={optionStyles.otherInput} value={otherText} onChangeText={(text) => {
                    setOtherText(text);
                    onAnswer({
                        questionId: question.id,
                        answer: "other",
                        otherText: text,
                    });
                }} placeholder="Please specify..." placeholderTextColor={theme.colors.textSecondary}/>)}
          </react_native_1.View>)}
      </react_native_1.View>
    </react_native_1.View>);
}
