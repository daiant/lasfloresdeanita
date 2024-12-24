/* eslint-disable react-native/no-inline-styles */
import {useFocusEffect} from '@react-navigation/native';
import {Binnacle as BinnacleType, Binnacles, format} from '../lib/binnacle';
import {database} from '../lib/db-service';
import React from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableHighlight,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import {Theme} from '../components/styles/theme';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import ThemedText from '../components/text';
import Button from '../components/button';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import IconWithAction from '../components/icon-with-action';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';

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
      if (route.params?.id) {
        setBinnacle(binnacleService.getById(route.params.id));
      }
    }, [route.params?.id]),
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
                {binnacle.title}
              </ThemedText>
            </View>
            <ThemedText style={{fontSize: 14, fontWeight: 400}}>
              {format(binnacle.createdAt as never)}
            </ThemedText>
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

import EmojiPicker from 'rn-emoji-keyboard';
function Edit({navigation}: {navigation: any}) {
  const [modal, setModal] = React.useState(false);

  const [title, setTitle] = React.useState('');
  const [emojiKBOpen, setEmojiKBOpen] = React.useState<boolean>(false);
  const [emoji, setEmoji] = React.useState('🌼');
  const [description, setDescription] = React.useState('');
  const [image, setImage] = React.useState('');

  function submit() {
    binnacleService.create({
      title,
      emoji,
      description,
      image,
    });

    navigation.goBack();
  }

  return (
    <ScrollView>
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
        <TouchableHighlight onPress={() => setEmojiKBOpen(true)}>
          <Text>{emoji}</Text>
        </TouchableHighlight>
        <TextInput
          style={{width: '100%', fontSize: 22, color: Theme.dark.text}}
          placeholder="Título"
          value={title}
          onChangeText={(e) => setTitle(e)}
        />
      </View>
      <TextInput
        multiline
        style={{
          width: '100%',
          textAlignVertical: 'top',
          borderBottomColor: Theme.dark.border,
          borderBottomWidth: 2,
          color: Theme.dark.text,
        }}
        placeholder="¿Qué ha pasado hoy?"
        value={description}
        onChangeText={(e) => setDescription(e)}
      />{' '}
      <View style={{marginBlockEnd: 40}}>
        <IconWithAction
          height={300}
          width={image ? 300 : 100}
          center
          source={
            image ? {uri: image} : require('../assets/flower-default.png')
          }
          text={'Hacer una foto'}
          action={() => setModal(true)}
        />
      </View>
      <CameraComponent open={modal} setOpen={setModal} setImage={setImage} />
      {/* Description Area */}
      <ThemedText>{''}</ThemedText>
      <Button action={submit} title="Guardar en la bitácora" />
      <EmojiPicker
        onEmojiSelected={(data) => setEmoji(data.emoji)}
        open={emojiKBOpen}
        onClose={() => setEmojiKBOpen(false)}
      />
    </ScrollView>
  );
}

function CameraComponent({
  open,
  setOpen,
  setImage,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setImage: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [loading, setLoading] = React.useState(false);
  const device = useCameraDevice('back');
  const camera = React.useRef<Camera>(null);

  React.useEffect(() => {
    if (device) {
      Camera.requestCameraPermission()
        .then((result) => {
          console.log('requestCameraPermission: ', result);
        })
        .catch((err) => {
          console.log('requestCameraPermission Err: ', err);
        });
    }
  }, [device]);

  async function takePhoto() {
    if (loading) {
      return;
    }

    try {
      setLoading(true);
      const file = await camera.current?.takePhoto();
      if (!file) {
        ToastAndroid.show('Fuck no', ToastAndroid.BOTTOM);
        setLoading(false);
        return;
      }
      const asset = await CameraRoll.saveAsset(`file://${file.path}`, {
        type: 'photo',
      });
      console.log(asset.node.image.uri);
      setImage(asset.node.image.uri);
      setOpen(false);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  }

  if (device) {
    return (
      <Modal
        animationType="slide"
        onRequestClose={() => setOpen(false)}
        visible={open}>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive
          photo
          ref={camera}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={takePhoto}
          style={{
            position: 'absolute',
            display: 'flex',
            bottom: 64,
            right: 0,
            left: 0,
          }}>
          <Text
            style={{
              margin: 'auto',
              width: 64,
              height: 64,
              borderRadius: 64,
              backgroundColor: Colors.white,
            }}
          />
        </TouchableOpacity>
      </Modal>
    );
  }
}
