import React from "react";
import { SurveyAnswer, SurveyQuestion as SurveyQuestionType } from "../../../types";
interface SurveyRatingQuestionProps {
    question: SurveyQuestionType;
    answer?: SurveyAnswer;
    onAnswer: (answer: SurveyAnswer) => void;
}
export default function SurveyRatingQuestion({ question, answer, onAnswer }: SurveyRatingQuestionProps): React.JSX.Element;
export {};
//# sourceMappingURL=rating.d.ts.map