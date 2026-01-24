import React, { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../../theme";
import { createOptionStyles, createQuestionStyles } from "../../../theme/question-styles";
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
  const theme = useTheme();
  const questionStyles = useMemo(() => createQuestionStyles(theme), [theme]);
  const optionStyles = useMemo(() => createOptionStyles(theme), [theme]);
  const [otherText, setOtherText] = useState(answer?.otherText ?? "");

  const themedStyles = useMemo(() => StyleSheet.create({
    radio: {
      width: 16,
      height: 16,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: theme.colors.textSecondary,
      alignItems: "center",
      justifyContent: "center",
    },
    radioInner: {
      width: 16,
      height: 16,
      borderRadius: 10,
      backgroundColor: theme.colors.primary,
    },
  }), [theme]);

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
    <View style={questionStyles.questionContainer}>
      <Text style={questionStyles.questionLabel}>{question.label}</Text>
      {question.description && (
        <Text style={questionStyles.questionDescription}>{question.description}</Text>
      )}
      <View style={optionStyles.optionsContainer}>
        {options.map((option) => {
          const isSelected = answer?.answer === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => handleSingleSelect(option.id)}
              style={[optionStyles.option, isSelected && optionStyles.optionSelected]}
            >
              <View style={themedStyles.radio}>
                {isSelected && <View style={themedStyles.radioInner} />}
              </View>
              <Text style={[optionStyles.optionText, isSelected && optionStyles.optionTextSelected]}>
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
                optionStyles.option,
                answer?.answer === "other" && optionStyles.optionSelected,
              ]}
            >
              <View style={themedStyles.radio}>
                {answer?.answer === "other" && <View style={themedStyles.radioInner} />}
              </View>
              <Text
                style={[
                  optionStyles.optionText,
                  answer?.answer === "other" && optionStyles.optionTextSelected,
                ]}
              >
                Other
              </Text>
            </TouchableOpacity>
            {answer?.answer === "other" && (
              <TextInput
                style={optionStyles.otherInput}
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
                placeholderTextColor={theme.colors.textSecondary}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
}



