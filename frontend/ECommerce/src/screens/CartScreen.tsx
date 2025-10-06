import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppData } from './HomeScreen';
import { useTheme } from '../context/ThemeContext';
import { strings } from '../constants/strings';
import { wp, scale, isTablet, getResponsiveValue, iconScale, fontScale } from '../utils/responsive';

export default function CartScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const { cart, updateQuantity, removeFromCart, placeOrder } = useAppData();
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Initialize selected items when cart changes
  useEffect(() => {
    setSelectedItems(new Set(cart.map(item => item.product.id)));
  }, [cart]);

  const toggleItemSelection = useCallback((productId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedItems.size === cart.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cart.map(item => item.product.id)));
    }
  }, [selectedItems.size, cart]);

  const selectedCartItems = useMemo(() => {
    return cart.filter(item => selectedItems.has(item.product.id));
  }, [cart, selectedItems]);

  const selectedCartSummary = useMemo(() => {
    const subtotal = selectedCartItems.reduce((s, c) => s + c.product.price * c.quantity, 0);
    const shipping = subtotal > 200 ? 0 : 12.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total, itemCount: selectedCartItems.length };
  }, [selectedCartItems]);

  const onCheckout = useCallback(async () => {
    // Validation
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to cart before checkout');
      return;
    }
    
    if (selectedItems.size === 0) {
      Alert.alert('No Items Selected', 'Please select items to checkout');
      return;
    }
    
    if (selectedCartSummary.total <= 0) {
      Alert.alert('Invalid Order', 'Order total must be greater than zero');
      return;
    }
    
    try {
      const order = await placeOrder(selectedCartItems);
      Alert.alert('✅ Order Placed!', `Your order #${order.id} has been successfully placed!`, [
        { text: 'View Orders', onPress: () => navigation.navigate('Orders') },
      ]);
    } catch (error: any) {
      Alert.alert('Order Failed', error.message || 'Failed to place order');
    }
  }, [cart.length, selectedItems.size, selectedCartSummary.total, selectedCartItems, placeOrder, navigation]);

  const styles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
    },
    backButton: {
      padding: 8,
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.textPrimary,
    },

    selectAllRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      marginHorizontal: 16,
      marginBottom: 12,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.md,
      elevation: 1,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    },
    selectAllLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    selectAllText: {
      marginLeft: 12,
      ...theme.typography.body,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
    selectAllCount: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      backgroundColor: theme.colors.background,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: theme.radii.sm,
      overflow: 'hidden',
    },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.md,
      marginBottom: 10,
      elevation: 2,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    },
    checkbox: {
      marginRight: 12,
    },
    productImage: {
      width: 60,
      height: 60,
      borderRadius: theme.radii.sm,
      marginRight: 12,
    },
    itemContent: {
      flex: 1,
    },
    itemTitle: {
      ...theme.typography.body,
      fontWeight: '600',
      color: theme.colors.textPrimary,
    },
    itemPrice: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    qtyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 12,
    },
    qtyBtn: {
      padding: 8,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radii.sm,
      minWidth: 32,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.accent,
    },
    qtyBtnText: {
      color: '#FFFFFF',
      ...theme.typography.button,
    },
    qtyText: {
      marginHorizontal: 12,
      ...theme.typography.body,
      color: theme.colors.textPrimary,
      minWidth: 20,
      textAlign: 'center',
    },
    remove: {
      marginLeft: 8,
      padding: 8,
    },
    removeText: {
      color: theme.colors.error,
      ...theme.typography.caption,
    },
    emptyText: {
      color: theme.colors.textSecondary,
      padding: 20,
      textAlign: 'center',
      ...theme.typography.body,
    },
    summary: {
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.md,
      elevation: 4,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      maxWidth: isTablet() ? 600 : '100%',
      alignSelf: 'center',
      width: '100%',
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 4,
    },
    summaryText: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
    },
    summaryTotal: {
      ...theme.typography.body,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    checkoutBtn: {
      marginTop: 16,
      backgroundColor: theme.colors.primary,
      padding: 16,
      borderRadius: theme.radii.md,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    checkoutBtnText: {
      color: '#FFFFFF',
      ...theme.typography.button,
      marginLeft: 8,
    },
  }), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={iconScale(24)} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
      </View>

      <FlatList
        data={cart}
        contentContainerStyle={{ padding: 16 }}
        keyExtractor={(i: any) => i.product.id}
        ListHeaderComponent={
          cart.length > 0 ? (
            <TouchableOpacity style={styles.selectAllRow} onPress={toggleSelectAll}>
              <View style={styles.selectAllLeft}>
                <Icon 
                  name={selectedItems.size === cart.length ? "checkbox" : "square-outline"} 
                  size={iconScale(24)} 
                  color={theme.colors.primary} 
                />
                <Text style={styles.selectAllText}>Select All</Text>
              </View>
              <Text style={styles.selectAllCount}>{selectedItems.size}/{cart.length}</Text>
            </TouchableOpacity>
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <TouchableOpacity 
              style={styles.checkbox}
              onPress={() => toggleItemSelection(item.product.id)}
            >
              <Icon 
                name={selectedItems.has(item.product.id) ? "checkbox" : "square-outline"} 
                size={iconScale(24)} 
                color={theme.colors.primary} 
              />
            </TouchableOpacity>
            <Image 
              source={{ uri: item.product.image }} 
              style={styles.productImage}
              resizeMode="cover"
            />
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>{item.product.name}</Text>
              <Text style={styles.itemPrice}>
                ${(item.product.price * item.quantity).toFixed(2)}
              </Text>
            </View>
            <View style={styles.qtyRow}>
              <TouchableOpacity
                onPress={() =>
                  updateQuantity(
                    item.product.id,
                    Math.max(1, item.quantity - 1),
                  )
                }
                style={styles.qtyBtn}
              >
                <Icon name="remove-outline" size={iconScale(16)} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <TouchableOpacity
                onPress={() =>
                  updateQuantity(item.product.id, item.quantity + 1)
                }
                style={styles.qtyBtn}
              >
                <Icon name="add-outline" size={iconScale(16)} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => removeFromCart(item.product.id)}
              style={styles.remove}
            >
              <Icon name="trash-outline" size={iconScale(16)} color={theme.colors.error} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {strings.cartEmpty}
          </Text>
        }
      />

      {selectedItems.size > 0 && (
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Subtotal ({selectedCartSummary.itemCount} items)</Text>
            <Text style={styles.summaryText}>${selectedCartSummary.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>{strings.shipping}</Text>
            <Text style={styles.summaryText}>${selectedCartSummary.shipping.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Tax</Text>
            <Text style={styles.summaryText}>${selectedCartSummary.tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: theme.colors.outline }]}>
            <Text style={styles.summaryTotal}>Total</Text>
            <Text style={styles.summaryTotal}>
              ${selectedCartSummary.total.toFixed(2)}
            </Text>
          </View>

          <TouchableOpacity style={styles.checkoutBtn} onPress={onCheckout}>
            <Icon name="flash-outline" size={iconScale(20)} color="#FFFFFF" />
            <Text style={styles.checkoutBtnText}>
              {strings.proceedToCheckout}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}


