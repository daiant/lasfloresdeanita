import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Theme } from './styles/theme';

type Props = {
  disabled?: boolean;
  variant?: 'primary' | 'danger' | 'secondary';
  action: () => void,
  title: string
}
export default function Button(props: Props) {
  return <TouchableOpacity disabled={props.disabled} onPress={props.action} activeOpacity={0.8}>
    <Text style={{ ...styles.button, ...(styles as any)[props.variant ?? 'primary'] }}>{props.title}</Text>
  </TouchableOpacity>;
}

const styles = StyleSheet.create({
  button: {
    color: Theme.dark.base,
    paddingBlock: 8,
    paddingInline: 16,
    fontSize: 16,
    fontWeight: 500,
    borderRadius: 4,
    textAlign: 'center',
    marginInline: 'auto',
    marginBlockStart: 8,
    width: '100%',
  },
  primary: {
    backgroundColor: Theme.dark.accent,
  },
  secondary: { backgroundColor: Theme.dark.border, color: Theme.dark.text },
  danger: { backgroundColor: Theme.dark.red },
});
