import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SurveyAnswer, SurveyQuestion as SurveyQuestionType, Survey as SurveyType } from '../../types';
import SurveyQuestion from './question';
import SurveyPopup from './survey-modal';

interface SurveyProps {
  survey: SurveyType;
  visible: boolean;
  onClose: () => void;
  onSubmit: (answers: SurveyAnswer[]) => void;
}

const Survey: React.FC<SurveyProps> = ({
  survey,
  visible,
  onClose,
  onSubmit,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswer[]>([]);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [isScrollable, setIsScrollable] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);

  const currentQuestion = survey.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === survey.questions.length - 1;

  const hasValidAnswer = (question: SurveyQuestionType, answer?: SurveyAnswer) => {
    if (!answer) return false;
    const value = answer.answer;

    switch (question.type) {
      case 'free_text':
        return typeof value === 'string' && value.trim().length > 0;
      case 'rating':
        return typeof value === 'number' && value > 0;
      case 'single_select':
        if (typeof value !== 'string' || value.trim().length === 0) return false;
        if (value === 'other') {
          const text = (answer.otherText || '').trim();
          return text.length > 0;
        }
        return true;
      case 'multi_select':
        if (!Array.isArray(value) || value.length === 0) return false;
        if (value.includes('other')) {
          const text = (answer.otherText || '').trim();
          return text.length > 0;
        }
        return true;
      default:
        return false;
    }
  };

  const hasOtherSelectedWithoutText = (question: SurveyQuestionType, answer?: SurveyAnswer) => {
    if (!answer) return false;
    const value = answer.answer;
    const text = (answer.otherText || '').trim();

    if (question.type === 'single_select' && value === 'other') {
      return text.length === 0;
    }

    if (question.type === 'multi_select' && Array.isArray(value) && value.includes('other')) {
      return text.length === 0;
    }

    return false;
  };

  const handleAnswer = (answer: SurveyAnswer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      onSubmit(answers);
      onClose();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleScrollViewLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && height !== scrollViewHeight) {
      setScrollViewHeight(height);
    }
  };

  const handleContentSizeChange = (_contentWidth: number, contentHeight: number) => {
    if (contentHeight > 0 && contentHeight !== contentHeight) {
      return;
    }
    setContentHeight(contentHeight);
  };

  useEffect(() => {
    if (scrollViewHeight <= 0 || contentHeight <= 0) return;
    const scrollable = contentHeight > scrollViewHeight + 1;
    if (scrollable !== isScrollable) {
      setIsScrollable(scrollable);
    }
  }, [scrollViewHeight, contentHeight, isScrollable]);

  const currentAnswer = answers[currentQuestionIndex];
  const hasResponse = (() => {
    if (!currentAnswer) return false;
    const value = currentAnswer.answer;
    switch (currentQuestion.type) {
      case 'free_text':
        return typeof value === 'string' && value.trim().length > 0;
      case 'rating':
        return typeof value === 'number' && value > 0;
      case 'single_select':
        return typeof value === 'string' && value.trim().length > 0;
      case 'multi_select':
        return Array.isArray(value) && value.length > 0;
      default:
        return false;
    }
  })();

  const isNextDisabled =
    hasOtherSelectedWithoutText(currentQuestion, currentAnswer) ||
    (currentQuestion.required && !hasValidAnswer(currentQuestion, currentAnswer));

  const nextLabel = (() => {
    if (isLastQuestion) {
      return 'Submit';
    }
    if (!currentQuestion.required && !hasResponse) {
      return 'Skip';
    }
    return 'Next';
  })();

  return (
  <SurveyPopup visible={visible} onClose={onClose} length={survey.questions.length} current={currentQuestionIndex + 1}>
    <ScrollView 
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      bounces={isScrollable}
      alwaysBounceVertical={false}
      showsVerticalScrollIndicator={true}
      onLayout={handleScrollViewLayout}
      onContentSizeChange={handleContentSizeChange}
    >
      <SurveyQuestion
        question={currentQuestion}
        answer={currentAnswer}
        onAnswer={handleAnswer}
      />

      <View style={styles.footer}>
        <View style={{...styles.buttons, justifyContent: currentQuestionIndex > 0 ? 'space-between' : 'flex-end'}}>
          {currentQuestionIndex > 0 && (
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={handleBack}
            >
              <Text style={styles.secondaryButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.button, styles.primaryButton, isNextDisabled && styles.buttonDisabled]}
            onPress={handleNext}
            disabled={isNextDisabled}
          >
            <Text style={styles.primaryButtonText}>
              {nextLabel}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  </SurveyPopup>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 0,
    flexShrink: 1,
  },
  scrollContent: {
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    maxWidth: 360,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  closeButton: {
    fontSize: 22,
    color: '#8e8e93',
    paddingLeft: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#8e8e93',
    textAlign: 'center',
    marginBottom: 12,
  },
  footer: {
    paddingTop: 12,
  },
  progress: {
    textAlign: 'center',
    color: '#8e8e93',
    marginBottom: 10,
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    height: 44,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  secondaryButton: {
    borderColor: '#171717',
    borderWidth: 0,
    marginRight: 8,
  },
  primaryButton: {
    backgroundColor: '#171717',
  },
  secondaryButtonText: {
    color: '#171717',
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#f6f6f6',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Survey;