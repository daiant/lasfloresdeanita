import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native';
import { Theme } from './styles/theme';

export default function ThemedText({ style, children }: { style?: StyleProp<TextStyle>, children: React.ReactNode }) {
  return <Text style={[styles.text, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  text: {
    color: Theme.dark.text,
    fontSize: 18,
    lineHeight: 20,
  },
})