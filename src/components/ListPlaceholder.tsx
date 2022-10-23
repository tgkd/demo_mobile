import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 48,
  },
  placeholderView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  placeholderIconView: {
    marginRight: 20,
  },
  placeholderContentView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeholderIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#ddd',
    borderRadius: 8,
  },
  placeholderTextBg: {
    width: 66,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#ddd',
  },
  placeholderTextSm: {
    width: 16,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#ddd',
  },
});

const PLACEHOLDER_ITEMS = new Array(8).fill({});

export function ListPlaceholder() {
  return (
    <FlatList
      data={PLACEHOLDER_ITEMS}
      keyExtractor={(_, idx) => idx.toString()}
      renderItem={() => (
        <View style={styles.placeholderView}>
          <View style={styles.placeholderContentView}>
            <View style={styles.placeholderIconView}>
              <View style={styles.placeholderIcon} />
            </View>
            <View style={styles.placeholderTextBg} />
          </View>
          <View style={styles.placeholderTextSm} />
        </View>
      )}
      contentContainerStyle={styles.container}
    />
  );
}
