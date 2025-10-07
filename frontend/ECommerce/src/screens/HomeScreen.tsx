import React, { createContext, useContext, useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Dimensions } from 'react-native';
import { apiService } from '../services/api';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import ProductListScreen from './ProductListScreen';
import CartScreen from './CartScreen';
import OrdersScreen from './OrdersScreen';
import AuthScreen from './AuthScreen';
import SettingsScreen from './SettingsScreen';
import SearchScreen from './SearchScreen';
import ProductDetailScreen from './ProductDetailScreen';
import OrderDetailScreen from './OrderDetailScreen';
import { useMockData } from '../hooks/useMockData';
import { isTablet, isLargeDevice } from '../utils/responsive';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Simple context to provide mock data hooks across screens
const AppDataContext = createContext<any>(null);
export const useAppData = () => useContext(AppDataContext);

function MainTabs() {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          height: isTablet() || isLargeDevice() ? 70 : 60,
          paddingBottom: isTablet() || isLargeDevice() ? 10 : 8,
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
        },
        tabBarLabelStyle: {
          fontSize: isLargeDevice() ? 16 : isTablet() ? 14 : 12,
        },
        tabBarIcon: ({ color }) => {
          let name: any = 'home';
          if (route.name === 'Products') name = 'grid-outline';
          if (route.name === 'Settings') name = 'settings-outline';
          const iconSize = isTablet() || isLargeDevice() ? 28 : 24;
          return <Icon name={name} size={iconSize} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Products" component={ProductListScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function HomeScreen() {
  const { theme } = useTheme();
  const data = useMockData();
  const [initialRoute, setInitialRoute] = useState('Auth');
  const [isReady, setIsReady] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await apiService.getStoredToken();
      if (token) {
        // Verify token is valid by making a profile request
        await apiService.getUserProfile();
        setInitialRoute('Main');
      }
    } catch (error) {
      console.log('Invalid or no token, redirecting to auth');
      await apiService.logout(); // Clear invalid token
    } finally {
      setIsReady(true);
    }
  };

  if (!isReady) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <AppDataContext.Provider value={data}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <Stack.Navigator 
          initialRouteName={initialRoute}
          screenOptions={{ 
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            fullScreenGestureEnabled: true,
            gestureResponseDistance: 50
          }}
        >
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Orders" component={OrdersScreen} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
        </Stack.Navigator>
      </SafeAreaView>
    </AppDataContext.Provider>
  );
}


