import React from 'react';
import { Button, FlatList, Text, View } from 'react-native';
import { Flower, Flowers } from '../lib/flowers';
import { database } from '../lib/db-service';
import { useFocusEffect } from '@react-navigation/native';
import { Pots } from '../lib/pots';
const flowerService = new Flowers(database);
const potService = new Pots(database);

type Props = {
  navigation: any,
  route: { params: { potId: string, name: string } },
}
export default function Pot({ navigation, route }: Props) {
  const [flowers, setFlowers] = React.useState<Flower[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      setFlowers(flowerService.getByPotId(route.params.potId));

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [route.params.potId]));

  return <View>
    <Text>Estamos en {route.params.name}</Text>
    <Button title="Afegir floretes" onPress={() => navigation.navigate('Add Flower', { potId: route.params.potId })} />
    <Button title="Borrar tarrito :(" color="#fe0000" onPress={() => { potService.delete(route.params.potId); navigation.goBack(); }} />
    <Text>Floretes</Text>
    <FlatList data={flowers} renderItem={({ item }) => <Text onPress={() => navigation.navigate('Edit Flower', { flower: item })}>{item.name}</Text>} />
  </View >;
}
