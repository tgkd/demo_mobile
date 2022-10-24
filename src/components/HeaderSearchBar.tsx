import { useStore } from 'effector-react';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { $searchFilter, searchChanged } from '../store/filters';

export function SearchBar() {
  const value = useStore($searchFilter);

  const onChange = (val: string) => {
    searchChanged(val);
  };

  return (
    <View style={styles.headerSearchContainer}>
      <TextInput
        style={styles.searchBar}
        clearButtonMode="while-editing"
        onChangeText={onChange}
        value={value}
        placeholder="Search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerSearchContainer: {
    backgroundColor: '#fff',
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 20,
  },
  searchBar: {
    backgroundColor: '#f3f3f3',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});
