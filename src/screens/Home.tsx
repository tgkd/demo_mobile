import { useNavigation } from '@react-navigation/native';
import { useStore } from 'effector-react';
import React, { useCallback, useEffect, useLayoutEffect } from 'react';
import { Button, Keyboard, StyleSheet, TextInput, View } from 'react-native';

import { CarsList } from '../components/CarsList';
import { AppNav } from '../navigation';
import {
  $cars,
  $paging,
  $searchFilter,
  pagingChanged,
  searchChanged,
  searchFx,
} from '../store/list';
import { Car } from '../types';

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

export function HomeScreen() {
  const navigation = useNavigation<AppNav>();
  const data = useStore($cars);
  const paging = useStore($paging);
  const search = useStore($searchFilter);
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
      title: 'Cars',
      statusBarHidden: false,
      headerRight: () => <Button onPress={showFiltersModal} title="Filters" />,
      headerSearchBarOptions: {
        inputType: 'text',
        onChangeText: ({ nativeEvent: { text } }) => searchChanged(text),
      },
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
      <TextInput
        underlineColorAndroid="transparent"
        placeholder="Search"
        onChangeText={searchChanged}
        value={search}
        style={styles.input}
      />
      <CarsList
        data={data}
        showLoader={loading}
        showPlaceholder={false}
        onSelect={onSelect}
        onEndReached={onEndReached}
        searchText={search}
      />
    </View>
  );
}
