import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Product } from '../types';
import { useTheme } from '../lib/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = {
  product: Product;
  onAdd: (p: Product) => void;
  navigation?: any;
};

export default function ProductCard({ product, onAdd, navigation }: Props) {
  const { theme } = useTheme();
  
  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radii.md,
      overflow: 'hidden',
      margin: theme.spacing.sm,
      flex: 1,
      elevation: 4,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      borderWidth: 2,
      borderColor: theme.colors.primary + '10',
    },
    imageContainer: {
      position: 'relative',
      height: 110,
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    imageOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '50%',
      backgroundColor: theme.colors.primary,
      opacity: 0.4,
    },
    body: {
      padding: theme.spacing.sm,
    },
    title: {
      ...theme.typography.caption,
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.xs,
      fontWeight: '600',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    price: {
      ...theme.typography.body,
      fontWeight: '700',
      color: theme.colors.primary,
    },
    addBtn: {
      backgroundColor: theme.colors.primary,
      padding: 8,
      borderRadius: theme.radii.md,
      elevation: 2,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    }
  });

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation?.navigate('ProductDetail', { product })}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} />
        <View style={styles.imageOverlay} />
      </View>
      <View style={styles.body}>
        <Text numberOfLines={2} style={styles.title}>{product.name}</Text>
        <View style={styles.row}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <TouchableOpacity onPress={() => onAdd(product)} style={styles.addBtn} accessibilityLabel={`Add ${product.name} to cart`}>
            <Icon name="add-circle-outline" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

