/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import NfcManager, {Ndef, NfcTech} from 'react-native-nfc-manager';
import {Theme} from './styles/theme';
import Title from './title';
import Button from './button';
import ThemedText from './text';
import {Pot, Pots} from '../lib/pots';
import {database} from '../lib/db-service';
import RNPickerSelect from 'react-native-picker-select';

const potService = new Pots(database);
export default function NFCWriter() {
  const [modal, setModal] = React.useState(false);
  const [pots, setPots] = React.useState<Pot[]>([]);
  const [selectedPot, setSelectedPot] = React.useState<Pot | undefined>(
    undefined,
  );

  React.useEffect(() => {
    setPots(potService.get());
  }, []);

  function cancel() {
    NfcManager.cancelTechnologyRequest();
    setModal(false);
    setSelectedPot(undefined);
  }

  async function write() {
    console.log('me llamo???????????????????');
    if (modal) {
      return;
    }
    if (!selectedPot) {
      ToastAndroid.show('Elige primero un frasco.', ToastAndroid.BOTTOM);
    }

    try {
      setModal(true);
      await NfcManager.requestTechnology(NfcTech.Ndef);

      const bytes = Ndef.encodeMessage([
        Ndef.textRecord('pot:' + selectedPot!.potId),
      ]);

      if (bytes) {
        await NfcManager.ndefHandler // STEP 2
          .writeNdefMessage(bytes); // STEP 3
      }
      ToastAndroid.show('¡Etiqueta conjurada!', ToastAndroid.BOTTOM);
    } catch (ex) {
      console.warn(ex);
    } finally {
      // stop the nfc scanning
      cancel();
    }
  }

  return (
    <View>
      <TouchableOpacity onPress={write}>
        <Image source={require('../assets/feather.png')} style={styles.image} />
      </TouchableOpacity>
      <TouchableOpacity onPress={write} style={styles.text}>
        <Text style={styles.text}>Conjurar</Text>
      </TouchableOpacity>
      <Modal visible={modal} transparent={true} animationType="fade">
        <View style={styles.modal}>
          <Title tag="h2">Conjurando hechizos...</Title>
          <ThemedText
            style={{marginBlockStart: 8, marginInlineStart: 8, fontSize: 14}}>
            Elige el frasco que quieres etiquetar
          </ThemedText>
          <RNPickerSelect
            onValueChange={(e) => setSelectedPot(e)}
            items={pots.map((pot) => ({label: pot.name, value: pot.potId}))}
            value={selectedPot}
          />
          <View
            style={{
              opacity: 0.5,
              margin: 'auto',
              alignContent: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={require('../assets/feather.png')}
              style={{marginInline: 'auto'}}
            />
            <ThemedText
              style={{fontStyle: 'italic', textAlign: 'center', fontSize: 13}}>
              Acerca el móvil a una etiqueta NFC
            </ThemedText>
          </View>
          <Button
            action={cancel}
            title="Cancelar"
            style={{marginBlockStart: 'auto', marginInlineStart: 'auto'}}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 80,
    objectFit: 'contain',
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
