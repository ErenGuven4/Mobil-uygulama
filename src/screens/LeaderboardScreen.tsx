// Oyuncuların skorlarını ve podyum sıralamasını gösterdiğim liderlik tablosu ekranı.
import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar,
  ActivityIndicator, RefreshControl
} from 'react-native';
// useFocusEffect: Ekran her görüntülendiğinde güncel verileri çekmek için kullanılan navigasyon hook'u.
import { useFocusEffect } from '@react-navigation/native';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
// getLeaderboard: Backend'den skora göre sıralı tüm kullanıcı listesini çeken API.
import { getLeaderboard, LeaderboardEntry } from '../api/api';
// useTheme: Tema renklerini (açık/koyu mod) almak için kullanılan context hook'u.
import { useTheme } from '../context/ThemeContext';

export default function LeaderboardScreen({ route }: any) {
  // route.params üzerinden gelen aktif kullanıcı ID'si (sen olduğunu belirtmek için).
  const { userId } = route.params || { userId: 'default' };
  const { theme, isDarkMode } = useTheme();
  const styles = getStyles(theme);

  // State tanımlamaları:
  // leaderboard: Sunucudan çekilen sıralı kullanıcı dizisi.
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  // loading: İlk açılışta yüklenme çemberini gösterir.
  const [loading, setLoading] = useState(true);
  // refreshing: Aşağı çekip yenileme (Pull to Refresh) animasyonunu kontrol eder.
  const [refreshing, setRefreshing] = useState(false);

  // Sunucudan liderlik sıralamasını alan asenkron fonksiyon.
  const loadData = async () => {
    try {
      const data = await getLeaderboard();
      setLeaderboard(data);
    } catch (err) {
      console.log('Skor tablosu yüklenirken hata:', err);
    } finally {
      // Her halükarda yükleniyor durumlarını kapatıyoruz.
      setLoading(false);
      setRefreshing(false);
    }
  };

  // useFocusEffect: Kullanıcı bu ekranı her açtığında sıralamayı günceller.
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [userId])
  );

  // Kullanıcı ekranı aşağı kaydırdığında (pull-to-refresh) tetiklenen yenileme fonksiyonu.
  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // İlk yüklemede dönen yükleniyor simgesi.
  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  // İlk 3 kişiyi podyumda (kürsüde) göstermek için diziden ayırıyoruz.
  const podium = leaderboard.slice(0, 3);
  // Geriye kalan oyuncuları ise normal liste şeklinde aşağıda göstereceğiz.
  const others = leaderboard.slice(3);

  // Oyuncunun sırasına göre kupa veya madalya emojisi döndüren yardımcı fonksiyon.
  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`; // İlk 3 dışındakilere "#4", "#5" gibi sıra no yazılır.
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      
      {/* Üst Başlık */}
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <Text style={styles.headerTitle}>📊 Skor Tablosu</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Kaydırılabilir İçerik Alanı ve Yenileme Kontrolü (RefreshControl) */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />
        }
      >
        <Text style={styles.pageSubtitle}>
          En çok kelime heceleyen süper oyuncular burada! Aşağı kaydırarak yenileyebilirsin. 🐼
        </Text>

        {/* PODYUM ALANI (Dereceye giren ilk 3 oyuncu görsel kürsüde gösterilir) */}
        {podium.length > 0 && (
          <View style={styles.podiumContainer}>
            {/* 2. Sıra (Soldaki kürsü) */}
            {podium[1] && (
              <View style={[styles.podiumCol, styles.podiumCol2]}>
                <Text style={styles.podiumRank}>🥈</Text>
                <View style={[styles.podiumAvatar, { backgroundColor: '#60A5FA' }]}>
                  <Text style={styles.podiumLetter}>{podium[1].userId.charAt(0).toUpperCase()}</Text>
                </View>
                <Text style={styles.podiumName2} numberOfLines={1}>{podium[1].userId}</Text>
                <Text style={styles.podiumScore}>{podium[1].score}⭐</Text>
              </View>
            )}

            {/* 1. Sıra (Ortadaki kürsü - daha büyük ve yukarıda hizalanmış) */}
            {podium[0] && (
              <View style={[styles.podiumCol, styles.podiumCol1]}>
                <Text style={styles.podiumRankMain}>🥇</Text>
                <View style={[styles.podiumAvatarMain, { backgroundColor: '#FBBF24' }]}>
                  <Text style={styles.podiumLetterMain}>{podium[0].userId.charAt(0).toUpperCase()}</Text>
                </View>
                <Text style={styles.podiumName1} numberOfLines={1}>{podium[0].userId}</Text>
                <Text style={styles.podiumScoreMain}>{podium[0].score}⭐</Text>
              </View>
            )}

            {/* 3. Sıra (Sağdaki kürsü) */}
            {podium[2] && (
              <View style={[styles.podiumCol, styles.podiumCol3]}>
                <Text style={styles.podiumRank}>🥉</Text>
                <View style={[styles.podiumAvatar, { backgroundColor: '#34D399' }]}>
                  <Text style={styles.podiumLetter}>{podium[2].userId.charAt(0).toUpperCase()}</Text>
                </View>
                <Text style={styles.podiumName3} numberOfLines={1}>{podium[2].userId}</Text>
                <Text style={styles.podiumScore}>{podium[2].score}⭐</Text>
              </View>
            )}
          </View>
        )}

        <Text style={styles.sectionTitle}>TÜM SIRALAMA</Text>

        {/* LİSTE ALANI (Tüm oyuncular alt alta sıralanır) */}
        <View style={styles.listCard}>
          {leaderboard.length === 0 ? (
            <Text style={styles.noDataText}>Henüz skor kaydı bulunmuyor.</Text>
          ) : (
            leaderboard.map((item, index) => {
              const rank = index + 1; // Sıralama index'i (1 tabanlı yapılıyor)
              const isCurrentUser = item.userId === userId; // Çizilen satır aktif oyuncuya mı ait?

              // İlk 3 dereceye özel renk parıltısı veya aktif kullanıcıya özel stil ataması
              let nameStyle: any = styles.userNameText;
              if (rank === 1) nameStyle = styles.userNameGlow1;
              else if (rank === 2) nameStyle = styles.userNameGlow2;
              else if (rank === 3) nameStyle = styles.userNameGlow3;
              else if (isCurrentUser) nameStyle = styles.currentUserText;

              return (
                <View
                  key={item.userId}
                  style={[
                    styles.rankRow,
                    isCurrentUser && styles.currentUserRow, // Giriş yapmış kullanıcıyı mor renkle vurgula
                    index === leaderboard.length - 1 && { borderBottomWidth: 0 } // Son satırın alt çizgisini kaldır
                  ]}
                >
                  {/* Sıralama Emoji veya Numarası */}
                  <Text style={[styles.rankNumber, rank <= 3 && styles.topRankNumber]}>
                    {getRankEmoji(rank)}
                  </Text>
                  
                  {/* Oyuncu Bilgileri */}
                  <View style={styles.userInfo}>
                    <Text style={nameStyle}>
                      {item.userId} {isCurrentUser && ' (Sen) 🐼'}
                    </Text>
                    <Text style={styles.userLevelText}>
                      Bölüm {item.currentLevel} • {item.completedWordsCount} Kelime
                    </Text>
                  </View>

                  {/* Oyuncu Skoru */}
                  <Text style={[styles.userScoreText, isCurrentUser && styles.currentUserText]}>
                    {item.score} ⭐
                  </Text>
                </View>
              );
            })
          )}
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  center: { alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 50, paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md,
    backgroundColor: theme.card, borderBottomLeftRadius: RADIUS.xl, borderBottomRightRadius: RADIUS.xl,
    ...SHADOWS.small,
  },
  headerTitle: { fontSize: FONTS.heading, fontWeight: FONTS.bold, color: theme.primary },
  content: { padding: SPACING.lg, paddingBottom: 100 },
  pageSubtitle: { fontSize: FONTS.body, color: theme.textLight, textAlign: 'center', marginBottom: SPACING.xl, lineHeight: 24 },
  
  // Podyum Tasarımı
  podiumContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    backgroundColor: theme.card,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.xl,
    borderWidth: 2,
    borderColor: theme.answerSlotBorder,
    marginBottom: SPACING.xl,
    ...SHADOWS.small
  },
  podiumCol: {
    alignItems: 'center',
    width: '30%',
  },
  podiumCol1: {
    transform: [{ translateY: -15 }],
  },
  podiumCol2: {},
  podiumCol3: {},
  podiumRank: {
    fontSize: 24,
    marginBottom: 4,
  },
  podiumRankMain: {
    fontSize: 32,
    marginBottom: 6,
  },
  podiumAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    ...SHADOWS.small
  },
  podiumAvatarMain: {
    width: 66,
    height: 66,
    borderRadius: 33,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 3,
    borderColor: '#FBBF24',
    ...SHADOWS.medium
  },
  podiumLetter: {
    color: '#FFF',
    fontSize: FONTS.subtitle,
    fontWeight: '700',
  },
  podiumLetterMain: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: '800',
  },
  podiumName1: {
    fontSize: FONTS.body,
    fontWeight: '800',
    color: '#FBBF24',
    textShadowColor: 'rgba(251, 191, 36, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    textAlign: 'center',
    marginBottom: 2,
  },
  podiumName2: {
    fontSize: FONTS.caption,
    fontWeight: '700',
    color: '#60A5FA',
    textShadowColor: 'rgba(96, 165, 250, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    textAlign: 'center',
    marginBottom: 2,
  },
  podiumName3: {
    fontSize: FONTS.caption,
    fontWeight: '700',
    color: '#34D399',
    textShadowColor: 'rgba(52, 211, 153, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    textAlign: 'center',
    marginBottom: 2,
  },
  podiumScore: {
    fontSize: FONTS.caption,
    color: theme.primary,
    fontWeight: '700',
  },
  podiumScoreMain: {
    fontSize: FONTS.body,
    color: '#FBBF24',
    fontWeight: '800',
  },

  // Sıralama Listesi
  sectionTitle: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.bold,
    color: theme.textLight,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.sm,
    letterSpacing: 1,
  },
  listCard: {
    backgroundColor: theme.card,
    borderRadius: RADIUS.xl,
    borderWidth: 2,
    borderColor: theme.answerSlotBorder,
    overflow: 'hidden',
    ...SHADOWS.small
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.background,
  },
  currentUserRow: {
    backgroundColor: theme.isDarkMode ? 'rgba(124, 58, 237, 0.15)' : 'rgba(124, 58, 237, 0.08)',
  },
  rankNumber: {
    width: 45,
    fontSize: FONTS.body,
    fontWeight: '700',
    color: theme.textLight,
    textAlign: 'center',
  },
  topRankNumber: {
    fontSize: 24,
  },
  userInfo: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  userNameText: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 2,
  },
  userNameGlow1: {
    fontSize: FONTS.body,
    fontWeight: '700',
    color: '#FBBF24',
    textShadowColor: 'rgba(251, 191, 36, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
    marginBottom: 2,
  },
  userNameGlow2: {
    fontSize: FONTS.body,
    fontWeight: '700',
    color: '#60A5FA',
    textShadowColor: 'rgba(96, 165, 250, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
    marginBottom: 2,
  },
  userNameGlow3: {
    fontSize: FONTS.body,
    fontWeight: '700',
    color: '#34D399',
    textShadowColor: 'rgba(52, 211, 153, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
    marginBottom: 2,
  },
  currentUserText: {
    color: theme.primary,
    fontWeight: '700',
  },
  userLevelText: {
    fontSize: FONTS.small,
    color: theme.textLight,
  },
  userScoreText: {
    fontSize: FONTS.body,
    fontWeight: '700',
    color: theme.text,
  },
  noDataText: {
    padding: SPACING.xl,
    textAlign: 'center',
    color: theme.textLight,
  }
});
