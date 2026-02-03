import React from "react";
import { SurveyAnswer, SurveyQuestion as SurveyQuestionType } from "../../../types";
interface SurveyFreeTextQuestionProps {
    question: SurveyQuestionType;
    answer?: SurveyAnswer;
    onAnswer: (answer: SurveyAnswer) => void;
}
export default function SurveyFreeTextQuestion({ question, answer, onAnswer, }: SurveyFreeTextQuestionProps): React.JSX.Element;
export {};
