import React, {Component} from 'react';
import {StyleSheet, SafeAreaView, View, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import GDrive from 'react-native-google-drive-api-wrapper';

export default class SplashScreen extends Component {
  componentDidMount = async () => {
    try {
      let receivedData = await AsyncStorage.getItem('offlineData');
      let offlineData = JSON.parse(receivedData);
      let token = offlineData.token;
      if (token !== null) {
        GDrive.setAccessToken(token);
        GDrive.init();
        this.props.navigation.replace('Camera', {token: token});
      } else {
        this.props.navigation.replace('SignIn');
      }
    } catch (error) {
      this.props.navigation.replace('SignIn');
    }
  };
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#66c2ff" />
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
