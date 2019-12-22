import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  PermissionsAndroid,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {dirPicutures} from '../util/DirStorage';
import RNFS from 'react-native-fs';
import moment from 'moment';

export default class Camera extends Component {
  state = {
    currentImage: null,
    token: this.props.navigation.getParam('token'),
  };
  componentDidMount = () => {
    alert(this.state.token);
  };
  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('Gallery', {token: this.state.token})
          }
          style={styles.gallery}>
          <Image style={{flex: 1}} source={{uri: this.state.currentImage}} />
        </TouchableOpacity>
        <View
          style={{
            position: 'absolute',
            alignSelf: 'center',
            bottom: 10,
          }}>
          <TouchableOpacity
            onPress={this.takePicture.bind(this)}
            style={styles.capture}>
            <Image
              style={{
                height: 30,
                width: 30,
              }}
              source={require('../assets/camera.png')}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  takePicture = async () => {
    if (this.camera) {
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      this.setState({currentImage: 'file://' + data.uri});
      this.moveFileToDest(data.uri);
    }
  };
  moveFileToDest = async srcPath => {
    const newImageName = `${moment().format('DDMMYY_HHmmSSS')}.jpg`;
    const desPath = `${dirPicutures}/${newImageName}`;
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Permission to write external storage',
          message: 'Permission to write external storage ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Permission to read external storage',
          message: 'Permission to read external storage ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        RNFS.mkdir(dirPicutures)
          .then(() => {
            RNFS.moveFile(srcPath, desPath)
              .then(() => {
                console.log('FILE MOVED', srcPath, desPath);
              })
              .catch(error => {
                console.log('moveFile error', error);
              });
          })
          .catch(error => {
            console.log('mkdir error', error);
          });
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 15,
  },
  gallery: {
    position: 'absolute',
    bottom: 10,
    left: 25,
    width: 60,
    height: 60,
    borderRadius: 35,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 10,
  },
});
