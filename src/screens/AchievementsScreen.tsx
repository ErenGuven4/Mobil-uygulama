// Oyuncunun kazandığı başarıları ve kilitli olan rozetleri gösterdiğim ekran.
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { getProgress, UserProgress } from '../api/api';
import { useTheme } from '../context/ThemeContext';

export default function AchievementsScreen({ navigation, route }: any) {
  const { userId } = route.params;
  const { theme, isDarkMode } = useTheme();
  const styles = getStyles(theme);

  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  async function loadProgress() {
    try {
      const data = await getProgress(userId);
      setProgress(data);
    } catch (err) {
      console.log('Başarılar yüklenirken hata:', err);
    } finally {
      setLoading(false);
    }
  }

  const score = progress?.score || 0;
  const levelsCompleted = progress?.completedLevels.length || 0;
  const wordsCompleted = progress?.completedWords.length || 0;

  const achievements = [
    {
      id: 1,
      title: 'İlk Adım',
      desc: 'İlk bölümü tamamla.',
      icon: '🌱',
      unlocked: levelsCompleted >= 1,
    },
    {
      id: 2,
      title: 'Öğrenmeye Aç',
      desc: '3 bölüm tamamla.',
      icon: '📚',
      unlocked: levelsCompleted >= 3,
    },
    {
      id: 3,
      title: 'Kelime Avcısı',
      desc: '10 farklı kelime bil.',
      icon: '🔎',
      unlocked: wordsCompleted >= 10,
    },
    {
      id: 4,
      title: 'Hece Ustası',
      desc: '100 puana ulaş.',
      icon: '⭐',
      unlocked: score >= 100,
    },
    {
      id: 5,
      title: 'Yarı Yol',
      desc: '10. bölümü tamamla.',
      icon: '🚀',
      unlocked: levelsCompleted >= 10,
    },
    {
      id: 6,
      title: 'Efsane Panda',
      desc: 'Tüm bölümleri tamamla!',
      icon: '🐼',
      unlocked: levelsCompleted >= 20,
    },
  ];

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <Text style={styles.headerTitle}>🏆 Başarılar</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statsCard}>
          <Text style={styles.statsText}>Toplam Puan: ⭐ {score}</Text>
          <Text style={styles.statsText}>Çözülen Kelime: 📝 {wordsCompleted}</Text>
        </View>

        <Text style={styles.sectionTitle}>ROZETLERİN</Text>

        {achievements.map(ach => {
          const lockedBg = isDarkMode ? '#1E293B' : '#F9FAFB';
          const lockedBorder = isDarkMode ? '#334155' : '#E5E7EB';
          const cardBg = ach.unlocked ? theme.card : lockedBg;
          const cardBorder = ach.unlocked ? theme.answerSlotBorder : lockedBorder;
          const iconBg = ach.unlocked ? theme.answerSlot : (isDarkMode ? '#334155' : '#E5E7EB');

          return (
            <View key={ach.id} style={[styles.card, !ach.unlocked && styles.cardLocked, { backgroundColor: cardBg, borderColor: cardBorder }]}>
              <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
                <Text style={styles.icon}>{ach.unlocked ? ach.icon : '🔒'}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.title}>{ach.title}</Text>
                <Text style={styles.desc}>{ach.desc}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  center: { alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 50, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md,
    backgroundColor: theme.card, borderBottomLeftRadius: RADIUS.xl, borderBottomRightRadius: RADIUS.xl,
    ...SHADOWS.small,
  },
  headerTitle: { fontSize: FONTS.heading, fontWeight: FONTS.bold, color: theme.primary },
  content: { padding: SPACING.lg, paddingBottom: 100 },
  statsCard: { backgroundColor: theme.primaryLight, padding: SPACING.lg, borderRadius: RADIUS.xl, marginBottom: SPACING.xl, alignItems: 'center', borderWidth: 2, borderColor: theme.answerSlotBorder },
  statsText: { fontSize: FONTS.heading, color: theme.textWhite, fontWeight: FONTS.bold, marginVertical: 4 },
  sectionTitle: { fontSize: FONTS.caption, fontWeight: FONTS.bold, color: theme.textLight, marginBottom: SPACING.sm, marginLeft: SPACING.sm, letterSpacing: 1 },
  card: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderRadius: RADIUS.lg, marginBottom: SPACING.md, borderWidth: 2, ...SHADOWS.small },
  cardLocked: { opacity: 0.6 },
  iconContainer: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  icon: { fontSize: 24 },
  info: { flex: 1 },
  title: { fontSize: FONTS.body, fontWeight: FONTS.bold, color: theme.text, marginBottom: 2 },
  desc: { fontSize: FONTS.caption, color: theme.textLight },
});
