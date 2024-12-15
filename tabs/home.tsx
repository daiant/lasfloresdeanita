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

export default function Home({ navigation }: { navigation: any }) {
  const [pots, setPots] = React.useState<Pot[]>([]);
  const [potService, setPotService] = React.useState<Pots | undefined>();
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  const callback = React.useCallback(async () => {
    setPotService(new Pots(database));
    await createTables(database);
  }, []);


  async function createNewPot(e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) {
    if (!potService || !e.nativeEvent.text) { return; }
    console.log('Writing to pots', e.nativeEvent.text);

    potService.create(e.nativeEvent.text);
    getPots();
  }

  const getPots = React.useCallback(() => {
    if (!potService) { return; }

    potService.get().then(data => {
      setPots(data);
    }).catch(error => console.log(error));
  }, [potService]);

  React.useEffect(() => {
    callback().then(() => getPots());
  }, [callback, getPots]);

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
            <Text onPress={() => navigation.navigate('Pot', { pot: item })} key={item.potId} style={{ color: Colors.white }}>
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
