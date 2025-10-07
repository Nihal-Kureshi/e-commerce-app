import React, { useState, useEffect } from 'react';
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
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/api';
import { strings } from '../constants/strings';
import { validateEmail, validatePassword, validateName } from '../utils/validation';
import { useDebounce } from '../hooks/useDebounce';
import { rScale, rIcon, rFont, isTablet, isLargeDevice } from '../utils/responsive';
import { NavigationProp } from '../types';
import { errorHandler, ValidationError, AuthError, NetworkError } from '../utils/errorHandler';
import KeyboardAwareScrollView from '../components/KeyboardAwareScrollView';

interface Props {
  navigation: NavigationProp;
}

export default function AuthScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const debouncedEmail = useDebounce(email, 500);
  const debouncedPassword = useDebounce(password, 500);
  const debouncedName = useDebounce(name, 500);

  const validateField = (field: string, value: string) => {
    let error = null;
    switch (field) {
      case 'email':
        error = validateEmail(value);
        break;
      case 'password':
        error = validatePassword(value);
        break;
      case 'name':
        error = validateName(value);
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [field]: error || ''
    }));
    
    return !error;
  };

  useEffect(() => {
    if (debouncedEmail) validateField('email', debouncedEmail);
  }, [debouncedEmail]);

  useEffect(() => {
    if (debouncedPassword) validateField('password', debouncedPassword);
  }, [debouncedPassword]);

  useEffect(() => {
    if (debouncedName && isRegister) validateField('name', debouncedName);
  }, [debouncedName, isRegister]);

  const validateForm = () => {
    const emailValid = validateField('email', email);
    const passwordValid = validateField('password', password);
    const nameValid = isRegister ? validateField('name', name) : true;
    
    return emailValid && passwordValid && nameValid;
  };

  async function onLogin() {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await apiService.login(email, password);
      navigation.replace('Main');
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = error.message || 'Login failed. Please try again.';
      
      if (errorMessage.includes('Invalid credentials')) {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (errorMessage.includes('Network') || errorMessage.includes('connection')) {
        errorMessage = 'Please check your internet connection and try again.';
      }
      
      Alert.alert(strings.loginFailed, errorMessage);
    } finally {
      setLoading(false);
    }
  }

  async function onRegister() {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      await apiService.register(name, email, password);
      navigation.replace('Main');
    } catch (error: any) {
      console.error('Register error:', error);
      
      let errorMessage = error.message || 'Registration failed. Please try again.';
      
      if (errorMessage.includes('User already exists')) {
        errorMessage = 'An account with this email already exists. Please sign in instead.';
      } else if (errorMessage.includes('Network') || errorMessage.includes('connection')) {
        errorMessage = 'Please check your internet connection and try again.';
      }
      
      Alert.alert(strings.registrationFailed, errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: rScale(24),
    },
    form: {
      backgroundColor: theme.colors.surface,
      padding: rScale(24),
      borderRadius: theme.radii.md,
      elevation: 4,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      maxWidth: isTablet() || isLargeDevice() ? 500 : '100%',
      alignSelf: 'center',
      width: '100%',
    },
    input: {
      borderWidth: 1,
      borderColor: theme.colors.outline,
      padding: rScale(12),
      borderRadius: theme.radii.md,
      marginBottom: rScale(4),
      backgroundColor: theme.colors.surface,
      color: theme.colors.textPrimary,
      fontSize: rFont(16),
    },
    inputError: {
      borderColor: theme.colors.error,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 12,
      marginBottom: 8,
      marginLeft: 4,
    },
    passwordContainer: {
      position: 'relative',
      marginBottom: 12,
    },
    passwordInput: {
      borderWidth: 1,
      borderColor: theme.colors.outline,
      padding: rScale(12),
      paddingRight: rScale(45),
      borderRadius: theme.radii.md,
      backgroundColor: theme.colors.surface,
      color: theme.colors.textPrimary,
      fontSize: rFont(16),
    },
    passwordInputError: {
      borderColor: theme.colors.error,
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
      marginTop: 8,
    },
    primaryBtnText: {
      color: '#FFFFFF',
      ...theme.typography.button,
    },
    or: {
      textAlign: 'center',
      color: theme.colors.textSecondary,
      marginVertical: 12,
      fontSize: 14,
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
      fontSize: 14,
    },
  });

  return (
    <KeyboardAwareScrollView 
      containerStyle={styles.container}
      contentContainerStyle={styles.scrollContainer}
    >
        <View style={styles.form}>
        {isRegister && (
          <>
            <TextInput
              placeholder={strings.name}
              placeholderTextColor={theme.colors.textSecondary}
              value={name}
              onChangeText={setName}
              onBlur={() => validateField('name', name)}
              style={[styles.input, errors.name && styles.inputError]}
            />
            {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
          </>
        )}
        <TextInput
          placeholder={strings.email}
          placeholderTextColor={theme.colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          onBlur={() => validateField('email', email)}
          style={[styles.input, errors.email && styles.inputError]}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder={strings.password}
            placeholderTextColor={theme.colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            onBlur={() => validateField('password', password)}
            style={[styles.passwordInput, errors.password && styles.passwordInputError]}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity 
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon 
              name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
              size={rIcon(20)} 
              color={theme.colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

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
            <Icon name="logo-facebook" size={rIcon(24)} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.socialBtn}
            onPress={() => Alert.alert(strings.googleLogin, strings.featureAvailableSoon)}
          >
            <Icon name="logo-google" size={rIcon(24)} color="#FFFFFF" />
          </TouchableOpacity>
          {Platform.OS === 'ios' && (
            <TouchableOpacity 
              style={styles.socialBtn}
              onPress={() => Alert.alert(strings.appleLogin, strings.featureAvailableSoon)}
            >
              <Icon name="logo-apple" size={rIcon(24)} color="#FFFFFF" />
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
    </KeyboardAwareScrollView>
  );
}


