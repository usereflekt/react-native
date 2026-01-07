import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SurveyAnswer, SurveyQuestion as SurveyQuestionType } from "../../../types";

interface SurveySingleSelectQuestionProps {
  question: SurveyQuestionType;
  answer?: SurveyAnswer;
  onAnswer: (answer: SurveyAnswer) => void;
}

export default function SurveySingleSelectQuestion({
  question,
  answer,
  onAnswer,
}: SurveySingleSelectQuestionProps) {
  const [otherText, setOtherText] = useState(answer?.otherText ?? "");

  const handleSingleSelect = (optionId: string) => {
    const current = answer?.answer;

    if (current === optionId) {
      onAnswer({
        questionId: question.id,
        answer: "",
      });
    } else {
      onAnswer({
        questionId: question.id,
        answer: optionId,
      });
    }
  };

  const handleOtherSelect = () => {
    const current = answer?.answer;

    if (current === "other") {
      onAnswer({
        questionId: question.id,
        answer: "",
      });
      return;
    }

    onAnswer({
      questionId: question.id,
      answer: "other",
      otherText: otherText,
    });
  };

  const options = question.selectConfig?.options || [];
  const allowOther = question.selectConfig?.allowOther || false;

  return (
    <View style={styles.questionContainer}>
      <Text style={styles.questionLabel}>{question.label}</Text>
      {question.description && (
        <Text style={styles.questionDescription}>{question.description}</Text>
      )}
      <View style={styles.optionsContainer}>
        {options.map((option) => {
          const isSelected = answer?.answer === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => handleSingleSelect(option.id)}
              style={[styles.option, isSelected && styles.optionSelected]}
            >
              <View style={styles.radio}>
                {isSelected && <View style={styles.radioInner} />}
              </View>
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
        {allowOther && (
          <View>
            <TouchableOpacity
              onPress={handleOtherSelect}
              style={[
                styles.option,
                answer?.answer === "other" && styles.optionSelected,
              ]}
            >
              <View style={styles.radio}>
                {answer?.answer === "other" && <View style={styles.radioInner} />}
              </View>
              <Text
                style={[
                  styles.optionText,
                  answer?.answer === "other" && styles.optionTextSelected,
                ]}
              >
                Other
              </Text>
            </TouchableOpacity>
            {answer?.answer === "other" && (
              <TextInput
                style={styles.otherInput}
                value={otherText}
                onChangeText={(text) => {
                  setOtherText(text);
                  onAnswer({
                    questionId: question.id,
                    answer: "other",
                    otherText: text,
                  });
                }}
                placeholder="Please specify..."
                placeholderTextColor="#8e8e93"
              />
            )}
          </View>
        )}
      </View>
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
  optionsContainer: {
    gap: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.12)",
    backgroundColor: "#ffffff",
    gap: 12,
  },
  optionSelected: {
    borderColor: "#171717",
    backgroundColor: "rgba(0, 0, 0, 0.02)",
  },
  optionText: {
    fontSize: 16,
    color: "#171717",
    flex: 1,
  },
  optionTextSelected: {
    fontWeight: "500",
  },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#8e8e93",
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 16,
    height: 16,
    borderRadius: 10,
    backgroundColor: "#171717",
  },
  otherInput: {
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.12)",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: "#171717",
    marginTop: 8,
  },
});


