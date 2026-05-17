// ============================================
// utils/audio.ts — Ses Sistemi
// ============================================
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

// Doğru cevap için kullanılacak yerel ses (Kullanıcı tarafından eklenecek)
let successSound: Audio.Sound | null = null;
export let isSoundEffectsEnabled = true;

export function setSoundEffectsEnabled(enabled: boolean) {
  isSoundEffectsEnabled = enabled;
}

// ============================================
// Ses Sistemini Başlat
// ============================================
export async function initAudio(): Promise<void> {
  console.log('🔊 Ses sistemi başlatıldı');
}

// ============================================
// Doğru Cevap Sesi (Süper yerine Konfeti Sesi)
// ============================================
export async function playCorrectSound(): Promise<void> {
  if (!isSoundEffectsEnabled) return;
  try {
    // Daha önce yüklendiyse önceki sesi durdur/başa sar
    if (successSound) {
      await successSound.unloadAsync();
    }
    
    // assets içindeki success.mp3 dosyasını çal
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/success.mp3')
    );
    successSound = sound;
    await sound.playAsync();
  } catch (error) {
    console.log('⚠️ Doğru sesi (success.mp3) bulunamadı veya çalınamadı:', error);
  }
}

// ============================================
// Yanlış Cevap Sesi (Daha doğal bir ses tonu)
// ============================================
export async function playWrongSound(): Promise<void> {
  // Kullanıcı isteği üzerine hata yapıldığında okunan "Bir daha dene" sesi kaldırıldı.
  return;
}

// ============================================
// Buton Tıklama Sesi
// ============================================
export async function playTapSound(): Promise<void> {
  // Sessiz
}

// ============================================
// Seviye Tamamlama Sesi
// ============================================
export async function playLevelCompleteSound(): Promise<void> {
  playCorrectSound(); // Seviye bitince de aynı konfeti sesi çalsın
}

// ============================================
// Kelimeyi Türkçe Sesli Oku (Sadece butona basınca)
// ============================================
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

// ============================================
// Heceyi Sesli Oku (SES KAPALI)
// ============================================
export async function speakSyllable(syllable: string): Promise<void> {
  // Kullanıcı isteği üzerine heceye tıklama sesi kapatıldı.
  return;
}

// ============================================
// TTS'i Durdur
// ============================================
export async function stopSpeaking(): Promise<void> {
  try {
    await Speech.stop();
  } catch (_) {}
}
