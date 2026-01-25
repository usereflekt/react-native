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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const theme_1 = require("../../theme");
const question_1 = __importDefault(require("./question"));
const survey_modal_1 = __importDefault(require("./survey-modal"));
const Survey = ({ survey, visible, onClose, onSubmit, }) => {
    const theme = (0, theme_1.useTheme)();
    const [currentQuestionIndex, setCurrentQuestionIndex] = (0, react_1.useState)(0);
    const [answers, setAnswers] = (0, react_1.useState)([]);
    const [scrollViewHeight, setScrollViewHeight] = (0, react_1.useState)(0);
    const [isScrollable, setIsScrollable] = (0, react_1.useState)(false);
    const [contentHeight, setContentHeight] = (0, react_1.useState)(0);
    // Generate dynamic styles based on theme
    const themedStyles = (0, react_1.useMemo)(() => react_native_1.StyleSheet.create({
        button: {
            height: 44,
            paddingHorizontal: 24,
            borderRadius: theme.borderRadius.button,
            alignItems: 'center',
            justifyContent: 'center',
        },
        primaryButton: {
            backgroundColor: theme.colors.primary,
        },
        secondaryButtonText: {
            color: theme.colors.text,
            fontSize: 16,
            fontWeight: '600',
        },
        primaryButtonText: {
            color: theme.colors.primaryForeground,
            fontSize: 16,
            fontWeight: '600',
        },
    }), [theme]);
    const currentQuestion = survey.questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === survey.questions.length - 1;
    const hasValidAnswer = (question, answer) => {
        if (question.type === 'message')
            return true;
        if (!answer)
            return false;
        const value = answer.answer;
        switch (question.type) {
            case 'free_text':
                return typeof value === 'string' && value.trim().length > 0;
            case 'rating':
                return typeof value === 'number' && value > 0;
            case 'single_select':
                if (typeof value !== 'string' || value.trim().length === 0)
                    return false;
                if (value === 'other') {
                    const text = (answer.otherText || '').trim();
                    return text.length > 0;
                }
                return true;
            case 'multi_select':
                if (!Array.isArray(value) || value.length === 0)
                    return false;
                if (value.includes('other')) {
                    const text = (answer.otherText || '').trim();
                    return text.length > 0;
                }
                return true;
            default:
                return false;
        }
    };
    const hasOtherSelectedWithoutText = (question, answer) => {
        if (!answer)
            return false;
        const value = answer.answer;
        const text = (answer.otherText || '').trim();
        if (question.type === 'single_select' && value === 'other') {
            return text.length === 0;
        }
        if (question.type === 'multi_select' && Array.isArray(value) && value.includes('other')) {
            return text.length === 0;
        }
        return false;
    };
    const handleAnswer = (answer) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = answer;
        setAnswers(newAnswers);
    };
    const handleNext = () => {
        react_native_1.Keyboard.dismiss();
        if (isLastQuestion) {
            onClose(false);
            onSubmit(answers);
        }
        else {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };
    const handleBack = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };
    const handleScrollViewLayout = (event) => {
        const { height } = event.nativeEvent.layout;
        if (height > 0 && height !== scrollViewHeight) {
            setScrollViewHeight(height);
        }
    };
    const handleContentSizeChange = (_contentWidth, contentHeight) => {
        if (contentHeight > 0 && contentHeight !== contentHeight) {
            return;
        }
        setContentHeight(contentHeight);
    };
    (0, react_1.useEffect)(() => {
        if (scrollViewHeight <= 0 || contentHeight <= 0)
            return;
        const scrollable = contentHeight > scrollViewHeight + 1;
        if (scrollable !== isScrollable) {
            setIsScrollable(scrollable);
        }
    }, [scrollViewHeight, contentHeight, isScrollable]);
    const currentAnswer = answers[currentQuestionIndex];
    const hasResponse = (() => {
        if (currentQuestion.type === 'message')
            return true;
        if (!currentAnswer)
            return false;
        const value = currentAnswer.answer;
        switch (currentQuestion.type) {
            case 'free_text':
                return typeof value === 'string' && value.trim().length > 0;
            case 'rating':
                return typeof value === 'number' && value > 0;
            case 'single_select':
                return typeof value === 'string' && value.trim().length > 0;
            case 'multi_select':
                return Array.isArray(value) && value.length > 0;
            default:
                return false;
        }
    })();
    const isNextDisabled = hasOtherSelectedWithoutText(currentQuestion, currentAnswer) ||
        (currentQuestion.required && !hasValidAnswer(currentQuestion, currentAnswer));
    const nextLabel = (() => {
        if (isLastQuestion) {
            return 'Submit';
        }
        if (!currentQuestion.required && !hasResponse) {
            return 'Skip';
        }
        return 'Next';
    })();
    return (<survey_modal_1.default visible={visible} onClose={onClose} length={survey.questions.length} current={currentQuestionIndex + 1}>
      <react_native_1.ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" bounces={isScrollable} alwaysBounceVertical={false} showsVerticalScrollIndicator={true} onLayout={handleScrollViewLayout} onContentSizeChange={handleContentSizeChange}>
        <question_1.default question={currentQuestion} answer={currentAnswer} onAnswer={handleAnswer}/>

        <react_native_1.View style={styles.footer}>
          <react_native_1.View style={{ ...styles.buttons, justifyContent: currentQuestionIndex > 0 ? 'space-between' : 'flex-end' }}>
            {currentQuestionIndex > 0 && (<react_native_1.TouchableOpacity style={[themedStyles.button, styles.secondaryButton]} onPress={handleBack}>
                <react_native_1.Text style={themedStyles.secondaryButtonText}>Back</react_native_1.Text>
              </react_native_1.TouchableOpacity>)}
            <react_native_1.TouchableOpacity style={[themedStyles.button, themedStyles.primaryButton, isNextDisabled && styles.buttonDisabled]} onPress={handleNext} disabled={isNextDisabled}>
              <react_native_1.Text style={themedStyles.primaryButtonText}>
                {nextLabel}
              </react_native_1.Text>
            </react_native_1.TouchableOpacity>
          </react_native_1.View>
        </react_native_1.View>
      </react_native_1.ScrollView>
    </survey_modal_1.default>);
};
// Static styles that don't depend on theme
const styles = react_native_1.StyleSheet.create({
    scrollView: {
        flexGrow: 0,
        flexShrink: 1,
    },
    scrollContent: {
        paddingBottom: 24,
        paddingHorizontal: 20,
    },
    footer: {
        paddingTop: 12,
    },
    buttons: {
        flexDirection: 'row',
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    secondaryButton: {
        marginRight: 8,
    },
});
exports.default = Survey;
