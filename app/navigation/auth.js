import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import SignIn from "@screens/SignIn";
import SignUp from "@screens/SignUp";
const Stack = createStackNavigator();

export default function Navigation() {
  return (
    <SafeAreaProvider>
      <NavigationContainer >
        <Stack.Navigator 
          screenOptions={{
            headerShown: false
          }}>
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="SignUp" component={SignUp} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  )
}

