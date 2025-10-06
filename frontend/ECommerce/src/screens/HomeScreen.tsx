import React, { createContext, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../lib/ThemeContext';
import ProductListScreen from './ProductListScreen';
import CartScreen from './CartScreen';
import OrdersScreen from './OrdersScreen';
import AuthScreen from './AuthScreen';
import SettingsScreen from './SettingsScreen';
import SearchScreen from './SearchScreen';
import ProductDetailScreen from './ProductDetailScreen';
import { useMockData } from '../hooks/useMockData';

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
          height: 64,
          paddingBottom: 8,
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
        },
        tabBarIcon: ({ color, size }) => {
          let name: any = 'home';
          if (route.name === 'Products') name = 'grid-outline';
          if (route.name === 'Settings') name = 'settings-outline';
          return <Icon name={name} size={size} color={color} />;
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });

  return (
    <AppDataContext.Provider value={data}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <Stack.Navigator 
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
        </Stack.Navigator>
      </SafeAreaView>
    </AppDataContext.Provider>
  );
}


