import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import GoogleSignIn from 'react-native-google-sign-in';
import AsyncStorage from '@react-native-community/async-storage';
import GDrive from 'react-native-google-drive-api-wrapper';

export default class SignIn extends Component {
  signIn = async () => {
    await GoogleSignIn.configure({
      clientID:
        '611971155839-1ddq09l5v2l7mm8pisbsdcd3iec925bl.apps.googleusercontent.com',
      scopes: [
        'openid',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/drive.metadata',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.appdata',
      ],
      shouldFetchBasicProfile: true,
    });

    GoogleSignIn.signInPromise().then(
      user => {
        console.log(user);
        let token = user.accessToken;
        console.log('user token', user.accessToken);
        this.storeOfflineData(token);
      },
      error => {
        console.log('signInPromise rejected', error);
        setTimeout(() => {
          alert(`signInPromise error: ${JSON.stringify(error)}`);
        }, 1000);
      },
    );
  };
  storeOfflineData = async token => {
    try {
      let offlineData = {
        token: token,
      };
      await AsyncStorage.setItem('offlineData', JSON.stringify(offlineData));
      console.log(token);
      GDrive.setAccessToken(token);
      const params = {
        files: {
          boundary: 'one_two', // The boundary string for multipart file uploads. Default: "foo_bar_baz".
        },
      };
      GDrive.init(params);
      GDrive.files
        .safeCreateFolder({
          name: 'CameraApp_Pictures',
          parents: ['root'],
        })
        .then(res => {
          console.log('createFolder success', res);
        })
        .catch(error => console.log('createFolder failure', error));
      this.props.navigation.replace('Camera', {token: token});
    } catch (error) {
      alert(error);
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.signIn} onPress={this.signIn}>
          <Image
            style={{height: 30, width: 30}}
            source={require('../assets/google.png')}
          />
          <Text style={styles.signInText}>Sign In with Google</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  signIn: {
    marginBottom: 100,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    width: '65%',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 3,
  },
  signInText: {
    fontSize: 18,
    color: '#777',
    fontWeight: 'bold',
  },
});
