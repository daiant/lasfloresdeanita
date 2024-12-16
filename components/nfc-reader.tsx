import React from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { Theme } from './styles/theme';
import Title from './title';
import Button from './button';
import ThemedText from './text';

export default function NFCReader() {
  const [modal, setModal] = React.useState(false);

  function cancel() {
    NfcManager.cancelTechnologyRequest();
    setModal(false);
  }
  async function read() {
    if (modal) { return; }
    try {
      setModal(true);
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);
      // the resolved tag object will contain `ndefMessage` property
      const tag = await NfcManager.getTag();
      console.warn(tag?.ndefMessage);
    } catch (ex) {
      console.warn(ex);
    } finally {
      // stop the nfc scanning
      cancel();
    }
  }

  return (
    <View>
      <TouchableOpacity onPress={read} style={styles.text}>
        <Image source={require('../assets/read.png')} style={styles.image} />
      </TouchableOpacity>
      <TouchableOpacity onPress={read}>
        <Text style={styles.text}>Leer lo arcano</Text>
      </TouchableOpacity>
      <Modal visible={modal} transparent={true} animationType="fade">
        <View style={styles.modal}>
          <Title tag="h2">Leyendo lo arcano...</Title>
          <View style={{ opacity: 0.5, margin: 'auto', alignContent: 'center', justifyContent: 'center' }}>
            <Image source={require('../assets/read.png')} style={{ marginInline: 'auto' }} />
            <ThemedText style={{ fontStyle: 'italic', textAlign: 'center', fontSize: 13 }}>Acerca el móvil a una etiqueta NFC</ThemedText>
          </View>
          <Button action={cancel} title="Cancelar" style={{ marginBlockStart: 'auto', marginInlineStart: 'auto' }} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 80,
  },
  text: {
    marginInline: 'auto',
    color: Theme.dark.text,
    fontSize: 18,
    textAlign: 'center',
  },
  modal: {
    backgroundColor: Theme.dark.overlay,
    margin: 16,
    padding: 8,
    borderRadius: 4,
    maxHeight: '60%',
    marginBlock: 'auto',
    flex: 1,
  },
});
