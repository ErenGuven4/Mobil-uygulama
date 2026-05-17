// ============================================
// api/api.ts — Backend API Bağlantısı
// ============================================
// Bu dosya frontend ile backend arasındaki
// tüm HTTP isteklerini yönetir.
// ============================================

// ============================================
// ÖNEMLİ: API adresini kendi bilgisayarınıza göre ayarlayın!
// ============================================
// Expo Go kullanıyorsanız, localhost yerine
// bilgisayarınızın yerel IP adresini kullanın.
// Örnek: const BASE_URL = 'http://192.168.1.100:3001/api';
//
// IP adresinizi bulmak için terminalde:
//   Windows: ipconfig
//   Mac/Linux: ifconfig
// ============================================
import Constants from 'expo-constants';

// Telefonun backend'e bağlanabilmesi için Expo'nun sağladığı IP adresini otomatik çekiyoruz
const hostUri = Constants.expoConfig?.hostUri;
const localIp = hostUri ? hostUri.split(':')[0] : '192.168.1.19';

const BASE_URL = `http://${localIp}:3001/api`;

// ============================================
// Tip Tanımlamaları (TypeScript)
// ============================================

/** Tek bir kelime objesi */
export interface Word {
  id: string;
  word: string;
  syllables: string[];
  level: number;
  emoji: string;
}

/** Seviye bilgisi */
export interface Level {
  id: number;
  name: string;
  description: string;
  requiredScore: number;
}

/** Kullanıcı ilerleme bilgisi */
export interface UserProgress {
  userId: string;
  completedLevels: number[];
  currentLevel: number;
  score: number;
  completedWords: string[];
  createdAt: string;
}

/** API yanıt formatı */
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  [key: string]: any;
}

// ============================================
// API Fonksiyonları
// ============================================

/**
 * Seviyeye göre kelimeleri getir
 * @param level - Seviye numarası (1-5)
 */
export async function getWordsByLevel(level: number): Promise<Word[]> {
  try {
    const response = await fetch(`${BASE_URL}/words?level=${level}`);
    const data = await response.json();

    if (data.success) {
      return data.words;
    }
    throw new Error(data.message || 'Kelimeler yüklenemedi');
  } catch (error) {
    console.error('API Hatası (getWordsByLevel):', error);
    // Offline durumda boş dizi dön
    return [];
  }
}

/**
 * Tüm seviyelerin listesini getir
 */
export async function getLevels(): Promise<Level[]> {
  try {
    const response = await fetch(`${BASE_URL}/levels`);
    const data = await response.json();

    if (data.success) {
      return data.levels;
    }
    throw new Error(data.message || 'Seviyeler yüklenemedi');
  } catch (error) {
    console.error('API Hatası (getLevels):', error);
    return [];
  }
}

/**
 * Kullanıcı ilerlemesini getir
 * @param userId - Kullanıcı ID (varsayılan: "default")
 */
export async function getProgress(userId: string = 'default'): Promise<UserProgress | null> {
  try {
    const response = await fetch(`${BASE_URL}/progress?userId=${userId}`);
    const data = await response.json();

    if (data.success) {
      return data.progress;
    }
    throw new Error(data.message || 'İlerleme yüklenemedi');
  } catch (error) {
    console.error('API Hatası (getProgress):', error);
    return null;
  }
}

/**
 * Kullanıcı ilerlemesini güncelle
 * @param wordId - Tamamlanan kelimenin ID'si
 * @param correct - Doğru mu cevaplandı?
 * @param levelId - Seviye tamamlandıysa seviye ID'si
 */
export async function updateProgress(
  wordId: string,
  correct: boolean,
  levelId?: number,
  userId: string = 'default'
): Promise<UserProgress | null> {
  try {
    const body: any = {
      userId,
      wordId,
      correct,
    };

    if (levelId !== undefined) {
      body.levelId = levelId;
    }

    const response = await fetch(`${BASE_URL}/progress`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (data.success) {
      return data.progress;
    }
    throw new Error(data.message || 'İlerleme güncellenemedi');
  } catch (error) {
    console.error('API Hatası (updateProgress):', error);
    return null;
  }
}

/**
 * İlerlemeyi sıfırla
 */
export async function resetProgress(): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/progress/reset`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: 'default' }),
    });

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('API Hatası (resetProgress):', error);
    return false;
  }
}

/**
 * Tüm kelimeleri getir
 */
export async function getAllWords(): Promise<Word[]> {
  try {
    const response = await fetch(`${BASE_URL}/words`);
    const data = await response.json();
    if (data.success) {
      return data.words;
    }
    return [];
  } catch (error) {
    console.error('API Hatası (getAllWords):', error);
    return [];
  }
}
