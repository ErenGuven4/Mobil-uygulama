// Ses ayarlarını, karanlık modu ve çıkış yapma seçeneklerini yönettiğim ekran.
// Ayarlar Switch bileşeni ile değiştirilir; değişiklikler anlık olarak uygulanır.
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Switch,
  ScrollView, Alert, StatusBar
} from 'react-native';
import { FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { isSoundEffectsEnabled, setSoundEffectsEnabled } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface Props {
  navigation: any;
  route: any;
}

export default function SettingsScreen({ navigation, route }: Props) {
  const { userId } = route.params || { userId: 'Oyuncu' };
  const { isDarkMode, theme, toggleDarkMode } = useTheme();
  const styles = getStyles(theme);
  
  // Ses efektinin açık olup olmadığını tuttuğum state.
  // isSoundEffectsEnabled: audio.ts'deki modül düzeyindeki değişkenden başlangıç değerini alıyoruz.
  const [soundEnabled, setSoundEnabled] = useState(isSoundEffectsEnabled);

  // Switch değişince hem lokal state'i güncelliyoruz hem de audio modülündeki global değişkeni.
  const handleSoundToggle = (val: boolean) => {
    setSoundEnabled(val);
    setSoundEffectsEnabled(val);
  };

  // Başka bir isimle girmek için çıkış yapma fonksiyonunu yazdım.
  function handleLogout() {
    Alert.alert(
      'Çıkış Yap',
      'Farklı bir isimle girmek ister misin?',
      [
        { text: 'İptal', style: 'cancel' },
        { 
          text: 'Evet', 
          style: 'destructive',
          onPress: () => navigation.replace('Splash')
        }
      ]
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />

      {/* Ayarlar başlığını buraya ekledim */}
      <View style={styles.header}>
        <View style={styles.placeholder} />
        <Text style={styles.headerTitle}>⚙️ Ayarlar</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Kullanıcının adının ilk harfini avatar olarak gösterdiğim profil alanı */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{userId.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userId}</Text>
            <Text style={styles.profileStatus}>Harika gidiyorsun! 🐼</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>SES VE GÖRÜNÜM</Text>

        {/* Ses ve karanlık mod anahtarlarını listelediğim yer */}
        <View style={styles.settingsGroup}>
          
          {/* Ses efektini açıp kapatan Switch */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🔊</Text>
              <Text style={styles.settingLabel}>Ses Efektleri</Text>
            </View>
            <Switch 
              value={soundEnabled} 
              onValueChange={handleSoundToggle} 
              trackColor={{ false: theme.disabled, true: theme.success }}
              thumbColor={theme.card}
            />
          </View>

          <View style={styles.divider} />

          {/* Karanlık modu açıp kapatan Switch */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🌙</Text>
              <Text style={styles.settingLabel}>Karanlık Mod</Text>
            </View>
            <Switch 
              value={isDarkMode} 
              onValueChange={toggleDarkMode} 
              trackColor={{ false: theme.disabled, true: theme.success }}
              thumbColor={theme.card}
            />
          </View>

        </View>

        <Text style={styles.sectionTitle}>HESAP</Text>

        <View style={styles.settingsGroup}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
            <Text style={styles.actionIcon}>🚪</Text>
            <Text style={styles.actionText}>Başka Bir İsimle Gir</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: theme.card,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
    ...SHADOWS.small,
  },
  headerTitle: {
    fontSize: FONTS.heading,
    fontWeight: FONTS.bold,
    color: theme.primary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.card,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.xl,
    borderWidth: 2,
    borderColor: theme.answerSlotBorder,
    ...SHADOWS.small,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: FONTS.title,
    fontWeight: FONTS.bold,
    color: theme.textWhite,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: FONTS.subtitle,
    fontWeight: FONTS.bold,
    color: theme.text,
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: FONTS.caption,
    color: theme.primary,
    fontWeight: FONTS.medium,
  },
  sectionTitle: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.bold,
    color: theme.textLight,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.sm,
    letterSpacing: 1,
  },
  settingsGroup: {
    backgroundColor: theme.card,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.xl,
    borderWidth: 2,
    borderColor: theme.answerSlotBorder,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  settingLabel: {
    fontSize: FONTS.body,
    color: theme.text,
    fontWeight: FONTS.medium,
  },
  divider: {
    height: 1,
    backgroundColor: theme.background,
    marginHorizontal: SPACING.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  actionText: {
    flex: 1,
    fontSize: FONTS.body,
    color: theme.error,
    fontWeight: FONTS.bold,
  },
  chevron: {
    fontSize: 24,
    color: theme.disabled,
  },
});
