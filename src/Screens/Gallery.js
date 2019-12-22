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
} from 'react-native';
import {dirPicutures} from '../util/DirStorage';
import RNFS from 'react-native-fs';
import Images from '../components/Images/Images';

import GDrive from 'react-native-google-drive-api-wrapper';

export default class Gallery extends Component {
  state = {
    images: [],
    token: this.props.navigation.getParam('token'),
  };
  componentDidMount = () => {
    console.log(GDrive.isInitialized());
    GDrive.files
      .safeCreateFolder({
        name: 'CameraApp Pictures',
        parents: ['root'],
      })
      .then(res => console.log('createFolder success', res))
      .catch(error => console.log('createFolder failure', error));
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
            console.log(res);
            this.setState({
              images: res,
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
    let images = this.state.images;
    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        RNFS.readFile('file://' + images[i].path, 'base64')
          .then(res => {
            this.upload(res, images[i].name);
          })
          .catch(error => console.log(error));
      }
    }
  };
  upload = (image, name) => {
    GDrive.files
      .createFileMultipart(
        image,
        "'image/jpg'",
        {
          parents: ['root'],
          name: name,
        },
        true,
      )
      .then(res => {
        console.log('upload success', res);
      })
      .catch(error => console.log('upload error', error));
  };
  render() {
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
