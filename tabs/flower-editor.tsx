import React from 'react';
import { Button, Image, KeyboardTypeOptions, Text, TextInput, View } from 'react-native';
import { Controller, ControllerRenderProps, useForm } from 'react-hook-form';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Flower, FlowerRequest, Flowers } from '../lib/flowers';
import { database } from '../lib/db-service';
import DocumentPicker from 'react-native-document-picker';

const flowerService = new Flowers(database);

export default function FlowerEditor({ route, navigation }: { route: { params: { flower: Flower | undefined, potId: number } }, navigation: any }) {
  const [loading, setLoading] = React.useState(false);
  const [image, setImage] = React.useState(route.params.flower?.image ?? '');

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      flowerId: route.params.flower?.flowerId,
      name: route.params.flower?.name ?? '',
      latinName: route.params.flower?.latinName ?? '',
      description: route.params.flower?.description ?? '',
      floration: route.params.flower?.floration ?? '',
      germination: route.params.flower?.germination ?? '',
      potId: route.params.flower?.potId ?? route.params.potId,
      image: route.params.flower?.image ?? '',
      quantity: route.params.flower?.quantity ?? 0,
    },
  });

  const onSubmit = async (flower: FlowerRequest) => {
    if (loading) { return; }
    if (!flowerService) { return; }

    setLoading(true);
    try {
      if (flower.flowerId) { flowerService.update(flower); }
      else { flowerService.create(flower); }
    } catch (error) {
      console.log(error)
    }
    setLoading(false);
    navigation.goBack();
  };

  return <View style={{ backgroundColor: Colors.darker }}>
    <Controller control={control} render={({ field }) => (<Input field={field} placeholder="Nombre" />)} name="name" />
    {errors.name && <Text>This is required.</Text>}

    <Controller control={control} render={({ field }) => (<Input field={field} placeholder="Nombre 100tifiko" />)} name="latinName" />
    {errors.latinName && <Text>This is required.</Text>}

    <Controller control={control} render={({ field }) => (<Input field={field} placeholder="Descripción" />)} name="description" />
    {errors.description && <Text>This is required.</Text>}

    <Controller control={control} render={({ field }) => (<Input field={field} placeholder="Floración" />)} name="floration" />
    {errors.floration && <Text>This is required.</Text>}

    <Controller control={control} render={({ field }) => (<Input field={field} placeholder="Germinación" />)} name="germination" />
    {errors.germination && <Text>This is required.</Text>}

    <Controller control={control} render={({ field }) => (<Input last keyboard="number-pad" field={field} placeholder="Cantidad de semillas" />)} name="quantity" />
    {errors.germination && <Text>This is required.</Text>}

    <Button title="Subir ficheros" onPress={() => {
      // TODO: Check if cache is better than document;
      DocumentPicker.pickSingle({ copyTo: 'cachesDirectory' }).then(data => {
        setImage(data.fileCopyUri ?? '');
        setValue('image', data.fileCopyUri ?? '');
      }).catch(e => { console.log(e); });
    }} />
    {image && <Image source={{ uri: image }} height={300} width={300} />}



    <Button onPress={handleSubmit(onSubmit)} title="Guardar floreta" disabled={loading} />
    {route.params.flower?.flowerId && <Button title="Borrar floreta :(" color="#fe0000" onPress={() => { flowerService.delete(route.params.flower?.flowerId); navigation.goBack(); }} />}
  </View>;
}

function Input({ placeholder, field: { onBlur, onChange, value }, keyboard, last }: { last?: boolean, field: ControllerRenderProps<any, any>, placeholder: string, keyboard?: KeyboardTypeOptions }) {
  return <TextInput style={{ color: Colors.white }} placeholder={placeholder} onBlur={onBlur} onChangeText={onChange} value={value} keyboardType={keyboard} returnKeyType={last ? 'default' : 'next'} submitBehavior={last ? 'blurAndSubmit' : 'submit'} />;
}
