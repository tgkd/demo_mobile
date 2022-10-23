import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { HomeScreen } from './screens/Home';
import { DetailsScreen } from './screens/Details';
import { Car } from './types';

export type RootStackParamList = {
  home: undefined;
  details: { car: Car };
};

export type AppNav = NativeStackNavigationProp<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Routes() {
  return (
    <Stack.Navigator initialRouteName="home">
      <Stack.Screen name="home" component={HomeScreen} />
      <Stack.Screen
        options={{ presentation: 'modal' }}
        name="details"
        component={DetailsScreen}
      />
    </Stack.Navigator>
  );
}
