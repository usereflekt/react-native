import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { SurveyAnswer, SurveyQuestion as SurveyQuestionType, SurveyRatingRange } from "../../../types";

interface SurveyRatingQuestionProps {
  question: SurveyQuestionType;
  answer?: SurveyAnswer;
  onAnswer: (answer: SurveyAnswer) => void;
}

function getStarSize(range: number, availableWidth: number): { size: number; gap: number; padding: number } {
  const MAX_SIZE = 52;
  const MIN_SIZE = 20;
  const MIN_GAP = 0;
  const MAX_GAP = 8;

  for (let size = MAX_SIZE; size >= MIN_SIZE; size -= 2) {
    for (let gap = MAX_GAP; gap >= MIN_GAP; gap -= 2) {
      const padding = Math.max(2, Math.min(8, Math.floor(gap / 2)));
      const totalWidth = (size + padding * 2) * range + gap * (range - 1);

      if (totalWidth <= availableWidth) {
        return { size, gap, padding };
      }
    }
  }

  return { size: MIN_SIZE, gap: MIN_GAP, padding: 2 };
}

function getEmojiSize(range: number, availableWidth: number): { fontSize: number; gap: number; padding: number } {
  const MAX_FONT_SIZE = 32;
  const MIN_FONT_SIZE = 16;
  const MIN_GAP = 2;
  const MAX_GAP = 16;

  for (let fontSize = MAX_FONT_SIZE; fontSize >= MIN_FONT_SIZE; fontSize -= 2) {
    for (let gap = MAX_GAP; gap >= MIN_GAP; gap -= 2) {
      const padding = Math.max(4, Math.min(12, Math.round(fontSize / 4)));
      const borderWidth = 1;
      const buttonSize = fontSize + padding * 2;
      const buttonWidth = buttonSize + borderWidth * 2;
      const totalWidth = buttonWidth * range + gap * (range - 1);

      if (totalWidth <= availableWidth) {
        return { fontSize, gap, padding };
      }
    }
  }

  return { fontSize: MIN_FONT_SIZE, gap: MIN_GAP, padding: 4 };
}

function getSmileySubset(range: SurveyRatingRange): string[] {
  switch (range) {
    case 3:
      return ["🙁", "😐", "😀"];
    case 4:
      return ["😞", "😕", "😐", "😀"];
    case 5:
      return ["😞", "😕", "😐", "🙂", "😄"];
    case 7:
      return ["😫", "🙁", "😕", "😐", "🙂", "😄", "😁"];
    case 10:
      return ["😫", "😣", "😞", "🙁", "😕", "😐", "🙂", "😀", "😁", "😍"];
  }

}

export default function SurveyRatingQuestion({ question, answer, onAnswer }: SurveyRatingQuestionProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const isLayoutReady = containerWidth > 0;

  const handleRating = (value: number) => {
    const current = answer?.answer;

    if (typeof current === "number" && current === value) {
      onAnswer({
        questionId: question.id,
        answer: 0,
      });
    } else {
      onAnswer({
        questionId: question.id,
        answer: value,
      });
    }
  };

  const renderRatingStars = () => {
    const range = question.ratingConfig?.range || 5;
    const { size, gap, padding } = getStarSize(range, containerWidth || 1);
    const stars = [];

    for (let i = 1; i <= range; i++) {
      const isSelected = typeof answer?.answer === "number" && answer.answer >= i;
      stars.push(
        <Pressable
          key={i}
          onPress={() => handleRating(i)}
          style={{ padding }}
          hitSlop={10}
        >
          <Svg width={size} height={size} viewBox="0 0 256 256">
            <Path
              fill={isSelected ? "#171717" : "#d1d1d6"}
              d={
                isSelected
                  ? "M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Z"
                  : "M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Zm-15.34,5.47-48.7,42a8,8,0,0,0-2.56,7.91l14.88,62.8a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-54.72-33.65a8,8,0,0,0-8.38,0L69.09,215.94c-.15.09-.19.12-.38,0a.37.37,0,0,1-.17-.48l14.88-62.8a8,8,0,0,0-2.56-7.91l-48.7-42c-.12-.1-.23-.19-.13-.5s.18-.27.33-.29l63.92-5.16A8,8,0,0,0,103,91.86l24.62-59.61c.08-.17.11-.25.35-.25s.27.08.35.25L153,91.86a8,8,0,0,0,6.75,4.92l63.92,5.16c.15,0,.24,0,.33.29S224,102.63,223.84,102.73Z"
              }
            />
          </Svg>
        </Pressable>
      );
    }

    return (
      <View style={[styles.ratingContainer, { gap }, !isLayoutReady && styles.hiddenWhileMeasuring]}>
        {stars}
      </View>
    );
  };

  const renderRatingNumbers = () => {
    const range = question.ratingConfig?.range || 5;
    const numbers = [];

    for (let i = 1; i <= range; i++) {
      const isSelected = answer?.answer === i;
      const isLast = i === range;
      numbers.push(
        <Pressable
          key={i}
          onPress={() => handleRating(i)}
          style={[
            styles.numberButton,
            !isLast && styles.numberButtonDivider,
            isSelected && styles.numberButtonSelected,
          ]}
        >
          <Text style={[styles.numberText, isSelected && styles.numberTextSelected]}>{i}</Text>
        </Pressable>
      );
    }

    return <View style={styles.numberRatingContainer}>{numbers}</View>;
  };

  const renderRatingSmiley = () => {
    const range = question.ratingConfig?.range || 5;
    const emojis = getSmileySubset(range);

    const { fontSize, gap, padding } = getEmojiSize(range, containerWidth || 1);
    const buttonSize = fontSize + padding * 2;

    return (
      <View style={[styles.ratingContainer, { gap }, !isLayoutReady && styles.hiddenWhileMeasuring]}>
        {emojis.map((emoji, index) => {
          const value = index + 1;
          const isSelected = answer?.answer === value;
          return (
            <Pressable
              key={value}
              onPress={() => handleRating(value)}
              style={[
                styles.smileyButton,
                isSelected && styles.smileyButtonSelected,
                { width: buttonSize, height: buttonSize },
              ]}
            >
              <Text style={{ fontSize }}>{emoji}</Text>
            </Pressable>
          );
        })}
      </View>
    );
  };

  const scale = question.ratingConfig?.scale || "stars";

  return (
    <View
      style={styles.questionContainer}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        if (width > 0 && containerWidth !== width) {
          setContainerWidth(width);
        }
      }}
    >
      <Text style={styles.questionLabel}>{question.label}</Text>
      {question.description && (
        <Text style={styles.questionDescription}>{question.description}</Text>
      )}

      {scale === "stars" && renderRatingStars()}
      {scale === "numbers" && renderRatingNumbers()}
      {scale === "smiley" && renderRatingSmiley()}

      {question.ratingConfig?.lowerLabel && question.ratingConfig?.upperLabel && (
        <View style={styles.ratingLabels}>
          <Text style={styles.ratingLabel}>{question.ratingConfig.lowerLabel}</Text>
          <Text style={styles.ratingLabel}>{question.ratingConfig.upperLabel}</Text>
        </View>
      )}
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
  ratingContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  hiddenWhileMeasuring: {
    opacity: 0,
  },
  numberRatingContainer: {
    flexDirection: "row",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.12)",
    gap: 0,
  },
  numberButton: {
    flex: 1,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  numberButtonDivider: {
    borderRightWidth: 1,
    borderRightColor: "rgba(0, 0, 0, 0.12)",
  },
  numberButtonSelected: {
    backgroundColor: "#171717",
  },
  numberText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#171717",
  },
  numberTextSelected: {
    color: "#ffffff",
  },
  smileyButton: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.12)",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  smileyButtonSelected: {
    borderColor: "#171717",
    borderWidth: 1,
    backgroundColor: "rgba(0, 0, 0, 0.02)",
  },
  ratingLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  ratingLabel: {
    fontSize: 12,
    color: "#8e8e93",
  },
});


