// ============================================
// screens/SettingsScreen.tsx — Ayarlar Ekranı
// ============================================
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Switch,
  ScrollView, Alert, StatusBar, Image
} from 'react-native';
import { COLORS, FONTS, RADIUS, SHADOWS, SPACING } from '../constants/theme';
import { isSoundEffectsEnabled, setSoundEffectsEnabled } from '../utils/audio';

interface Props {
  navigation: any;
  route: any;
}

export default function SettingsScreen({ navigation, route }: Props) {
  const { userId } = route.params || { userId: 'Oyuncu' };
  
  // Ayar state'leri
  const [soundEnabled, setSoundEnabled] = useState(isSoundEffectsEnabled);

  const handleSoundToggle = (val: boolean) => {
    setSoundEnabled(val);
    setSoundEffectsEnabled(val);
  };

  // Çıkış yapma işlemi
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
      <StatusBar barStyle="dark-content" />

      {/* Üst Başlık (Header) */}
      <View style={styles.header}>
        <View style={styles.placeholder} />
        <Text style={styles.headerTitle}>⚙️ Ayarlar</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Profil Kartı (Duolingo Tarzı) */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{userId.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userId}</Text>
            <Text style={styles.profileStatus}>Harika gidiyorsun! 🐼</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>SES VE MÜZİK</Text>

        {/* Ayar Listesi */}
        <View style={styles.settingsGroup}>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.settingIcon}>🔊</Text>
              <Text style={styles.settingLabel}>Ses Efektleri</Text>
            </View>
            <Switch 
              value={soundEnabled} 
              onValueChange={handleSoundToggle} 
              trackColor={{ false: COLORS.disabled, true: COLORS.success }}
              thumbColor={COLORS.card}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.card,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
    ...SHADOWS.small,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },
  backButtonText: {
    fontSize: 22,
    color: COLORS.primary,
    fontWeight: FONTS.bold,
  },
  headerTitle: {
    fontSize: FONTS.heading,
    fontWeight: FONTS.bold,
    color: COLORS.primary,
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
    backgroundColor: COLORS.card,
    padding: SPACING.lg,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.xl,
    borderWidth: 2,
    borderColor: COLORS.answerSlotBorder,
    ...SHADOWS.small,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontSize: FONTS.title,
    fontWeight: FONTS.bold,
    color: COLORS.card,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: FONTS.subtitle,
    fontWeight: FONTS.bold,
    color: COLORS.text,
    marginBottom: 4,
  },
  profileStatus: {
    fontSize: FONTS.caption,
    color: COLORS.primary,
    fontWeight: FONTS.medium,
  },
  sectionTitle: {
    fontSize: FONTS.caption,
    fontWeight: FONTS.bold,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
    marginLeft: SPACING.sm,
    letterSpacing: 1,
  },
  settingsGroup: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.xl,
    borderWidth: 2,
    borderColor: COLORS.answerSlotBorder,
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
    color: COLORS.text,
    fontWeight: FONTS.medium,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.background,
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
    color: COLORS.error,
    fontWeight: FONTS.bold,
  },
  chevron: {
    fontSize: 24,
    color: COLORS.disabled,
  },
});
