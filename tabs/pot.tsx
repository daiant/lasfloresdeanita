import React from 'react';
import { Button, FlatList, SafeAreaView, StyleSheet, View, useColorScheme } from 'react-native';
import { Flower, Flowers } from '../lib/flowers';
import { database } from '../lib/db-service';
import { useFocusEffect } from '@react-navigation/native';
import { Pot as PotType, Pots } from '../lib/pots';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Theme } from '../components/styles/theme';
import IconWithAction from '../components/icon-with-action';
import Title from '../components/title';
import ThemedText from '../components/text';

const flowerService = new Flowers(database);
const potService = new Pots(database);

type Props = {
  navigation: any,
  route: { params: { potId: string, name: string } },
}
export default function Pot({ navigation, route }: Props) {
  const [flowers, setFlowers] = React.useState<Flower[]>([]);
  const [pot, setPot] = React.useState<PotType | undefined>(undefined);
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Theme.dark.base : Colors.lighter,
    flex: 1,
    paddingBlock: 8,
    paddingInline: 16,
  };

  useFocusEffect(
    React.useCallback(() => {
      setFlowers(flowerService.getByPotId(route.params.potId));
      setPot(potService.getById(route.params.potId));

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [route.params.potId]));

  return <SafeAreaView style={backgroundStyle}>
    <View style={styles.section}>
      {Boolean(pot?.description) && <ThemedText>{pot?.description}</ThemedText>}
      <Title tag="h2">Flores</Title>
      <FlatList
        data={flowers}
        contentContainerStyle={styles.list}
        horizontal
        ListFooterComponent={
          <IconWithAction center={!flowers.length} source={require('../assets/flower.png')} text="Añade una flor" action={() => navigation.navigate('New Flower', { potId: route.params.potId })} />}
        renderItem={({ item }) => (
          <IconWithAction source={item.image ? { uri: item.image } : require('../assets/flower-default.png')} action={() => navigation.navigate('Edit Flower', { potId: item.potId, flower: item })} text={item.name} />
        )}
      />
      <View style={styles.section}>
        <Title tag="h3">Zona peligrosa</Title>
        <Button title="Borrar tarrito :(" color={Theme.dark.red} onPress={() => { potService.delete(route.params.potId); navigation.goBack(); }} />
      </View>
    </View>
  </SafeAreaView >;
}


const styles = StyleSheet.create({
  list: { gap: 8 },
  section: { gap: 16 },
});
