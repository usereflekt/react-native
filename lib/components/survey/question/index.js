"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SurveyQuestion;
const react_1 = __importDefault(require("react"));
const free_text_question_1 = __importDefault(require("./free-text-question"));
const multi_select_question_1 = __importDefault(require("./multi-select-question"));
const rating_question_1 = __importDefault(require("./rating-question"));
const single_select_question_1 = __importDefault(require("./single-select-question"));
function SurveyQuestion({ question, answer, onAnswer, }) {
    switch (question.type) {
        case "free_text":
            return (<free_text_question_1.default question={question} answer={answer} onAnswer={onAnswer}/>);
        case "single_select":
            return (<single_select_question_1.default question={question} answer={answer} onAnswer={onAnswer}/>);
        case "multi_select":
            return (<multi_select_question_1.default question={question} answer={answer} onAnswer={onAnswer}/>);
        case "rating":
            return (<rating_question_1.default question={question} answer={answer} onAnswer={onAnswer}/>);
        default:
            return null;
    }
}
