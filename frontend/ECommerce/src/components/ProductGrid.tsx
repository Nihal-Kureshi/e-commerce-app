import React from 'react';
import { FlatList, Text } from 'react-native';
import ProductCard from './ProductCard';
import { useProductGrid } from '../hooks/useProductGrid';
import { useGrid } from '../context/ThemeContext';
import { ProductGridProps } from '../types';

export default function ProductGrid({
  products,
  onAddToCart,
  navigation,
  emptyMessage = 'No products found',
  maxToRenderPerBatch = 10,
  windowSize = 10,
  initialNumToRender = 6,
}: ProductGridProps) {
  const { cardType } = useGrid();
  const { flatListProps } = useProductGrid(cardType);

  return (
    <FlatList
      data={products}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          onAdd={onAddToCart}
          navigation={navigation}
          cardType={cardType}
        />
      )}
      keyExtractor={(item) => item.id}
      maxToRenderPerBatch={maxToRenderPerBatch}
      windowSize={windowSize}
      initialNumToRender={initialNumToRender}
      updateCellsBatchingPeriod={50}
      ListEmptyComponent={
        <Text style={{ textAlign: 'center', marginTop: 50, color: '#666' }}>
          {emptyMessage}
        </Text>
      }
      {...flatListProps}
    />
  );
}