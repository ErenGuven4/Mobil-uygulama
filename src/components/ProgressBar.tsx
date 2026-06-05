// Oyun içinde kaçıncı kelimede olduğumuzu gösteren ilerleme çubuğu (progress bar) bileşeni.
// current/total oranına göre çubuk animasyonlu olarak genilir.
import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { FONTS, RADIUS, SPACING } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

// Props: current → şu anda kaçıncı kelime, total → toplam kelime sayısı
interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  // widthAnim: 0 (boş) ile 100 (öo) arasında animate edilecek yüzde değeri
  const widthAnim = useRef(new Animated.Value(0)).current;

  // current veya total değiştiğinde çubuğun genişliği animasyonlu olarak güncelleniyor.
  // percentage: kaçıncı kelimede olduğumuzu yüzde olarak hesaplıyoruz.
  // useNativeDriver:false → width animasyonu JS side gerektirir (layout animasyonu)
  useEffect(() => {
    const percentage = total > 0 ? (current / total) * 100 : 0;
    Animated.timing(widthAnim, {
      toValue: percentage,
      duration: 500,      // 500ms’de yavaşça genile
      useNativeDriver: false,
    }).start();
  }, [current, total]);

  // widthAnim (0-100) değerini CSS yüzde stringe (“0%”-“100%”) çeviriyoruz.
  // Bu sayede Animated.View içinde width prop’u olarak kullanılabilir.
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
