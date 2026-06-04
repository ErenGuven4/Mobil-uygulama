// Harfleri birleştirirken tıkladığımız hece butonunun tasarımını ve animasyonunu yaptığım bileşen.
import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface SyllableButtonProps {
  syllable: string;
  onPress: () => void;
  disabled?: boolean;
  selected?: boolean;
}

export default function SyllableButton({
  syllable,
  onPress,
  disabled = false,
  selected = false,
}: SyllableButtonProps) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Butona basıldığında küçülme efekti verdim.
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  // Parmak butondan çekildiğinde tekrar eski boyutuna gelmesini sağladım.
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

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    margin: SPACING.sm,
    borderRadius: RADIUS.lg,
    backgroundColor: theme.syllableBtn,
    borderWidth: 2,
    borderColor: theme.syllableBtnBorder,
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
    color: theme.primary,
  },
  disabled: {
    opacity: 0.3,
    backgroundColor: theme.disabled,
    borderColor: theme.disabled,
  },
  disabledText: {
    color: theme.textLight,
  },
  selected: {
    backgroundColor: theme.syllableBtnActive,
    borderColor: theme.primaryDark,
  },
  selectedText: {
    color: theme.textWhite,
  },
});
