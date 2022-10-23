import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const LoadingView = () => (
  <View style={styles.container}>
    <ActivityIndicator animating color="#000" />
  </View>
);
