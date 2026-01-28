import React from "react";
import { SurveyAnswer, SurveyQuestion as SurveyQuestionType } from "../../../types";
export interface SurveyQuestionProps {
    question: SurveyQuestionType;
    answer?: SurveyAnswer;
    onAnswer: (answer: SurveyAnswer) => void;
}
export default function SurveyQuestion({ question, answer, onAnswer, }: SurveyQuestionProps): React.JSX.Element | null;
//# sourceMappingURL=index.d.ts.map