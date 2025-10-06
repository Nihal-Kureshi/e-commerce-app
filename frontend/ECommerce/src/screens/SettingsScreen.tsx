import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { strings } from '../constants/strings';
import { apiService } from '../services/api';
import { Alert } from 'react-native';

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
      padding: 20,
    },
    profileSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 30,
      paddingVertical: 20,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 15,
    },
    profileInfo: {
      flex: 1,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.textPrimary,
    },
    email: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    settingText: {
      fontSize: 16,
      color: theme.colors.textPrimary,
      marginLeft: 12,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Icon name="person" size={30} color="white" />
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
      
      <TouchableOpacity 
        style={styles.settingItem}
        onPress={() => navigation.navigate('Orders')}
      >
        <View style={styles.settingLeft}>
          <Icon name="receipt-outline" size={20} color={theme.colors.textPrimary} />
          <Text style={styles.settingText}>{strings.orders}</Text>
        </View>
        <Icon name="chevron-forward-outline" size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>
      
      <View style={styles.settingItem}>
        <View style={styles.settingLeft}>
          <Icon name="moon-outline" size={20} color={theme.colors.textPrimary} />
          <Text style={styles.settingText}>{strings.darkMode}</Text>
        </View>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: theme.colors.outline, true: theme.colors.primary }}
          thumbColor={isDark ? 'white' : theme.colors.surface}
        />
      </View>
      
      <TouchableOpacity 
        style={styles.settingItem}
        onPress={handleLogout}
      >
        <View style={styles.settingLeft}>
          <Icon name="log-out-outline" size={20} color={theme.colors.error} />
          <Text style={[styles.settingText, { color: theme.colors.error }]}>Logout</Text>
        </View>
        <Icon name="chevron-forward-outline" size={20} color={theme.colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}