/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  View,
  useColorScheme,
} from 'react-native';
import {Flower, Flowers} from '../lib/flowers';
import {database} from '../lib/db-service';
import {useFocusEffect} from '@react-navigation/native';
import {Pot as PotType, Pots} from '../lib/pots';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Theme} from '../components/styles/theme';
import IconWithAction from '../components/icon-with-action';
import Title from '../components/title';
import ThemedText from '../components/text';
import Button from '../components/button';

const flowerService = new Flowers(database);
const potService = new Pots(database);

type Props = {
  navigation: any;
  route: {params: {potId: string; name: string}};
};
export default function Pot({navigation, route}: Props) {
  const [edit, setEdit] = React.useState(false);
  const [flowerModal, setFlowerModal] = React.useState(false);
  const [flowers, setFlowers] = React.useState<Flower[]>([]);
  const [loading, setLoading] = React.useState(true);
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
      setLoading(false);

      return () => {
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, [route.params.potId]),
  );
  if (!loading) {
    if (!pot) {
      navigation.goBack();
    } else {
      return (
        <SafeAreaView style={backgroundStyle}>
          {!edit && (
            <View style={styles.section}>
              <View
                style={{
                  flexDirection: 'row',
                  borderBottomColor: Theme.dark.border,
                  borderBottomWidth: 2,
                  paddingBlockEnd: 8,
                  marginBlockStart: 8,
                }}>
                <ThemedText
                  style={{
                    flex: 1,
                    fontWeight: 500,
                    fontSize: 22,
                    paddingBlock: 3,
                  }}>
                  {pot.name}
                </ThemedText>
                <TouchableHighlight onPress={() => setEdit(true)}>
                  <Image
                    source={require('../assets/feather.png')}
                    style={{
                      width: 24,
                      height: 24,
                    }}
                  />
                </TouchableHighlight>
              </View>
              {Boolean(pot.description) && (
                <ThemedText>{pot.description}</ThemedText>
              )}
            </View>
          )}
          {edit && (
            <PotEditor
              pot={pot}
              onClose={() => {
                setPot(potService.getById(pot.potId));
                setEdit(false);
              }}
            />
          )}
          <View style={{...styles.section, marginBlockStart: 16}}>
            <Title tag="h3">Flores</Title>
            <FlatList
              data={flowers}
              contentContainerStyle={styles.list}
              horizontal
              ListFooterComponent={
                <IconWithAction
                  center={!flowers.length}
                  source={require('../assets/flower.png')}
                  text="Añade más flores"
                  action={() => {
                    setFlowerModal(true);
                  }}
                />
              }
              renderItem={({item}) => (
                <View>
                  <IconWithAction
                    source={
                      item.image
                        ? {uri: item.image}
                        : require('../assets/flower-default.png')
                    }
                    action={() =>
                      navigation.navigate('Flower Detail', {
                        flowerId: item.flowerId,
                      })
                    }
                    text={item.name}
                  />

                  <Button
                    variant="secondary"
                    title="Borrar"
                    action={() => {
                      potService.deleteFlower(pot.potId, item.flowerId);
                      setFlowers(flowerService.getByPotId(route.params.potId));
                    }}
                  />
                </View>
              )}
            />
            <View style={styles.section}>
              <Title tag="h3">Zona peligrosa</Title>
              <Button
                title="Borrar tarrito :("
                variant="danger"
                action={() => {
                  potService.delete(route.params.potId);
                  navigation.goBack();
                }}
              />
            </View>
          </View>
          <FlowerModal
            flowers={flowerService
              .get()
              .filter(
                (flower) =>
                  !flowers.find((f) => f.flowerId === flower.flowerId),
              )}
            isOpen={flowerModal}
            setIsOpen={setFlowerModal}
            navigation={navigation}
            potId={route.params.potId as never}
            onFlower={(flowerId) => {
              potService.addFlower(pot.potId, flowerId);
              setFlowers(flowerService.getByPotId(route.params.potId));
              setPot(potService.getById(route.params.potId));
            }}
          />
        </SafeAreaView>
      );
    }
  }
}

type FlowerModalProps = {
  flowers: Flower[];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onFlower: (flowerId: Flower['flowerId']) => void;
  navigation: any;
  potId: PotType['potId'];
};
export function FlowerModal({
  flowers,
  isOpen,
  setIsOpen,
  onFlower,
  navigation,
  potId,
}: FlowerModalProps) {
  return (
    <Modal
      animationType="slide"
      visible={isOpen}
      onRequestClose={() => setIsOpen(false)}
      transparent={true}>
      <View
        style={{
          backgroundColor: Theme.dark.overlay,
          flex: 1,
          marginInline: 16,
          marginBlock: 32,
          borderColor: Theme.dark.border,
          borderWidth: 2,
          padding: 8,
          borderRadius: 4,
        }}>
        <View style={{marginBlock: 8}}>
          <Title tag="h2">Selecciona una flor</Title>
        </View>
        <FlatList
          numColumns={4}
          data={flowers}
          columnWrapperStyle={styles.list}
          contentContainerStyle={styles.list}
          ListFooterComponent={
            <IconWithAction
              center={!flowers.length}
              source={require('../assets/flower.png')}
              text="Añade una flor"
              action={() => {
                setIsOpen(false);
                navigation.navigate('New Flower', {
                  potId: potId,
                });
              }}
            />
          }
          renderItem={({item}) => (
            <IconWithAction
              source={
                item.image
                  ? {uri: item.image}
                  : require('../assets/flower-default.png')
              }
              action={() => {
                onFlower(item.flowerId);
                setIsOpen(false);
              }}
              text={item.name}
            />
          )}
        />
      </View>
    </Modal>
  );
}

function PotEditor({
  pot,
  onClose,
}: {
  pot: PotType | undefined;
  onClose: () => void;
}) {
  const [name, setName] = React.useState(pot?.name ?? '');
  const [description, setDescription] = React.useState(pot?.description ?? '');
  if (!pot) {
    return '';
  }

  return (
    <View>
      <TextInput
        value={name}
        placeholder="Nombre"
        onChangeText={(e) => setName(e)}
        style={styles.input}
      />
      <TextInput
        style={styles.input}
        placeholder={
          'Descripción.\nEjemplo: Bomba de semillas para sembrar los jardines del Túria.'
        }
        onChange={(e) => setDescription(e.nativeEvent.text)}
        value={description}
        multiline={true}
      />
      <Button
        title="Guardar"
        action={() => {
          potService.update(pot.potId, {name, description});
          onClose();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {gap: 8},
  section: {gap: 16},
  input: {
    borderWidth: 1,
    borderColor: Theme.dark.border,
    borderRadius: 4,
    marginBlock: 8,
    lineHeight: 24,
    color: Theme.dark.text,
    textAlignVertical: 'top',
  },
});
