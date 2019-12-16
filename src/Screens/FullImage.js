import React, {Component} from 'react';
import {StyleSheet, SafeAreaView, View, Image, Dimensions} from 'react-native';

export default class FullImage extends Component {
  render() {
    return (
      <SafeAreaView>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{uri: this.props.navigation.getParam('uri')}}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    width: width,
    height: height,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
  },
});
