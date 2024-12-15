import React from 'react';
import { Button, FlatList, Text, View } from 'react-native';
import { Flower, Flowers } from '../lib/flowers';
import { database } from '../lib/db-service';

type Props = {
  navigation: any,
  route: any,
}
export default function Pot({ navigation, route }: Props) {
  const [flowers, setFlowers] = React.useState<Flower[]>([]);
  const [flowerService, setflowerService] = React.useState<Flowers | undefined>();

  const callback = React.useCallback(async () => {
    setflowerService(new Flowers(database));
  }, []);

  const getFlowers = React.useCallback(() => {
    if (!flowerService) { return; }

    setFlowers(flowerService.getByPotId(route.params.pot.potId));
  }, [flowerService, route.params.pot.potId]);


  React.useEffect(() => {
    callback().then(() => getFlowers());
  }, [callback, getFlowers]);

  return <View>
    <Text>Estamos en {route.params.pot.name}</Text>
    <Button title="Afegir floretes" onPress={() => navigation.navigate('Add Flower', { potId: route.params.pot.potId })} />
    <Text>Floretes</Text>
    <FlatList data={flowers} renderItem={({ item }) => <Text>{item.name}</Text>} />
  </View >;
}
