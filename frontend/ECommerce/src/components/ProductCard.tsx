import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Product } from '../types';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = {
  product: Product;
  onAdd: (p: Product) => void;
  navigation?: any;
  isGrid?: boolean;
};

export default function ProductCard({ product, onAdd, navigation, isGrid = true }: Props) {
  const { theme } = useTheme();
  
  const styles = StyleSheet.create({
    card: {
      borderRadius: theme.radii.md,
      overflow: 'hidden',
      margin: isGrid ? theme.spacing.sm : 16,
      width: isGrid ? 160 : undefined,
      height: isGrid ? 200 : 200,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      flex: isGrid ? 0 : 1,
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      position: isGrid ? 'absolute' : 'absolute',
    },
    overlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '60%',
      backgroundColor: 'rgba(255,255,255,0)',
    },
    gradientOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: isGrid ? '50%' : '60%',
    },
    content: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: theme.spacing.sm,
    },
    title: {
      ...theme.typography.caption,
      color: '#FFFFFF',
      marginBottom: 4,
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
      padding: 6,
      borderRadius: 20,
      width: 32,
      height: 32,
      alignItems: 'center',
      justifyContent: 'center',
    }
  });

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => navigation?.navigate('ProductDetail', { product })}
    >
      <Image source={{ uri: product.image }} style={styles.image} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.gradientOverlay}
      />
      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.title}>{product.name}</Text>
        <View style={styles.row}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <TouchableOpacity onPress={() => onAdd(product)} style={styles.addBtn} accessibilityLabel={`Add ${product.name} to cart`}>
            <Icon name="add" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

