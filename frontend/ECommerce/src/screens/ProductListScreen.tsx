import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppData } from './HomeScreen';
import { useTheme } from '../context/ThemeContext';
import ProductGrid from '../components/ProductGrid';
import { getGridPadding, iconScale, isTablet, isLargeDevice } from '../utils/responsive';
import { useGrid } from '../context/ThemeContext';

export default function ProductListScreen({ navigation }: any) {
  const { theme, toggleTheme, isDark } = useTheme();
  const { products, addToCart, loading, cart, error, loadProducts } = useAppData();
  const { cardType, toggleCardType } = useGrid();
  const categories = Array.from(new Set(products.map((p: any) => p.category)));
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  const handleCategoryPress = (category: string | null, index: number) => {
    setActiveCategory(category);
    
    const totalItems = categories.length + 1; // +1 for "All" tab
    const itemWidth = 100; // Approximate tab width
    
    // Auto-scroll logic for both directions
    if (index <= 1) {
      // First two items - scroll to beginning
      scrollViewRef.current?.scrollTo({ x: 0, animated: true });
    } else if (index >= totalItems - 2) {
      // Last two items - scroll to end
      scrollViewRef.current?.scrollToEnd({ animated: true });
    } else {
      // Middle items - scroll to show current item centered with context
      const scrollPosition = Math.max(0, (index - 2) * itemWidth);
      scrollViewRef.current?.scrollTo({ x: scrollPosition, animated: true });
    }
  };

  const filtered = products.filter((p: any) => {
    const matchesCat = activeCategory ? p.category === activeCategory : true;
    return matchesCat;
  });

  const styles = StyleSheet.create({
    statusBarBg: {
      backgroundColor: '#FFFFFF',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 100,
      zIndex: -1,
    },
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: theme.spacing.lg,
      paddingBottom: theme.spacing.xs,
      backgroundColor: theme.colors.primary,
      position: 'relative',
      overflow: 'hidden',
    },
    headerGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.accent,
      opacity: 0.3,
    },
    headerContent: {
      position: 'relative',
      zIndex: 1,
    },
    brandRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
    },
    brandContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    headerButton: {
      padding: 8,
      borderRadius: theme.radii.md,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.3)',
    },
    brandIcon: {
      width: 40,
      height: 40,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: theme.radii.md,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: theme.spacing.sm,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.3)',
    },
    brandText: {
      color: '#FFFFFF',
      ...theme.typography.heading1,
      fontWeight: '700',
    },
    brandSubtext: {
      color: 'rgba(255,255,255,0.9)',
      ...theme.typography.caption,
    },
    tabsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      paddingVertical: 12,
      paddingLeft: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
    },
    tabsScroll: {
      flex: 1,
    },
    tab: {
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginRight: 12,
      borderRadius: 8,
    },
    tabActive: {
      backgroundColor: theme.colors.primary + '20',
    },
    tabText: {
      fontSize: isLargeDevice() ? 16 : isTablet() ? 14 : 12,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    tabTextActive: {
      color: theme.colors.primary,
      fontWeight: '600',
    },
    gridToggle: {
      padding: 8,
      borderRadius: theme.radii.md,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      marginRight: 16,
    },
    cartBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: theme.colors.error,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cartBadgeText: {
      color: 'white',
      fontSize: 12,
      fontWeight: 'bold',
    },
  });

  return (
    <>
      <View style={styles.statusBarBg} />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerGradient} />
          <View style={styles.headerContent}>
            <View style={styles.brandRow}>
              <View style={styles.brandContainer}>
                <View style={styles.brandIcon}>
                  <Icon name="cube-outline" size={iconScale(24)} color="#FFFFFF" />
                </View>
                <View>
                  <Text style={styles.brandText}>ShopEasy</Text>
                  <Text style={styles.brandSubtext}>Online Store</Text>
                </View>
              </View>
              <View style={styles.headerButtons}>
                <TouchableOpacity 
                  style={styles.headerButton} 
                  onPress={() => navigation.navigate('Search')}
                  testID="search-button"
                >
                  <Icon name="search-outline" size={iconScale(20)} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.headerButton} 
                  onPress={() => navigation.navigate('Cart')}
                  testID="cart-button"
                >
                  <Icon name="bag-outline" size={iconScale(20)} color="#FFFFFF" />
                  {cart.length > 0 && (
                    <View style={styles.cartBadge}>
                      <Text style={styles.cartBadgeText}>{cart.length}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <ScrollView 
            ref={scrollViewRef}
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.tabsScroll}
          >
            <TouchableOpacity
              onPress={() => handleCategoryPress(null, 0)}
              style={[styles.tab, !activeCategory && styles.tabActive]}
            >
              <Icon name="apps-outline" size={isLargeDevice() ? 26 : isTablet() ? 24 : 20} color={!activeCategory ? theme.colors.primary : theme.colors.textSecondary} />
              <Text style={[styles.tabText, !activeCategory && styles.tabTextActive]}>All</Text>
            </TouchableOpacity>
            {categories.map((c, index) => {
              const getIcon = (category: string) => {
                if (category.toLowerCase().includes('fashion')) return 'shirt-outline';
                if (category.toLowerCase().includes('electronics')) return 'phone-portrait-outline';
                if (category.toLowerCase().includes('home')) return 'home-outline';
                if (category.toLowerCase().includes('sports')) return 'fitness-outline';
                if (category.toLowerCase().includes('books')) return 'book-outline';
                return 'cube-outline';
              };
              
              return (
                <TouchableOpacity
                  key={c}
                  onPress={() => handleCategoryPress(c, index + 1)}
                  style={[styles.tab, activeCategory === c && styles.tabActive]}
                >
                  <Icon name={getIcon(c)} size={isLargeDevice() ? 26 : isTablet() ? 24 : 20} color={activeCategory === c ? theme.colors.primary : theme.colors.textSecondary} />
                  <Text style={[styles.tabText, activeCategory === c && styles.tabTextActive]}>{c}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <TouchableOpacity 
            style={styles.gridToggle}
            onPress={toggleCardType}
          >
            <Icon 
              name={cardType === 'small' ? 'apps-outline' : 'grid-outline'} 
              size={isLargeDevice() ? 26 : isTablet() ? 24 : 20} 
              color={theme.colors.textPrimary} 
            />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{ marginTop: 16, color: theme.colors.textSecondary }}>Loading products...</Text>
          </View>
        ) : error ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <Icon name="alert-circle-outline" size={iconScale(64)} color={theme.colors.error} />
            <Text style={{ marginTop: 16, color: theme.colors.error, textAlign: 'center' }}>{error}</Text>
            <TouchableOpacity 
              onPress={loadProducts}
              style={{ marginTop: 16, padding: 12, backgroundColor: theme.colors.primary, borderRadius: 8 }}
            >
              <Text style={{ color: 'white' }}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ paddingTop: getGridPadding() }}>
            <ProductGrid
              products={filtered}
              onAddToCart={addToCart}
              navigation={navigation}
              emptyMessage="No products available"
            />
          </View>
        )}
      </View>
    </>
  );
}