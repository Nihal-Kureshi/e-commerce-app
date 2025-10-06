import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/api';
import { useAppData } from './HomeScreen';

export default function OrderDetailScreen({ route, navigation }: any) {
  const { orderId } = route.params;
  const { theme } = useTheme();
  const { products } = useAppData();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getProductById = (productId: number) => {
    return products.find(p => parseInt(p.id) === productId);
  };

  useEffect(() => {
    loadOrderDetail();
  }, []);

  async function loadOrderDetail() {
    try {
      setError(null);
      const orderData = await apiService.getOrderById(orderId);
      setOrder(orderData);
    } catch (error: any) {
      console.error('Failed to load order:', error);
      setError(error.message || 'Failed to load order details');
    } finally {
      setLoading(false);
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
    content: {
      padding: 16,
    },
    section: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.md,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.outline,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.textPrimary,
      marginBottom: 12,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    label: {
      color: theme.colors.textSecondary,
      fontSize: 14,
    },
    value: {
      color: theme.colors.textPrimary,
      fontSize: 14,
      fontWeight: '500',
    },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
    },
    productImage: {
      width: 50,
      height: 50,
      borderRadius: theme.radii.sm,
      marginRight: 12,
      backgroundColor: theme.colors.background,
    },
    itemContent: {
      flex: 1,
    },
    itemName: {
      color: theme.colors.textPrimary,
      fontSize: 14,
      fontWeight: '500',
      marginBottom: 2,
    },
    itemDetails: {
      color: theme.colors.textSecondary,
      fontSize: 12,
    },
    itemPrice: {
      color: theme.colors.textPrimary,
      fontSize: 14,
      fontWeight: '600',
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors.outline,
    },
    totalLabel: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.textPrimary,
    },
    totalValue: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
  });

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!order && !loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{error ? 'Error' : 'Order Not Found'}</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Icon name="alert-circle-outline" size={64} color={theme.colors.error} />
          <Text style={{ marginTop: 16, color: theme.colors.error, textAlign: 'center' }}>
            {error || 'Order not found'}
          </Text>
          <TouchableOpacity 
            onPress={loadOrderDetail}
            style={{ marginTop: 16, padding: 12, backgroundColor: theme.colors.primary, borderRadius: 8 }}
          >
            <Text style={{ color: 'white' }}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Order ID</Text>
            <Text style={styles.value}>{order.id}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>{new Date(order.createdAt).toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>Processing</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items ({order.items?.length || 0})</Text>
          {order.items?.map((item: any, index: number) => {
            const product = getProductById(item.productId);
            return (
              <View key={index} style={styles.itemRow}>
                <Image 
                  source={{ uri: product?.image || 'https://via.placeholder.com/50' }} 
                  style={styles.productImage}
                  resizeMode="cover"
                />
                <View style={styles.itemContent}>
                  <Text style={styles.itemName}>{item.productName || product?.name || `Product #${item.productId}`}</Text>
                  <Text style={styles.itemDetails}>Qty: {item.quantity} × ${item.price}</Text>
                </View>
                <Text style={styles.itemPrice}>${(item.quantity * item.price).toFixed(2)}</Text>
              </View>
            );
          })}
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${order.total?.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}