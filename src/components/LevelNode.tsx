// ============================================
// components/LevelNode.tsx — Seviye Düğümü
// ============================================
// Seviye seçim ekranındaki Duolingo tarzı
// yol haritası düğümleri.
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

interface LevelNodeProps {
  /** Seviye numarası */
  levelId: number;
  /** Seviye adı */
  name: string;
  /** Seviye durumu */
  status: 'completed' | 'current' | 'locked';
  /** Tıklandığında */
  onPress: () => void;
}

export default function LevelNode({
  levelId,
  name,
  status,
  onPress,
}: LevelNodeProps) {
  // Aktif seviye için nabız (pulse) animasyonu
  const pulseAnim = useRef(new Animated.Value(1)).current;
  // Giriş animasyonu
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Giriş animasyonu
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: levelId * 150, // Her seviye sırayla görünsün
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: levelId * 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Aktif seviye nabız animasyonu
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

  // Duruma göre emoji
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

  // Duruma göre arka plan rengi
  const getNodeColor = () => {
    switch (status) {
      case 'completed':
        return COLORS.levelCompleted;
      case 'current':
        return COLORS.levelCurrent;
      case 'locked':
        return COLORS.levelLocked;
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

const styles = StyleSheet.create({
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
    borderColor: COLORS.warning,
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
    color: COLORS.textWhite,
  },
  lockedText: {
    color: COLORS.levelLockedText,
  },
  name: {
    marginTop: SPACING.sm,
    fontSize: FONTS.caption,
    fontWeight: FONTS.semiBold,
    color: COLORS.text,
    textAlign: 'center',
    maxWidth: 120,
  },
  lockedNameText: {
    color: COLORS.levelLockedText,
  },
});
