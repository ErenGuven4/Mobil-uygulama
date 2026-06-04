// Kelimeleri heceleyip oyunu oynadığımız ana oyun ekranı.
import React, { useEffect, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, TouchableOpacity,
  StatusBar, ActivityIndicator,
} from 'react-native';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import SyllableButton from '../components/SyllableButton';
import AnswerSlot from '../components/AnswerSlot';
import ProgressBar from '../components/ProgressBar';
import FeedbackModal from '../components/FeedbackModal';
import ConfettiEffect from '../components/ConfettiEffect';
import { shuffle } from '../utils/shuffle';
import { playCorrectSound, playWrongSound, playTapSound, playLevelCompleteSound, speakWord, speakSyllable, stopSpeaking } from '../utils/audio';
import { getWordsByLevel, updateProgress, Word } from '../api/api';
import { useTheme } from '../context/ThemeContext';

interface Props {
  navigation: any;
  route: any;
}

// Sunucudan kelime gelmezse diye yedek kelime havuzu ekledim.
const fallbackWords: Word[] = [
  { id: 'f1', word: 'Elma', syllables: ['El', 'ma'], level: 1, emoji: '🍎' },
  { id: 'f2', word: 'Arı', syllables: ['A', 'rı'], level: 1, emoji: '🐝' },
  { id: 'f3', word: 'Kedi', syllables: ['Ke', 'di'], level: 1, emoji: '🐱' },
  { id: 'f4', word: 'Kapı', syllables: ['Ka', 'pı'], level: 1, emoji: '🚪' },
  { id: 'f5', word: 'Balık', syllables: ['Ba', 'lık'], level: 1, emoji: '🐟' },
];

export default function GameScreen({ navigation, route }: Props) {
  const { levelId, userId = 'default' } = route.params;
  const { theme, isDarkMode } = useTheme();
  const styles = getStyles(theme);

  const [words, setWords] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [shuffledSyllables, setShuffledSyllables] = useState<string[]>([]);
  const [selectedSyllables, setSelectedSyllables] = useState<(string | undefined)[]>([]);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());
  const [slotStatus, setSlotStatus] = useState<'neutral' | 'correct' | 'wrong'>('neutral');
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<'correct' | 'wrong'>('correct');
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(true);
  const [levelComplete, setLevelComplete] = useState(false);

  const emojiScale = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  const currentWord = words[currentWordIndex];

  useEffect(() => {
    loadWords();
  }, [levelId]);

  async function loadWords() {
    setLoading(true);
    try {
      const data = await getWordsByLevel(levelId);
      const wordList = data.length > 0 ? data : fallbackWords;
      setWords(wordList);
      setupWord(wordList[0]);
    } catch (error) {
      console.error('Kelimeler yüklenemedi:', error);
      setWords(fallbackWords);
      setupWord(fallbackWords[0]);
    }
    setLoading(false);
  }

  // Yeni kelimeyi hazırlayan ve hecelerini karıştıran fonksiyonu yazdım.
  function setupWord(word: Word) {
    if (!word) return;
    const shuffled = shuffle(word.syllables);
    setShuffledSyllables(shuffled);
    setSelectedSyllables(new Array(word.syllables.length).fill(undefined));
    setUsedIndices(new Set());
    setSlotStatus('neutral');

    emojiScale.setValue(0);
    cardAnim.setValue(0);
    Animated.parallel([
      Animated.spring(emojiScale, {
        toValue: 1, useNativeDriver: true, speed: 6, bounciness: 15,
      }),
      Animated.timing(cardAnim, {
        toValue: 1, duration: 500, useNativeDriver: true,
      }),
    ]).start();
  }

  // Bir heceye basıldığında onu boş kutuya yerleştiren fonksiyonu yazdım.
  function handleSyllablePress(syllable: string, index: number) {
    playTapSound();
    speakSyllable(syllable);

    const emptySlotIndex = selectedSyllables.findIndex((s) => s === undefined);
    if (emptySlotIndex === -1) return;

    const newSelected = [...selectedSyllables];
    newSelected[emptySlotIndex] = syllable;
    setSelectedSyllables(newSelected);

    const newUsed = new Set(usedIndices);
    newUsed.add(index);
    setUsedIndices(newUsed);

    const allFilled = newSelected.every((s) => s !== undefined);
    if (allFilled) {
      checkAnswer(newSelected as string[]);
    }
  }

  // Seçilen bir heceyi geri almak için kutuya tıklandığında çalışan fonksiyonu yazdım.
  function handleSlotPress(slotIndex: number) {
    const syllable = selectedSyllables[slotIndex];
    if (!syllable) return;

    playTapSound();

    const newSelected = [...selectedSyllables];
    newSelected[slotIndex] = undefined;
    setSelectedSyllables(newSelected);

    const originalIndex = shuffledSyllables.findIndex(
      (s, i) => s === syllable && usedIndices.has(i)
    );
    if (originalIndex !== -1) {
      const newUsed = new Set(usedIndices);
      newUsed.delete(originalIndex);
      setUsedIndices(newUsed);
    }

    setSlotStatus('neutral');
  }

  // Heceler tamamlandığında cevabın doğruluğunu kontrol ettiğim fonksiyon.
  async function checkAnswer(answer: string[]) {
    if (!currentWord) return;

    const isCorrect = answer.join('') === currentWord.syllables.join('');

    if (isCorrect) {
      setSlotStatus('correct');
      setFeedbackType('correct');
      setShowConfetti(true);
      setShowFeedback(true);
      playCorrectSound();

      await updateProgress(currentWord.id, true, undefined, userId);
    } else {
      setSlotStatus('wrong');
      setFeedbackType('wrong');
      setShowFeedback(true);
      playWrongSound();
    }
  }

  // Doğru/yanlış bildirim ekranı kapandığında sonraki kelimeye geçen fonksiyonu yazdım.
  function handleFeedbackClose() {
    setShowFeedback(false);
    setShowConfetti(false);

    if (feedbackType === 'correct') {
      const nextIndex = currentWordIndex + 1;
      if (nextIndex < words.length) {
        setCurrentWordIndex(nextIndex);
        setupWord(words[nextIndex]);
      } else {
        handleLevelComplete();
      }
    } else {
      if (currentWord) {
        setupWord(currentWord);
      }
    }
  }

  // Bölümdeki tüm kelimeler bitince seviyeyi tamamlayan fonksiyonu yazdım.
  async function handleLevelComplete() {
    setLevelComplete(true);
    playLevelCompleteSound();
    await updateProgress('', false, levelId, userId);
  }

  useEffect(() => {
    return () => { stopSpeaking(); };
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Kelimeler yükleniyor...</Text>
      </View>
    );
  }

  if (levelComplete) {
    return (
      <View style={[styles.container, styles.center]}>
        <ConfettiEffect visible={true} />
        <Text style={styles.completeEmoji}>🏆</Text>
        <Text style={styles.completeTitle}>Tebrikler!</Text>
        <Text style={styles.completeSubtitle}>
          Seviye {levelId} tamamlandı! 🎉
        </Text>
        <Text style={styles.completeScore}>
          +{words.length * 10} puan kazandın! ⭐
        </Text>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.completeButtonText}>Devam Et →</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!currentWord) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <ConfettiEffect visible={showConfetti} onComplete={() => setShowConfetti(false)} />

      {/* Üst Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <ProgressBar current={currentWordIndex} total={words.length} />
      </View>

      {/* Kelime Kartı */}
      <Animated.View style={[styles.wordCard, {
        opacity: cardAnim,
        transform: [{ translateY: cardAnim.interpolate({
          inputRange: [0, 1], outputRange: [20, 0],
        }) }],
      }]}>
        {/* Emoji Görseli */}
        <Animated.Text style={[
          styles.wordEmoji,
          { transform: [{ scale: emojiScale }] },
        ]}>
          {currentWord.emoji}
        </Animated.Text>

        {/* Tekrar dinle butonu */}
        <TouchableOpacity
          style={styles.speakButton}
          onPress={() => speakWord(currentWord.word)}
          activeOpacity={0.7}
        >
          <Text style={styles.speakButtonText}>🔊 Dinle</Text>
        </TouchableOpacity>

        {/* İpucu */}
        <Text style={styles.hintText}>Bu kelimeyi hecele:</Text>
        <View style={styles.wordDots}>
          {currentWord.syllables.map((_, i) => (
            <View key={i} style={styles.dot} />
          ))}
        </View>
      </Animated.View>

      {/* Cevap Yuvaları */}
      <View style={styles.slotsContainer}>
        <View style={styles.slotsRow}>
          {selectedSyllables.map((syllable, index) => (
            <AnswerSlot
              key={index}
              syllable={syllable}
              index={index}
              status={slotStatus}
              onPress={() => handleSlotPress(index)}
            />
          ))}
        </View>
      </View>

      {/* Hece Butonları */}
      <Animated.View style={[styles.syllablesContainer, {
        opacity: cardAnim,
      }]}>
        <View style={styles.syllablesRow}>
          {shuffledSyllables.map((syllable, index) => (
            <SyllableButton
              key={`${syllable}-${index}`}
              syllable={syllable}
              disabled={usedIndices.has(index)}
              onPress={() => handleSyllablePress(syllable, index)}
            />
          ))}
        </View>
      </Animated.View>

      {/* Geri Bildirim Modal */}
      <FeedbackModal
        visible={showFeedback}
        type={feedbackType}
        onClose={handleFeedbackClose}
      />
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
    paddingHorizontal: SPACING.xl,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONTS.body,
    color: theme.textLight,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: theme.error,
    fontWeight: FONTS.bold,
  },
  wordCard: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    marginHorizontal: SPACING.lg,
    backgroundColor: theme.card,
    borderRadius: RADIUS.xl,
    ...SHADOWS.medium,
    marginTop: SPACING.md,
  },
  wordEmoji: {
    fontSize: 80,
    marginBottom: SPACING.sm,
  },
  speakButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.primaryLight,
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.round,
    marginBottom: SPACING.md,
  },
  speakButtonText: {
    fontSize: FONTS.caption,
    color: theme.primaryDark,
    fontWeight: FONTS.bold,
  },
  hintText: {
    fontSize: FONTS.body,
    color: theme.textLight,
    fontWeight: FONTS.medium,
    marginBottom: SPACING.sm,
  },
  wordDots: {
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.primaryLight,
  },
  slotsContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  slotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  syllablesContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: SPACING.xxl,
  },
  syllablesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  // Seviye tamamlama ekranı
  completeEmoji: {
    fontSize: 80,
    marginBottom: SPACING.lg,
  },
  completeTitle: {
    fontSize: FONTS.title,
    fontWeight: FONTS.bold,
    color: theme.primary,
    marginBottom: SPACING.sm,
  },
  completeSubtitle: {
    fontSize: FONTS.heading,
    color: theme.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  completeScore: {
    fontSize: FONTS.body,
    color: theme.warning,
    fontWeight: FONTS.bold,
    marginBottom: SPACING.xl,
  },
  completeButton: {
    backgroundColor: theme.primary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
    borderRadius: RADIUS.round,
    ...SHADOWS.large,
  },
  completeButtonText: {
    color: theme.textWhite,
    fontSize: FONTS.heading,
    fontWeight: FONTS.bold,
  },
});
