// Uygulamanın renklerini, yazı tiplerini (font) ve boşluk (spacing) değerlerini belirlediğim yer.

export const LIGHT_COLORS = {
  // Ana arka plan renkleri
  background: '#FFF5F7',        // Çok açık pembe arka plan
  backgroundGradientStart: '#E8D5F5', // Gradient başlangıç (açık mor)
  backgroundGradientEnd: '#FDDDE6',   // Gradient bitiş (açık pembe)

  // Ana renkler
  primary: '#7C3AED',           // Mor (ana tema rengi)
  primaryLight: '#A78BFA',      // Açık mor
  primaryDark: '#5B21B6',       // Koyu mor
  secondary: '#F472B6',         // Pembe
  secondaryLight: '#FBCFE8',    // Açık pembe

  // Durum renkleri
  success: '#34D399',           // Yeşil (doğru cevap)
  successLight: '#D1FAE5',      // Açık yeşil arka plan
  error: '#FB7185',             // Kırmızı (yanlış cevap)
  errorLight: '#FFE4E6',        // Açık kırmızı arka plan
  warning: '#FBBF24',           // Sarı (uyarı)
  warningLight: '#FEF3C7',      // Açık sarı

  // Kart ve buton renkleri
  card: '#FFFFFF',              // Beyaz kart
  cardShadow: 'rgba(124, 58, 237, 0.1)', // Mor gölge
  syllableBtn: '#EDE9FE',       // Hece buton arka plan
  syllableBtnBorder: '#C4B5FD', // Hece buton kenar
  syllableBtnActive: '#7C3AED', // Seçili hece arka plan
  answerSlot: '#F3E8FF',        // Cevap yuvası arka plan
  answerSlotBorder: '#DDD6FE',  // Cevap yuvası kenar

  // Metin renkleri
  text: '#1F2937',              // Koyu metin
  textLight: '#6B7280',         // Açık metin
  textWhite: '#FFFFFF',         // Beyaz metin

  // Seviye düğüm renkleri
  levelCompleted: '#34D399',    // Tamamlanmış seviye (yeşil)
  levelCurrent: '#7C3AED',      // Mevcut seviye (mor)
  levelLocked: '#D1D5DB',       // Kilitli seviye (gri)
  levelLockedText: '#9CA3AF',   // Kilitli seviye metni

  // Diğer
  disabled: '#D1D5DB',          // Devre dışı
  overlay: 'rgba(0, 0, 0, 0.5)', // Koyu overlay
};

export const DARK_COLORS = {
  // Ana arka plan renkleri
  background: '#0F172A',        // Slate 900 (Koyu lacivert)
  backgroundGradientStart: '#1E1B4B', // Indigo 950 (Çok koyu indigo)
  backgroundGradientEnd: '#311042',   // Koyu patlıcan/mor gradient bitiş

  // Ana renkler
  primary: '#A78BFA',           // Açık mor (koyu temada kontrast için daha açık)
  primaryLight: '#C084FC',      // Daha parlak açık mor
  primaryDark: '#7C3AED',       // Mor
  secondary: '#F472B6',         // Pembe
  secondaryLight: '#FBCFE8',    // Açık pembe

  // Durum renkleri
  success: '#34D399',           // Yeşil
  successLight: 'rgba(16, 185, 129, 0.15)', // Şeffaf koyu yeşil arka plan
  error: '#FB7185',             // Kırmızı
  errorLight: 'rgba(244, 63, 94, 0.15)',   // Şeffaf koyu kırmızı
  warning: '#FBBF24',           // Sarı
  warningLight: 'rgba(245, 158, 11, 0.15)', // Şeffaf koyu sarı

  // Kart ve buton renkleri
  card: '#1E293B',              // Slate 800 (Koyu kart arka planı)
  cardShadow: 'rgba(0, 0, 0, 0.4)', // Koyu gölge
  syllableBtn: '#334155',       // Slate 700 (Koyu hece butonu)
  syllableBtnBorder: '#475569', // Slate 600
  syllableBtnActive: '#A78BFA', // Seçili hece
  answerSlot: '#1E1B4B',        // Koyu cevap yuvası
  answerSlotBorder: '#475569',  // Koyu yuva kenarı

  // Metin renkleri
  text: '#F8FAF8',              // Beyaza yakın metin
  textLight: '#94A3B8',         // Slate 400 (Gri metin)
  textWhite: '#FFFFFF',         // Beyaz metin

  // Seviye düğüm renkleri
  levelCompleted: '#10B981',    // Yeşil
  levelCurrent: '#A78BFA',      // Mor
  levelLocked: '#475569',       // Koyu gri
  levelLockedText: '#64748B',   // Kilitli metin rengi

  // Diğer
  disabled: '#475569',          // Devre dışı
  overlay: 'rgba(0, 0, 0, 0.7)', // Koyu overlay
};

// Geriye uyumluluk için varsayılan COLORS
export const COLORS = LIGHT_COLORS;

export const FONTS = {
  // Font boyutları
  title: 32,
  subtitle: 24,
  heading: 20,
  body: 16,
  caption: 14,
  small: 12,

  // Font ağırlıkları
  bold: '700' as const,
  semiBold: '600' as const,
  medium: '500' as const,
  regular: '400' as const,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 999,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};
