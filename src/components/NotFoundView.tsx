import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

import { filtersReset } from '../store/filters';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    maxWidth: 120,
    alignSelf: 'center',
    marginTop: 16,
    color: '#000',
    fontSize: 18,
    textAlign: 'center',
  },
});

export const NotFoundView = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{'No results found'}</Text>
      <Button title={'Refresh'} onPress={() => filtersReset()} />
    </View>
  );
};
