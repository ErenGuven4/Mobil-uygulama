// ============================================
// components/AnswerSlot.tsx — Cevap Yuvası
// ============================================
import React, { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  View,
} from 'react-native';
import { FONTS, RADIUS, SPACING } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface AnswerSlotProps {
  syllable?: string;
  index: number;
  onPress: () => void;
  status?: 'neutral' | 'correct' | 'wrong';
}

export default function AnswerSlot({
  syllable,
  index,
  onPress,
  status = 'neutral',
}: AnswerSlotProps) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const bounceAnim = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (syllable) {
      bounceAnim.setValue(0);
      Animated.spring(bounceAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 12,
        bounciness: 15,
      }).start();
    }
  }, [syllable]);

  useEffect(() => {
    if (status === 'wrong') {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
      ]).start();
    }
  }, [status]);

  const scale = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1],
  });

  const getStatusStyle = () => {
    switch (status) {
      case 'correct':
        return {
          backgroundColor: theme.successLight,
          borderColor: theme.success,
        };
      case 'wrong':
        return {
          backgroundColor: theme.errorLight,
          borderColor: theme.error,
        };
      default:
        return {};
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        getStatusStyle(),
        {
          transform: [
            { scale: syllable ? scale : 1 },
            { translateX: shakeAnim },
          ],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        disabled={!syllable}
        activeOpacity={0.7}
        style={styles.slot}
      >
        {syllable ? (
          <Text style={[
            styles.text,
            status === 'correct' && styles.correctText,
            status === 'wrong' && styles.wrongText,
          ]}>
            {syllable}
          </Text>
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>{index + 1}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    margin: SPACING.xs,
    borderRadius: RADIUS.md,
    backgroundColor: theme.answerSlot,
    borderWidth: 2,
    borderColor: theme.answerSlotBorder,
    borderStyle: 'dashed',
    minWidth: 70,
    minHeight: 55,
  },
  slot: {
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: FONTS.heading,
    fontWeight: FONTS.bold,
    color: theme.primary,
  },
  correctText: {
    color: theme.success,
  },
  wrongText: {
    color: theme.error,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: FONTS.caption,
    color: theme.disabled,
    fontWeight: FONTS.medium,
  },
});
