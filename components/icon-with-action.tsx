import React from 'react';
import { View, TouchableHighlight, Image, Text, StyleSheet } from 'react-native';
import { Theme } from './styles/theme';

type Props = {
  source: any,
  text: string,
  action: () => void,
  center?: boolean,
  width?: number,
  height?: number,
}

export default function IconWithAction({ source, text, action, height, width }: Props) {

  const widthStyles = { height: height ?? 64, width: width ?? 64 };
  return <View>
    <TouchableHighlight onPress={action} underlayColor={'transparent'}>
      <Image source={source} style={{ ...styles.image, ...widthStyles }} resizeMode="contain" />
    </TouchableHighlight>
    <Text onPress={action} style={styles.text}>{text}</Text>
  </View>;
}

const styles = StyleSheet.create({
  image: { width: 64, height: 64, marginBlock: 8, marginInline: 'auto' },
  text: {
    color: Theme.dark.text,
    lineHeight: 18,
    fontSize: 15,
    maxWidth: 200,
    textAlign: 'center',
    marginInline: 'auto',
  },
});
