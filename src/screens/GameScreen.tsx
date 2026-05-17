// ============================================
// screens/GameScreen.tsx — Oyun Ekranı
// ============================================
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, Animated, TouchableOpacity,
  StatusBar, ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import SyllableButton from '../components/SyllableButton';
import AnswerSlot from '../components/AnswerSlot';
import ProgressBar from '../components/ProgressBar';
import FeedbackModal from '../components/FeedbackModal';
import ConfettiEffect from '../components/ConfettiEffect';
import { shuffle } from '../utils/shuffle';
import { playCorrectSound, playWrongSound, playTapSound, playLevelCompleteSound, speakWord, speakSyllable, stopSpeaking } from '../utils/audio';
import { getWordsByLevel, updateProgress, Word } from '../api/api';

interface Props {
  navigation: any;
  route: any;
}

// Varsayılan kelimeler (offline fallback)
const fallbackWords: Word[] = [
  { id: 'f1', word: 'Elma', syllables: ['El', 'ma'], level: 1, emoji: '🍎' },
  { id: 'f2', word: 'Arı', syllables: ['A', 'rı'], level: 1, emoji: '🐝' },
  { id: 'f3', word: 'Kedi', syllables: ['Ke', 'di'], level: 1, emoji: '🐱' },
  { id: 'f4', word: 'Kapı', syllables: ['Ka', 'pı'], level: 1, emoji: '🚪' },
  { id: 'f5', word: 'Balık', syllables: ['Ba', 'lık'], level: 1, emoji: '🐟' },
];

export default function GameScreen({ navigation, route }: Props) {
  const { levelId, userId = 'default' } = route.params;

  // Durum (state) değişkenleri
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

  // Animasyon değerleri
  const emojiScale = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;

  // Mevcut kelime
  const currentWord = words[currentWordIndex];

  // Verileri yükle
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

  // Yeni kelime hazırla
  function setupWord(word: Word) {
    if (!word) return;
    const shuffled = shuffle(word.syllables);
    setShuffledSyllables(shuffled);
    setSelectedSyllables(new Array(word.syllables.length).fill(undefined));
    setUsedIndices(new Set());
    setSlotStatus('neutral');

    // Emoji animasyonu
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

  // Hece butonuna tıklandığında
  function handleSyllablePress(syllable: string, index: number) {
    playTapSound();
    speakSyllable(syllable); // Heceyi sesli oku

    // İlk boş yuvayı bul
    const emptySlotIndex = selectedSyllables.findIndex((s) => s === undefined);
    if (emptySlotIndex === -1) return; // Tüm yuvalar dolu

    // Heceyi yuvaya yerleştir
    const newSelected = [...selectedSyllables];
    newSelected[emptySlotIndex] = syllable;
    setSelectedSyllables(newSelected);

    // Kullanılan indeksi işaretle
    const newUsed = new Set(usedIndices);
    newUsed.add(index);
    setUsedIndices(newUsed);

    // Tüm yuvalar dolduysa kontrol et
    const allFilled = newSelected.every((s) => s !== undefined);
    if (allFilled) {
      checkAnswer(newSelected as string[]);
    }
  }

  // Yuvadaki heceye tıklayınca geri al
  function handleSlotPress(slotIndex: number) {
    const syllable = selectedSyllables[slotIndex];
    if (!syllable) return;

    playTapSound();

    // Yuvayı temizle
    const newSelected = [...selectedSyllables];
    newSelected[slotIndex] = undefined;
    setSelectedSyllables(newSelected);

    // Kullanılan indeksi bul ve kaldır
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

  // Cevabı kontrol et
  async function checkAnswer(answer: string[]) {
    if (!currentWord) return;

    const isCorrect = answer.join('') === currentWord.syllables.join('');

    if (isCorrect) {
      // DOĞRU CEVAP
      setSlotStatus('correct');
      setFeedbackType('correct');
      setShowConfetti(true);
      setShowFeedback(true);
      playCorrectSound();

      // İlerlemeyi kaydet
      await updateProgress(currentWord.id, true, undefined, userId);
    } else {
      // YANLIŞ CEVAP
      setSlotStatus('wrong');
      setFeedbackType('wrong');
      setShowFeedback(true);
      playWrongSound();
    }
  }

  // Geri bildirim kapatıldığında
  function handleFeedbackClose() {
    setShowFeedback(false);
    setShowConfetti(false);

    if (feedbackType === 'correct') {
      // Sonraki kelimeye geç
      const nextIndex = currentWordIndex + 1;
      if (nextIndex < words.length) {
        setCurrentWordIndex(nextIndex);
        setupWord(words[nextIndex]);
      } else {
        // Seviye tamamlandı!
        handleLevelComplete();
      }
    } else {
      // Yanlış cevap — sıfırla ve tekrar dene
      if (currentWord) {
        setupWord(currentWord);
      }
    }
  }

  // Seviye tamamlandığında
  async function handleLevelComplete() {
    setLevelComplete(true);
    playLevelCompleteSound();
    await updateProgress('', false, levelId, userId);
  }

  // Bileşen kapandığında TTS'i durdur
  useEffect(() => {
    return () => { stopSpeaking(); };
  }, []);

  // Yükleniyor
  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Kelimeler yükleniyor...</Text>
      </View>
    );
  }

  // Seviye tamamlandı ekranı
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
      <StatusBar barStyle="dark-content" />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONTS.body,
    color: COLORS.textLight,
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
    backgroundColor: COLORS.errorLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 18,
    color: COLORS.error,
    fontWeight: FONTS.bold,
  },
  wordCard: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    marginHorizontal: SPACING.lg,
    backgroundColor: COLORS.card,
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
    backgroundColor: COLORS.primaryLight,
    paddingVertical: 6,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.round,
    marginBottom: SPACING.md,
  },
  speakButtonText: {
    fontSize: FONTS.caption,
    color: COLORS.primary,
    fontWeight: FONTS.bold,
  },
  hintText: {
    fontSize: FONTS.body,
    color: COLORS.textLight,
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
    backgroundColor: COLORS.primaryLight,
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
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  completeSubtitle: {
    fontSize: FONTS.heading,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  completeScore: {
    fontSize: FONTS.body,
    color: COLORS.warning,
    fontWeight: FONTS.bold,
    marginBottom: SPACING.xl,
  },
  completeButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
    borderRadius: RADIUS.round,
    ...SHADOWS.large,
  },
  completeButtonText: {
    color: COLORS.textWhite,
    fontSize: FONTS.heading,
    fontWeight: FONTS.bold,
  },
});
