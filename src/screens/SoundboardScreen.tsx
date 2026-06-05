// Geçilen bölümlerdeki kelimelerin listesini gösterip sesli okuttuğum ses paneli ekranı.
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
// useFocusEffect: Ekran her odaklandığında (açıldığında) tetiklenen React Navigation hook'u.
import { useFocusEffect } from '@react-navigation/native';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
// speakWord: Kelimeleri sesli okutmak için TTS yardımcı fonksiyonumuz.
import { speakWord } from '../utils/audio';
// getAllWords: Tüm kelimeleri, getProgress: Kullanıcı verilerini backend'den çeken API istekleri.
import { getAllWords, getProgress, Word, UserProgress } from '../api/api';
// useTheme: Aktif açık/karanlık temayı kullanmak için context hook'u.
import { useTheme } from '../context/ThemeContext';

export default function SoundboardScreen({ route }: any) {
  // route.params üzerinden NameEntry ekranından gelen kullanıcı ID'sini alıyoruz.
  const { userId } = route.params || { userId: 'default' };
  const { theme, isDarkMode } = useTheme();
  const styles = getStyles(theme);

  // State tanımlamaları:
  // words: Backend'den çekilen tüm kelimelerin listesi.
  const [words, setWords] = useState<Word[]>([]);
  // progress: Kullanıcının skor, tamamladığı seviyeler gibi ilerleme bilgileri.
  const [progress, setProgress] = useState<UserProgress | null>(null);
  // loading: Veriler yüklenirken yüklenme göstergesini kontrol eden durum.
  const [loading, setLoading] = useState(true);
  // activeWord: O an sesli okunan kelime (UI'da basılı olduğunu belli etmek/efekt uygulamak için).
  const [activeWord, setActiveWord] = useState<string | null>(null);

  // useFocusEffect: Kullanıcı bu sekmeye her tıkladığında / geldiğinde
  // loadData fonksiyonunu çalıştırarak en güncel ilerleme ve kelimeleri yükler.
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [userId])
  );

  // Sunucudan kelimeleri ve kullanıcının ilerleme durumunu aynı anda çeken asenkron fonksiyon.
  async function loadData() {
    setLoading(true);
    try {
      // Promise.all: İki asenkron API isteğini paralel olarak başlatıp ikisi de bitince devam eder (hız kazandırır).
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

  // Kelimeye tıklandığında ses çalan ve butona geçici olarak aktif stili veren fonksiyon.
  const playSound = async (wordText: string) => {
    setActiveWord(wordText); // Aktif kelimeyi set et (UI'da stil değişecek)
    await speakWord(wordText); // TTS ile kelimeyi Türkçe seslendir
    setTimeout(() => setActiveWord(null), 800); // 800ms sonra basılı stilini kaldır
  };

  // Kullanıcının tamamladığı en yüksek seviyeyi bulur. Hiç yoksa 0 kabul edilir.
  const maxLevelCompleted = progress?.completedLevels?.length ? Math.max(...progress.completedLevels) : 0;
  // Oynanabilir aktif seviye: tamamlanan en büyük seviyenin 1 fazlasıdır.
  const currentLevelToPlay = maxLevelCompleted + 1;

  // Çekilen kelimeleri ait oldukları level numarasına göre grupluyoruz (örn: {1: [Kelime1, Kelime2], 2: [...]}).
  const groupedWords = words.reduce((acc, word) => {
    if (!acc[word.level]) acc[word.level] = [];
    acc[word.level].push(word);
    return acc;
  }, {} as Record<number, Word[]>);

  // Gruplanan seviyeleri sayıya çevirip küçükten büyüğe sıralı bir dizi yapıyoruz (örn: [1, 2, 3...]).
  const levels = Object.keys(groupedWords).map(Number).sort((a, b) => a - b);
  
  // Her bölümün kartı için görsel olarak farklı renk tonları (açık ve koyu mod için ayrı ayrı).
  const lightLevelColors = ['#FF9A9E', '#A18CD1', '#34D399', '#FBBF24', '#60A5FA'];
  const darkLevelColors = ['#9A4D50', '#5E4E80', '#1F6B4E', '#806010', '#2E5080'];
  const levelColors = isDarkMode ? darkLevelColors : lightLevelColors;

  // Veriler yüklenirken ekranda dönen yükleniyor tekerleği gösterilir.
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      {/* Üst Başlık Bölümü */}
      <View style={styles.header}>
        <View style={styles.placeholder} />
        <Text style={styles.headerTitle}>🗣️ Seslerle Öğren</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Kelime Seviyelerini Kaydırılabilir Liste Halinde Gösterdiğimiz Alan */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageSubtitle}>
          Geçtiğin bölümlerdeki kelimelere tıklayarak onları tekrar dinleyebilirsin! 🐼
        </Text>

        {levels.map((level) => {
          // Eğer bölüm seviyesi kullanıcının oynayabileceği max seviyeden küçük veya eşitse kilidi açıktır.
          const isUnlocked = level <= currentLevelToPlay;
          const sectionColor = levelColors[(level - 1) % levelColors.length];
          const sectionWords = groupedWords[level];
          const lockedBg = isDarkMode ? '#334155' : '#E5E7EB';

          return (
            <View key={level} style={[styles.section, !isUnlocked && styles.sectionLocked]}>
              {/* Seviye Başlığı (Bölüm numarası ve Kilit Simgesi) */}
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>{isUnlocked ? '🔓' : '🔒'}</Text>
                <Text style={styles.sectionTitle}>BÖLÜM {level}</Text>
              </View>
              
              {/* Seviye İçindeki Kelime Kartlarının Kutusu */}
              <View style={[styles.cardContainer, { backgroundColor: isUnlocked ? sectionColor : lockedBg }]}>
                {sectionWords.map((item, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.wordButton,
                      activeWord === item.word && styles.wordButtonActive, // Ses çalarken aktif stil uygulanır
                      !isUnlocked && styles.wordButtonLocked // Kilitliyse kilit stili uygulanır
                    ]}
                    // Kilidi açıksa kelimeyi oku, kilitliyse tıklamayı engelle
                    onPress={() => isUnlocked && playSound(item.word)}
                    activeOpacity={isUnlocked ? 0.8 : 1}
                  >
                    <Text style={[
                      styles.wordText,
                      activeWord === item.word && styles.wordTextActive,
                      !isUnlocked && styles.wordTextLocked
                    ]}>
                      {/* Bölüm kilitliyse kelimeyi gizleyip soru işareti gösteriyoruz */}
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

// Ekran stilleri (Tema nesnesi parametre olarak alınıp açık/karanlık moda göre dinamik stil üretilir).
const getStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 50, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md,
    backgroundColor: theme.card, borderBottomLeftRadius: RADIUS.xl, borderBottomRightRadius: RADIUS.xl,
    ...SHADOWS.small,
  },
  headerTitle: { fontSize: FONTS.heading, fontWeight: FONTS.bold, color: theme.primary },
  placeholder: { width: 40 },
  content: { padding: SPACING.lg, paddingBottom: 100 },
  pageSubtitle: { fontSize: FONTS.body, color: theme.textLight, textAlign: 'center', marginBottom: SPACING.xl, lineHeight: 24 },
  section: { marginBottom: SPACING.xl },
  sectionLocked: { opacity: 0.8 }, // Kilitli bölümlerin saydamlığını hafifçe düşürür
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm, paddingHorizontal: SPACING.xs },
  sectionIcon: { fontSize: 20, marginRight: SPACING.sm },
  sectionTitle: { fontSize: FONTS.caption, fontWeight: FONTS.bold, color: theme.text, letterSpacing: 1 },
  cardContainer: {
    flexDirection: 'row', flexWrap: 'wrap', padding: SPACING.md,
    borderRadius: RADIUS.xl, ...SHADOWS.medium,
  },
  wordButton: {
    backgroundColor: theme.card, paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.xl, marginRight: SPACING.sm, marginBottom: SPACING.sm, ...SHADOWS.small
  },
  // Tıklanan / sesli okunan kelime butonunun stili (hafifçe büyür ve rengi değişir)
  wordButtonActive: { transform: [{ scale: 1.1 }], backgroundColor: theme.isDarkMode ? '#5B21B6' : '#FFF5F7' },
  wordButtonLocked: { backgroundColor: theme.isDarkMode ? '#1E293B' : '#F3F4F6', elevation: 0, shadowOpacity: 0 },
  wordText: { fontSize: FONTS.heading, fontWeight: FONTS.bold, color: theme.text },
  wordTextActive: { color: theme.primaryDark },
  wordTextLocked: { color: theme.isDarkMode ? '#475569' : '#9CA3AF' },
});
