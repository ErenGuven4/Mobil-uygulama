// Oyundaki bölüm listesini (yol haritasını) gösterdiğim seviye seçme ekranı.
import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Animated,
  StatusBar, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import LevelNode from '../components/LevelNode';
import { getLevels, getProgress, Level, UserProgress } from '../api/api';
import { useTheme } from '../context/ThemeContext';

interface Props {
  navigation: any;
  route: any;
}

export default function LevelSelectScreen({ navigation, route }: Props) {
  const { userId } = route.params || { userId: 'default' };
  const { theme, isDarkMode } = useTheme();
  const styles = getStyles(theme);

  const [levels, setLevels] = useState<Level[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const headerAnim = useRef(new Animated.Value(0)).current;

  // Sunucudan veri çekilemezse kullanılacak yedek seviye listesini tanımladım.
  const defaultLevels: Level[] = [
    { id: 1, name: '2 Heceli Kolay', description: 'İki heceli basit kelimeler', requiredScore: 0 },
    { id: 2, name: '2 Heceli Orta', description: 'İki heceli orta zorlukta', requiredScore: 50 },
    { id: 3, name: '3 Heceli', description: 'Üç heceli kelimeler', requiredScore: 120 },
    { id: 4, name: '3+ Heceli Zor', description: 'Üç ve daha fazla heceli', requiredScore: 200 },
    { id: 5, name: 'Karışık', description: 'Tüm seviyelerden karışık', requiredScore: 300 },
  ];

  useEffect(() => {
    loadData();
    Animated.timing(headerAnim, {
      toValue: 1, duration: 800, useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  async function loadData() {
    try {
      setLoading(true);
      const [levelsData, progressData] = await Promise.all([
        getLevels(),
        getProgress(userId),
      ]);
      setLevels(levelsData.length > 0 ? levelsData : defaultLevels);
      setProgress(progressData || {
        userId: userId, completedLevels: [], currentLevel: 1,
        score: 0, completedWords: [], createdAt: '',
      });
    } catch (error) {
      console.error('Veri yüklenemedi:', error);
      setLevels(defaultLevels);
      setProgress({
        userId: userId, completedLevels: [], currentLevel: 1,
        score: 0, completedWords: [], createdAt: '',
      });
    } finally {
      setLoading(false);
    }
  }

  // Seviyenin tamamlanma, aktif veya kilitli olma durumunu bulduğum fonksiyon.
  function getLevelStatus(levelId: number): 'completed' | 'current' | 'locked' {
    if (!progress) return levelId === 1 ? 'current' : 'locked';
    if (progress.completedLevels.includes(levelId)) return 'completed';
    if (levelId === progress.currentLevel) return 'current';
    if (levelId <= progress.currentLevel) return 'completed';
    return 'locked';
  }

  // Tıklanan bölüme gitmeyi sağlayan fonksiyonu yazdım.
  function handleLevelPress(levelId: number) {
    const status = getLevelStatus(levelId);
    if (status !== 'locked') {
      navigation.navigate('Game', { levelId, userId });
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* Sayfa başlığı ve geri tuşunu eklediğim kısım */}
      <Animated.View style={[styles.header, {
        opacity: headerAnim,
        transform: [{ translateY: headerAnim.interpolate({
          inputRange: [0, 1], outputRange: [-30, 0],
        }) }],
      }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            navigation.replace('NameEntry');
          }}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>🗺️ Seviyeler</Text>
          <Text style={styles.headerSubtitle}>
            Puan: ⭐ {progress?.score || 0}
          </Text>
        </View>
        <View style={styles.backButton} />
      </Animated.View>

      {/* Seviyeleri yol haritası şeklinde listelediğim kaydırılabilir alan */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Yol çizgisi */}
        <View style={styles.pathLine} />

        {levels.map((level, index) => {
          const status = getLevelStatus(level.id);
          const offsetX = index % 2 === 0 ? -30 : 30;

          return (
            <View key={level.id} style={[
              styles.nodeWrapper,
              { transform: [{ translateX: offsetX }] },
            ]}>
              <LevelNode
                levelId={level.id}
                name={level.name}
                status={status}
                onPress={() => handleLevelPress(level.id)}
              />
            </View>
          );
        })}

        {/* Alt boşluk */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONTS.body,
    color: theme.textLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: theme.card,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
    ...SHADOWS.medium,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.background,
  },
  backButtonText: {
    fontSize: 22,
    color: theme.primary,
    fontWeight: FONTS.bold,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONTS.subtitle,
    fontWeight: FONTS.bold,
    color: theme.primary,
  },
  headerSubtitle: {
    fontSize: FONTS.caption,
    color: theme.warning,
    fontWeight: FONTS.semiBold,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: SPACING.xl,
  },
  pathLine: {
    position: 'absolute',
    width: 3,
    height: '100%',
    backgroundColor: theme.primaryLight,
    opacity: 0.3,
    left: '50%',
    marginLeft: -1.5,
  },
  nodeWrapper: {
    alignItems: 'center',
    zIndex: 1,
  },
});
