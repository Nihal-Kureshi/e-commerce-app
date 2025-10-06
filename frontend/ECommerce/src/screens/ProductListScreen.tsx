import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppData } from './HomeScreen';
import { useTheme } from '../context/ThemeContext';
import ProductCard from '../components/ProductCard';

export default function ProductListScreen({ navigation }: any) {
  const { theme, toggleTheme, isDark } = useTheme();
  const { products, addToCart, loading, cart } = useAppData();
  const [grid, setGrid] = useState(true);
  const categories = Array.from(new Set(products.map((p: any) => p.category)));
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

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
      fontSize: 12,
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
                  <Icon name="cube-outline" size={24} color="#FFFFFF" />
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
                >
                  <Icon name="search-outline" size={20} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.headerButton} 
                  onPress={() => navigation.navigate('Cart')}
                >
                  <Icon name="bag-outline" size={20} color="#FFFFFF" />
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
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsScroll}>
            <TouchableOpacity
              onPress={() => setActiveCategory(null)}
              style={[styles.tab, !activeCategory && styles.tabActive]}
            >
              <Icon name="apps-outline" size={20} color={!activeCategory ? theme.colors.primary : theme.colors.textSecondary} />
              <Text style={[styles.tabText, !activeCategory && styles.tabTextActive]}>All</Text>
            </TouchableOpacity>
            {categories.map(c => {
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
                  onPress={() => setActiveCategory(c)}
                  style={[styles.tab, activeCategory === c && styles.tabActive]}
                >
                  <Icon name={getIcon(c)} size={20} color={activeCategory === c ? theme.colors.primary : theme.colors.textSecondary} />
                  <Text style={[styles.tabText, activeCategory === c && styles.tabTextActive]}>{c}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <TouchableOpacity 
            style={styles.gridToggle}
            onPress={() => setGrid(!grid)}
          >
            <Icon 
              name={grid ? 'list-outline' : 'grid-outline'} 
              size={20} 
              color={theme.colors.textPrimary} 
            />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={{ marginTop: 16, color: theme.colors.textSecondary }}>Loading products...</Text>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={{ padding: theme.spacing.sm, paddingTop: 0 }}
            data={filtered}
            numColumns={grid ? 2 : 1}
            key={grid ? 'g' : 'l'}
            columnWrapperStyle={grid ? { justifyContent: 'flex-start', gap: 8 } : undefined}
            renderItem={({ item }) => (
              <ProductCard product={item} onAdd={addToCart} navigation={navigation} isGrid={grid} />
            )}
            keyExtractor={(i: any) => i.id}
          />
        )}
      </View>
    </>
  );
}