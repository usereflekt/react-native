"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
const react_native_svg_1 = __importStar(require("react-native-svg"));
const { height: SCREEN_HEIGHT } = react_native_1.Dimensions.get('window');
const OPEN_SPRING_CONFIG = {
    damping: 28,
    stiffness: 320,
    mass: 0.9,
    overshootClamping: false,
};
const SurveyPopup = ({ visible, onClose, children, length = 0, current = 0, }) => {
    const [isMounted, setIsMounted] = (0, react_1.useState)(visible);
    const translateY = (0, react_native_reanimated_1.useSharedValue)(SCREEN_HEIGHT);
    const dragOffset = (0, react_native_reanimated_1.useSharedValue)(0);
    const sheetHeight = (0, react_native_reanimated_1.useSharedValue)(SCREEN_HEIGHT * 0.5);
    const keyboardOffset = (0, react_native_reanimated_1.useSharedValue)(0);
    const isKeyboardOpen = (0, react_native_reanimated_1.useSharedValue)(0);
    const rawProgress = length > 0 ? current / length : 0;
    const clampedProgress = Math.max(0, Math.min(rawProgress, 1));
    const progressValue = (0, react_native_reanimated_1.useSharedValue)(clampedProgress);
    (0, react_1.useEffect)(() => {
        if (visible) {
            setIsMounted(true);
            translateY.value = (0, react_native_reanimated_1.withSpring)(0, OPEN_SPRING_CONFIG);
        }
        else {
            translateY.value = (0, react_native_reanimated_1.withTiming)(SCREEN_HEIGHT, { duration: 200 }, (finished) => {
                if (finished) {
                    (0, react_native_reanimated_1.runOnJS)(setIsMounted)(false);
                }
            });
        }
    }, [visible, translateY]);
    (0, react_1.useEffect)(() => {
        progressValue.value = (0, react_native_reanimated_1.withTiming)(clampedProgress, {
            duration: 220,
        });
    }, [clampedProgress, progressValue]);
    (0, react_1.useEffect)(() => {
        const keyboardWillShow = react_native_1.Keyboard.addListener(react_native_1.Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', (e) => {
            keyboardOffset.value = (0, react_native_reanimated_1.withSpring)(e.endCoordinates.height, OPEN_SPRING_CONFIG);
            isKeyboardOpen.value = 1;
        });
        const keyboardWillHide = react_native_1.Keyboard.addListener(react_native_1.Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => {
            keyboardOffset.value = (0, react_native_reanimated_1.withSpring)(0, OPEN_SPRING_CONFIG);
            isKeyboardOpen.value = 0;
        });
        return () => {
            keyboardWillShow.remove();
            keyboardWillHide.remove();
        };
    }, [keyboardOffset, isKeyboardOpen, sheetHeight]);
    const sheetStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
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
    const backdropStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => {
        const y = Math.min(Math.max(translateY.value, 0), SCREEN_HEIGHT);
        return {
            opacity: (0, react_native_reanimated_1.interpolate)(y, [0, SCREEN_HEIGHT], [1, 0]),
        };
    });
    const progressAnimatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(() => ({
        width: `${progressValue.value * 100}%`,
    }));
    const dismissKeyboard = () => {
        react_native_1.Keyboard.dismiss();
    };
    const panGesture = react_native_gesture_handler_1.Gesture.Pan()
        .onStart(() => {
        dragOffset.value = translateY.value;
    })
        .onUpdate((event) => {
        const nextY = dragOffset.value + event.translationY;
        if (isKeyboardOpen.value > 0 && event.translationY > 20) {
            (0, react_native_reanimated_1.runOnJS)(dismissKeyboard)();
        }
        translateY.value = nextY;
    })
        .onEnd((event) => {
        if (translateY.value <= 0) {
            translateY.value = (0, react_native_reanimated_1.withSpring)(0, OPEN_SPRING_CONFIG);
            return;
        }
        const shouldCloseByPosition = translateY.value > sheetHeight.value * 0.6;
        const shouldCloseByFling = translateY.value > SCREEN_HEIGHT * 0.05 && event.velocityY > 1000;
        const shouldClose = shouldCloseByPosition || shouldCloseByFling;
        if (shouldClose && isKeyboardOpen.value === 0) {
            translateY.value = (0, react_native_reanimated_1.withTiming)(SCREEN_HEIGHT, { duration: 200 }, (finished) => {
                if (finished) {
                    (0, react_native_reanimated_1.runOnJS)(onClose)();
                }
            });
        }
        else {
            translateY.value = (0, react_native_reanimated_1.withSpring)(0, OPEN_SPRING_CONFIG);
        }
    });
    if (!isMounted)
        return null;
    const handleBackdropPress = () => {
        react_native_1.Keyboard.dismiss();
        onClose();
    };
    return (<react_native_1.View style={react_native_1.StyleSheet.absoluteFill} pointerEvents="box-none">
      <react_native_reanimated_1.default.View style={[styles.backdrop, backdropStyle]} pointerEvents={visible ? 'auto' : 'none'}>
        <react_native_1.Pressable style={react_native_1.StyleSheet.absoluteFill} onPress={handleBackdropPress}/>
      </react_native_reanimated_1.default.View>

      <react_native_1.View style={styles.bottomContainer} pointerEvents="box-none">
        <react_native_gesture_handler_1.GestureDetector gesture={panGesture}>
          <react_native_1.TouchableWithoutFeedback onPress={react_native_1.Keyboard.dismiss}>
            <react_native_reanimated_1.default.View style={[styles.sheet, sheetStyle]} onLayout={(event) => {
            sheetHeight.value = event.nativeEvent.layout.height;
        }}>
              <react_native_1.View style={styles.headerContainer}>
                <react_native_1.Text style={styles.progressText}>
                  {current} of {length}
                </react_native_1.Text>
                <react_native_1.View style={styles.progressTrack}>
                  <react_native_reanimated_1.default.View style={[styles.progressFill, progressAnimatedStyle]}/>
                </react_native_1.View>
                <react_native_1.Pressable style={styles.closeButton} onPress={onClose} hitSlop={12}>
                  <react_native_svg_1.default width={14} height={14} viewBox="0 0 12 12">
                    <react_native_svg_1.Path d="M3 3L9 9" stroke="#8e8e93" strokeWidth={1.5} strokeLinecap="round"/>
                    <react_native_svg_1.Path d="M9 3L3 9" stroke="#8e8e93" strokeWidth={1.5} strokeLinecap="round"/>
                  </react_native_svg_1.default>
                </react_native_1.Pressable>
              </react_native_1.View>
              <react_native_1.View style={styles.contentContainer}>
                {children}
                <react_native_1.View pointerEvents="none" style={styles.bottomGradient}>
                  <react_native_svg_1.default width="100%" height="100%">
                    <react_native_svg_1.Defs>
                      <react_native_svg_1.LinearGradient id="bottomWhiteFade" x1="0" y1="0" x2="0" y2="1">
                        <react_native_svg_1.Stop offset="0" stopColor="#ffffff" stopOpacity="0"/>
                        <react_native_svg_1.Stop offset="1" stopColor="#ffffff" stopOpacity="1"/>
                      </react_native_svg_1.LinearGradient>
                    </react_native_svg_1.Defs>
                    <react_native_svg_1.Rect x="0" y="0" width="100%" height="100%" fill="url(#bottomWhiteFade)"/>
                  </react_native_svg_1.default>
                </react_native_1.View>
              </react_native_1.View>
            </react_native_reanimated_1.default.View>
          </react_native_1.TouchableWithoutFeedback>
        </react_native_gesture_handler_1.GestureDetector>
      </react_native_1.View>
    </react_native_1.View>);
};
const styles = react_native_1.StyleSheet.create({
    backdrop: {
        ...react_native_1.StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    bottomContainer: {
        ...react_native_1.StyleSheet.absoluteFillObject,
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
exports.default = SurveyPopup;
