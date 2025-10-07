import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ActivityIndicator, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { strings } from '../constants/strings';
import { apiService } from '../services/api';
import { rScale, rIcon, rFont } from '../utils/responsive';

export default function SettingsScreen({ navigation }: any) {
  const { theme, isDark, toggleTheme } = useTheme();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setError(null);
      const data = await apiService.getUserProfile();
      setUserData(data);
    } catch (error: any) {
      console.error('Failed to load user data:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await apiService.logout();
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            });
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      padding: rScale(20),
    },
    profileSection: {
      backgroundColor: theme.colors.surface,
      borderRadius: rScale(12),
      marginBottom: rScale(16),
      padding: rScale(16),
      elevation: 2,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    profileContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: rScale(60),
      height: rScale(60),
      borderRadius: rScale(30),
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: rScale(15),
    },
    profileInfo: {
      flex: 1,
    },
    name: {
      fontSize: rFont(18),
      fontWeight: 'bold',
      color: theme.colors.textPrimary,
    },
    email: {
      fontSize: rFont(14),
      color: theme.colors.textSecondary,
      marginTop: rScale(2),
    },
    sectionCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: rScale(12),
      marginBottom: rScale(16),
      paddingVertical: rScale(8),
      elevation: 2,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: rScale(15),
      paddingHorizontal: rScale(16),
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
    },
    lastItem: {
      borderBottomWidth: 0,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    settingText: {
      fontSize: rFont(16),
      color: theme.colors.textPrimary,
      marginLeft: rScale(12),
    },
    sectionTitle: {
      fontSize: rFont(16),
      fontWeight: '600',
      color: theme.colors.textSecondary,
      paddingHorizontal: rScale(16),
      paddingTop: rScale(8),
      paddingBottom: rScale(4),
    },
    comingSoon: {
      backgroundColor: theme.colors.primary + '20',
      paddingHorizontal: rScale(8),
      paddingVertical: rScale(4),
      borderRadius: rScale(12),
    },
    comingSoonText: {
      fontSize: rFont(12),
      color: theme.colors.primary,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <View style={styles.profileContent}>
          <View style={styles.avatar}>
            <Icon name="person" size={rIcon(30)} color="white" />
          </View>
          <View style={styles.profileInfo}>
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : error ? (
              <TouchableOpacity onPress={loadUserData}>
                <Text style={[styles.name, { color: theme.colors.error }]}>Failed to load profile</Text>
                <Text style={styles.email}>Tap to retry</Text>
              </TouchableOpacity>
            ) : (
              <>
                <Text style={styles.name}>{userData?.name || 'User'}</Text>
                <Text style={styles.email}>{userData?.email || 'user@example.com'}</Text>
              </>
            )}
          </View>
        </View>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Quick Actions Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity 
            style={styles.settingItem}
            onPress={() => navigation.navigate('Orders')}
          >
            <View style={styles.settingLeft}>
              <Icon name="receipt-outline" size={rIcon(20)} color={theme.colors.textPrimary} />
              <Text style={styles.settingText}>{strings.orders}</Text>
            </View>
            <Icon name="chevron-forward-outline" size={rIcon(20)} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          
          <View style={[styles.settingItem, styles.lastItem]}>
            <View style={styles.settingLeft}>
              <Icon name="moon-outline" size={rIcon(20)} color={theme.colors.textPrimary} />
              <Text style={styles.settingText}>{strings.darkMode}</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.colors.outline, true: theme.colors.primary }}
              thumbColor={isDark ? 'white' : theme.colors.surface}
            />
          </View>
        </View>

        {/* Account Settings Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Profile Settings', 'Coming Soon!')}>
            <View style={styles.settingLeft}>
              <Icon name="person-outline" size={rIcon(20)} color={theme.colors.textPrimary} />
              <Text style={styles.settingText}>Edit Profile</Text>
            </View>
            <View style={styles.comingSoon}>
              <Text style={styles.comingSoonText}>Soon</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Address Book', 'Coming Soon!')}>
            <View style={styles.settingLeft}>
              <Icon name="location-outline" size={rIcon(20)} color={theme.colors.textPrimary} />
              <Text style={styles.settingText}>Address Book</Text>
            </View>
            <View style={styles.comingSoon}>
              <Text style={styles.comingSoonText}>Soon</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, styles.lastItem]} onPress={() => Alert.alert('Payment Methods', 'Coming Soon!')}>
            <View style={styles.settingLeft}>
              <Icon name="card-outline" size={rIcon(20)} color={theme.colors.textPrimary} />
              <Text style={styles.settingText}>Payment Methods</Text>
            </View>
            <View style={styles.comingSoon}>
              <Text style={styles.comingSoonText}>Soon</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Preferences Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Notifications', 'Coming Soon!')}>
            <View style={styles.settingLeft}>
              <Icon name="notifications-outline" size={rIcon(20)} color={theme.colors.textPrimary} />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <View style={styles.comingSoon}>
              <Text style={styles.comingSoonText}>Soon</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Language', 'Coming Soon!')}>
            <View style={styles.settingLeft}>
              <Icon name="language-outline" size={rIcon(20)} color={theme.colors.textPrimary} />
              <Text style={styles.settingText}>Language</Text>
            </View>
            <View style={styles.comingSoon}>
              <Text style={styles.comingSoonText}>Soon</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, styles.lastItem]} onPress={() => Alert.alert('Currency', 'Coming Soon!')}>
            <View style={styles.settingLeft}>
              <Icon name="cash-outline" size={rIcon(20)} color={theme.colors.textPrimary} />
              <Text style={styles.settingText}>Currency</Text>
            </View>
            <View style={styles.comingSoon}>
              <Text style={styles.comingSoonText}>Soon</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Support Card */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Support</Text>

          <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Help Center', 'Coming Soon!')}>
            <View style={styles.settingLeft}>
              <Icon name="help-circle-outline" size={rIcon(20)} color={theme.colors.textPrimary} />
              <Text style={styles.settingText}>Help Center</Text>
            </View>
            <View style={styles.comingSoon}>
              <Text style={styles.comingSoonText}>Soon</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Contact Us', 'Coming Soon!')}>
            <View style={styles.settingLeft}>
              <Icon name="mail-outline" size={rIcon(20)} color={theme.colors.textPrimary} />
              <Text style={styles.settingText}>Contact Us</Text>
            </View>
            <View style={styles.comingSoon}>
              <Text style={styles.comingSoonText}>Soon</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, styles.lastItem]} onPress={() => Alert.alert('Privacy Policy', 'Coming Soon!')}>
            <View style={styles.settingLeft}>
              <Icon name="shield-outline" size={rIcon(20)} color={theme.colors.textPrimary} />
              <Text style={styles.settingText}>Privacy Policy</Text>
            </View>
            <View style={styles.comingSoon}>
              <Text style={styles.comingSoonText}>Soon</Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Logout Card */}
        <View style={styles.sectionCard}>
          <TouchableOpacity 
            style={[styles.settingItem, styles.lastItem]}
            onPress={handleLogout}
          >
            <View style={styles.settingLeft}>
              <Icon name="log-out-outline" size={rIcon(20)} color={theme.colors.error} />
              <Text style={[styles.settingText, { color: theme.colors.error }]}>Logout</Text>
            </View>
            <Icon name="chevron-forward-outline" size={rIcon(20)} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}