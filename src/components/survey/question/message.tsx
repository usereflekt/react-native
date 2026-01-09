import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { SurveyAnswer, SurveyQuestion as SurveyQuestionType } from "../../../types";

interface SurveyMessageQuestionProps {
  question: SurveyQuestionType;
}

export default function SurveyMessageQuestion({
  question,
}: SurveyMessageQuestionProps) {
  return (
    <View style={styles.questionContainer}>
      <Text style={styles.questionLabel}>{question.label}</Text>
      {question.description && (
        <Text style={styles.questionDescription}>{question.description}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  questionContainer: {
    gap: 16,
  },
  questionLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: "#171717",
    lineHeight: 28,
  },
  questionDescription: {
    fontSize: 14,
    color: "#8e8e93",
    lineHeight: 20,
    marginTop: -8,
  },
});


