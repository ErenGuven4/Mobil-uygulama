// Seslerin çalınmasını ve sesli okuma (TTS) işlemlerini kontrol etmek için yazdığım yardımcı fonksiyonlar.
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

// Doğru ve yanlış seslerini atadığım değişkenler.
let successSound: Audio.Sound | null = null;
let wrongSound: Audio.Sound | null = null;
export let isSoundEffectsEnabled = true;

export function setSoundEffectsEnabled(enabled: boolean) {
  isSoundEffectsEnabled = enabled;
}

// Ses sistemini başlattım.
export async function initAudio(): Promise<void> {
  console.log('🔊 Ses sistemi başlatıldı');
}

// Doğru cevap verildiğinde çalacak konfeti sesini buraya ekledim.
export async function playCorrectSound(): Promise<void> {
  if (!isSoundEffectsEnabled) return;
  try {
    // Daha önce yüklendiyse önceki sesi durdur/başa sar
    if (successSound) {
      await successSound.unloadAsync();
    }
    
    // Projenin assets klasöründeki doğru cevap sesini çaldırdım.
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/success.mp3')
    );
    successSound = sound;
    await sound.playAsync();
  } catch (error) {
    console.log('⚠️ Doğru sesi (success.mp3) bulunamadı veya çalınamadı:', error);
  }
}

// Yanlış cevap verildiğinde çalacak buzzer sesini buraya ekledim.
export async function playWrongSound(): Promise<void> {
  if (!isSoundEffectsEnabled) return;
  try {
    if (wrongSound) {
      await wrongSound.unloadAsync();
    }
    const { sound } = await Audio.Sound.createAsync(
      { uri: 'https://assets.mixkit.co/active_storage/sfx/951/951-preview.mp3' }
    );
    wrongSound = sound;
    await sound.playAsync();
  } catch (error) {
    console.log('⚠️ Yanlış cevap sesi çalınamadı:', error);
  }
}

// Buton tıklama sesini tanımladım.
export async function playTapSound(): Promise<void> {
  // Sessiz
}

// Bölüm bitirme sesini ayarladım.
export async function playLevelCompleteSound(): Promise<void> {
  playCorrectSound(); // Seviye bitince de aynı konfeti sesi çalsın
}

// Kelimenin tamamını Türkçe okutmak için kullandığım TTS fonksiyonu.
export async function speakWord(word: string): Promise<void> {
  try {
    const isSpeaking = await Speech.isSpeakingAsync();
    if (isSpeaking) {
      await Speech.stop();
    }
    Speech.speak(word, {
      language: 'tr-TR',
      pitch: 1.0, // Sesi dijitalleştirmeden (bozmadan) çıkan en doğal ton
      rate: 0.9,  // Çok yavaşlatıldığında oluşan robotik uzamayı engellemek için doğal hız
    });
  } catch (error) {
    console.log('⚠️ TTS çalıştırılamadı:', error);
  }
}

// Heceye tıklayınca çalması planlanan ama sonradan iptal ettiğim ses.
export async function speakSyllable(syllable: string): Promise<void> {
  // Kullanıcı isteği üzerine heceye tıklama sesi kapatıldı.
  return;
}

// Sesli okumayı yarıda kesmek için kullandığım durdurma fonksiyonu.
export async function stopSpeaking(): Promise<void> {
  try {
    await Speech.stop();
  } catch (_) {}
}
