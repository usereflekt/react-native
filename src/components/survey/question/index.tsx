import React from "react";
import { SurveyAnswer, SurveyQuestion as SurveyQuestionType } from "../../../types";
import SurveyFreeTextQuestion from "./free-text";
import SurveyMultiSelectQuestion from "./multi-select";
import SurveyRatingQuestion from "./rating";
import SurveySingleSelectQuestion from "./single-select";
import SurveyMessageQuestion from "./message";

export interface SurveyQuestionProps {
  question: SurveyQuestionType;
  answer?: SurveyAnswer;
  onAnswer: (answer: SurveyAnswer) => void;
}

export default function SurveyQuestion({
  question,
  answer,
  onAnswer,
}: SurveyQuestionProps) {

  switch (question.type) {
    case "free_text":
      return (
        <SurveyFreeTextQuestion
          question={question}
          answer={answer}
          onAnswer={onAnswer}
        />
      );
    case "message":
      return (
        <SurveyMessageQuestion
          question={question}
        />
      );
    case "single_select":
      return (
        <SurveySingleSelectQuestion
          question={question}
          answer={answer}
          onAnswer={onAnswer}
        />
      );
    case "multi_select":
      return (
        <SurveyMultiSelectQuestion
          question={question}
          answer={answer}
          onAnswer={onAnswer}
        />
      );
    case "rating":
      return (
        <SurveyRatingQuestion
          question={question}
          answer={answer}
          onAnswer={onAnswer}
        />
      );
    default:
      return null;
  }
}