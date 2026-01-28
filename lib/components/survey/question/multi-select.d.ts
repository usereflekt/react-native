import React from "react";
import { SurveyAnswer, SurveyQuestion as SurveyQuestionType } from "../../../types";
interface SurveyMultiSelectQuestionProps {
    question: SurveyQuestionType;
    answer?: SurveyAnswer;
    onAnswer: (answer: SurveyAnswer) => void;
}
export default function SurveyMultiSelectQuestion({ question, answer, onAnswer, }: SurveyMultiSelectQuestionProps): React.JSX.Element;
export {};
//# sourceMappingURL=multi-select.d.ts.map