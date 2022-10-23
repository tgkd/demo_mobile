import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { Car } from '../types';
import { CarListItem } from './CarListItem';
import { ListPlaceholder } from './ListPlaceholder';
import { LoadingView } from './LoadingView';
import { NotFoundView } from './NotFoundView';

const styles = StyleSheet.create({
  container: {
    paddingBottom: 48,
  },
  searchBarTip: {
    alignSelf: 'center',
    marginTop: 4,
    marginBottom: 16,
    color: '#ddd',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#ddd',
  },
});

interface Props {
  searchText: string;
  data: Array<Car>;
  onSelect: (data: Car) => void;
  onEndReached: () => void;
  showLoader: boolean;
  showPlaceholder: boolean;
}

export const CarsList = (props: Props) => {
  const { data, showLoader, showPlaceholder } = props;

  const renderSectionItem = ({ item }: { item: Car; index: number }) => (
    <CarListItem data={item} onPress={props.onSelect} />
  );

  const renderFooter = () => (showLoader ? <LoadingView /> : null);

  const renderEmptyList = () =>
    !showLoader && !showPlaceholder && !data.length ? <NotFoundView /> : null;

  if (props.showPlaceholder) {
    return <ListPlaceholder />;
  }

  return (
    <FlatList
      data={props.data}
      renderItem={renderSectionItem}
      keyExtractor={item => `${item.id}_${item.model}`}
      contentContainerStyle={styles.container}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmptyList}
      onEndReachedThreshold={0.5}
      onEndReached={props.onEndReached}
      maxToRenderPerBatch={20}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentInsetAdjustmentBehavior="automatic"
    />
  );
};
