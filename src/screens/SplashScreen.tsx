// Uygulama ilk açıldığında gösterdiğim animasyonlu karşılama ekranı.
import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, TouchableOpacity,
  StatusBar, Image,
} from 'react-native';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface Props {
  navigation: any;
}

export default function SplashScreen({ navigation }: Props) {
  const { theme, isDarkMode } = useTheme();
  const styles = getStyles(theme);

  // Animasyon Değişkenleri (useRef ile bileşen her render olduğunda sıfırlanması önlenir):
  // logoScale: Logunun sıfırdan orijinal boyutuna (1) büyümesini sağlar.
  const logoScale = useRef(new Animated.Value(0)).current;
  // titleOpacity: Başlık metinlerinin opaklığını (opacity) 0'dan 1'e getirir.
  const titleOpacity = useRef(new Animated.Value(0)).current;
  // titleSlide: Başlık metnini aşağıdan yukarı kaydırmak için başlangıçta 30px aşağıda tutar.
  const titleSlide = useRef(new Animated.Value(30)).current;
  // btnOpacity: Başla butonunun görünürlüğünü yavaşça açar (0'dan 1'e).
  const btnOpacity = useRef(new Animated.Value(0)).current;
  // btnBounce: Butonun sürekli yukarı-aşağı zıplama efekti için dikey konumu (translateY).
  const btnBounce = useRef(new Animated.Value(0)).current;
  // bgAnim: Arka plan renk geçişi (gradient geçişi) için kullanılan 0 ile 1 arasındaki değer.
  const bgAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Giriş animasyonlarını sırayla tetikledim (Animated.sequence).
    Animated.sequence([
      // 1. Adım: Logo yaylanarak (spring) büyür.
      Animated.spring(logoScale, {
        toValue: 1, useNativeDriver: true, speed: 4, bounciness: 14,
      }),
      // 2. Adım: Başlık yazıları görünür olurken (parallel) aynı anda yukarı doğru kayar.
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1, duration: 600, useNativeDriver: true,
        }),
        Animated.timing(titleSlide, {
          toValue: 0, duration: 600, useNativeDriver: true,
        }),
      ]),
      // 3. Adım: Başlama butonu yavaşça belirir.
      Animated.timing(btnOpacity, {
        toValue: 1, duration: 400, useNativeDriver: true,
      }),
    ]).start(() => {
      // Giriş animasyonları bittikten sonra butona sürekli zıplama hareketi (loop) veriyoruz.
      Animated.loop(
        Animated.sequence([
          // Butonu 600ms içinde 8px yukarı kaydır
          Animated.timing(btnBounce, {
            toValue: -8, duration: 600, useNativeDriver: true,
          }),
          // Butonu 600ms içinde eski yerine (0) getir
          Animated.timing(btnBounce, {
            toValue: 0, duration: 600, useNativeDriver: true,
          }),
        ])
      ).start();
    });

    // Arka plan renginin sürekli olarak iki renk arasında yumuşak geçiş yapmasını (loop) sağladık.
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgAnim, {
          toValue: 1, duration: 3000, useNativeDriver: false, // Renk interpolasyonu için useNativeDriver: false olmalıdır
        }),
        Animated.timing(bgAnim, {
          toValue: 0, duration: 3000, useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  // bgAnim değeri (0 ila 1) değiştikçe arka planın rengini başlangıç rengi ile bitiş rengi arasında dönüştürürüz (interpolate).
  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.backgroundGradientStart, theme.backgroundGradientEnd],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* Arka plana süs olsun diye eklediğim emojiler */}
      <View style={styles.bgEmojis}>
        <Text style={[styles.bgEmoji, { top: '10%', left: '10%' }]}>📚</Text>
        <Text style={[styles.bgEmoji, { top: '15%', right: '15%' }]}>✨</Text>
        <Text style={[styles.bgEmoji, { top: '70%', left: '5%' }]}>🌈</Text>
        <Text style={[styles.bgEmoji, { top: '75%', right: '10%' }]}>⭐</Text>
        <Text style={[styles.bgEmoji, { top: '40%', left: '2%' }]}>🎈</Text>
        <Text style={[styles.bgEmoji, { top: '55%', right: '5%' }]}>🦋</Text>
      </View>

      {/* Uygulamanın logosu ve arkasındaki parlayan dairesel arka plan */}
      <Animated.View style={[
        styles.logoContainer,
        { transform: [{ scale: logoScale }] },
      ]}>
        <Image 
          source={require('../../assets/logo.png')} 
          style={styles.logoImage} 
          resizeMode="contain"
        />
        <View style={styles.logoCircle} />
      </Animated.View>

      {/* Oyun adını ve alt başlığı yazdığım kısım */}
      <Animated.View style={{
        opacity: titleOpacity,
        transform: [{ translateY: titleSlide }],
      }}>
        <Text style={styles.title}>HeceOyunu</Text>
        <Text style={styles.subtitle}>Harfler birleşsin, kelimeler doğsun! ✨</Text>
      </Animated.View>

      {/* Oyunu başlatan buton (Kullanıcıyı NameEntry ekranına yönlendirir) */}
      <Animated.View style={{
        opacity: btnOpacity,
        transform: [{ translateY: btnBounce }],
      }}>
        <TouchableOpacity
          style={styles.startButton}
          activeOpacity={0.8}
          // replace: Geri butonuna basınca Splash ekranına dönmesin diye stack'ten tamamen kaldırır
          onPress={() => navigation.replace('NameEntry')}
        >
          <Text style={styles.startButtonText}>🚀 Başla!</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Ekranın en altında duran bilgi yazısı */}
      <Animated.View style={[styles.footer, { opacity: btnOpacity }]}>
        <Text style={styles.footerText}>Heceleyerek öğren 🎓</Text>
      </Animated.View>
    </Animated.View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
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
    opacity: 0.15, // Emojileri yarı saydam yaparak arka planda boğulmamasını sağlıyoruz
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
    backgroundColor: theme.warning,
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
    color: theme.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    textShadowColor: 'rgba(124, 58, 237, 0.2)', // Başlığa hafif gölge derinliği
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: FONTS.body,
    color: theme.textLight,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  startButton: {
    backgroundColor: theme.primary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl + 16,
    borderRadius: RADIUS.round,
    ...SHADOWS.large,
  },
  startButtonText: {
    color: theme.textWhite,
    fontSize: FONTS.subtitle,
    fontWeight: FONTS.bold,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
  },
  footerText: {
    fontSize: FONTS.caption,
    color: theme.textLight,
  },
});
