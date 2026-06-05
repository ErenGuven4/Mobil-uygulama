// Haritadaki her bir seviye düğümünün (dairelerin) animasyonunu ve durumlarını tasarladığım bileşen.
// completed: Tamamlanmış (yeşil), current: Aktif (mor+titreyen), locked: Kilitli (gri).
import React, { useRef, useEffect } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

// Bu bileşenin dışardan aldığı prop'lar:
interface LevelNodeProps {
  levelId: number;                                     // Bölüm numarası (ekranda görünür)
  name: string;                                        // Bölüm adı (düğümün altında)
  status: 'completed' | 'current' | 'locked';         // Bölümün durumu
  onPress: () => void;                                 // Basınca çalışacak fonksiyon
}

export default function LevelNode({
  levelId,
  name,
  status,
  onPress,
}: LevelNodeProps) {
  const { theme } = useTheme();
  const styles = getStyles(theme);

  // pulseAnim: aktif seviyenin nabzı gibi büyüyüp küçülmesi için (sürekli döngü)
  // fadeAnim: düğüm ekrana belirirken saydamsızlık (0→1)
  // slideAnim: düğüm aşağıdan yukarıya kayarak açılır (30→0 piksel)
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Bileşen ekranda göründüğünde hem fade+slide başlatılır, hem aktifse pulse tetiklenir.
  // levelId * 150ms delay → düğümler sırayla açılır (1. bölüm önce, 5. bölüm en son).
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: levelId * 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: levelId * 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Aktif seviye için: 1→1.1→1 arası sürekli döngü → nabzı simgeler.
    // return () => pulse.stop() → bileşen silinince animasyon durdurulur.
    if (status === 'current') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [status]);

  // Duruma göre düğümün içindeki emoji örneği: tamamlanan→✅, aktif→⭐, kilitli→🔒
  const getStatusEmoji = () => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'current':
        return '⭐';
      case 'locked':
        return '🔒';
    }
  };

  // Duruma göre düğüm arka plan rengi: tamamlanan→yeşil, aktif→mor, kilitli→gri
  const getNodeColor = () => {
    switch (status) {
      case 'completed':
        return theme.levelCompleted;
      case 'current':
        return theme.levelCurrent;
      case 'locked':
        return theme.levelLocked;
    }
  };

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: status === 'current' ? pulseAnim : 1 },
          ],
        },
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        disabled={status === 'locked'}
        activeOpacity={0.7}
        style={[
          styles.node,
          { backgroundColor: getNodeColor() },
          status === 'current' && styles.currentNode,
          status === 'locked' && styles.lockedNode,
        ]}
      >
        <Text style={styles.emoji}>{getStatusEmoji()}</Text>
        <Text
          style={[
            styles.levelNumber,
            status === 'locked' && styles.lockedText,
          ]}
        >
          {levelId}
        </Text>
      </TouchableOpacity>

      <Text
        style={[
          styles.name,
          status === 'locked' && styles.lockedNameText,
        ]}
      >
        {name}
      </Text>
    </Animated.View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    marginVertical: SPACING.md,
  },
  node: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.large,
  },
  currentNode: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: theme.warning,
  },
  lockedNode: {
    opacity: 0.5,
  },
  emoji: {
    fontSize: 24,
    marginBottom: 2,
  },
  levelNumber: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.bold,
    color: theme.textWhite,
  },
  lockedText: {
    color: theme.levelLockedText,
  },
  name: {
    marginTop: SPACING.sm,
    fontSize: FONTS.caption,
    fontWeight: FONTS.semiBold,
    color: theme.text,
    textAlign: 'center',
    maxWidth: 120,
  },
  lockedNameText: {
    color: theme.levelLockedText,
  },
});
