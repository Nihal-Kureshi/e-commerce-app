import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList } from 'react-native';
import { useAppData } from './HomeScreen';
import { useTheme } from '../lib/ThemeContext';
import ProductCard from '../components/ProductCard';
import { strings } from '../constants/strings';

export default function SearchScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { products, addToCart } = useAppData();
  const [query, setQuery] = useState('');

  const filtered = products.filter((p: any) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
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
    results: {
      flex: 1,
    },
    emptyText: {
      textAlign: 'center',
      color: theme.colors.textSecondary,
      marginTop: 50,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search</Text>
      </View>
      <TextInput
        placeholder={strings.searchProducts}
        placeholderTextColor={theme.colors.textSecondary}
        style={styles.search}
        value={query}
        onChangeText={setQuery}
        autoFocus
      />
      <FlatList
        style={styles.results}
        data={filtered}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => (
          <ProductCard product={item} onAdd={addToCart} navigation={navigation} />
        )}
        keyExtractor={(i: any) => i.id}
        ListEmptyComponent={
          query ? <Text style={styles.emptyText}>{strings.noProductsFound}</Text> : null
        }
      />
    </View>
  );
}