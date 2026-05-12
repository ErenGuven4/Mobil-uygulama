// ============================================
// components/FeedbackModal.tsx — Geri Bildirim
// ============================================
import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, TouchableOpacity, Modal,
} from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';

interface FeedbackModalProps {
  visible: boolean;
  type: 'correct' | 'wrong';
  message?: string;
  onClose: () => void;
}

export default function FeedbackModal({
  visible, type, message, onClose,
}: FeedbackModalProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0);
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 8,
        bounciness: 12,
      }).start();

      // Doğru cevapta 1.5 saniye sonra otomatik kapat
      if (type === 'correct') {
        const timer = setTimeout(onClose, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [visible, type]);

  const isCorrect = type === 'correct';

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[
          styles.card,
          {
            backgroundColor: isCorrect ? COLORS.successLight : COLORS.errorLight,
            transform: [{ scale: scaleAnim }],
          },
        ]}>
          <Text style={styles.emoji}>
            {isCorrect ? '🎉' : '😅'}
          </Text>
          <Text style={[
            styles.title,
            { color: isCorrect ? COLORS.success : COLORS.error },
          ]}>
            {isCorrect ? 'Aferin!' : 'Tekrar Dene!'}
          </Text>
          <Text style={styles.message}>
            {message || (isCorrect ? 'Harika, doğru bildin! 🌟' : 'Yaklaştın, bir daha dene! 💪')}
          </Text>
          {!isCorrect && (
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Tamam</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '80%',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    ...SHADOWS.large,
  },
  emoji: { fontSize: 64, marginBottom: SPACING.md },
  title: { fontSize: FONTS.title, fontWeight: FONTS.bold, marginBottom: SPACING.sm },
  message: { fontSize: FONTS.body, color: COLORS.text, textAlign: 'center', marginBottom: SPACING.lg },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.round,
  },
  buttonText: { color: COLORS.textWhite, fontSize: FONTS.body, fontWeight: FONTS.bold },
});
