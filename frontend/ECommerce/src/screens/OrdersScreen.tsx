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
import { useTheme } from '../lib/ThemeContext';

export default function OrdersScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { orders } = useAppData();

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
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      <FlatList
        data={orders}
        contentContainerStyle={{ padding: theme.spacing.md }}
        keyExtractor={(o: any) => o.id}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.orderLeft}>
              <Text style={styles.orderId}>{item.id}</Text>
              <Text style={styles.orderMeta}>
                {new Date(item.date).toLocaleDateString()} • {item.items.length} futuristic items
              </Text>
              <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
            </View>
            <View style={styles.orderRight}>
              <View style={styles.statusRow}>
                <Icon 
                  name={getStatusIcon(item.status)} 
                  size={16} 
                  color={getStatusColor(item.status)} 
                />
                <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
                  {item.status}
                </Text>
              </View>
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.action}
                  onPress={() => Alert.alert('🚀 Reorder', `Quantum reorder of ${item.id} added to cart!`)}
                >
                  <Text style={styles.actionText}>Reorder</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.action}
                  onPress={() => Alert.alert('📡 Track Order', `Tracking ${item.id}: Your tech package is being teleported!`)}
                >
                  <Text style={styles.actionText}>Track</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="cube-outline" size={64} color={theme.colors.textSecondary} />
            <Text style={styles.emptyText}>
              {strings.noOrdersYet}
            </Text>
          </View>
        }
      />
    </View>
  );
}


