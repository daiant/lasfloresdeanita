import React from 'react';
import { Button, FlatList, SafeAreaView, Text, useColorScheme } from 'react-native';
import { Flower, Flowers } from '../lib/flowers';
import { database } from '../lib/db-service';
import { useFocusEffect } from '@react-navigation/native';
import { Pots } from '../lib/pots';
import { IconWithAction, Theme, styles } from './home';
import { Colors } from 'react-native/Libraries/NewAppScreen';
const flowerService = new Flowers(database);
const potService = new Pots(database);

type Props = {
  navigation: any,
  route: { params: { potId: string, name: string } },
}
export default function Pot({ navigation, route }: Props) {
  const [flowers, setFlowers] = React.useState<Flower[]>([]);
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Theme.dark.base : Colors.lighter,
    flex: 1,
  };

  useFocusEffect(
    React.useCallback(() => {
      setFlowers(flowerService.getByPotId(route.params.potId));

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [route.params.potId]));

  return <SafeAreaView style={backgroundStyle}>
    <Text style={styles.text}>Estamos en {route.params.name}</Text>
    <Button title="Afegir floretes" onPress={() => navigation.navigate('Add Flower', { potId: route.params.potId })} />
    <Button title="Borrar tarrito :(" color="#fe0000" onPress={() => { potService.delete(route.params.potId); navigation.goBack(); }} />
    <Text style={styles.text}>Floretes</Text>
    <FlatList
      data={flowers}
      contentContainerStyle={{ gap: 8 }}
      horizontal
      ListFooterComponent={
        <IconWithAction center={!flowers.length} source={require('../assets/flower.png')} text="Añade una flor" action={() => navigation.navigate('New Flower', { potId: route.params.potId })} />}
      renderItem={({ item }) => (
        <IconWithAction source={{ uri: item.image }} action={() => navigation.navigate('Edit Flower', { potId: item.potId, flower: item })} text={item.name} />
      )}
    />
  </SafeAreaView >;
}

