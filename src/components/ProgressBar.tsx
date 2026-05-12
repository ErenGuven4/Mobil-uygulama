// ============================================
// components/ProgressBar.tsx — İlerleme Çubuğu
// ============================================
// Oyun ekranında kaçıncı kelimede olduğunu
// gösteren animasyonlu ilerleme çubuğu.
// ============================================

import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, FONTS, RADIUS, SPACING } from '../constants/theme';

interface ProgressBarProps {
  /** Şu anki kelime indeksi (0'dan başlar) */
  current: number;
  /** Toplam kelime sayısı */
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const widthAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const percentage = total > 0 ? (current / total) * 100 : 0;
    Animated.timing(widthAnim, {
      toValue: percentage,
      duration: 500,
      useNativeDriver: false, // width animasyonu native driver desteklemez
    }).start();
  }, [current, total]);

  const animatedWidth = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.barBackground}>
        <Animated.View
          style={[
            styles.barFill,
            { width: animatedWidth },
          ]}
        />
      </View>
      <Text style={styles.text}>
        {current}/{total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  barBackground: {
    flex: 1,
    height: 12,
    backgroundColor: COLORS.secondaryLight,
    borderRadius: RADIUS.round,
    overflow: 'hidden',
    marginRight: SPACING.sm,
  },
  barFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.round,
  },
  text: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
    minWidth: 35,
    textAlign: 'right',
  },
});
