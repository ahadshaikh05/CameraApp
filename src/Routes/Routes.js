import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import SplashScreen from '../Screens/SplashScreen';
import SignIn from '../Screens/SignIn';
import Camera from '../Screens/Camera';
import Gallery from '../Screens/Gallery';
import FullImage from '../Screens/FullImage';

const stackNavigator = createStackNavigator(
  {
    SplashScreen: SplashScreen,
    SignIn: SignIn,
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
