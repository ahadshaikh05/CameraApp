import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';

const image = props => {
  return (
    <TouchableOpacity onPress={props.navigate}>
      <Image
        style={{width: 120, height: 120, margin: 5}}
        source={props.source}
      />
    </TouchableOpacity>
  );
};

export default image;
