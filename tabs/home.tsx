/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  Button,
  FlatList,
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { createTables } from '../lib/db-service';
import { Pot, Pots } from '../lib/pots';
import { database } from '../lib/db-service';
import { useFocusEffect } from '@react-navigation/native';

const potService = new Pots(database);
export default function Home({ navigation }: { navigation: any }) {
  const [pots, setPots] = React.useState<Pot[]>([]);
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  async function createNewPot(name: string) {
    if (!potService || !name) { return; }

    potService.create(name);
    setPots(potService.get());
  }

  useFocusEffect(React.useCallback(() => {
    createTables(database);
    setPots(potService.get());
  }, []));

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={{ marginBlockEnd: 'auto' }}>
        <Text
          style={titleStyles}>
          Hola anita!!!!!!
        </Text>
        <DumbInput callback={createNewPot} />
        <FlatList
          data={pots}
          renderItem={({ item }) => (
            <Text onPress={() => navigation.navigate('Pot', { potId: item.potId, name: item.name })} key={item.potId} style={{ color: Colors.white }}>
              {item.name}
            </Text>
          )}
        />
      </View>
      <Button title="Hellfire" onPress={() => {
        database.execute('DELETE FROM flowers');
        database.execute('DELETE FROM pots');
        createTables(database);
        setPots(potService.get());
      }} />
    </SafeAreaView>
  );
}

export function DumbInput({ callback }: { callback: (name: string) => void }) {
  const [value, setValue] = React.useState('');

  return <TextInput
    placeholder="Afegir pot"
    onChange={e => setValue(e.nativeEvent.text)}
    value={value}
    onBlur={() => setValue('')}
    onSubmitEditing={(e) => { callback(e.nativeEvent.text); setValue(''); }}
    style={{ color: Colors.white }}
  />;
}

const titleStyles = {
  fontWeight: '700',
  fontSize: 32,
  color: Colors.white,
  marginBlock: 8,
} as any;
