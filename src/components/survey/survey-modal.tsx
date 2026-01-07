import React, { useEffect, useState } from 'react';
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
  const [isMounted, setIsMounted] = useState(visible);

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
      dragOffset.value = translateY.value;
    })
    .onUpdate((event) => {
      const nextY = dragOffset.value + event.translationY;
      if (isKeyboardOpen.value > 0 && event.translationY > 20) {
        runOnJS(dismissKeyboard)();
      }
      translateY.value = nextY;
    })
    .onEnd((event) => {
      if (translateY.value <= 0) {
        translateY.value = withSpring(0, OPEN_SPRING_CONFIG);
        return;
      }

      const shouldCloseByPosition = translateY.value > sheetHeight.value * 0.6;
      const shouldCloseByFling =
        translateY.value > SCREEN_HEIGHT * 0.05 && event.velocityY > 1000;

      const shouldClose = shouldCloseByPosition || shouldCloseByFling;

      if (shouldClose && isKeyboardOpen.value === 0) {
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
    Keyboard.dismiss();
    onClose();
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
              style={[styles.sheet, sheetStyle]}
              onLayout={(event) => {
                sheetHeight.value = event.nativeEvent.layout.height;
              }}
            >
              <View style={styles.headerContainer}>
                <Text style={styles.progressText}>
                  {current} of {length}
                </Text>
                <View style={styles.progressTrack}>
                  <Animated.View
                    style={[styles.progressFill, progressAnimatedStyle]}
                  />
                </View>
                <Pressable
                  style={styles.closeButton}
                  onPress={onClose}
                  hitSlop={12}
                >
                  <Svg width={14} height={14} viewBox="0 0 12 12">
                    <Path
                      d="M3 3L9 9"
                      stroke="#8e8e93"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                    />
                    <Path
                      d="M9 3L3 9"
                      stroke="#8e8e93"
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
                        <Stop offset="0" stopColor="#ffffff" stopOpacity="0" />
                        <Stop offset="1" stopColor="#ffffff" stopOpacity="1" />
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

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  bottomContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  sheet: {
    borderRadius: 24,
    paddingTop: 12,
    backgroundColor: '#ffffff',
    maxHeight: SCREEN_HEIGHT * 0.85,
    overflow: 'hidden',
    gap: 12,
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
  progressText: {
    fontSize: 12,
    color: '#8e8e93',
  },
  progressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#000000',
  },
  closeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
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