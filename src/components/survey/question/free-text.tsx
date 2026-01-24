import React, { useMemo } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { useTheme, withOpacity } from "../../../theme";
import { createQuestionStyles } from "../../../theme/question-styles";
import { SurveyAnswer, SurveyQuestion as SurveyQuestionType } from "../../../types";

interface SurveyFreeTextQuestionProps {
  question: SurveyQuestionType;
  answer?: SurveyAnswer;
  onAnswer: (answer: SurveyAnswer) => void;
}

export default function SurveyFreeTextQuestion({
  question,
  answer,
  onAnswer,
}: SurveyFreeTextQuestionProps) {
  const theme = useTheme();
  const questionStyles = useMemo(() => createQuestionStyles(theme), [theme]);

  const themedStyles = useMemo(() => StyleSheet.create({
    textInput: {
      borderWidth: 1,
      borderColor: withOpacity(theme.colors.primary, 0.12),
      borderRadius: theme.borderRadius.input,
      padding: 12,
      fontSize: 16,
      color: theme.colors.text,
      minHeight: 100,
      textAlignVertical: "top",
    },
  }), [theme]);

  const handleFreeTextChange = (text: string) => {
    onAnswer({
      questionId: question.id,
      answer: text,
    });
  };

  return (
    <View style={questionStyles.questionContainer}>
      <Text style={questionStyles.questionLabel}>{question.label}</Text>
      {question.description && (
        <Text style={questionStyles.questionDescription}>{question.description}</Text>
      )}
      <TextInput
        style={themedStyles.textInput}
        value={typeof answer?.answer === "string" ? answer.answer : ""}
        onChangeText={handleFreeTextChange}
        placeholder="Type your answer here..."
        placeholderTextColor={theme.colors.textSecondary}
        multiline
        submitBehavior="blurAndSubmit"
        numberOfLines={4}
      />
    </View>
  );
}


