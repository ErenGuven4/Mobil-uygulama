// Oyuncunun ismini girdiği ve önceki profillerini listelediğim giriş ekranı.
import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Animated, TextInput,
  TouchableOpacity, StatusBar, KeyboardAvoidingView,
  Platform, ActivityIndicator, ScrollView, Image,
} from 'react-native';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { getProgress } from '../api/api';
import { useTheme } from '../context/ThemeContext';

interface Props {
  navigation: any;
}

let savedProfiles: string[] = [];

export default function NameEntryScreen({ navigation }: Props) {
  const { theme, isDarkMode } = useTheme();
  const styles = getStyles(theme);

  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profiles, setProfiles] = useState<string[]>(savedProfiles);

  // Kart ve yazı animasyonlarını tanımladım.
  const titleAnim  = useRef(new Animated.Value(0)).current;
  const cardAnim   = useRef(new Animated.Value(0)).current;
  const shakeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(200, [
      Animated.spring(titleAnim, { toValue: 1, useNativeDriver: true, speed: 5, bounciness: 12 }),
      Animated.timing(cardAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  // İsim eksik veya hatalı girildiğinde kartı sallatmak için yazdığım fonksiyon.
  function shake() {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6,   duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 60, useNativeDriver: true }),
    ]).start();
  }

  // İsmi onaylayıp bir sonraki ekrana geçiş yaptığım fonksiyon.
  async function handleContinue(selectedName?: string) {
    const trimmedName = (selectedName ?? name).trim();

    if (trimmedName.length < 2) {
      setError('İsmin en az 2 harf olmalı! 😊');
      shake();
      return;
    }
    if (trimmedName.length > 20) {
      setError('İsmin çok uzun, daha kısa bir isim yaz!');
      shake();
      return;
    }

    setError('');
    setLoading(true);

    try {
      await getProgress(trimmedName);

      if (!savedProfiles.includes(trimmedName)) {
        savedProfiles = [trimmedName, ...savedProfiles].slice(0, 5);
      }

      navigation.replace('MainTabs', { userId: trimmedName });
    } catch {
      setError('Bir hata oluştu, tekrar dene.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Başlık */}
        <Animated.View style={{
          opacity: titleAnim,
          transform: [{ scale: titleAnim.interpolate({ inputRange: [0,1], outputRange: [0.8, 1] }) }],
        }}>
          <Image 
            source={require('../../assets/logo.png')} 
            style={styles.logoImage} 
            resizeMode="contain"
          />
          <Text style={styles.title}>Hoş Geldin!</Text>
          <Text style={styles.subtitle}>Adını yaz, macerana başla! 🚀</Text>
        </Animated.View>

        {/* İsim Girişi Kartı */}
        <Animated.View style={[styles.card, {
          opacity: cardAnim,
          transform: [
            { translateY: cardAnim.interpolate({ inputRange: [0,1], outputRange: [30, 0] }) },
            { translateX: shakeAnim },
          ],
        }]}>
          <Text style={styles.inputLabel}>Senin Adın:</Text>
          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            placeholder="Adını buraya yaz..."
            placeholderTextColor={theme.textLight}
            value={name}
            onChangeText={(t) => { setName(t); setError(''); }}
            maxLength={20}
            autoCorrect={false}
            returnKeyType="go"
            onSubmitEditing={() => handleContinue()}
          />

          {/* Hata mesajı */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Devam Et Butonu */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={() => handleContinue()}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={theme.textWhite} />
              : <Text style={styles.buttonText}>Devam Et 🎯</Text>
            }
          </TouchableOpacity>
        </Animated.View>

        {/* Kaydedilmiş Profiller */}
        {profiles.length > 0 && (
          <Animated.View style={[styles.profilesCard, { opacity: cardAnim }]}>
            <Text style={styles.profilesTitle}>Önceki Oyuncular:</Text>
            {profiles.map((p) => (
              <TouchableOpacity
                key={p}
                style={styles.profileChip}
                onPress={() => handleContinue(p)}
                activeOpacity={0.7}
              >
                <Text style={styles.profileEmoji}>👤</Text>
                <Text style={styles.profileName}>{p}</Text>
                <Text style={styles.profileArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </Animated.View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scroll: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
  },
  logoImage: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 36,
    fontWeight: FONTS.bold,
    color: theme.primary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONTS.body,
    color: theme.textLight,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
  },
  card: {
    width: '100%',
    backgroundColor: theme.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.medium,
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: FONTS.body,
    fontWeight: FONTS.semiBold,
    color: theme.text,
    marginBottom: SPACING.sm,
  },
  input: {
    backgroundColor: theme.background,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    fontSize: FONTS.subtitle,
    color: theme.text,
    borderWidth: 2,
    borderColor: theme.primaryLight,
    marginBottom: SPACING.md,
  },
  inputError: {
    borderColor: theme.error,
  },
  errorText: {
    fontSize: FONTS.caption,
    color: theme.error,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  button: {
    backgroundColor: theme.primary,
    borderRadius: RADIUS.round,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    ...SHADOWS.large,
    marginTop: SPACING.sm,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: theme.textWhite,
    fontSize: FONTS.heading,
    fontWeight: FONTS.bold,
  },
  profilesCard: {
    width: '100%',
    backgroundColor: theme.card,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  profilesTitle: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.semiBold,
    color: theme.textLight,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  profileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.background,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  profileEmoji: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  profileName: {
    flex: 1,
    fontSize: FONTS.body,
    fontWeight: FONTS.semiBold,
    color: theme.text,
  },
  profileArrow: {
    fontSize: FONTS.body,
    color: theme.primary,
    fontWeight: FONTS.bold,
  },
});
