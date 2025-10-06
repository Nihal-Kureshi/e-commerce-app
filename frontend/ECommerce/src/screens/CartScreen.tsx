import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppData } from './HomeScreen';
import { useTheme } from '../context/ThemeContext';
import { strings } from '../constants/strings';

export default function CartScreen({ navigation }: any) {
  const { theme, isDark } = useTheme();
  const { cart, updateQuantity, removeFromCart, cartSummary, placeOrder } =
    useAppData();

  async function onCheckout() {
    try {
      const order = await placeOrder({}, {});
      Alert.alert('✅ Order Placed!', `Your order ${order.id} has been successfully placed!`, [
        { text: 'View Orders', onPress: () => navigation.navigate('Orders') },
      ]);
    } catch (error: any) {
      Alert.alert('Order Failed', error.message);
    }
  }

  const styles = StyleSheet.create({
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
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
      </View>

      <FlatList
        data={cart}
        contentContainerStyle={{ padding: theme.spacing.md }}
        keyExtractor={(i: any) => i.product.id}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <View style={{ flex: 1 }}>
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
                <Icon name="remove-outline" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <TouchableOpacity
                onPress={() =>
                  updateQuantity(item.product.id, item.quantity + 1)
                }
                style={styles.qtyBtn}
              >
                <Icon name="add-outline" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => removeFromCart(item.product.id)}
              style={styles.remove}
            >
              <Icon name="trash-outline" size={16} color={theme.colors.error} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {strings.cartEmpty}
          </Text>
        }
      />

      {cart.length > 0 && (
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Subtotal</Text>
            <Text style={styles.summaryText}>${cartSummary.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>{strings.shipping}</Text>
            <Text style={styles.summaryText}>${cartSummary.shipping.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Tax</Text>
            <Text style={styles.summaryText}>${cartSummary.tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.summaryRow, { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: theme.colors.outline }]}>
            <Text style={styles.summaryTotal}>Total</Text>
            <Text style={styles.summaryTotal}>
              ${cartSummary.total.toFixed(2)}
            </Text>
          </View>

          <TouchableOpacity style={styles.checkoutBtn} onPress={onCheckout}>
            <Icon name="flash-outline" size={20} color="#FFFFFF" />
            <Text style={styles.checkoutBtnText}>
              {strings.proceedToCheckout}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}


