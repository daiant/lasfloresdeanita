/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableHighlight,
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
import { Flower, Flowers } from '../lib/flowers';

export const Theme = {
  dark: {
    base: '#24273a',
    text: '#cad3f5',
    border: '#363a4f',
    accent: '#c6a0f6',
  },
};

const potService = new Pots(database);
const flowerService = new Flowers(database);
export default function Home({ navigation }: { navigation: any }) {
  const [pots, setPots] = React.useState<Pot[]>([]);
  const [flowers, setFlowers] = React.useState<Flower[]>([]);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Theme.dark.base : Colors.lighter,
    flex: 1,
  };

  useFocusEffect(React.useCallback(() => {
    createTables(database);
    setPots(potService.get());
    setFlowers(flowerService.get());
  }, []));


  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        translucent backgroundColor="transparent"
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />
      <ImageBackground source={require('../assets/anita-wallpaper.webp')} style={styles.header}>
        <Text style={styles.title}>Las flores de Anita</Text>
      </ImageBackground>
      <View style={styles.view}>
        <Text style={styles.subtitle}>Tarros</Text>
        <FlatList
          data={pots}
          contentContainerStyle={{ gap: 8 }}
          horizontal
          ListFooterComponent={
            <IconWithAction center={!pots.length} source={require('../assets/zodiac.png')} text="Añade un tarro" action={() => navigation.navigate('New Pot')} />}
          renderItem={({ item }) => (
            <IconWithAction text={item.name} action={() => navigation.navigate('Pot', { potId: item.potId, name: item.name })} source={require('../assets/bottle.png')} />
          )}
        />
        <Text style={styles.subtitle}>Flores</Text>
        <FlatList
          data={flowers}
          contentContainerStyle={{ gap: 8 }}
          horizontal
          ListFooterComponent={
            <IconWithAction center={!flowers.length} source={require('../assets/flower.png')} text="Añade una flor" action={() => navigation.navigate('New Flower')} />}
          renderItem={({ item }) => (
            <IconWithAction source={{ uri: item.image }} action={() => navigation.navigate('Edit Flower', { potId: item.potId, flower: item })} text={item.name} />
          )}
        />
      </View>
      {/* <Button title="Hellfire" onPress={() => {
        database.execute('DELETE FROM flowers');
        database.execute('DELETE FROM pots');
        createTables(database);
        setPots(potService.get());
      }} /> */}
    </SafeAreaView>
  );
}

export function IconWithAction({ source, text, action, center }: { source: any, text: string, action: () => void, center?: boolean }) {
  return <View>
    <TouchableHighlight onPress={action} underlayColor={'transparent'}>
      <Image source={source} style={{ width: 64, height: 64, marginBlock: 8, marginInline: 'auto' }} resizeMode="contain" />
    </TouchableHighlight>
    <Text onPress={action} style={{ ...styles.text, fontSize: 15, textAlign: center ? 'center' : 'left', maxWidth: 125 }}>{text}</Text>
  </View>
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
  title: {
    fontWeight: '700',
    fontSize: 32,
    color: Theme.dark.text,
    marginBlockStart: 24,
    marginBlockEnd: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 500,
    color: Theme.dark.text,
    marginBlock: 4,
    borderBottomWidth: 2,
    borderBottomColor: Theme.dark.border,
  },
  text: {
    color: Theme.dark.text,
    fontSize: 18,
    lineHeight: 18,
  },
});
