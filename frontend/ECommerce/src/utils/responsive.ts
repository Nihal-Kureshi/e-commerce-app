import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const isTablet = () => SCREEN_WIDTH >= 768;
export const isPhone = () => SCREEN_WIDTH < 768;

export const wp = (percentage: number) => {
  return (percentage * SCREEN_WIDTH) / 100;
};

export const hp = (percentage: number) => {
  return (percentage * SCREEN_HEIGHT) / 100;
};

// Icon scaling for tablets
export const iconScale = (size: number) => {
  if (isTablet()) {
    return size * 1.5; // Larger icons for tablets
  }
  return size;
};

// Font scaling for tablets
export const fontScale = (size: number) => {
  if (isTablet()) {
    return size * 1.3; // Larger fonts for tablets
  }
  return size;
};

// General scaling
export const scale = (size: number) => {
  if (isTablet()) {
    return size * 1.4; // Better scaling for tablets
  }
  return size;
};

export const getResponsiveValue = (phone: number, tablet: number) => {
  return isTablet() ? tablet : phone;
};