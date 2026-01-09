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
function SurveySingleSelectQuestion({ question, answer, onAnswer, }) {
    const [otherText, setOtherText] = (0, react_1.useState)(answer?.otherText ?? "");
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
    return (<react_native_1.View style={styles.questionContainer}>
      <react_native_1.Text style={styles.questionLabel}>{question.label}</react_native_1.Text>
      {question.description && (<react_native_1.Text style={styles.questionDescription}>{question.description}</react_native_1.Text>)}
      <react_native_1.View style={styles.optionsContainer}>
        {options.map((option) => {
            const isSelected = answer?.answer === option.id;
            return (<react_native_1.TouchableOpacity key={option.id} onPress={() => handleSingleSelect(option.id)} style={[styles.option, isSelected && styles.optionSelected]}>
              <react_native_1.View style={styles.radio}>
                {isSelected && <react_native_1.View style={styles.radioInner}/>}
              </react_native_1.View>
              <react_native_1.Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {option.label}
              </react_native_1.Text>
            </react_native_1.TouchableOpacity>);
        })}
        {allowOther && (<react_native_1.View>
            <react_native_1.TouchableOpacity onPress={handleOtherSelect} style={[
                styles.option,
                answer?.answer === "other" && styles.optionSelected,
            ]}>
              <react_native_1.View style={styles.radio}>
                {answer?.answer === "other" && <react_native_1.View style={styles.radioInner}/>}
              </react_native_1.View>
              <react_native_1.Text style={[
                styles.optionText,
                answer?.answer === "other" && styles.optionTextSelected,
            ]}>
                Other
              </react_native_1.Text>
            </react_native_1.TouchableOpacity>
            {answer?.answer === "other" && (<react_native_1.TextInput style={styles.otherInput} value={otherText} onChangeText={(text) => {
                    setOtherText(text);
                    onAnswer({
                        questionId: question.id,
                        answer: "other",
                        otherText: text,
                    });
                }} placeholder="Please specify..." placeholderTextColor="#8e8e93"/>)}
          </react_native_1.View>)}
      </react_native_1.View>
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
    optionsContainer: {
        gap: 8,
    },
    option: {
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.12)",
        backgroundColor: "#ffffff",
        gap: 12,
    },
    optionSelected: {
        borderColor: "#171717",
        backgroundColor: "rgba(0, 0, 0, 0.02)",
    },
    optionText: {
        fontSize: 16,
        color: "#171717",
        flex: 1,
    },
    optionTextSelected: {
        fontWeight: "500",
    },
    radio: {
        width: 16,
        height: 16,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "#8e8e93",
        alignItems: "center",
        justifyContent: "center",
    },
    radioInner: {
        width: 16,
        height: 16,
        borderRadius: 10,
        backgroundColor: "#171717",
    },
    otherInput: {
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.12)",
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        color: "#171717",
        marginTop: 8,
    },
});
