import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../lib/ThemeContext';
import { apiService } from '../services/api';
import { strings } from '../constants/strings';

export default function AuthScreen({ navigation }: any) {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onLogin() {
    if (!email || !password) {
      Alert.alert(strings.error, strings.pleaseEnterEmailPassword);
      return;
    }

    try {
      setLoading(true);
      await apiService.login(email, password);
      navigation.replace('Main');
    } catch (error: any) {
      Alert.alert(strings.loginFailed, error.message);
    } finally {
      setLoading(false);
    }
  }

  async function onRegister() {
    if (!name || !email || !password) {
      Alert.alert(strings.error, strings.pleaseFillAllFields);
      return;
    }

    try {
      setLoading(true);
      await apiService.register(name, email, password);
      navigation.replace('Main');
    } catch (error: any) {
      Alert.alert(strings.registrationFailed, error.message);
    } finally {
      setLoading(false);
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      justifyContent: 'center',
      backgroundColor: theme.colors.background,
    },

    form: {
      backgroundColor: theme.colors.surface,
      padding: 20,
      borderRadius: theme.radii.md,
      elevation: 4,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.outline,
      padding: 12,
      borderRadius: theme.radii.md,
      marginBottom: 12,
      backgroundColor: theme.colors.surface,
      color: theme.colors.textPrimary,
      fontSize: 16,
    },
    passwordContainer: {
      position: 'relative',
      marginBottom: 12,
    },
    passwordInput: {
      borderWidth: 1,
      borderColor: theme.colors.outline,
      padding: 12,
      paddingRight: 45,
      borderRadius: theme.radii.md,
      backgroundColor: theme.colors.surface,
      color: theme.colors.textPrimary,
      fontSize: 16,
    },
    eyeIcon: {
      position: 'absolute',
      right: 12,
      top: 12,
      padding: 4,
    },
    primaryBtn: {
      backgroundColor: theme.colors.primary,
      padding: 14,
      borderRadius: theme.radii.md,
      alignItems: 'center',
    },
    primaryBtnText: {
      color: '#FFFFFF',
      ...theme.typography.button,
    },
    or: {
      textAlign: 'center',
      color: theme.colors.textSecondary,
      marginVertical: 12,
      ...theme.typography.caption,
    },
    socialRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    socialBtn: {
      flex: 1,
      padding: 12,
      borderRadius: theme.radii.md,
      alignItems: 'center',
      backgroundColor: theme.colors.secondary,
      marginHorizontal: 2,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    },
    socialBtnText: {
      color: '#FFFFFF',
      ...theme.typography.button,
    },
    link: {
      marginTop: 14,
      alignItems: 'center',
    },
    linkText: {
      color: theme.colors.accent,
      ...theme.typography.caption,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        {isRegister && (
          <TextInput
            placeholder={strings.name}
            placeholderTextColor={theme.colors.textSecondary}
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
        )}
        <TextInput
          placeholder={strings.email}
          placeholderTextColor={theme.colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder={strings.password}
            placeholderTextColor={theme.colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity 
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon 
              name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
              size={20} 
              color={theme.colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={isRegister ? onRegister : onLogin}
          disabled={loading}
          accessibilityLabel={isRegister ? 'Register' : 'Sign in'}
        >
          <Text style={styles.primaryBtnText}>
            {loading ? strings.loading : (isRegister ? strings.register : strings.signIn)}
          </Text>
        </TouchableOpacity>

        <Text style={styles.or}>{strings.orContinueWith}</Text>
        <View style={styles.socialRow}>
          <TouchableOpacity 
            style={styles.socialBtn}
            onPress={() => Alert.alert(strings.facebookLogin, strings.featureAvailableSoon)}
          >
            <Icon name="logo-facebook" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.socialBtn}
            onPress={() => Alert.alert(strings.googleLogin, strings.featureAvailableSoon)}
          >
            <Icon name="logo-google" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          {Platform.OS === 'ios' && (
            <TouchableOpacity 
              style={styles.socialBtn}
              onPress={() => Alert.alert(strings.appleLogin, strings.featureAvailableSoon)}
            >
              <Icon name="logo-apple" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.link}
          onPress={() => setIsRegister(!isRegister)}
        >
          <Text style={styles.linkText}>
            {isRegister ? strings.alreadyHaveAccount : strings.signUp}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


