import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { speakWord } from '../utils/audio';
import { getAllWords, getProgress, Word, UserProgress } from '../api/api';

export default function SoundboardScreen({ route }: any) {
  const { userId } = route.params || { userId: 'default' };
  const [words, setWords] = useState<Word[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeWord, setActiveWord] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [userId])
  );

  async function loadData() {
    setLoading(true);
    try {
      const [wordsData, progressData] = await Promise.all([
        getAllWords(),
        getProgress(userId)
      ]);
      setWords(wordsData);
      setProgress(progressData);
    } catch (error) {
      console.log('Veriler yüklenirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  }

  const playSound = async (wordText: string) => {
    setActiveWord(wordText);
    await speakWord(wordText);
    setTimeout(() => setActiveWord(null), 800);
  };

  const maxLevelCompleted = progress?.completedLevels?.length ? Math.max(...progress.completedLevels) : 0;
  const currentLevelToPlay = maxLevelCompleted + 1;

  // Kelimeleri bölümlerine göre (level) grupla
  const groupedWords = words.reduce((acc, word) => {
    if (!acc[word.level]) acc[word.level] = [];
    acc[word.level].push(word);
    return acc;
  }, {} as Record<number, Word[]>);

  // Bölüm numaralarını sıraya diz
  const levels = Object.keys(groupedWords).map(Number).sort((a, b) => a - b);
  
  // Arka plan renkleri (sırayla tekrar edecek)
  const levelColors = ['#FF9A9E', '#A18CD1', '#34D399', '#FBBF24', '#60A5FA'];

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <View style={styles.placeholder} />
        <Text style={styles.headerTitle}>🗣️ Seslerle Öğren</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageSubtitle}>
          Geçtiğin bölümlerdeki kelimelere tıklayarak onları tekrar dinleyebilirsin! 🐼
        </Text>

        {levels.map((level) => {
          const isUnlocked = level <= currentLevelToPlay;
          const sectionColor = levelColors[(level - 1) % levelColors.length];
          const sectionWords = groupedWords[level];

          return (
            <View key={level} style={[styles.section, !isUnlocked && styles.sectionLocked]}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>{isUnlocked ? '🔓' : '🔒'}</Text>
                <Text style={styles.sectionTitle}>BÖLÜM {level}</Text>
              </View>
              
              <View style={[styles.cardContainer, { backgroundColor: isUnlocked ? sectionColor : '#E5E7EB' }]}>
                {sectionWords.map((item, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.wordButton,
                      activeWord === item.word && styles.wordButtonActive,
                      !isUnlocked && styles.wordButtonLocked
                    ]}
                    onPress={() => isUnlocked && playSound(item.word)}
                    activeOpacity={isUnlocked ? 0.8 : 1}
                  >
                    <Text style={[
                      styles.wordText,
                      activeWord === item.word && styles.wordTextActive,
                      !isUnlocked && styles.wordTextLocked
                    ]}>
                      {isUnlocked ? `${item.word} ${item.emoji}` : '???'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
        })}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 50, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md,
    backgroundColor: COLORS.card, borderBottomLeftRadius: RADIUS.xl, borderBottomRightRadius: RADIUS.xl,
    ...SHADOWS.small,
  },
  headerTitle: { fontSize: FONTS.heading, fontWeight: FONTS.bold, color: COLORS.primary },
  placeholder: { width: 40 },
  content: { padding: SPACING.lg, paddingBottom: 100 },
  pageSubtitle: { fontSize: FONTS.body, color: COLORS.textLight, textAlign: 'center', marginBottom: SPACING.xl, lineHeight: 24 },
  section: { marginBottom: SPACING.xl },
  sectionLocked: { opacity: 0.8 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm, paddingHorizontal: SPACING.xs },
  sectionIcon: { fontSize: 20, marginRight: SPACING.sm },
  sectionTitle: { fontSize: FONTS.caption, fontWeight: FONTS.bold, color: COLORS.text, letterSpacing: 1 },
  cardContainer: {
    flexDirection: 'row', flexWrap: 'wrap', padding: SPACING.md,
    borderRadius: RADIUS.xl, ...SHADOWS.medium,
  },
  wordButton: {
    backgroundColor: COLORS.card, paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.xl, marginRight: SPACING.sm, marginBottom: SPACING.sm, ...SHADOWS.small
  },
  wordButtonActive: { transform: [{ scale: 1.1 }], backgroundColor: '#FFF5F7' },
  wordButtonLocked: { backgroundColor: '#F3F4F6', elevation: 0, shadowOpacity: 0 },
  wordText: { fontSize: FONTS.heading, fontWeight: FONTS.bold, color: COLORS.text },
  wordTextActive: { color: COLORS.primaryDark },
  wordTextLocked: { color: '#9CA3AF' },
});
