// ============================================
// screens/SplashScreen.tsx — Karşılama Ekranı
// ============================================
import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, TouchableOpacity,
  StatusBar, Image,
} from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';

interface Props {
  navigation: any;
}

export default function SplashScreen({ navigation }: Props) {
  const logoScale = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(30)).current;
  const btnOpacity = useRef(new Animated.Value(0)).current;
  const btnBounce = useRef(new Animated.Value(0)).current;
  const bgAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sıralı giriş animasyonları
    Animated.sequence([
      // 1. Logo büyüsün
      Animated.spring(logoScale, {
        toValue: 1, useNativeDriver: true, speed: 4, bounciness: 14,
      }),
      // 2. Başlık görünsün
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1, duration: 600, useNativeDriver: true,
        }),
        Animated.timing(titleSlide, {
          toValue: 0, duration: 600, useNativeDriver: true,
        }),
      ]),
      // 3. Buton görünsün
      Animated.timing(btnOpacity, {
        toValue: 1, duration: 400, useNativeDriver: true,
      }),
    ]).start(() => {
      // Buton zıplama animasyonu (sonsuz döngü)
      Animated.loop(
        Animated.sequence([
          Animated.timing(btnBounce, {
            toValue: -8, duration: 600, useNativeDriver: true,
          }),
          Animated.timing(btnBounce, {
            toValue: 0, duration: 600, useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // Arka plan renk geçişi
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgAnim, {
          toValue: 1, duration: 3000, useNativeDriver: false,
        }),
        Animated.timing(bgAnim, {
          toValue: 0, duration: 3000, useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.backgroundGradientStart, COLORS.backgroundGradientEnd],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle="dark-content" />

      {/* Dekoratif arka plan emojileri */}
      <View style={styles.bgEmojis}>
        <Text style={[styles.bgEmoji, { top: '10%', left: '10%' }]}>📚</Text>
        <Text style={[styles.bgEmoji, { top: '15%', right: '15%' }]}>✨</Text>
        <Text style={[styles.bgEmoji, { top: '70%', left: '5%' }]}>🌈</Text>
        <Text style={[styles.bgEmoji, { top: '75%', right: '10%' }]}>⭐</Text>
        <Text style={[styles.bgEmoji, { top: '40%', left: '2%' }]}>🎈</Text>
        <Text style={[styles.bgEmoji, { top: '55%', right: '5%' }]}>🦋</Text>
      </View>

      {/* Logo / Maskot */}
      <Animated.View style={[
        styles.logoContainer,
        { transform: [{ scale: logoScale }] },
      ]}>
        {/* Kendi logon için: frontend/assets/logo.png dosyasını koymalısın */}
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logoImage} 
          resizeMode="contain"
        />
        <View style={styles.logoCircle} />
      </Animated.View>

      {/* Başlık */}
      <Animated.View style={{
        opacity: titleOpacity,
        transform: [{ translateY: titleSlide }],
      }}>
        <Text style={styles.title}>HeceOyunu</Text>
        <Text style={styles.subtitle}>Harfler birleşsin, kelimeler doğsun! ✨</Text>
      </Animated.View>

      {/* Başla Butonu */}
      <Animated.View style={{
        opacity: btnOpacity,
        transform: [{ translateY: btnBounce }],
      }}>
        <TouchableOpacity
          style={styles.startButton}
          activeOpacity={0.8}
          onPress={() => navigation.replace('NameEntry')}
        >
          <Text style={styles.startButtonText}>🚀 Başla!</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Alt bilgi */}
      <Animated.View style={[styles.footer, { opacity: btnOpacity }]}>
        <Text style={styles.footerText}>Heceleyerek öğren 🎓</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  bgEmojis: {
    ...StyleSheet.absoluteFillObject,
  },
  bgEmoji: {
    position: 'absolute',
    fontSize: 30,
    opacity: 0.15,
  },
  logoContainer: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.warning,
    opacity: 0.15,
  },
  logoImage: {
    width: 100,
    height: 100,
    zIndex: 1,
  },
  title: {
    fontSize: 42,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    textShadowColor: 'rgba(124, 58, 237, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: FONTS.body,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl + 16,
    borderRadius: RADIUS.round,
    ...SHADOWS.large,
  },
  startButtonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.subtitle,
    fontWeight: FONTS.bold,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
  },
  footerText: {
    fontSize: FONTS.caption,
    color: COLORS.textLight,
  },
});
