import { Dimensions } from 'react-native';

let { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Update dimensions on orientation change
Dimensions.addEventListener('change', ({ window }) => {
  SCREEN_WIDTH = window.width;
  SCREEN_HEIGHT = window.height;
});

// Device type detection (dynamic based on current orientation)
export const isPhone = () => {
  const { width } = Dimensions.get('window');
  return width <= 600;
};
export const isTablet = () => {
  const { width } = Dimensions.get('window');
  return width > 600 && width <= 1024;
};
export const isLargeDevice = () => {
  const { width } = Dimensions.get('window');
  return width > 1024;
};

export const wp = (percentage: number) => {
  const { width } = Dimensions.get('window');
  return (percentage * width) / 100;
};

export const hp = (percentage: number) => {
  const { height } = Dimensions.get('window');
  return (percentage * height) / 100;
};

// Grid layout configuration
export const getGridColumns = (cardType: 'big' | 'small') => {
  if (isLargeDevice()) {
    return cardType === 'big' ? 4 : 5;
  }
  if (isTablet()) {
    return cardType === 'big' ? 3 : 4;
  }
  return cardType === 'big' ? 1 : 2;
};

// Card dimensions (dynamic based on current screen width)
export const getCardWidth = (cardType: 'big' | 'small') => {
  const { width } = Dimensions.get('window');
  const columns = getGridColumns(cardType);
  const padding = getGridPadding();
  const gap = getCardGap();
  const totalGaps = (columns - 1) * gap;
  const totalPadding = padding * 2;
  const availableWidth = width - totalPadding - totalGaps;
  const cardWidth = availableWidth / columns;
  
  // Limit max width on large screens
  const maxWidth = cardType === 'big' ? 450 : 400;
  return Math.min(cardWidth, maxWidth);
};

// Spacing
export const getGridPadding = () => isPhone() ? 16 : 24;
export const getCardGap = () => isPhone() ? 12 : 16;

// Conservative responsive scaling
export const rScale = (size: number) => {
  if (isLargeDevice()) return Math.round(size * 1.15);
  if (isTablet()) return Math.round(size * 1.08);
  return size;
};

export const rIcon = (size: number) => {
  if (isLargeDevice()) return Math.round(size * 1.25);
  if (isTablet()) return Math.round(size * 1.15);
  return size;
};

export const rFont = (size: number) => {
  if (isLargeDevice()) return Math.round(size * 1.2);
  if (isTablet()) return Math.round(size * 1.1);
  return size;
};

// Legacy aliases for backward compatibility
export const scale = rScale;
export const iconScale = rIcon;
export const fontScale = rFont;

// Responsive spacing
export const rSpacing = {
  xs: rScale(4),
  sm: rScale(8),
  md: rScale(12),
  lg: rScale(16),
  xl: rScale(24),
  xxl: rScale(32)
};

// Responsive border radius
export const rRadius = {
  sm: rScale(4),
  md: rScale(8),
  lg: rScale(12)
};