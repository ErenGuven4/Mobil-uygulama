// ============================================
// components/SyllableButton.tsx — Hece Butonu
// ============================================
// Oyun ekranında karışık sırada gösterilen
// her bir hece için tıklanabilir buton.
// ============================================

import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';

interface SyllableButtonProps {
  /** Hece metni (ör: "El", "ma") */
  syllable: string;
  /** Buton tıklandığında çağrılacak fonksiyon */
  onPress: () => void;
  /** Buton devre dışı mı? (seçildiyse true) */
  disabled?: boolean;
  /** Buton seçili mi? */
  selected?: boolean;
}

export default function SyllableButton({
  syllable,
  onPress,
  disabled = false,
  selected = false,
}: SyllableButtonProps) {
  // Animasyon değeri — tıklama efekti için
  const scaleAnim = useRef(new Animated.Value(1)).current;

  /**
   * Butona basıldığında küçülme efekti
   */
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  /**
   * Butondan el çekildiğinde geri büyüme
   */
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 8,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ scale: scaleAnim }] },
        disabled && styles.disabled,
        selected && styles.selected,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.8}
        style={styles.button}
      >
        <Text
          style={[
            styles.text,
            disabled && styles.disabledText,
            selected && styles.selectedText,
          ]}
        >
          {syllable}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: SPACING.sm,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.syllableBtn,
    borderWidth: 2,
    borderColor: COLORS.syllableBtnBorder,
    ...SHADOWS.medium,
  },
  button: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  text: {
    fontSize: FONTS.heading,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
  },
  disabled: {
    opacity: 0.3,
    backgroundColor: COLORS.disabled,
    borderColor: COLORS.disabled,
  },
  disabledText: {
    color: COLORS.textLight,
  },
  selected: {
    backgroundColor: COLORS.syllableBtnActive,
    borderColor: COLORS.primaryDark,
  },
  selectedText: {
    color: COLORS.textWhite,
  },
});
