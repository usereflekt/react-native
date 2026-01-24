import React, { useEffect, useMemo, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';
import { useTheme, withOpacity } from '../../theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const OPEN_SPRING_CONFIG = {
  damping: 28,
  stiffness: 320,
  mass: 0.9,
  overshootClamping: false,
} as const;

interface SurveyPopupProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  length?: number;
  current?: number;
}

const SurveyPopup: React.FC<SurveyPopupProps> = ({
  visible,
  onClose,
  children,
  length = 0,
  current = 0,
}) => {
  const theme = useTheme();
  const [isMounted, setIsMounted] = useState(visible);

  // Generate dynamic styles based on theme
  const themedStyles = useMemo(() => StyleSheet.create({
    sheet: {
      borderRadius: theme.borderRadius.sheet,
      paddingTop: 12,
      backgroundColor: theme.colors.background,
      maxHeight: SCREEN_HEIGHT * 0.85,
      overflow: 'hidden',
      gap: 12,
    },
    progressText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    progressTrack: {
      flex: 1,
      height: 6,
      borderRadius: 2,
      backgroundColor: withOpacity(theme.colors.primary, 0.08),
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 2,
      backgroundColor: theme.colors.primary,
    },
    closeButton: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: withOpacity(theme.colors.primary, 0.06),
      alignItems: 'center',
      justifyContent: 'center',
    },
  }), [theme]);

  const translateY = useSharedValue(SCREEN_HEIGHT);
  const dragOffset = useSharedValue(0);
  const sheetHeight = useSharedValue(SCREEN_HEIGHT * 0.5);
  const keyboardOffset = useSharedValue(0);
  const isKeyboardOpen = useSharedValue(0);

  const rawProgress = length > 0 ? current / length : 0;
  const clampedProgress = Math.max(0, Math.min(rawProgress, 1));
  const progressValue = useSharedValue(clampedProgress);

  useEffect(() => {
    if (visible) {
      setIsMounted(true);
      translateY.value = withSpring(0, OPEN_SPRING_CONFIG);
    } else {
      translateY.value = withTiming(
        SCREEN_HEIGHT,
        { duration: 200 },
        (finished) => {
          if (finished) {
            runOnJS(setIsMounted)(false);
          }
        }
      );
    }
  }, [visible, translateY]);

  useEffect(() => {
    progressValue.value = withTiming(clampedProgress, {
      duration: 220,
    });
  }, [clampedProgress, progressValue]);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        keyboardOffset.value = withSpring(e.endCoordinates.height, OPEN_SPRING_CONFIG);
        isKeyboardOpen.value = 1;
      }
    );

    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        keyboardOffset.value = withSpring(0, OPEN_SPRING_CONFIG);
        isKeyboardOpen.value = 0;
      }
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, [keyboardOffset, isKeyboardOpen, sheetHeight]);

  const sheetStyle = useAnimatedStyle(() => {
    let dragTranslate = translateY.value;

    if (dragTranslate < 0) {
      const clamped = Math.max(dragTranslate, -SCREEN_HEIGHT);
      const normalized = Math.pow(Math.min(Math.abs(clamped) / SCREEN_HEIGHT, 1), 2);
      const resistance = 3 + (6 - 3) * normalized;
      dragTranslate = clamped / resistance;
    }

    const translate = dragTranslate - keyboardOffset.value;

    return {
      transform: [{ translateY: translate }],
    };
  });

  const backdropStyle = useAnimatedStyle(() => {
    const y = Math.min(Math.max(translateY.value, 0), SCREEN_HEIGHT);

    return {
      opacity: interpolate(y, [0, SCREEN_HEIGHT], [1, 0]),
    };
  });

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressValue.value * 100}%`,
  }));

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      'worklet';
      dragOffset.value = translateY.value;
    })
    .onUpdate((event) => {
      'worklet';
      translateY.value = dragOffset.value + event.translationY;
    })
    .onEnd((event) => {
      'worklet';
      if (translateY.value <= 0) {
        translateY.value = withSpring(0, OPEN_SPRING_CONFIG);
        return;
      }
      
      const isKeyboardOpenValue = isKeyboardOpen.value > 0;
      const shouldCloseByPosition = translateY.value > sheetHeight.value * 0.6;
      const shouldCloseByFling =
        translateY.value > SCREEN_HEIGHT * 0.05 && event.velocityY > 1000;

      if (isKeyboardOpenValue && event.translationY > 20) {
        runOnJS(dismissKeyboard)();
      }

      const shouldClose = shouldCloseByPosition || shouldCloseByFling;

      if (shouldClose && !isKeyboardOpenValue) {
        translateY.value = withTiming(
          SCREEN_HEIGHT,
          { duration: 200 },
          (finished) => {
            if (finished) {
              runOnJS(onClose)();
            }
          }
        );
      } else {
        translateY.value = withSpring(0, OPEN_SPRING_CONFIG);
      }
    });

  if (!isMounted) return null;

  const handleBackdropPress = () => {
    if (isKeyboardOpen.value > 0) {
      Keyboard.dismiss();
    }
    else {
      onClose();
    }
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <Animated.View
        style={[styles.backdrop, backdropStyle]}
        pointerEvents={visible ? 'auto' : 'none'}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={handleBackdropPress} />
      </Animated.View>

      <View style={styles.bottomContainer} pointerEvents="box-none">
        <GestureDetector gesture={panGesture}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Animated.View
              style={[themedStyles.sheet, sheetStyle]}
              onLayout={(event) => {
                sheetHeight.value = event.nativeEvent.layout.height;
              }}
            >
              <View style={styles.headerContainer}>
                <Text style={themedStyles.progressText}>
                  {current} of {length}
                </Text>
                <View style={themedStyles.progressTrack}>
                  <Animated.View
                    style={[themedStyles.progressFill, progressAnimatedStyle]}
                  />
                </View>
                <Pressable
                  style={themedStyles.closeButton}
                  onPress={onClose}
                  hitSlop={12}
                >
                  <Svg width={14} height={14} viewBox="0 0 12 12">
                    <Path
                      d="M3 3L9 9"
                      stroke={theme.colors.textSecondary}
                      strokeWidth={1.5}
                      strokeLinecap="round"
                    />
                    <Path
                      d="M9 3L3 9"
                      stroke={theme.colors.textSecondary}
                      strokeWidth={1.5}
                      strokeLinecap="round"
                    />
                  </Svg>
                </Pressable>
              </View>
              <View style={styles.contentContainer}>
                {children}
                <View pointerEvents="none" style={styles.bottomGradient}>
                  <Svg width="100%" height="100%">
                    <Defs>
                      <LinearGradient
                        id="bottomWhiteFade"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <Stop offset="0" stopColor={theme.colors.background} stopOpacity="0" />
                        <Stop offset="1" stopColor={theme.colors.background} stopOpacity="1" />
                      </LinearGradient>
                    </Defs>
                    <Rect
                      x="0"
                      y="0"
                      width="100%"
                      height="100%"
                      fill="url(#bottomWhiteFade)"
                    />
                  </Svg>
                </View>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </GestureDetector>
      </View>
    </View>
  );
};

// Static styles that don't depend on theme
const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'flex-end',
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  contentContainer: {
    paddingHorizontal: 0,
    flexShrink: 1,
    minHeight: 0,
    position: 'relative',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
  },
  bottomGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 20,
  },
});

export default SurveyPopup;