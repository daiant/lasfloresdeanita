import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {Theme} from './styles/theme';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export default function Title({
  tag,
  children,
  hideBorder,
}: {
  children: React.ReactNode;
  tag: 'h1' | 'h2' | 'h3';
  hideBorder?: boolean;
}) {
  return (
    <Text
      // eslint-disable-next-line react-native/no-inline-styles
      style={{
        ...styles[tag as keyof typeof styles],
        borderBottomWidth: hideBorder ? 0 : 2,
      }}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontWeight: '700',
    fontSize: 32,
    color: Theme.dark.text,
    marginBlockStart: 24,
    marginBlockEnd: 8,
    textAlign: 'center',
    borderBottomColor: 'transparent',
  },
  h2: {
    fontSize: 24,
    fontWeight: 500,
    color: Theme.dark.text,
    marginBlock: 4,
    borderBottomWidth: 2,
    borderBottomColor: Theme.dark.border,
  },
  h3: {
    fontSize: 22,
    fontWeight: 400,
    color: Theme.dark.text,
    marginBlock: 4,
    borderBottomWidth: 2,
    borderBottomColor: Theme.dark.border,
  },
});
