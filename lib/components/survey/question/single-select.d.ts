import React from "react";
import { SurveyAnswer, SurveyQuestion as SurveyQuestionType } from "../../../types";
interface SurveySingleSelectQuestionProps {
    question: SurveyQuestionType;
    answer?: SurveyAnswer;
    onAnswer: (answer: SurveyAnswer) => void;
}
export default function SurveySingleSelectQuestion({ question, answer, onAnswer, }: SurveySingleSelectQuestionProps): React.JSX.Element;
export {};
//# sourceMappingURL=single-select.d.ts.map