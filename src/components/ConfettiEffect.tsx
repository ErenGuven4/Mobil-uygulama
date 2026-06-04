// Kelime doğru hecelendiğinde ekrandan aşağı dökülen konfeti animasyonunu tasarladığım bileşen.
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

const { width: SW, height: SH } = Dimensions.get('window');
const CONFETTI_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#F1948A', '#82E0AA',
];

interface Props {
  visible: boolean;
  onComplete?: () => void;
}

export default function ConfettiEffect({ visible, onComplete }: Props) {
  // Ekrana rastgele saçılacak 25 adet konfeti parçasının ilk ayarlarını yaptım.
  const anims = useRef(
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      y: new Animated.Value(-60),
      x: new Animated.Value(Math.random() * SW),
      rot: new Animated.Value(0),
      sc: new Animated.Value(0),
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: Math.random() * 10 + 6,
    }))
  ).current;

  // Konfetiler görünür olduğunda aşağı düşme, dönme ve küçülme animasyonlarını başlattım.
  useEffect(() => {
    if (!visible) return;
    const animations = anims.map((p, i) => {
      p.x.setValue(Math.random() * SW);
      p.y.setValue(-60 - Math.random() * 100);
      p.rot.setValue(0);
      p.sc.setValue(0);
      const delay = i * 40;
      return Animated.parallel([
        Animated.timing(p.y, { toValue: SH + 50, duration: 2200, delay, useNativeDriver: true }),
        Animated.timing(p.rot, { toValue: 10, duration: 2200, delay, useNativeDriver: true }),
        Animated.sequence([
          Animated.timing(p.sc, { toValue: 1, duration: 300, delay, useNativeDriver: true }),
          Animated.timing(p.sc, { toValue: 0.3, duration: 1900, useNativeDriver: true }),
        ]),
      ]);
    });
    Animated.parallel(animations).start(() => onComplete?.());
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {anims.map((p) => (
        <Animated.View
          key={p.id}
          style={{
            position: 'absolute',
            backgroundColor: p.color,
            width: p.size,
            height: p.size,
            borderRadius: p.size / 2,
            transform: [
              { translateX: p.x },
              { translateY: p.y },
              { rotate: p.rot.interpolate({ inputRange: [0, 10], outputRange: ['0deg', '3600deg'] }) },
              { scale: p.sc },
            ],
          }}
        />
      ))}
    </View>
  );
}
