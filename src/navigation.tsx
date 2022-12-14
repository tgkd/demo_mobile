import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import { HomeScreen } from './screens/Home';
import { DetailsScreen } from './screens/Details';
import { FiltersScreen } from './screens/Filters';
import { Car } from './types';

export type RootStackParamList = {
  home: undefined;
  details: { car: Car };
  filters: undefined;
};

export type AppNav = NativeStackNavigationProp<RootStackParamList>;

const Stack = createNativeStackNavigator<RootStackParamList>();

export function Routes() {
  return (
    <Stack.Navigator
      initialRouteName="home"
      screenOptions={{
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: '#fff',
        },
      }}>
      <Stack.Screen
        name="home"
        options={{ headerTitle: 'Cars', headerShadowVisible: false }}
        component={HomeScreen}
      />
      <Stack.Screen
        options={{ presentation: 'modal' }}
        name="details"
        component={DetailsScreen}
      />
      <Stack.Screen
        name="filters"
        component={FiltersScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
