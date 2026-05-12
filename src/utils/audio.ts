// ============================================
// utils/audio.ts — Ses Yardımcı Fonksiyonları
// ============================================
// Expo Audio kütüphanesi ile ses çalma
// placeholder fonksiyonları.
// İleride gerçek ses dosyaları eklenebilir.
// ============================================

import { Audio } from 'expo-av';

/**
 * Ses sistemini başlat
 * Uygulamanın sesli modda çalışmasını sağlar
 */
export async function initAudio(): Promise<void> {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
    console.log('🔊 Ses sistemi başlatıldı');
  } catch (error) {
    console.log('⚠️ Ses sistemi başlatılamadı:', error);
  }
}

/**
 * Doğru cevap sesi çal
 * TODO: Gerçek ses dosyası eklenince güncellenecek
 */
export async function playCorrectSound(): Promise<void> {
  try {
    // Placeholder — gerçek ses dosyası eklendiğinde:
    // const { sound } = await Audio.Sound.createAsync(
    //   require('../../assets/sounds/correct.mp3')
    // );
    // await sound.playAsync();
    console.log('🎵 Doğru cevap sesi çalındı!');
  } catch (error) {
    console.log('⚠️ Ses çalınamadı:', error);
  }
}

/**
 * Yanlış cevap sesi çal
 * TODO: Gerçek ses dosyası eklenince güncellenecek
 */
export async function playWrongSound(): Promise<void> {
  try {
    // Placeholder — gerçek ses dosyası eklendiğinde:
    // const { sound } = await Audio.Sound.createAsync(
    //   require('../../assets/sounds/wrong.mp3')
    // );
    // await sound.playAsync();
    console.log('🎵 Yanlış cevap sesi çalındı!');
  } catch (error) {
    console.log('⚠️ Ses çalınamadı:', error);
  }
}

/**
 * Seviye tamamlama sesi çal
 * TODO: Gerçek ses dosyası eklenince güncellenecek
 */
export async function playLevelCompleteSound(): Promise<void> {
  try {
    console.log('🎵 Seviye tamamlama sesi çalındı!');
  } catch (error) {
    console.log('⚠️ Ses çalınamadı:', error);
  }
}

/**
 * Buton tıklama sesi çal
 * TODO: Gerçek ses dosyası eklenince güncellenecek
 */
export async function playTapSound(): Promise<void> {
  try {
    console.log('🎵 Tıklama sesi çalındı!');
  } catch (error) {
    console.log('⚠️ Ses çalınamadı:', error);
  }
}
