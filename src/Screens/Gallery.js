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
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-simple-toast';

export default class Gallery extends Component {
  state = {
    isConnected: null,
    images: [],
    token: this.props.navigation.getParam('token'),
    folderId: null,
  };
  componentDidMount = () => {
    NetInfo.fetch().then(state => {
      if (state.isConnected) {
        this.getFolderId();
      } else {
        this.setState({isConnected: false}, this.getPictures);
      }
    });
    this.netinfoUnsubscribe = NetInfo.addEventListener(
      this.handleConnectivityChange,
    );
  };

  handleConnectivityChange = connection => {
    console.log('iscon', connection.isConnected);
    this.setState({isConnected: connection.isConnected}, this.getPictures);
  };

  componentWillUnmount() {
    if (this.netinfoUnsubscribe) {
      this.netinfoUnsubscribe();
      this.netinfoUnsubscribe = null;
    }
  }

  getFolderId = async () => {
    try {
      let folderId = await GDrive.files.getId('CameraApp_Pictures', ['root']);
      this.setState({isConnected: true, folderId: folderId}, this.getPictures);
    } catch (error) {
      if (error.status == 401) {
        Alert.alert(
          'Token Expired',
          'Your access token has expired. Press OK to login again',
          [{text: 'OK', onPress: this.navigateToLogin}],
          {cancelable: false},
        );
      }
      console.log('guguygy', error);
    }
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
            if (this.state.isConnected) {
              for (let i = 0; i < res.length; i++) {
                images[i].uploaded = 'uploading';
              }
              this.setState({images: images});
              for (let i = 0; i < res.length; i++) {
                GDrive.files
                  .getId(images[i].name, [this.state.folderId], 'image/jpeg')
                  .then(res => {
                    if (res) {
                      console.log(res);
                      images[i].uploaded = 'yes';
                      this.setState({images: images});
                    } else {
                      images[i].uploaded = 'no';
                      this.setState({images: images});
                    }
                  })
                  .catch(err => {
                    images[i].uploaded = 'no';
                    console.log(err);
                  });
              }
            } else {
              for (let i = 0; i < res.length; i++) {
                images[i].uploaded = 'no';
              }
              this.setState({images: images});
            }
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
    if (!this.state.isConnected) {
      Toast.show('No Internet connection');
    } else {
      let images = [...this.state.images];
      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          if (images[i].uploaded === 'no') {
            images[i].uploaded = 'uploading';
            this.setState({images: images});
            RNFS.readFile('file://' + images[i].path, 'base64')
              .then(res => {
                this.upload(res, images[i].name, images, i);
              })
              .catch(error => console.log(error));
          }
        }
      }
    }
  };
  upload = (image, name, images, i) => {
    GDrive.files
      .createFileMultipart(
        image,
        'image/jpg',
        {
          parents: ['1bzY0cl1BVWQSSdo8feB7KqhsiG6sn5sG'],
          name: name,
        },
        true,
      )
      .then(res => {
        if (res.status == 200) {
          images[i].uploaded = 'yes';
          this.setState({images: images});
          console.log('upload success', res);
        } else if (res.status == 401) {
          console.log('upload fail', res);
          Alert.alert(
            'Token Expired',
            'Your access token has expired. Press OK to login again',
            [{text: 'OK', onPress: this.navigateToLogin}],
            {cancelable: false},
          );
        }
      })
      .catch(error => {
        images[i].uploaded = 'no';
        this.setState({images: images});
        console.log('upload error', error);
      });
  };
  navigateToLogin = () => {
    console.log(this.props.navigation);
    AsyncStorage.clear(() => this.props.navigation.navigate('SignIn'));
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
