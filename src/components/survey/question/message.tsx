import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../../theme";
import { SurveyQuestion as SurveyQuestionType } from "../../../types";

interface SurveyMessageQuestionProps {
  question: SurveyQuestionType;
}

export default function SurveyMessageQuestion({
  question,
}: SurveyMessageQuestionProps) {
  const theme = useTheme();

  // Message has slightly different label styling (larger font)
  const themedStyles = useMemo(() => StyleSheet.create({
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

  return (
    <View style={themedStyles.questionContainer}>
      <Text style={themedStyles.questionLabel}>{question.label}</Text>
      {question.description && (
        <Text style={themedStyles.questionDescription}>{question.description}</Text>
      )}
    </View>
  );
}


