"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SurveyMessageQuestion;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
function SurveyMessageQuestion({ question, }) {
    return (<react_native_1.View style={styles.questionContainer}>
      <react_native_1.Text style={styles.questionLabel}>{question.label}</react_native_1.Text>
      {question.description && (<react_native_1.Text style={styles.questionDescription}>{question.description}</react_native_1.Text>)}
    </react_native_1.View>);
}
const styles = react_native_1.StyleSheet.create({
    questionContainer: {
        gap: 16,
    },
    questionLabel: {
        fontSize: 20,
        fontWeight: "600",
        color: "#171717",
        lineHeight: 28,
    },
    questionDescription: {
        fontSize: 14,
        color: "#8e8e93",
        lineHeight: 20,
        marginTop: -8,
    },
});
