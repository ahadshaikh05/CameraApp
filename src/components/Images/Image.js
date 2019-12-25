import React from 'react';
import {View, Image, TouchableOpacity, ActivityIndicator} from 'react-native';

const image = props => {
  let image = null;
  if (props.uploaded === 'no') {
    image = (
      <Image
        style={{
          height: 20,
          width: 20,
          position: 'absolute',
          left: 5,
          top: 5,
          zIndex: 10,
        }}
        source={require('../../assets/NotUploaded.png')}
      />
    );
  } else if (props.uploaded === 'uploading') {
    image = (
      <ActivityIndicator
        style={{
          height: 20,
          width: 20,
          position: 'absolute',
          left: 5,
          top: 5,
          zIndex: 10,
        }}
      />
    );
  } else if (props.uploaded === 'yes') {
    image = (
      <Image
        style={{
          height: 20,
          width: 20,
          position: 'absolute',
          left: 5,
          top: 5,
          zIndex: 10,
        }}
        source={require('../../assets/Uploaded.png')}
      />
    );
  }
  return (
    <TouchableOpacity onPress={props.navigate}>
      <View style={{width: 120, height: 120, margin: 5}}>
        {image}
        <Image
          style={{flex: 1, height: null, width: null}}
          source={props.source}
        />
      </View>
    </TouchableOpacity>
  );
};

export default image;
