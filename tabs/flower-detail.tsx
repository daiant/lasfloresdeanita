/* eslint-disable react-native/no-inline-styles */
import {
  View,
  TouchableHighlight,
  Image,
  StyleSheet,
  ScrollView,
  useColorScheme,
  FlatList,
} from 'react-native';
import ThemedText from '../components/text';
import {Flower, Flowers} from '../lib/flowers';
import React from 'react';
import {Theme} from '../components/styles/theme';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {database} from '../lib/db-service';
import {Pots} from '../lib/pots';
import IconWithAction from '../components/icon-with-action';
import {useFocusEffect} from '@react-navigation/native';

type FlowerDetailProps = {
  route: {params?: {flowerId: number | undefined}};
  navigation: any;
};

const potService = new Pots(database);
const flowerService = new Flowers(database);
export default function FlowerDetail({route, navigation}: FlowerDetailProps) {
  const [flower, setFlower] = React.useState<Flower | undefined>(undefined);
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Theme.dark.base : Colors.lighter,
    flex: 1,
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log('ima callin');
      setFlower(flowerService.getById(route.params?.flowerId));
    }, [route.params]),
  );

  if (!flower) {
  } else {
    return (
      <View style={backgroundStyle}>
        <ScrollView style={{paddingInline: 16, marginBlockEnd: 16}}>
          <View
            style={{
              marginBlock: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <ThemedText style={{flex: 1, fontSize: 18, fontWeight: 600}}>
              {flower.name}
            </ThemedText>
            <TouchableHighlight
              onPress={() =>
                navigation.navigate('Edit Flower', {
                  flowerId: flower.flowerId,
                })
              }>
              <Image
                source={require('../assets/feather.png')}
                style={{
                  width: 24,
                  height: 24,
                }}
              />
            </TouchableHighlight>
          </View>
          {flower.image && (
            <Image
              source={{uri: flower.image}}
              width={'100%' as never}
              height={200}
            />
          )}
          <ThemedText style={detailStyles.label}>Nombre</ThemedText>
          <View style={{flexDirection: 'row', gap: 8}}>
            <ThemedText>{flower.name}</ThemedText>
            <ThemedText style={detailStyles.italic}>
              {flower.latinName}
            </ThemedText>
          </View>
          {flower.description && (
            <>
              <ThemedText style={detailStyles.label}>Descripción</ThemedText>
              <ThemedText>{flower.description}</ThemedText>
            </>
          )}

          <ThemedText style={detailStyles.label}>Floración</ThemedText>
          {Boolean(flower.floration) && (
            <ThemedText>{flower.floration}</ThemedText>
          )}
          {!flower.floration && (
            <ThemedText style={detailStyles.italic}>
              No hay información
            </ThemedText>
          )}

          <ThemedText style={detailStyles.label}>Germinación</ThemedText>
          {Boolean(flower.germination) && (
            <ThemedText>{flower.germination}</ThemedText>
          )}
          {!flower.germination && (
            <ThemedText style={detailStyles.italic}>
              No hay información
            </ThemedText>
          )}

          <ThemedText style={detailStyles.label}>
            Cantidad de semillas
          </ThemedText>
          <ThemedText>{flower.quantity || 0}</ThemedText>

          <ThemedText style={detailStyles.label}>Frascos</ThemedText>
          <FlatList
            horizontal
            data={potService.getByFlowerId(flower.flowerId)}
            contentContainerStyle={{gap: 8}}
            ListEmptyComponent={
              <ThemedText style={{fontSize: 13, fontStyle: 'italic'}}>
                En ningún frasco
              </ThemedText>
            }
            renderItem={({item}) => (
              <View>
                <IconWithAction
                  text={item.name}
                  action={() => {
                    navigation.navigate('Pot', {potId: item.potId});
                  }}
                  source={require('../assets/bottle.png')}
                />
              </View>
            )}
          />
        </ScrollView>
      </View>
    );
  }
}
const detailStyles = StyleSheet.create({
  label: {
    fontSize: 12,
    marginBlockStart: 12,
    marginBlockEnd: 0,
  },
  italic: {
    fontSize: 15,
    fontStyle: 'italic',
  },
});
