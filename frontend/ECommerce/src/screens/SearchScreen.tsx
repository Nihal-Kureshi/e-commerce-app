import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useAppData } from './HomeScreen';
import { useTheme } from '../context/ThemeContext';
import { strings } from '../constants/strings';
import { useSearch } from '../hooks/useSearch';
import ScreenHeader from '../components/ScreenHeader';
import ProductGrid from '../components/ProductGrid';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import { NavigationProp } from '../types';

interface Props {
  navigation: NavigationProp;
}

export default function SearchScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const { products, addToCart } = useAppData();
  const { query, searchError, filteredItems, handleSearchChange } = useSearch(products, 'name');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    search: {
      backgroundColor: theme.colors.surface,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors.outline,
      color: theme.colors.textPrimary,
      margin: 20,
      fontSize: 16,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 12,
      marginTop: -8,
      marginLeft: 20,
      marginBottom: 8,
    },
  });

  return (
    <KeyboardAvoidingWrapper style={styles.container}>
      <ScreenHeader title="Search" onBack={() => navigation.goBack()} />
      <View>
        <TextInput
          placeholder={strings.searchProducts}
          placeholderTextColor={theme.colors.textSecondary}
          style={[styles.search, searchError && { borderColor: theme.colors.error }]}
          value={query}
          onChangeText={handleSearchChange}
          autoFocus
        />
        {searchError ? <Text style={styles.errorText}>{searchError}</Text> : null}
      </View>
      <ProductGrid
        products={filteredItems}
        onAddToCart={addToCart}
        navigation={navigation}
        emptyMessage={query ? strings.noProductsFound : ''}
        maxToRenderPerBatch={8}
        windowSize={8}
        initialNumToRender={4}
      />
    </KeyboardAvoidingWrapper>
  );
}