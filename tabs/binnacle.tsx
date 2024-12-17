/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import Title from '../components/title';
import { FlatList, Text, TouchableHighlight, View, useColorScheme } from 'react-native';
import { FloatingAction } from 'react-native-floating-action';
import { Theme } from '../components/styles/theme';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Binnacle as BinnacleType, Binnacles } from '../lib/binnacle';
import { database } from '../lib/db-service';
import { useFocusEffect } from '@react-navigation/native';
import ThemedText from '../components/text';

const binnacleService = new Binnacles(database);
const intl = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long' });
export default function Binnacle({ navigation }: { navigation: any }) {
  const [binnacles, setBinnacles] = React.useState<BinnacleType[]>([]);

  useFocusEffect(React.useCallback(() => {
    setBinnacles(binnacleService.get());
  }, []));

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Theme.dark.base : Colors.lighter,
    flex: 1,
    paddingBlock: 8,
    paddingInline: 16,
  };
  return <View style={backgroundStyle}>
    <Title tag="h2">Bitácoras</Title>

    <FlatList data={binnacles} contentContainerStyle={{ gap: 16, paddingBlock: 8 }} renderItem={({ item }) => {
      const date = intl.format(dateFromUTC(item.createdAt, '-'));
      return <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, borderBottomColor: Theme.dark.border, borderBottomWidth: 2, paddingBlockEnd: 4 }}>
        <TouchableHighlight onPress={() => { navigation.navigate('Binnacle Detail', { id: item.binnacleId }); }}>
          <Text style={{ fontSize: 18 }}>{item.emoji}</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={() => { navigation.navigate('Binnacle Detail', { id: item.binnacleId }); }}>
          <ThemedText style={{ fontSize: 18, fontWeight: 600 }}>{date}</ThemedText>
        </TouchableHighlight>
        <TouchableHighlight style={{ marginInlineStart: 'auto' }} onPress={() => { navigation.navigate('Binnacle Detail', { id: item.binnacleId }); }}>
          <ThemedText >{'>'}</ThemedText>
        </TouchableHighlight>
      </View>;
    }} />

    <FloatingAction floatingIcon={require('../assets/eye.png')} color={Theme.dark.overlay} buttonSize={64} iconHeight={48} iconWidth={48} onPressMain={() => {
      // navigation.navigate('New Binnacle');
      binnacleService.create({ image: 'none', emoji: '😍', description: 'No kiero' })
    }} />
  </View>;
}

function dateFromUTC(dateAsString: any, ymdDelimiter: string) {
  var pattern = new RegExp('(\\d{4})' + ymdDelimiter + '(\\d{2})' + ymdDelimiter + '(\\d{2}) (\\d{2}):(\\d{2}):(\\d{2})');
  var parts = dateAsString.match(pattern);

  return new Date(Date.UTC(
    parseInt(parts[1], 10)
    , parseInt(parts[2], 10) - 1
    , parseInt(parts[3], 10)
    , parseInt(parts[4], 10)
    , parseInt(parts[5], 10)
    , parseInt(parts[6], 10)
    , 0
  ));
}