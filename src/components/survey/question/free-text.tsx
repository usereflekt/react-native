import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
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
  const handleFreeTextChange = (text: string) => {
    onAnswer({
      questionId: question.id,
      answer: text,
    });
  };

  return (
    <View style={styles.questionContainer}>
      <Text style={styles.questionLabel}>{question.label}</Text>
      {question.description && (
        <Text style={styles.questionDescription}>{question.description}</Text>
      )}
      <TextInput
        style={styles.textInput}
        value={typeof answer?.answer === "string" ? answer.answer : ""}
        onChangeText={handleFreeTextChange}
        placeholder="Type your answer here..."
        placeholderTextColor="#8e8e93"
        multiline
        submitBehavior="blurAndSubmit"
        numberOfLines={4}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  questionContainer: {
    gap: 16,
  },
  questionLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#171717",
    lineHeight: 24,
  },
  questionDescription: {
    fontSize: 14,
    color: "#8e8e93",
    lineHeight: 20,
    marginTop: -8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.12)",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: "#171717",
    minHeight: 100,
    textAlignVertical: "top",
  },
});


