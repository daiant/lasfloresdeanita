import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Theme } from './styles/theme';

export default function ThemedText({ children }: { children: React.ReactNode }) {
  return <Text style={style.text}>{children}</Text>;
}

const style = StyleSheet.create({
  text: {
    color: Theme.dark.text,
    fontSize: 18,
    lineHeight: 20,
  },
})