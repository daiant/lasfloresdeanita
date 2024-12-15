import React from 'react';
import { Button, KeyboardTypeOptions, Text, TextInput, View } from 'react-native';
import { Controller, ControllerRenderProps, useForm } from 'react-hook-form';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { FlowerRequest, Flowers } from '../lib/flowers';
import { database } from '../lib/db-service';
const flowerService = new Flowers(database);

export default function FlowerEditor({ route, navigation }: { route: any, navigation: any }) {
  const [loading, setLoading] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      latinName: '',
      description: '',
      floration: '',
      germination: '',
      potId: route.params.potId,
      quantity: 0,
    },
  });

  const onSubmit = async (flower: FlowerRequest) => {
    if (loading) { return; }
    if (!flowerService) { return; }

    setLoading(true);
    flowerService.create(flower);
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

    <Button onPress={handleSubmit(onSubmit)} title="Guardar floreta" disabled={loading} />
  </View>;
}

function Input({ placeholder, field: { onBlur, onChange, value }, keyboard, last }: { last?: boolean, field: ControllerRenderProps<any, any>, placeholder: string, keyboard?: KeyboardTypeOptions }) {
  return <TextInput style={{ color: Colors.white }} placeholder={placeholder} onBlur={onBlur} onChangeText={onChange} value={value} keyboardType={keyboard} returnKeyType={last ? 'default' : 'next'} submitBehavior={last ? 'blurAndSubmit' : 'submit'} />;
}
