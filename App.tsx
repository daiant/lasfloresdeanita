import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Home from './tabs/home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Pot from './tabs/pot';
import FlowerEditor from './tabs/flower-editor';

const Stack = createNativeStackNavigator();
export const actions = [
  {
    text: 'Accessibility',
    // icon: require('./images/ic_accessibility_white.png'),
    name: 'bt_accessibility',
    position: 2,
  },
  {
    text: 'Language',
    // icon: require('./images/ic_language_white.png'),
    name: 'bt_language',
    position: 1,
  },
  {
    text: 'Location',
    // icon: require('./images/ic_room_white.png'),
    name: 'bt_room',
    position: 3,
  },
  {
    text: 'Video',
    // icon: require('./images/ic_videocam_white.png'),
    name: 'bt_videocam',
    position: 4,
  },
];

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Welcome' }}
        />
        <Stack.Screen name="Pot" component={Pot} />
        <Stack.Screen name="Add Flower" component={FlowerEditor} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
