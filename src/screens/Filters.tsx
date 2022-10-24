import { useNavigation } from '@react-navigation/native';
import { useStore } from 'effector-react';
import React, { useCallback, useLayoutEffect } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AnimatedButton } from '../components/Button';
import {
  fuelTypeChanged,
  $fuelTypeFilter,
  filtersReset,
} from '../store/filters';
import { CarFuel } from '../types';

const fuelTypesList: { label: string; value: CarFuel }[] = [
  { label: 'Gasoline', value: 'Gasoline' },
  { label: 'Diesel', value: 'Diesel' },
  { label: 'Electric', value: 'Electric' },
  { label: 'Hybrid', value: 'Hybrid' },
];

export function FiltersScreen() {
  const navigation = useNavigation();
  const fuelFilter = useStore($fuelTypeFilter);

  const closeModal = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const resetFilter = useCallback(() => {
    filtersReset();
    closeModal();
  }, [closeModal]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button onPress={resetFilter} title="Reset" />,
    });
  }, [navigation, resetFilter]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{'Fuel type'}</Text>
      <View style={styles.list}>
        {fuelTypesList.map(fuelType => (
          <AnimatedButton
            style={[
              styles.button,
              fuelFilter === fuelType.value && styles.active,
            ]}
            key={fuelType.value}
            onPress={() => fuelTypeChanged(fuelType.value)}>
            <Text
              style={[
                styles.btnLabel,
                fuelFilter === fuelType.value && styles.activeText,
              ]}>
              {fuelType.label}
            </Text>
          </AnimatedButton>
        ))}
      </View>
      <View style={styles.footerBtnView}>
        <AnimatedButton style={styles.footerBtn} onPress={closeModal}>
          <Text style={styles.activeText}>{'Apply'}</Text>
        </AnimatedButton>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  list: {
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
    paddingVertical: 20,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
    backgroundColor: '#ccc',
    marginRight: 8,
  },
  btnLabel: {
    color: '#000',
  },
  active: {
    backgroundColor: '#486bdf',
  },
  activeText: {
    color: '#fff',
  },
  title: {
    fontSize: 18,
  },
  footerBtnView: {
    marginTop: 'auto',
  },
  footerBtn: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#486bdf',
    borderRadius: 12,
  },
});
