import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './app/WelcomeScreen';
import InfoSreen from './app/InfoScreean';
import Camera from './app/CameraScrean';

const Stack = createNativeStackNavigator();
export default function App() {
return (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={WelcomeScreen}
        options={{ title: 'Welcome' }}
      />
      <Stack.Screen name="info" component={InfoSreen} />
      <Stack.Screen name="Camera" component={Camera} />

    </Stack.Navigator>
  </NavigationContainer>
);
}

