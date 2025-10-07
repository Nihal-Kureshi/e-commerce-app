import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useScreenHeader } from '../hooks/useScreenHeader';
import { ScreenHeaderProps } from '../types';

export default function ScreenHeader({ title, onBack, rightComponent }: ScreenHeaderProps) {
  const { headerStyles, theme } = useScreenHeader();

  return (
    <View style={headerStyles.header}>
      <TouchableOpacity style={headerStyles.backButton} onPress={onBack} testID="back-button">
        <Icon name="arrow-back" size={24} color={theme.colors.textPrimary} />
      </TouchableOpacity>
      <Text style={headerStyles.headerTitle}>{title}</Text>
      {rightComponent && <View style={{ marginLeft: 'auto' }}>{rightComponent}</View>}
    </View>
  );
}