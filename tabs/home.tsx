/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  FlatList,
  NativeSyntheticEvent,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TextInputSubmitEditingEventData,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { createTables } from '../lib/db-service';
import { Pot, Pots } from '../lib/pots';
import { actions } from '../App';
import { FloatingAction } from 'react-native-floating-action';
import { database } from '../lib/db-service';

const potService = new Pots(database);
export default function Home({ navigation }: { navigation: any }) {
  const [pots, setPots] = React.useState<Pot[]>(potService.get());
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  async function createNewPot(e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) {
    if (!potService || !e.nativeEvent.text) { return; }
    console.log('Writing to pots', e.nativeEvent.text);

    potService.create(e.nativeEvent.text);
    setPots(potService.get());
  }

  React.useEffect(() => {
    createTables(database);
    console.log(potService.get());
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View>
        <Text
          style={titleStyles}>
          Hola anita!!!!!!
        </Text>
        <TextInput placeholder="Afegir pot" onSubmitEditing={createNewPot} />
        <FlatList
          data={pots}
          renderItem={({ item }) => (
            <Text onPress={() => navigation.navigate('Pot', { potId: item.potId, name: item.name })} key={item.potId} style={{ color: Colors.white }}>
              {item.name}
            </Text>
          )}
        />
      </View>
      <FloatingAction actions={actions} />
    </SafeAreaView>
  );
}

const titleStyles = {
  fontWeight: '700',
  fontSize: 32,
  color: Colors.white,
  marginBlock: 8,
} as any;
