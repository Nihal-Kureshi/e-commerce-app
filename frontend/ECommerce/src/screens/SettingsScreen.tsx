import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../lib/ThemeContext';
import { strings } from '../constants/strings';

export default function SettingsScreen({ navigation }: any) {
  const { theme, isDark, toggleTheme } = useTheme();

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
          <Text style={styles.name}>{strings.johnDoe}</Text>
          <Text style={styles.email}>{strings.johnDoeEmail}</Text>
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
    </View>
  );
}