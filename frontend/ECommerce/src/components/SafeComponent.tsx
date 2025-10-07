import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ErrorBoundary from './ErrorBoundary';

interface Props {
  children: ReactNode;
  componentName?: string;
}

const ComponentErrorFallback = ({ componentName }: { componentName?: string }) => (
  <View style={styles.errorContainer}>
    <Icon name="warning-outline" size={24} color="#FF6B6B" />
    <Text style={styles.errorText}>
      {componentName ? `${componentName} failed to load` : 'Component error'}
    </Text>
  </View>
);

export default function SafeComponent({ children, componentName }: Props) {
  return (
    <ErrorBoundary fallback={<ComponentErrorFallback componentName={componentName} />}>
      {children}
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFE0E0',
    margin: 8,
  },
  errorText: {
    marginLeft: 8,
    color: '#FF6B6B',
    fontSize: 14,
  },
});