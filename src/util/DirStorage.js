import {Platform} from 'react-native';
//const RNFS = require('react-native-fs');
import RNFS from 'react-native-fs';

export const dirHome = Platform.select({
  android: `${RNFS.ExternalStorageDirectoryPath}/CameraApp`,
});

export const dirPicutures = `${dirHome}/Pictures`;
