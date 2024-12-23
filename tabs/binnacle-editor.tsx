/* eslint-disable react-native/no-inline-styles */
import {useFocusEffect} from '@react-navigation/native';
import {Binnacle as BinnacleType, Binnacles, format} from '../lib/binnacle';
import {database} from '../lib/db-service';
import React from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import {Theme} from '../components/styles/theme';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import ThemedText from '../components/text';
import Button from '../components/button';

const binnacleService = new Binnacles(database);
export default function BinnacleEditor({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) {
  const [binnacle, setBinnacle] = React.useState<BinnacleType | undefined>(
    undefined,
  );
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Theme.dark.base : Colors.lighter,
    flex: 1,
    paddingBlock: 8,
    paddingInline: 16,
  };

  useFocusEffect(
    React.useCallback(() => {
      if (route.params.id) {
        setBinnacle(binnacleService.getById(route.params.id));
      }
    }, [route.params.id]),
  );

  return (
    <View style={backgroundStyle}>
      {binnacle && (
        <ScrollView>
          <>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                borderBottomColor: Theme.dark.border,
                borderBottomWidth: 2,
                paddingBlockEnd: 4,
                marginBlockEnd: 16,
              }}>
              <Text style={{flex: 0}}>{binnacle.emoji}</Text>
              <ThemedText style={{fontSize: 18, fontWeight: 600}}>
                {format(binnacle.createdAt as never)}
              </ThemedText>
            </View>
            <Image
              style={{
                marginInline: 'auto',
                marginBlock: 16,
                maxWidth: '80%',
                maxHeight: 300,
                aspectRatio: '9 / 16',
                objectFit: 'contain',
              }}
              source={
                binnacle.image
                  ? {uri: binnacle.image}
                  : require('../assets/eye.png')
              }
              height={300}
              width={500}
            />
            <ThemedText>{binnacle.description}</ThemedText>
          </>
        </ScrollView>
      )}
      {!binnacle && <Edit navigation={navigation} />}
    </View>
  );
}

function Edit({navigation}: {navigation: any}) {
  const [emoji, setEmoji] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [image, setImage] = React.useState('');

  function submit() {
    binnacleService.create({
      emoji,
      description,
      image,
    });

    navigation.goBack();
  }

  return (
    <ScrollView>
      <>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            borderBottomColor: Theme.dark.border,
            borderBottomWidth: 2,
            paddingBlockEnd: 4,
            marginBlockEnd: 16,
          }}>
          <TextInput style={{flex: 0}} />
        </View>
        {/* Camera */}
        <Image
          style={{
            marginInline: 'auto',
            marginBlock: 16,
            maxWidth: '80%',
            maxHeight: 300,
            aspectRatio: '9 / 16',
            objectFit: 'contain',
          }}
          // source={
          //   // binnacle.image
          //   //   ? {uri: binnacle.image}
          //   //   : require('../assets/eye.png')
          // }
          height={300}
          width={500}
        />
        {/* Description Area */}
        <ThemedText>{''}</ThemedText>
        <Button action={submit} title="Guardar en la bitácora" />
      </>
    </ScrollView>
  );
}
