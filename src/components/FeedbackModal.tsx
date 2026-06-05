// Heceleme bittikten sonra doğru veya yanlış bildirim penceresini (pop-up) açtığım modal bileşeni.
// Doğru cevap 1.5 saniye sonra otomatik kapanır; yanlışta "Tamam" butonu görünür.
import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, TouchableOpacity, Modal,
} from 'react-native';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

// Bu bileşenin dışardan aldığı prop'lar:
interface FeedbackModalProps {
  visible: boolean;                // Modal görünür mü?
  type: 'correct' | 'wrong';       // Doğru mu yanlış mı?
  message?: string;                // Opsiyonel özel mesaj (yoksa varsayılan kullanılır)
  onClose: () => void;             // Modal kapanınca çağrılır
}

export default function FeedbackModal({
  visible, type, message, onClose,
}: FeedbackModalProps) {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  // scaleAnim: modalin sıfırdan yaylanarak (spring) büyüme animasyonu için
  const scaleAnim = useRef(new Animated.Value(0)).current;

  // Modal göründüğünde yaylanarak (spring) büyüme animasyonu başlatılıyor.
  // Doğru cevapta 1.5 saniye sonra modal otomatik kapanıyor (setTimeout).
  // cleanup fonksiyonu: bileşen unmount olursa timer iptal ediliyor (bellek sızıntısı önleniyor).
  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0);
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 8,
        bounciness: 12,
      }).start();

      if (type === 'correct') {
        const timer = setTimeout(onClose, 1500); // 1.5 saniye sonra kapat
        return () => clearTimeout(timer);         // temizle
      }
    }
  }, [visible, type]);

  // Doğru ise isCorrect=true, yanlış ise false. Bu değere göre renk, emoji ve metin seçilir.
  const isCorrect = type === 'correct';

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[
          styles.card,
          {
            backgroundColor: isCorrect ? theme.successLight : theme.errorLight,
            transform: [{ scale: scaleAnim }],
          },
        ]}>
          <Text style={styles.emoji}>
            {isCorrect ? '🎉' : '😅'}
          </Text>
          <Text style={[
            styles.title,
            { color: isCorrect ? theme.success : theme.error },
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

const getStyles = (theme: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.overlay,
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
  message: { fontSize: FONTS.body, color: theme.text, textAlign: 'center', marginBottom: SPACING.lg },
  button: {
    backgroundColor: theme.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.round,
  },
  buttonText: { color: theme.textWhite, fontSize: FONTS.body, fontWeight: FONTS.bold },
});
