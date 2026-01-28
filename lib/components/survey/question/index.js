"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SurveyQuestion;
const react_1 = __importDefault(require("react"));
const free_text_1 = __importDefault(require("./free-text"));
const multi_select_1 = __importDefault(require("./multi-select"));
const rating_1 = __importDefault(require("./rating"));
const single_select_1 = __importDefault(require("./single-select"));
const message_1 = __importDefault(require("./message"));
function SurveyQuestion({ question, answer, onAnswer, }) {
    switch (question.type) {
        case "free_text":
            return (<free_text_1.default question={question} answer={answer} onAnswer={onAnswer}/>);
        case "message":
            return (<message_1.default question={question}/>);
        case "single_select":
            return (<single_select_1.default question={question} answer={answer} onAnswer={onAnswer}/>);
        case "multi_select":
            return (<multi_select_1.default question={question} answer={answer} onAnswer={onAnswer}/>);
        case "rating":
            return (<rating_1.default question={question} answer={answer} onAnswer={onAnswer}/>);
        default:
            return null;
    }
}
//# sourceMappingURL=index.js.map