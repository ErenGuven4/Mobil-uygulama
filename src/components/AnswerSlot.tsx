// ============================================
// components/AnswerSlot.tsx — Cevap Yuvası
// ============================================
// Çocuğun seçtiği hecelerin sırayla
// yerleştirildiği kutucuklar.
// ============================================

import React, { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  View,
} from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';

interface AnswerSlotProps {
  /** Yuvadaki hece (boşsa undefined) */
  syllable?: string;
  /** Yuva indeksi */
  index: number;
  /** Tıklandığında heceyi geri gönder */
  onPress: () => void;
  /** Doğru mu yanlış mı gösterimi */
  status?: 'neutral' | 'correct' | 'wrong';
}

export default function AnswerSlot({
  syllable,
  index,
  onPress,
  status = 'neutral',
}: AnswerSlotProps) {
  // Yeni hece geldiğinde bounce animasyonu
  const bounceAnim = useRef(new Animated.Value(0)).current;
  // Yanlış cevapta titreme animasyonu
  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (syllable) {
      // Hece yerleştiğinde bounce efekti
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
      // Yanlış cevapta titreme animasyonu
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

  // Duruma göre renk seç
  const getStatusStyle = () => {
    switch (status) {
      case 'correct':
        return {
          backgroundColor: COLORS.successLight,
          borderColor: COLORS.success,
        };
      case 'wrong':
        return {
          backgroundColor: COLORS.errorLight,
          borderColor: COLORS.error,
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

const styles = StyleSheet.create({
  container: {
    margin: SPACING.xs,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.answerSlot,
    borderWidth: 2,
    borderColor: COLORS.answerSlotBorder,
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
    color: COLORS.primary,
  },
  correctText: {
    color: COLORS.success,
  },
  wrongText: {
    color: COLORS.error,
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: FONTS.caption,
    color: COLORS.disabled,
    fontWeight: FONTS.medium,
  },
});
