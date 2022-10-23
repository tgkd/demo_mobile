import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';

import { Car } from '../types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    width: '100%',
    backgroundColor: '#fff',
  },
  imgContainer: {
    width: 60,
    height: 60,
    marginRight: 12,
    borderRadius: 8,
    backgroundColor: '#ddd',
    overflow: 'hidden',
  },
  img: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
  },
});

interface Props {
  data: Car;
  onPress: (data: Car) => void;
}

export function CarListItem(props: Props) {
  const { model, make, price, images } = props.data;
  const previewUrl = images[0];
  const formattedPrice = Intl.NumberFormat('en', {
    currency: 'EUR',
    style: 'currency',
  }).format(price);

  const onPresss = () => props.onPress(props.data);

  return (
    <TouchableOpacity onPress={onPresss}>
      <View style={styles.container}>
        <View style={styles.info}>
          <View style={styles.imgContainer}>
            <Image style={styles.img} source={{ uri: previewUrl }} />
          </View>
          <Text>{`${make} ${model}`}</Text>
        </View>
        <Text style={styles.price}>{formattedPrice}</Text>
      </View>
    </TouchableOpacity>
  );
}
