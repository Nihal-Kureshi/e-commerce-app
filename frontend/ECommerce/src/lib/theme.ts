import { rFont, rScale } from '../utils/responsive';

export const typography = {
  heading1: { fontSize: rFont(24), fontWeight: '700' as const, lineHeight: rFont(32), fontFamily: 'Inter' },
  heading2: { fontSize: rFont(20), fontWeight: '600' as const, lineHeight: rFont(28), fontFamily: 'Inter' },
  body: { fontSize: rFont(16), fontWeight: '400' as const, lineHeight: rFont(24), fontFamily: 'Inter' },
  caption: { fontSize: rFont(14), fontWeight: '500' as const, lineHeight: rFont(20), fontFamily: 'Inter' },
  button: { fontSize: rFont(16), fontWeight: '500' as const, lineHeight: rFont(24), fontFamily: 'Inter' },
};

export const spacing = {
  xxs: rScale(4),
  xs: rScale(8),
  sm: rScale(12),
  md: rScale(16),
  lg: rScale(24),
  xl: rScale(32),
  xxl: rScale(40),
};

export const radii = {
  sm: rScale(6),
  md: rScale(12),
  lg: rScale(16),
};

export const lightColors = {
  primary: '#00BFFF',
  secondary: '#1F1F1F',
  background: '#F0F2F5',
  surface: '#FFFFFF',
  textPrimary: '#1C1C1C',
  textSecondary: '#4B4B4B',
  accent: '#1E40AF',
  error: '#FF4C4C',
  outline: '#E0E0E0', 
  shadow: 'rgba(0,0,0,0.1)',
};

export const darkColors = {
  primary: '#00E0FF',
  secondary: '#B0B0B0',
  background: '#0D0D0D',
  surface: '#1A1A1A',
  textPrimary: '#E0E0E0',
  textSecondary: '#B0B0B0',
  accent: '#3B82F6',
  error: '#FF6B6B',
  outline: '#404040',
  shadow: 'rgba(0,0,0,0.3)',
};

export type Theme = {
  colors: typeof lightColors;
  spacing: typeof spacing;
  radii: typeof radii;
  typography: typeof typography;
};

export const createTheme = (isDark: boolean): Theme => ({
  colors: isDark ? darkColors : lightColors,
  spacing,
  radii,
  typography,
});

export default createTheme(false);