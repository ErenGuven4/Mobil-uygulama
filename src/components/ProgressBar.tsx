// Oyun içinde kaçıncı kelimede olduğumuzu gösteren ilerleme çubuğu (progress bar) bileşeni.
import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { FONTS, RADIUS, SPACING } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const widthAnim = useRef(new Animated.Value(0)).current;

  // Mevcut heceleme durumuna göre ilerleme yüzdesini hesaplayıp genişliği animasyonlu olarak artırdım.
  useEffect(() => {
    const percentage = total > 0 ? (current / total) * 100 : 0;
    Animated.timing(widthAnim, {
      toValue: percentage,
      duration: 500,
      useNativeDriver: false,
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

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  barBackground: {
    flex: 1,
    height: 12,
    backgroundColor: theme.secondaryLight,
    borderRadius: RADIUS.round,
    overflow: 'hidden',
    marginRight: SPACING.sm,
  },
  barFill: {
    height: '100%',
    backgroundColor: theme.primary,
    borderRadius: RADIUS.round,
  },
  text: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.bold,
    color: theme.primary,
    minWidth: 35,
    textAlign: 'right',
  },
});
