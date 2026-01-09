"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SurveyFreeTextQuestion;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
function SurveyFreeTextQuestion({ question, answer, onAnswer, }) {
    const handleFreeTextChange = (text) => {
        onAnswer({
            questionId: question.id,
            answer: text,
        });
    };
    return (<react_native_1.View style={styles.questionContainer}>
      <react_native_1.Text style={styles.questionLabel}>{question.label}</react_native_1.Text>
      {question.description && (<react_native_1.Text style={styles.questionDescription}>{question.description}</react_native_1.Text>)}
      <react_native_1.TextInput style={styles.textInput} value={typeof answer?.answer === "string" ? answer.answer : ""} onChangeText={handleFreeTextChange} placeholder="Type your answer here..." placeholderTextColor="#8e8e93" multiline submitBehavior="blurAndSubmit" numberOfLines={4}/>
    </react_native_1.View>);
}
const styles = react_native_1.StyleSheet.create({
    questionContainer: {
        gap: 16,
    },
    questionLabel: {
        fontSize: 18,
        fontWeight: "600",
        color: "#171717",
        lineHeight: 24,
    },
    questionDescription: {
        fontSize: 14,
        color: "#8e8e93",
        lineHeight: 20,
        marginTop: -8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.12)",
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: "#171717",
        minHeight: 100,
        textAlignVertical: "top",
    },
});
