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

export default class Gallery extends Component {
  state = {
    images: [],
  };
  componentDidMount = () => {
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
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Image
              style={{height: 25, width: 25}}
              source={require('../assets/back.png')}
            />
          </TouchableOpacity>
          <View>
            <TouchableOpacity>
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
