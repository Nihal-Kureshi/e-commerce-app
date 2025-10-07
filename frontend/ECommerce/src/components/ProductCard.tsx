import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Product } from '../types';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { getCardWidth, scale, fontScale, iconScale, getCardGap } from '../utils/responsive';

type Props = {
  product: Product;
  onAdd: (p: Product) => void;
  navigation?: any;
  cardType: 'big' | 'small';
};

export default function ProductCard({
  product,
  onAdd,
  navigation,
  cardType,
}: Props) {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    card: {
      borderRadius: theme.radii.md,
      overflow: 'hidden',
      width: getCardWidth(cardType),
      height: cardType === 'big' ? scale(240) : scale(200),
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      position: 'relative',
      marginBottom: getCardGap(),
    },
    image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      position: 'absolute',
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
      height: cardType === 'small' ? '50%' : '60%',
    },
    content: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: scale(8),
    },
    title: {
      fontSize: fontScale(cardType === 'big' ? 14 : 12),
      color: '#FFFFFF',
      marginBottom: scale(4),
      fontWeight: '600',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    price: {
      fontSize: fontScale(cardType === 'big' ? 16 : 14),
      fontWeight: '700',
      color: theme.colors.primary,
    },
    addBtn: {
      backgroundColor: theme.colors.primary,
      padding: scale(6),
      borderRadius: scale(20),
      width: scale(cardType === 'big' ? 36 : 32),
      height: scale(cardType === 'big' ? 36 : 32),
      alignItems: 'center',
      justifyContent: 'center',
    },
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
        <Text numberOfLines={2} style={styles.title}>
          {product.name}
        </Text>
        <View style={styles.row}>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <TouchableOpacity
            onPress={() => onAdd(product)}
            style={styles.addBtn}
            accessibilityLabel={`Add ${product.name} to cart`}
          >
            <Icon name="add" size={iconScale(16)} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
