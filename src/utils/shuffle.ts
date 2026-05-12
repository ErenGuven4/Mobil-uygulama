// ============================================
// utils/shuffle.ts — Dizi Karıştırma Yardımcısı
// ============================================
// Fisher-Yates algoritması ile bir diziyi
// rastgele karıştırır. Hece butonlarını
// karışık sırada göstermek için kullanılır.
// ============================================

/**
 * Bir diziyi rastgele karıştır (Fisher-Yates Shuffle)
 * Orijinal diziyi değiştirmez, yeni bir dizi döndürür.
 *
 * @param array - Karıştırılacak dizi
 * @returns Karıştırılmış yeni dizi
 *
 * @example
 * shuffle(["El", "ma"]) → ["ma", "El"]
 */
export function shuffle<T>(array: T[]): T[] {
  // Orijinal diziyi bozmamak için kopyasını al
  const shuffled = [...array];

  // Fisher-Yates algoritması: sondan başa doğru
  for (let i = shuffled.length - 1; i > 0; i--) {
    // 0 ile i arasında rastgele bir indeks seç
    const j = Math.floor(Math.random() * (i + 1));
    // i ve j indekslerindeki elemanları yer değiştir
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
