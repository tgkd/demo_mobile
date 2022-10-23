import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Car } from '../types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

interface Props {
  data: Car;
  onPress: (data: Car) => void;
}

export function CarListItem(props: Props) {
  return (
    <View style={styles.container}>
      <Text>{props.data.id}</Text>
    </View>
  );
}
