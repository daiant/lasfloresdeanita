/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import Title from '../components/title';
import {
  FlatList,
  Image,
  Text,
  TouchableHighlight,
  View,
  useColorScheme,
} from 'react-native';
import {FloatingAction} from 'react-native-floating-action';
import {Theme} from '../components/styles/theme';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Binnacle as BinnacleType, Binnacles} from '../lib/binnacle';
import {database} from '../lib/db-service';
import {useFocusEffect} from '@react-navigation/native';
import ThemedText from '../components/text';

const binnacleService = new Binnacles(database);
export default function Binnacle({navigation}: {navigation: any}) {
  const [binnacles, setBinnacles] = React.useState<BinnacleType[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      setBinnacles(binnacleService.get());
    }, []),
  );

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Theme.dark.base : Colors.lighter,
    flex: 1,
    paddingBlock: 8,
    paddingInline: 16,
  };
  return (
    <View style={backgroundStyle}>
      <Title tag="h2">Bitácoras</Title>

      <FlatList
        data={binnacles}
        contentContainerStyle={{gap: 16, paddingBlock: 8}}
        renderItem={({item}) => {
          return (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                borderBottomColor: Theme.dark.border,
                borderBottomWidth: 2,
                paddingBlockEnd: 4,
              }}>
              <TouchableHighlight
                onPress={() => {
                  navigation.navigate('Binnacle Detail', {id: item.binnacleId});
                }}>
                <Text style={{fontSize: 18}}>{item.emoji}</Text>
              </TouchableHighlight>
              <TouchableHighlight
                onPress={() => {
                  navigation.navigate('Binnacle Detail', {id: item.binnacleId});
                }}>
                <ThemedText style={{fontSize: 18, fontWeight: 600}}>
                  {item.title}
                </ThemedText>
              </TouchableHighlight>
              <TouchableHighlight
                style={{marginInlineStart: 'auto'}}
                onPress={() => {
                  navigation.navigate('Binnacle Detail', {id: item.binnacleId});
                }}>
                <Image
                  style={{
                    height: 16,
                    width: 16,
                  }}
                  source={require('../assets/caret.png')}
                  height={32}
                  width={32}
                />
              </TouchableHighlight>
            </View>
          );
        }}
      />

      <FloatingAction
        floatingIcon={require('../assets/eye.png')}
        color={Theme.dark.overlay}
        buttonSize={64}
        iconHeight={48}
        iconWidth={48}
        overlayColor="rgba(0, 0, 0, 0)"
        showBackground={false}
        onPressMain={() => {
          navigation.navigate('Binnacle Detail');
        }}
      />
    </View>
  );
}
