import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Home, { Theme } from './tabs/home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Pot from './tabs/pot';
import FlowerEditor from './tabs/flower-editor';
import NewPot from './tabs/new-pot';
import { StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Pot" component={Pot as any} options={({ route }) => ({ ...headerOptions, title: (route.params as { name: string })?.name })} />
        <Stack.Screen name="New Pot" component={NewPot as any} options={{ ...headerOptions, title: 'Nuevo Tarro' }} />
        <Stack.Screen name="New Flower" component={FlowerEditor as any} options={headerOptions} />
        <Stack.Screen name="Edit Flower" component={FlowerEditor as any} options={headerOptions} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  header: {
    backgroundColor: Theme.dark.base,
  },
});
const headerOptions = { headerStyle: styles.header, headerTintColor: Theme.dark.text };

export default App;

