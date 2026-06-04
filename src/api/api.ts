// Sunucu ile haberleşmeyi sağlamak için yazdığım api fonksiyonları.

import Constants from 'expo-constants';

// Telefondan bağlanırken bilgisayarın IP adresini otomatik çektim.
const hostUri = Constants.expoConfig?.hostUri;
const localIp = hostUri ? hostUri.split(':')[0] : '192.168.1.19';
const BASE_URL = `http://${localIp}:3001/api`;

// Kelime verisinin yapısını tanımladım.
export interface Word {
  id: string;
  word: string;
  syllables: string[];
  level: number;
  emoji: string;
}

// Her seviyenin (bölümün) bilgilerini tutan interface.
export interface Level {
  id: number;
  name: string;
  description: string;
  requiredScore: number;
}

// Kullanıcının oyundaki durum bilgilerini tutan interface.
export interface UserProgress {
  userId: string;
  completedLevels: number[];
  currentLevel: number;
  score: number;
  completedWords: string[];
  createdAt: string;
}

// Sunucudan gelen genel cevap formatını belirledim.
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  [key: string]: any;
}

// Seçilen bölüme ait kelimeleri sunucudan çeken fonksiyonu yazdım.
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

// Bölümlerin listesini sunucudan getiren fonksiyonu yazdım.
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

// Kullanıcının kaldığı yer ve skor gibi ilerleme verilerini çeken fonksiyonu yazdım.
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

export interface LeaderboardEntry {
  userId: string;
  score: number;
  currentLevel: number;
  completedWordsCount: number;
}

// Skor tablosundaki oyuncuları sunucudan çeken fonksiyonu yazdım.
export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const response = await fetch(`${BASE_URL}/progress/leaderboard`);
    const data = await response.json();

    if (data.success) {
      return data.leaderboard;
    }
    throw new Error(data.message || 'Skor tablosu yüklenemedi');
  } catch (error) {
    console.error('API Hatası (getLeaderboard):', error);
    return [];
  }
}


// Kullanıcı kelime bildiğinde veya bölüm bitirdiğinde durumu sunucuda güncelleyen fonksiyonu yazdım.
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

// Kullanıcı sıfırlama yaptığında sunucudaki verilerini de sıfırlayan fonksiyonu yazdım.
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

// Sunucudaki tüm kelimeleri tek seferde getiren fonksiyonu yazdım.
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
