import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

import { RootStackParamList } from '../navigation';

type RouteParams = RouteProp<RootStackParamList, 'details'>;

export function DetailsScreen() {
  const { params } = useRoute<RouteParams>();

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
