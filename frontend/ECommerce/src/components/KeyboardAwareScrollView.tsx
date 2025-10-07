import React, { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  StyleSheet,
  ViewStyle,
  ScrollViewProps,
} from 'react-native';

interface Props extends ScrollViewProps {
  children: ReactNode;
  containerStyle?: ViewStyle;
  keyboardVerticalOffset?: number;
  enableOnAndroid?: boolean;
}

export default function KeyboardAwareScrollView({
  children,
  containerStyle,
  keyboardVerticalOffset = Platform.OS === 'ios' ? 0 : 20,
  enableOnAndroid = true,
  ...scrollViewProps
}: Props) {
  const behavior = Platform.OS === 'ios' ? 'padding' : enableOnAndroid ? 'height' : undefined;

  return (
    <KeyboardAvoidingView
      style={[styles.container, containerStyle]}
      behavior={behavior}
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
        {...scrollViewProps}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});