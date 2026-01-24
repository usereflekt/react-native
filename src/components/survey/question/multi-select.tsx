import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../../theme";
import { createOptionStyles, createQuestionStyles } from "../../../theme/question-styles";
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
  const theme = useTheme();
  const questionStyles = useMemo(() => createQuestionStyles(theme), [theme]);
  const optionStyles = useMemo(() => createOptionStyles(theme), [theme]);
  const [otherText, setOtherText] = useState(answer?.otherText ?? "");

  const themedStyles = useMemo(() => StyleSheet.create({
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: theme.colors.textSecondary,
      alignItems: "center",
      justifyContent: "center",
    },
    checkboxSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary,
    },
  }), [theme]);

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
        style={[optionStyles.option, isSelected && optionStyles.optionSelected]}
      >
        <View
          style={[
            themedStyles.checkbox,
            isSelected && themedStyles.checkboxSelected,
          ]}
        >
          {isSelected && (
            <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={theme.colors.primaryForeground} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <Path d="M20 6 9 17l-5-5" />
            </Svg>
          )}
        </View>
        <Text style={[optionStyles.optionText, isSelected && optionStyles.optionTextSelected]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={questionStyles.questionContainer}>
      <Text style={questionStyles.questionLabel}>{question.label}</Text>
      {question.description && (
        <Text style={questionStyles.questionDescription}>{question.description}</Text>
      )}
      <View style={optionStyles.optionsContainer}>
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
                style={optionStyles.otherInput}
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
                placeholderTextColor={theme.colors.textSecondary}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
}



