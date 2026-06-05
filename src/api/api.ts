import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const hostUri = Constants.expoConfig?.hostUri;
const localIp = hostUri ? hostUri.split(':')[0] : '192.168.1.19';
// Web'de window.location.hostname ile aynı makinedeki backend'e bağlan
const isWeb = typeof window !== 'undefined' && typeof document !== 'undefined';
const BASE_URL = isWeb
  ? `http://${window.location.hostname}:3001/api`
  : `http://${localIp}:3001/api`;

// ─── Token yönetimi ───────────────────────────────────────────────
const TOKEN_KEY = 'accessToken';

export async function saveToken(token: string) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function clearToken() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

// JWT gerektiren istekler için Authorization header'ı ekler
async function authHeaders(): Promise<Record<string, string>> {
  const token = await getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─── Tipler ──────────────────────────────────────────────────────
export interface Word {
  id: string;
  word: string;
  syllables: string[];
  level: number;
  emoji: string;
}

export interface Level {
  id: number;
  name: string;
  description: string;
  requiredScore: number;
}

export interface UserProgress {
  userId: string;
  completedLevels: number[];
  currentLevel: number;
  score: number;
  completedWords: string[];
  createdAt: string;
}

export interface LeaderboardEntry {
  userId: string;
  score: number;
  currentLevel: number;
  completedWordsCount: number;
}

// ─── Auth ─────────────────────────────────────────────────────────

// Kayıt: kullanıcı adı + email + şifre
export async function register(username: string, password: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        email: `${username}@heceleme.app`,
        password,
      }),
    });
    return res.status === 201;
  } catch {
    return false;
  }
}

// Giriş: token alır ve kaydeder
export async function login(username: string, password: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.accessToken) {
      await saveToken(data.accessToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Çıkış: token'ı temizle
export async function logout(): Promise<void> {
  try {
    const headers = await authHeaders();
    await fetch(`${BASE_URL}/auth/logout`, { method: 'POST', headers });
  } finally {
    await clearToken();
  }
}

// ─── Kelimeler ────────────────────────────────────────────────────

export async function getWordsByLevel(level: number): Promise<Word[]> {
  try {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/words?level=${level}`, { headers });
    const data = await res.json();
    return data.success ? data.words : [];
  } catch (error) {
    console.error('API Hatası (getWordsByLevel):', error);
    return [];
  }
}

export async function getAllWords(): Promise<Word[]> {
  try {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/words`, { headers });
    const data = await res.json();
    return data.success ? data.words : [];
  } catch (error) {
    console.error('API Hatası (getAllWords):', error);
    return [];
  }
}

// Seviyeler herkese açık (JWT gerekmez)
export async function getLevels(): Promise<Level[]> {
  try {
    const res = await fetch(`${BASE_URL}/levels`);
    const data = await res.json();
    return data.success ? data.levels : [];
  } catch (error) {
    console.error('API Hatası (getLevels):', error);
    return [];
  }
}

// ─── İlerleme ─────────────────────────────────────────────────────

export async function getProgress(userId: string = 'default'): Promise<UserProgress | null> {
  try {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/progress?userId=${userId}`, { headers });
    const data = await res.json();
    return data.success ? data.progress : null;
  } catch (error) {
    console.error('API Hatası (getProgress):', error);
    return null;
  }
}

export async function updateProgress(
  wordId: string,
  correct: boolean,
  levelId?: number,
  userId: string = 'default',
): Promise<UserProgress | null> {
  try {
    const headers = await authHeaders();
    const body: any = { userId, wordId, correct };
    if (levelId !== undefined) body.levelId = levelId;

    const res = await fetch(`${BASE_URL}/progress`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return data.success ? data.progress : null;
  } catch (error) {
    console.error('API Hatası (updateProgress):', error);
    return null;
  }
}

export async function resetProgress(userId: string = 'default'): Promise<boolean> {
  try {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/progress/reset`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    return data.success;
  } catch (error) {
    console.error('API Hatası (resetProgress):', error);
    return false;
  }
}

export async function getLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const headers = await authHeaders();
    const res = await fetch(`${BASE_URL}/progress/leaderboard`, { headers });
    const data = await res.json();
    return data.success ? data.leaderboard : [];
  } catch (error) {
    console.error('API Hatası (getLeaderboard):', error);
    return [];
  }
}
