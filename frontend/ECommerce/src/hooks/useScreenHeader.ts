import { StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export const useScreenHeader = () => {
  const { theme } = useTheme();

  const headerStyles = StyleSheet.create({
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
  });

  return { headerStyles, theme };
};