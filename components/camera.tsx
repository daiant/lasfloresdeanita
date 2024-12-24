/* eslint-disable react-native/no-inline-styles */
import {
  PhotoIdentifier,
  CameraRoll,
} from '@react-native-camera-roll/camera-roll';
import React from 'react';
import {
  ToastAndroid,
  Modal,
  StyleSheet,
  FlatList,
  TouchableHighlight,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import {useCameraDevice, Camera} from 'react-native-vision-camera';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export default function CameraComponent({
  open,
  setOpen,
  setImage,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setImage: (uri: string) => void;
}) {
  const [loading, setLoading] = React.useState(false);
  const device = useCameraDevice('back');
  const camera = React.useRef<Camera>(null);
  const [media, setMedia] = React.useState<PhotoIdentifier[]>([]);

  React.useEffect(() => {
    async function fetchAssets() {
      const recentCameraRoll = await CameraRoll.getPhotos({first: 10});
      setMedia(recentCameraRoll.edges);
    }

    fetchAssets();
  }, []);

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
        <FlatList
          horizontal
          data={media}
          style={{
            position: 'absolute',
            display: 'flex',
            bottom: 0,
            right: 0,
            left: 0,
          }}
          contentContainerStyle={{gap: 4}}
          renderItem={({item}) => (
            <TouchableHighlight
              onPress={() => {
                if (loading) {
                  return;
                }
                setImage(item.node.image.uri);
                setOpen(false);
              }}>
              <Image
                source={{uri: item.node.image.uri}}
                height={64}
                width={64}
                style={{objectFit: 'cover'}}
              />
            </TouchableHighlight>
          )}
        />
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={takePhoto}
          style={{
            position: 'absolute',
            display: 'flex',
            bottom: 72,
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
