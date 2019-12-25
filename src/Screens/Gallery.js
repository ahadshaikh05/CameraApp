import React, {Component} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {dirPicutures} from '../util/DirStorage';
import RNFS from 'react-native-fs';
import Images from '../components/Images/Images';

import GDrive from 'react-native-google-drive-api-wrapper';
import AsyncStorage from '@react-native-community/async-storage';

export default class Gallery extends Component {
  state = {
    images: [],
    token: this.props.navigation.getParam('token'),
  };
  componentDidMount = () => {
    //"/storage/emulated/0/CameraApp/Pictures/221219_1352754.jpg"

    //console.log(GDrive.isInitialized());

    // GDrive.files
    //   .safeCreateFolder({
    //     name: 'CameraApp_Pictures',
    //     parents: ['CameraApp_Pictures'],
    //   })
    //   .then(res => console.log('createFolder success', res))
    //   .catch(error => console.log('createFolder failure', error));
    this.getPictures();
  };
  getPictures = async () => {
    try {
      const granted = await PermissionsAndroid.request(
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
        RNFS.readDir(dirPicutures)
          .then(res => {
            let images = [...res];
            for (let i = 0; i < res.length; i++) {
              images[i].uploaded = 'no';
              // GDrive.files
              //   .getId(images[i].path, 'root', 'image/jpeg', false)
              //   .then(res => {
              //     if (res) {
              //       images[i].uploaded = 'yes';
              //     } else {
              //       images[i].uploaded = 'no';
              //     }
              //   })
              //   .catch(err => console.log(err));
            }
            console.log('gallery mages', images);
            this.setState({
              images: images,
            });
          })
          .catch(error => {
            console.log('error', error);
          });
      } else {
        console.log('permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  sync = () => {
    let images = [...this.state.images];
    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        images[i].uploaded = 'uploading';
        this.setState({images: images});
        RNFS.readFile('file://' + images[i].path, 'base64')
          .then(res => {
            this.upload(res, images[i].name, images, i);
          })
          .catch(error => console.log(error));
      }
    }
  };
  upload = (image, name, images, i) => {
    GDrive.files
      .createFileMultipart(
        image,
        'image/jpg',
        {
          parents: ['root'],
          name: name,
        },
        true,
      )
      .then(res => {
        if (res.status == 200) {
          images[i].uploaded = 'yes';
          this.setState({images: images}, console.log(this.state.images));
          console.log('upload success', res);
        } else {
          Alert.alert(
            'Token Expired',
            'Your access token has expired. Please press OK to login again',
            [{text: 'OK', onPress: () => this.navigateToLogin}],
            {cancelable: false},
          );
        }
      })
      .catch(error => {
        images[i].uploaded = 'no';
        this.setState({images: images}, console.log(this.state.images));
        console.log('upload error', error);
      });
  };
  navigateToLogin = () => {
    AsyncStorage.clear(() => this.props.navigation.navigate('SignIn'));
  };
  render() {
    console.log('state imag', this.state.images);
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image
                style={{height: 25, width: 25}}
                source={require('../assets/back.png')}
              />
            </TouchableOpacity>
            <View>
              <TouchableOpacity onPress={this.sync}>
                <Image
                  style={{height: 30, width: 30}}
                  source={require('../assets/sync.png')}
                />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView>
            <Images
              navigate={uri => {
                this.props.navigation.navigate('FullImage', {uri: uri});
              }}
              images={this.state.images}
            />
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}
const {width} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: width,
    height: 50,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
