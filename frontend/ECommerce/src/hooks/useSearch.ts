import { useState, useMemo } from 'react';
import { UseSearchResult } from '../types';

export const useSearch = <T>(items: T[], searchKey: keyof T): UseSearchResult<T> => {
  const [query, setQuery] = useState('');
  const [searchError, setSearchError] = useState('');

  const validateSearch = (searchQuery: string): boolean => {
    if (searchQuery.length > 0 && searchQuery.length < 2) {
      setSearchError('Search must be at least 2 characters');
      return false;
    }
    setSearchError('');
    return true;
  };

  const filteredItems = useMemo(() => {
    if (!query) return items;
    return items.filter((item) =>
      String(item[searchKey]).toLowerCase().includes(query.toLowerCase())
    );
  }, [items, query, searchKey]);

  const handleSearchChange = (text: string): void => {
    setQuery(text);
    validateSearch(text);
  };

  return {
    query,
    searchError,
    filteredItems,
    handleSearchChange,
  };
};