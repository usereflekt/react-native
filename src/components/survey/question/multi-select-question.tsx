import React, { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { SurveyAnswer, SurveyQuestion as SurveyQuestionType } from "../../../types";

interface SurveyMultiSelectQuestionProps {
  question: SurveyQuestionType;
  answer?: SurveyAnswer;
  onAnswer: (answer: SurveyAnswer) => void;
}

export default function SurveyMultiSelectQuestion({
  question,
  answer,
  onAnswer,
}: SurveyMultiSelectQuestionProps) {
  const [otherText, setOtherText] = useState(answer?.otherText ?? "");

  const handleMultiSelect = (optionId: string) => {
    const currentAnswers = Array.isArray(answer?.answer) ? answer.answer : [];
    const newAnswers = currentAnswers.includes(optionId)
      ? currentAnswers.filter((id) => id !== optionId)
      : [...currentAnswers, optionId];

    onAnswer({
      questionId: question.id,
      answer: newAnswers,
      otherText,
    });
  };

  const handleOtherSelect = () => {
    const currentAnswers = Array.isArray(answer?.answer) ? answer.answer : [];
    const withoutOther = currentAnswers.filter((id) => id !== "other");
    const newAnswers = currentAnswers.includes("other") ? withoutOther : [...withoutOther, "other"];

    onAnswer({
      questionId: question.id,
      answer: newAnswers,
      otherText: otherText,
    });
  };

  const options = question.selectConfig?.options || [];
  const allowOther = question.selectConfig?.allowOther || false;
  const currentAnswers = Array.isArray(answer?.answer) ? answer.answer : [];

  function CheckBoxOption({onPress, label, isSelected}: {onPress: () => void, label: string, isSelected: boolean}) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[styles.option, isSelected && styles.optionSelected]}
      >
        <View
          style={[
            styles.checkbox,
            isSelected && styles.checkboxSelected,
          ]}
        >
          {isSelected && (
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <Path d="M20 6 9 17l-5-5" />
            </Svg>
          )}
        </View>
        <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.questionContainer}>
      <Text style={styles.questionLabel}>{question.label}</Text>
      {question.description && (
        <Text style={styles.questionDescription}>{question.description}</Text>
      )}
      <View style={styles.optionsContainer}>
        {options.map((option) => 
          <CheckBoxOption 
            key={option.id}
            onPress={() => handleMultiSelect(option.id)}
            label={option.label}
            isSelected={currentAnswers.includes(option.id)}
          />
        )}
        {allowOther && (
          <View>
            <CheckBoxOption
              onPress={handleOtherSelect}
              label="Other"
              isSelected={currentAnswers.includes("other")}
            />
            {currentAnswers.includes("other") && (
              <TextInput
                style={styles.otherInput}
                value={otherText}
                onChangeText={(text) => {
                  setOtherText(text);
                  const current =
                    Array.isArray(answer?.answer) && answer.answer ? answer.answer : [];
                  onAnswer({
                    questionId: question.id,
                    answer: current,
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
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#8e8e93",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    borderColor: "#171717",
    backgroundColor: "#171717",
  },
  checkmark: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
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


