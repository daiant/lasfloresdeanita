import React from 'react';
import { View, Text, StatusBar, useColorScheme, SafeAreaView, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Theme, styles as baseStyles } from './home';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Pots } from '../lib/pots';
import { database } from '../lib/db-service';

const potService = new Pots(database);
export default function NewPot({ navigation }: { navigation: any, route: any }) {
  const [potName, setPotName] = React.useState('');
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Theme.dark.base : Colors.lighter,
    flex: 1,
  };

  function createNewPot(name: string) {
    if (!potService || !name) { return; }

    potService.create(name);
    navigation.goBack();
  }



  return <SafeAreaView style={backgroundStyle}>
    <StatusBar
      translucent backgroundColor="transparent"
      barStyle={isDarkMode ? 'light-content' : 'dark-content'}
    />
    <View style={styles.view}>
      <Text style={styles.text}>Los tarros son útiles para guardar semillas del mismo tipo.{'\n'}Aquí podrás crear un tarro para luego ir añadiéndole flores y semillas.{'\n'}¡Ponle nombre a tu tarro!</Text>
      <TextInput
        style={styles.input}
        placeholder="Añade un nombre"
        onChange={e => setPotName(e.nativeEvent.text)}
        value={potName}
        onBlur={() => setPotName('')}
      />
      <TouchableOpacity onPress={() => { createNewPot(potName); setPotName(''); }} activeOpacity={0.8}>
        <Text style={styles.button}>Crea tu tarro</Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  view: { ...baseStyles.view, paddingBlockStart: 8 },
  text: { ...baseStyles.text, fontSize: 14, fontWeight: 300 },
  input: {
    borderWidth: 1,
    borderColor: Theme.dark.border,
    borderRadius: 4,
    marginBlock: 8,
    lineHeight: 24,
    color: Theme.dark.text,
  },
  button: {
    color: Theme.dark.base,
    backgroundColor: Theme.dark.accent,
    paddingBlock: 8,
    paddingInline: 16,
    fontSize: 16,
    borderRadius: 100,
    width: 125,
    marginInline: 'auto',
    marginBlockStart: 8
  },
});
