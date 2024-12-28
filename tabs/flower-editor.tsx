/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  FlatList,
  KeyboardTypeOptions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import {Controller, ControllerRenderProps, useForm} from 'react-hook-form';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Flower, FlowerRequest, Flowers} from '../lib/flowers';
import {database} from '../lib/db-service';
import {Pot, Pots} from '../lib/pots';
import {useFocusEffect} from '@react-navigation/native';
import {Theme} from '../components/styles/theme';
import ThemedText from '../components/text';
import Button from '../components/button';
import IconWithAction from '../components/icon-with-action';
import CameraComponent from '../components/camera';
import Title from '../components/title';

const flowerService = new Flowers(database);
const potService = new Pots(database);
export default function FlowerEditor({
  route,
  navigation,
}: {
  route: {params?: {flowerId: number | undefined; potId: number}};
  navigation: any;
}) {
  const [flower, setFlower] = React.useState<Flower | undefined>(undefined);
  const [pots, setPots] = React.useState<Pot[]>([]);
  const [isPotModal, setIsPotModal] = React.useState(false);
  const [selectedPots, setSelectedPots] = React.useState<Pot[]>(
    potService.getByFlowerId(flower?.flowerId),
  );
  const [loading, setLoading] = React.useState(false);
  const [cameraModal, setCameraModal] = React.useState(false);
  const [image, setImage] = React.useState(flower?.image ?? '');
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Theme.dark.base : Colors.lighter,
    flex: 1,
  };

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: {errors},
  } = useForm({
    defaultValues: {
      flowerId: flower?.flowerId,
      pots: selectedPots,
      name: flower?.name ?? '',
      latinName: flower?.latinName ?? '',
      description: flower?.description ?? '',
      floration: flower?.floration ?? '',
      germination: flower?.germination ?? '',
      image: flower?.image ?? '',
      quantity: flower?.quantity ?? 0,
    },
  });

  useFocusEffect(
    React.useCallback(() => {
      setPots(potService.get());
      setFlower(flowerService.getById(route.params?.flowerId));
    }, [route.params]),
  );

  React.useEffect(() => {
    reset({
      flowerId: flower?.flowerId,
      pots: selectedPots,
      name: flower?.name ?? '',
      latinName: flower?.latinName ?? '',
      description: flower?.description ?? '',
      floration: flower?.floration ?? '',
      germination: flower?.germination ?? '',
      image: flower?.image ?? '',
      quantity: flower?.quantity ?? 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flower, reset]);

  const onSubmit = async (flower: FlowerRequest) => {
    if (loading) {
      return;
    }
    if (!flowerService) {
      return;
    }

    setLoading(true);
    try {
      if (flower.flowerId) {
        await flowerService.update({...flower, pots: selectedPots});
      } else {
        await flowerService.create({...flower, pots: selectedPots});
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    navigation.goBack();
  };

  const size = {
    width: image ? 330 : 200,
    height: image ? 96 : 96,
  };

  function updateImage(uri: string) {
    setImage(uri);
    setValue('image', uri);
  }

  return (
    <View style={backgroundStyle}>
      <ScrollView style={styles.section}>
        <IconWithAction
          width={size.width}
          height={size.height}
          center
          source={
            image ? {uri: image} : require('../assets/flower-default.png')
          }
          text={'Subir foto de la flor'}
          action={() => setCameraModal(true)}
        />

        <CameraComponent
          open={cameraModal}
          setOpen={setCameraModal}
          setImage={updateImage}
        />

        <Controller
          rules={{required: true}}
          control={control}
          render={({field}) => <Input field={field} placeholder="Nombre" />}
          name="name"
        />
        {errors.name && <ThemedText>This is required.</ThemedText>}

        <Controller
          control={control}
          render={({field}) => (
            <Input field={field} placeholder="Nombre 100tifiko" />
          )}
          name="latinName"
        />
        {errors.latinName && <ThemedText>This is required.</ThemedText>}

        <Controller
          control={control}
          render={({field}) => (
            <Input field={field} placeholder="Descripción" />
          )}
          name="description"
        />
        {errors.description && <ThemedText>This is required.</ThemedText>}

        <Controller
          control={control}
          render={({field}) => <Input field={field} placeholder="Floración" />}
          name="floration"
        />
        {errors.floration && <ThemedText>This is required.</ThemedText>}

        <Controller
          control={control}
          render={({field}) => (
            <Input field={field} placeholder="Germinación" />
          )}
          name="germination"
        />
        {errors.germination && <ThemedText>This is required.</ThemedText>}

        <Text style={styles.label}>Frasco</Text>
        <FlatList
          horizontal
          data={selectedPots}
          contentContainerStyle={{gap: 8}}
          renderItem={({item}) => (
            <View>
              <IconWithAction
                text={item.name}
                action={() => {
                  navigation.navigate('Pot', {potId: item.potId});
                }}
                source={require('../assets/bottle.png')}
              />
              <Button
                variant="secondary"
                title="Borrar"
                action={() =>
                  setSelectedPots((prev) =>
                    prev.filter((p) => p.potId !== item.potId),
                  )
                }
              />
            </View>
          )}
          ListFooterComponent={
            <IconWithAction
              center={!pots.length}
              source={require('../assets/zodiac.png')}
              text="Añade un frasco"
              action={() => setIsPotModal(true)}
            />
          }
        />
        <PotModal
          pots={pots.filter(
            (p) => !selectedPots.find((sp) => sp.potId === p.potId),
          )}
          isOpen={isPotModal}
          setIsOpen={setIsPotModal}
          onPot={(pot) => {
            setSelectedPots((prev) => {
              const item = pots.find((p) => p.potId === pot);
              if (prev.find((p) => p.potId === pot)) {
                return prev;
              }
              if (!item) {
                return prev;
              }
              return prev.concat(item);
            });
            setIsPotModal(false);
          }}
        />

        <Controller
          control={control}
          render={({field}) => (
            <Input
              last
              keyboard="number-pad"
              field={field}
              placeholder="Cantidad de semillas"
            />
          )}
          name="quantity"
        />
        {errors.germination && <ThemedText>This is required.</ThemedText>}

        <Button
          action={handleSubmit(onSubmit)}
          title="Guardar floreta"
          disabled={loading}
        />

        {flower?.flowerId && (
          <View style={{marginBlockStart: 24}}>
            <Title tag="h3">Zona peligrosa</Title>
            <Button
              title="Borrar floreta :("
              variant="danger"
              action={() => {
                flowerService.delete(flower?.flowerId);
                navigation.navigate('Home');
              }}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

type PotModalProps = {
  pots: Pot[];
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onPot: (potId: Pot['potId']) => void;
};
export function PotModal({pots, isOpen, setIsOpen, onPot}: PotModalProps) {
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
          <Title tag="h2">Selecciona un frasco</Title>
        </View>
        <FlatList
          numColumns={4}
          data={pots}
          columnWrapperStyle={{gap: 8}}
          contentContainerStyle={{gap: 8}}
          ListEmptyComponent={
            <ThemedText style={{fontSize: 13, fontStyle: 'italic'}}>
              No hay frascos disponibles
            </ThemedText>
          }
          renderItem={({item}) => (
            <IconWithAction
              text={item.name}
              action={() => onPot(item.potId)}
              source={require('../assets/bottle.png')}
            />
          )}
        />
      </View>
    </Modal>
  );
}

export function Input({
  placeholder,
  field: {onBlur, onChange, value},
  keyboard,
  last,
}: {
  last?: boolean;
  field: ControllerRenderProps<any, any>;
  placeholder: string;
  keyboard?: KeyboardTypeOptions;
}) {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      onBlur={onBlur}
      onChangeText={onChange}
      value={value}
      keyboardType={keyboard}
      returnKeyType={last ? 'default' : 'next'}
      submitBehavior={last ? 'blurAndSubmit' : 'submit'}
    />
  );
}

const styles = StyleSheet.create({
  section: {
    paddingInline: 16,
    marginBlockEnd: 16,
  },
  label: {
    color: Theme.dark.text,
    fontSize: 14,
    marginInline: 6,
    marginBlockStart: 8,
  },
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
