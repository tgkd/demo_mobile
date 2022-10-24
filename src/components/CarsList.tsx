import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useStore } from 'effector-react';

import { Car } from '../types';
import { CarListItem } from './CarListItem';
import { ListPlaceholder } from './ListPlaceholder';
import { LoadingView } from './LoadingView';
import { NotFoundView } from './NotFoundView';
import { $cars } from '../store/list';

interface Props {
  showLoader: boolean;
  showPlaceholder: boolean;
  refreshing: boolean;
  onSelect: (data: Car) => void;
  onEndReached: () => void;
  onRefresh: () => void;
}

export const CarsList = (props: Props) => {
  const data = useStore($cars);
  const { showLoader, showPlaceholder } = props;

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
      data={data}
      renderItem={renderSectionItem}
      keyExtractor={item => `${item.id}`}
      contentContainerStyle={styles.container}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmptyList}
      onEndReachedThreshold={0.5}
      onEndReached={props.onEndReached}
      maxToRenderPerBatch={16}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      contentInsetAdjustmentBehavior="automatic"
      refreshing={false}
      onRefresh={props.onRefresh}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 48,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#ddd',
  },
});
