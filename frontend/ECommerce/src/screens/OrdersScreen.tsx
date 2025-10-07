import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAppData } from './HomeScreen';
import { useTheme } from '../context/ThemeContext';
import { strings } from '../constants/strings';
import ScreenHeader from '../components/ScreenHeader';

export default function OrdersScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { orders, loadOrders } = useAppData();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadOrders();
    } catch (error) {
      Alert.alert('Error', 'Failed to refresh orders');
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return theme.colors.primary;
      case 'Shipped': return theme.colors.accent;
      case 'Processing': return theme.colors.secondary;
      default: return theme.colors.error;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return 'checkmark-circle-outline';
      case 'Shipped': return 'rocket-outline';
      case 'Processing': return 'sync-outline';
      default: return 'alert-circle-outline';
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },


    orderCard: {
      flexDirection: 'row',
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.md,
      marginBottom: 12,
      elevation: 2,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    },
    orderLeft: {
      flex: 1,
    },
    orderId: {
      ...theme.typography.body,
      fontWeight: '700',
      color: theme.colors.textPrimary,
      marginBottom: 4,
    },
    orderMeta: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    orderTotal: {
      ...theme.typography.body,
      fontWeight: '600',
      color: theme.colors.primary,
    },
    orderRight: {
      alignItems: 'flex-end',
    },
    statusRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    status: {
      ...theme.typography.caption,
      fontWeight: '600',
      marginLeft: 6,
    },
    actionsRow: {
      flexDirection: 'row',
    },
    action: {
      marginLeft: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radii.sm,
      borderWidth: 1,
      borderColor: theme.colors.accent,
    },
    actionText: {
      color: '#FFFFFF',
      ...theme.typography.caption,
      fontWeight: '500',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      color: theme.colors.textSecondary,
      ...theme.typography.body,
      textAlign: 'center',
      marginTop: 16,
    },
  });

  return (
    <View style={styles.container}>
      <ScreenHeader title="My Orders" onBack={() => navigation.goBack()} />

      <FlatList
        data={orders}
        contentContainerStyle={{ padding: theme.spacing.md }}
        keyExtractor={(o: any) => o.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.orderCard}
            onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
          >
            <View style={styles.orderLeft}>
              <Text style={styles.orderId}>Order #{item.id}</Text>
              <Text style={styles.orderMeta}>
                {new Date(item.createdAt || Date.now()).toLocaleString()} • {Array.isArray(item.items) ? item.items.length : 0} items
              </Text>
              <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
            </View>
            <View style={styles.orderRight}>
              <View style={styles.statusRow}>
                <Icon 
                  name={getStatusIcon(item.status || 'Processing')} 
                  size={16} 
                  color={getStatusColor(item.status || 'Processing')} 
                />
                <Text style={[styles.status, { color: getStatusColor(item.status || 'Processing') }]}>
                  {item.status || 'Processing'}
                </Text>
              </View>
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.action}
                  onPress={() => Alert.alert('Reorder', `Reorder ${item.id} added to cart!`)}
                >
                  <Text style={styles.actionText}>Reorder</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.action}
                  onPress={() => Alert.alert('Track Order', `Tracking order ${item.id}`)}
                >
                  <Text style={styles.actionText}>Track</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="receipt-outline" size={64} color={theme.colors.textSecondary} />
            <Text style={styles.emptyText}>
              {strings.noOrdersYet}
            </Text>
          </View>
        }
      />
    </View>
  );
}


