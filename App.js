import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from './app/WelcomeScreen';
import InfoSreen from './app/InfoScreean';

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
      <Stack.Screen name="Profile" component={InfoSreen} />
    </Stack.Navigator>
  </NavigationContainer>
);
}

