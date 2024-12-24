import React from 'react';
import {
  KeyboardTypeOptions,
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
import RNPickerSelect from 'react-native-picker-select';
import {Theme} from '../components/styles/theme';
import ThemedText from '../components/text';
import Button from '../components/button';
import IconWithAction from '../components/icon-with-action';
import CameraComponent from '../components/camera';

const flowerService = new Flowers(database);
const potService = new Pots(database);

export default function FlowerEditor({
  route,
  navigation,
}: {
  route: {params?: {flower: Flower | undefined; potId: number}};
  navigation: any;
}) {
  const [pots, setPots] = React.useState<Pot[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [cameraModal, setCameraModal] = React.useState(false);
  const [image, setImage] = React.useState(route.params?.flower?.image ?? '');
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Theme.dark.base : Colors.lighter,
    flex: 1,
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm({
    defaultValues: {
      flowerId: route.params?.flower?.flowerId,
      name: route.params?.flower?.name ?? '',
      latinName: route.params?.flower?.latinName ?? '',
      description: route.params?.flower?.description ?? '',
      floration: route.params?.flower?.floration ?? '',
      germination: route.params?.flower?.germination ?? '',
      potId: route.params?.flower?.potId ?? route.params?.potId,
      image: route.params?.flower?.image ?? '',
      quantity: route.params?.flower?.quantity ?? 0,
    },
  });

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
        flowerService.update(flower);
      } else {
        flowerService.create(flower);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    navigation.goBack();
  };

  useFocusEffect(
    React.useCallback(() => {
      setPots(potService.get());
    }, []),
  );

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
        <Controller
          name="potId"
          control={control}
          render={({field}) => (
            <RNPickerSelect
              onValueChange={(e) => field.onChange(e)}
              items={pots.map((pot) => ({label: pot.name, value: pot.potId}))}
              value={field.value}
              onClose={field.onBlur}
              placeholder={{label: 'Elige un frasco...'}}
            />
          )}
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

        {route.params?.flower?.flowerId && (
          <Button
            title="Borrar floreta :("
            variant="danger"
            action={() => {
              flowerService.delete(route.params?.flower?.flowerId);
              navigation.goBack();
            }}
          />
        )}
      </ScrollView>
    </View>
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
