import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GetStartedScreen from '../screens/GetStartedScreen';
import Techgenius from '../screens/TechGenius';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="GetStarted">
        <Stack.Screen name="GetStarted" component={GetStartedScreen} options={{headerShown:false}} />
        <Stack.Screen name="Techgenius" component={Techgenius} options={{headerShown:false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;