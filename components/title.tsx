import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Theme } from './styles/theme';

export default function Title({ tag, children }: { children: React.ReactNode, tag: 'h1' | 'h2' }) {
  return <Text style={styles[tag as keyof typeof styles]}>{children}</Text>;
}

const styles = StyleSheet.create({
  h1: {
    fontWeight: '700',
    fontSize: 32,
    color: Theme.dark.text,
    marginBlockStart: 24,
    marginBlockEnd: 8,
    textAlign: 'center',
  },
  h2: {
    fontSize: 24,
    fontWeight: 500,
    color: Theme.dark.text,
    marginBlock: 4,
    borderBottomWidth: 2,
    borderBottomColor: Theme.dark.border,
  },
});
