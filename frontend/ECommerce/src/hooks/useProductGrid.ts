import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { getGridColumns, getGridPadding, getCardGap } from '../utils/responsive';
import { UseProductGridResult, CardType } from '../types';

export const useProductGrid = (cardType: CardType): UseProductGridResult => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  const gridColumns = getGridColumns(cardType);
  const gridPadding = getGridPadding();
  const cardGap = getCardGap();

  const getItemLayout = (data: any, index: number): { length: number; offset: number; index: number } => ({
    length: cardType === 'big' ? 240 : 200,
    offset: (cardType === 'big' ? 240 : 200) * Math.floor(index / gridColumns),
    index,
  });

  const flatListProps = {
    numColumns: gridColumns,
    key: `${cardType}-${gridColumns}-${dimensions.width}`,
    columnWrapperStyle: gridColumns > 1 ? {
      justifyContent: 'flex-start' as const,
      gap: cardGap,
      paddingHorizontal: 0,
    } : undefined,
    contentContainerStyle: {
      padding: gridPadding,
      gap: cardGap,
    },
    getItemLayout,
    removeClippedSubviews: true,
  };

  return {
    dimensions,
    gridColumns,
    gridPadding,
    cardGap,
    flatListProps,
  };
};