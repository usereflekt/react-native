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
exports.default = SurveyMessageQuestion;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const theme_1 = require("../../../theme");
function SurveyMessageQuestion({ question, }) {
    const theme = (0, theme_1.useTheme)();
    // Message has slightly different label styling (larger font)
    const themedStyles = (0, react_1.useMemo)(() => react_native_1.StyleSheet.create({
        questionContainer: {
            gap: 16,
        },
        questionLabel: {
            fontSize: 20,
            fontWeight: "600",
            color: theme.colors.text,
            lineHeight: 28,
        },
        questionDescription: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            lineHeight: 20,
            marginTop: -8,
        },
    }), [theme]);
    return (<react_native_1.View style={themedStyles.questionContainer}>
      <react_native_1.Text style={themedStyles.questionLabel}>{question.label}</react_native_1.Text>
      {question.description && (<react_native_1.Text style={themedStyles.questionDescription}>{question.description}</react_native_1.Text>)}
    </react_native_1.View>);
}
//# sourceMappingURL=message.js.map