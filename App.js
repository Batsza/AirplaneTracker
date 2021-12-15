import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './app/WelcomeScreen';
import InfoSreen from './app/InfoScreean';
import Camera from './app/CameraScrean';
import TestComponent from './app/TestComponent';

const Stack = createNativeStackNavigator();
export default function App() {
return (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={WelcomeScreen}
        options={{ title: 'Plane Tracker' }}
      />
      <Stack.Screen name="Informacje" component={InfoSreen} />
      <Stack.Screen name="Namierz samolot" component={Camera} />
      <Stack.Screen name="Test" component={TestComponent} />


    </Stack.Navigator>
  </NavigationContainer>
);
}

