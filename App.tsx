import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Home from './tabs/home';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Pot from './tabs/pot';
import FlowerEditor from './tabs/flower-editor';
import NewPot from './tabs/new-pot';
import {StyleSheet} from 'react-native';
import {Theme} from './components/styles/theme';
import Binnacle from './tabs/binnacle';
import BinnacleEditor from './tabs/binnacle-editor';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Pot"
          component={Pot as any}
          options={({route}) => ({
            ...headerOptions,
            title: (route.params as {name: string})?.name,
          })}
        />
        <Stack.Screen
          name="New Pot"
          component={NewPot as any}
          options={{...headerOptions, title: 'Nuevo Frasco'}}
        />
        <Stack.Screen
          name="New Flower"
          component={FlowerEditor as any}
          options={headerOptions}
        />
        <Stack.Screen
          name="Edit Flower"
          component={FlowerEditor as any}
          options={headerOptions}
        />
        <Stack.Screen
          name="Binnacle"
          component={Binnacle}
          options={{...headerOptions, title: 'Bitácora de la bruja'}}
        />
        <Stack.Screen
          name="Binnacle Detail"
          component={BinnacleEditor}
          options={{...headerOptions, title: 'Bitácora'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  header: {
    backgroundColor: Theme.dark.base,
  },
});
const headerOptions = {
  headerStyle: styles.header,
  headerTintColor: Theme.dark.text,
};

export default App;
