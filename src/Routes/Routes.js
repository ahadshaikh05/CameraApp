import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import Camera from '../Screens/Camera';
import Gallery from '../Screens/Gallery';
import FullImage from '../Screens/FullImage';
import SignIn from '../Screens/SignIn';

const stackNavigator = createStackNavigator(
  {
    Camera: Camera,
    Gallery: Gallery,
    FullImage: FullImage,
  },
  {
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
);

export default createAppContainer(stackNavigator);
