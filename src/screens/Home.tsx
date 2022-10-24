import { useNavigation } from '@react-navigation/native';
import { useStore } from 'effector-react';
import React, { useCallback, useEffect, useLayoutEffect } from 'react';
import { Button, Keyboard, StyleSheet, View } from 'react-native';

import { CarsList } from '../components/CarsList';
import { SearchBar } from '../components/HeaderSearchBar';
import { AppNav } from '../navigation';
import {
  $paging,
  pagingChanged,
  pagingReset,
  searchFx,
} from '../store/filters';
import { Car } from '../types';

export function HomeScreen() {
  const navigation = useNavigation<AppNav>();
  const paging = useStore($paging);
  const loading = useStore(searchFx.pending);

  useEffect(() => {
    pagingChanged(paging);
  }, []);

  const showFiltersModal = useCallback(() => {
    Keyboard.dismiss();
    navigation.navigate('filters');
  }, [navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <Button onPress={showFiltersModal} title="Filters" />,
    });
  }, [navigation, showFiltersModal]);

  const onEndReached = () => {
    if (!loading && paging.nextPage) {
      pagingChanged({ ...paging, page: paging.nextPage });
    }
  };

  const onSelect = (car: Car) => {
    Keyboard.dismiss();
    navigation.navigate('details', { car });
  };

  return (
    <View style={styles.container}>
      <SearchBar />
      <CarsList
        showLoader={loading}
        showPlaceholder={false}
        onSelect={onSelect}
        onEndReached={onEndReached}
        refreshing={loading}
        onRefresh={pagingReset}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
    borderRadius: 8,
  },
});
