/* eslint-disable react-native/no-inline-styles */
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
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {createTables} from '../lib/db-service';
import {Pot, Pots} from '../lib/pots';
import {database} from '../lib/db-service';
import {useFocusEffect} from '@react-navigation/native';
import {Flower, Flowers} from '../lib/flowers';
import Title from '../components/title';
import {Theme} from '../components/styles/theme';
import IconWithAction from '../components/icon-with-action';
import NFCReader from '../components/nfc-reader';
import NFCWriter from '../components/nfc-writer';
import ThemedText from '../components/text';

const potService = new Pots(database);
const flowerService = new Flowers(database);
export default function Home({navigation}: {navigation: any}) {
  const [pots, setPots] = React.useState<Pot[]>([]);
  const [flowers, setFlowers] = React.useState<Flower[]>([]);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Theme.dark.base : Colors.lighter,
    flex: 1,
  };

  useFocusEffect(
    React.useCallback(() => {
      createTables(database);
      setPots(potService.get());
      setFlowers(flowerService.get());
    }, []),
  );

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <ImageBackground
        source={require('../assets/anita-wallpaper.webp')}
        style={styles.header}>
        <Title tag="h1">Las flores de Anita</Title>
      </ImageBackground>
      <View style={styles.view}>
        <Title tag="h2">Frascos</Title>
        <FlatList
          data={pots}
          contentContainerStyle={styles.list}
          horizontal
          ListFooterComponent={
            <IconWithAction
              center={!pots.length}
              source={require('../assets/zodiac.png')}
              text="Añade un frasco"
              action={() => navigation.navigate('New Pot')}
            />
          }
          renderItem={({item}) => (
            <IconWithAction
              text={item.name}
              action={() =>
                navigation.navigate('Pot', {potId: item.potId, name: item.name})
              }
              source={require('../assets/bottle.png')}
            />
          )}
        />
        <Title tag="h2">Flores</Title>
        <FlatList
          data={flowers}
          contentContainerStyle={styles.list}
          horizontal
          ListFooterComponent={
            <IconWithAction
              center={!flowers.length}
              source={require('../assets/flower.png')}
              text="Añade una flor"
              action={() => navigation.navigate('New Flower')}
            />
          }
          renderItem={({item}) => (
            <IconWithAction
              source={
                item.image
                  ? {uri: item.image}
                  : require('../assets/flower-default.png')
              }
              action={() =>
                navigation.navigate('Edit Flower', {
                  potId: item.potId,
                  flower: item,
                })
              }
              text={item.name}
            />
          )}
        />
        <Title tag="h2">Magias</Title>
        <ScrollView horizontal style={{marginBlockStart: 8}}>
          {/* <NFCReader /> */}
          {/* <NFCWriter /> */}
          <IconWithAction
            source={require('../assets/eye.png')}
            action={() => navigation.navigate('Binnacle')}
            text="Bitácora de la bruja"
          />
        </ScrollView>
      </View>
      <ThemedText style={{textAlign: 'center', marginBlock: 3, fontSize: 11}}>
        Lots of love, Charlo
      </ThemedText>
      {/* <Button
        title="Hellfire"
        onPress={() => {
          database.execute('DROP TABLE flowers');
          database.execute('DROP TABLE pots');
          database.execute('DROP TABLE binnacles');
          createTables(database);
          setPots(potService.get());
        }}
      /> */}
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  view: {
    paddingInline: 16,
    marginBlockEnd: 'auto',
  },
  header: {
    paddingInline: 16,
    height: 150,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBlockEnd: 16,
  },
  list: {
    gap: 8,
  },
});
