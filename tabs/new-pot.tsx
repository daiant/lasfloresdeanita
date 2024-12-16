import React from 'react';
import { View, StatusBar, useColorScheme, SafeAreaView, TextInput, StyleSheet, } from 'react-native';
import { styles as baseStyles } from './home';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Pots } from '../lib/pots';
import { database } from '../lib/db-service';
import { Theme } from '../components/styles/theme';
import ThemedText from '../components/text';
import Button from '../components/button';

const potService = new Pots(database);
export default function NewPot({ navigation }: { navigation: any, route: any }) {
  const [potName, setPotName] = React.useState('');
  const [potDescription, setPotDescription] = React.useState('');
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Theme.dark.base : Colors.lighter,
    flex: 1,
  };

  function createNewPot() {
    if (!potService || !potName) { return; }

    potService.create(potName, potDescription);
    navigation.goBack();
  }



  return <SafeAreaView style={backgroundStyle}>
    <StatusBar
      translucent backgroundColor="transparent"
      barStyle={isDarkMode ? 'light-content' : 'dark-content'}
    />
    <View style={styles.view}>
      <ThemedText>Los tarros son útiles para guardar semillas del mismo tipo.{'\n'}Aquí podrás crear un tarro para luego ir añadiéndole flores y semillas.{'\n'}¡Ponle nombre a tu tarro!</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Añade un nombre"
        onChange={e => setPotName(e.nativeEvent.text)}
        value={potName}
      />
      <TextInput
        style={styles.input}
        placeholder={'Descripción.\nEjemplo: Bomba de semillas para sembrar los jardines del Túria.'}
        onChange={e => setPotDescription(e.nativeEvent.text)}
        value={potDescription}
        multiline={true}
      />
      <Button title="Crea tu tarro" action={() => { createNewPot(); setPotName(''); }} />
    </View>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  view: { ...baseStyles.view, paddingBlockStart: 8 },
  input: {
    borderWidth: 1,
    borderColor: Theme.dark.border,
    borderRadius: 4,
    marginBlock: 8,
    lineHeight: 24,
    color: Theme.dark.text,
    textAlignVertical: 'top',
  },
  button: {
    color: Theme.dark.base,
    backgroundColor: Theme.dark.accent,
    paddingBlock: 8,
    paddingInline: 16,
    fontSize: 16,
    fontWeight: 500,
    borderRadius: 4,
    textAlign: 'center',
    marginInline: 'auto',
    marginBlockStart: 8,
  },
});
