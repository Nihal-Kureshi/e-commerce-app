import React, { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ViewStyle } from 'react-native';

interface Props {
  children: ReactNode;
  style?: ViewStyle;
  keyboardVerticalOffset?: number;
  behavior?: 'height' | 'position' | 'padding';
}

export default function KeyboardAvoidingWrapper({
  children,
  style,
  keyboardVerticalOffset = Platform.OS === 'ios' ? 0 : 20,
  behavior = Platform.OS === 'ios' ? 'padding' : 'height',
}: Props) {
  return (
    <KeyboardAvoidingView
      style={[{ flex: 1 }, style]}
      behavior={behavior}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      {children}
    </KeyboardAvoidingView>
  );
}