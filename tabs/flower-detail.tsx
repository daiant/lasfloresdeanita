/* eslint-disable react-native/no-inline-styles */
import {
  View,
  TouchableHighlight,
  Image,
  StyleSheet,
  ScrollView,
  useColorScheme,
} from 'react-native';
import ThemedText from '../components/text';
import {Flower} from '../lib/flowers';
import React from 'react';
import {Theme} from '../components/styles/theme';
import {Colors} from 'react-native/Libraries/NewAppScreen';

type FlowerDetailProps = {
  route: {params?: {flower: Flower | undefined; potId: number}};
  navigation: any;
};

export default function FlowerDetail({route, navigation}: FlowerDetailProps) {
  const flower = route.params?.flower;
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Theme.dark.base : Colors.lighter,
    flex: 1,
  };
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
                  potId: route.params?.potId,
                  flower: flower,
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
          <Image
            source={{uri: flower.image}}
            width={'100%' as never}
            height={200}
          />

          <ThemedText style={detailStyles.label}>Nombre</ThemedText>
          <View style={{flexDirection: 'row', gap: 8}}>
            <ThemedText>{flower.name}</ThemedText>
            <ThemedText style={detailStyles.italic}>
              {flower.latinName}
            </ThemedText>
          </View>
          {flower.description && <ThemedText>{flower.description}</ThemedText>}

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
        </ScrollView>{' '}
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
