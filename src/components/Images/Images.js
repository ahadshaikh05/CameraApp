import React from 'react';
import {StyleSheet, View, Text} from 'react-native';

import Image from './Image';

const Images = props => {
  let images = props.images;
  let sortedImages = [];
  for (let i = images.length; i > 0; i--) {
    let hourNumber = new Date(images[i - 1].mtime).getHours();
    let hourPresent = false;
    if (sortedImages.length == 0) {
      let hour = {
        id: hourNumber,
        time: `${hourNumber}:00 Hrs`,
        images: [images[i - 1].path],
      };
      sortedImages.push(hour);
    } else {
      sortedImages.map(element => {
        if (hourNumber == element.id) {
          element.images.push(images[i - 1].path);
          hourPresent = true;
        } else {
          hourPresent = false;
        }
      });
      if (hourPresent == false) {
        let hour = {
          id: hourNumber,
          time: `${hourNumber}:00 Hrs`,
          images: [images[i - 1].path],
        };
        sortedImages.push(hour);
      }
    }
  }
  return (
    <View>
      {sortedImages.map((hour, index) => {
        let hourImages = [...hour.images];
        return (
          <View style={{marginVertical: 10}} key={index}>
            <View style={{marginLeft: 5}}>
              <Text style={{color: '#555'}}>{hour.time}</Text>
            </View>
            <View style={styles.imagesContainer}>
              {hourImages.map((image, index) => {
                return (
                  <Image
                    navigate={() => props.navigate('file://' + image)}
                    key={index}
                    source={{uri: 'file://' + image}}
                  />
                );
              })}
            </View>
          </View>
        );
      })}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
export default Images;
