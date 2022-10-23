import React, { useLayoutEffect, useMemo } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { AppNav, RootStackParamList } from '../navigation';
import { Media } from '../types';
import { AnimatedCarousel } from '../components/AnimatedCarousel';

const WIDTH = Dimensions.get('window').width;
const IMG_SIZE = WIDTH - 48;

type RouteParams = RouteProp<RootStackParamList, 'details'>;

export function DetailsScreen() {
  const navigation = useNavigation<AppNav>();
  const {
    params: { car },
  } = useRoute<RouteParams>();

  const descriptionRows = useMemo(
    () => [
      { title: 'Manufacturer', value: car.make },
      { title: 'Model', value: car.model },
      {
        title: 'Year',
        value: new Date(car.firstRegistration).getFullYear().toString(),
      },
      { title: 'Mileage', value: `${car.mileage} km` },
      { title: 'Fuel', value: car.fuel },
    ],
    [car],
  );

  const sellerRows = useMemo(
    () => [
      { title: 'Type', value: car.seller.type },
      { title: 'City', value: car.seller.city },
      { title: 'Phone', value: car.seller.phone },
    ],
    [car],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${car.make} ${car.model}`,
    });
  }, [navigation, car]);

  const renderImgItem = ({ item }: { item: Media }) => {
    return (
      <View style={styles.imgContainer}>
        <Image
          source={{ uri: item.url }}
          style={styles.img}
          resizeMode="contain"
        />
      </View>
    );
  };

  return (
    <ScrollView>
      <AnimatedCarousel<Media>
        data={car.images}
        ItemView={renderImgItem}
        itemViewProps={{}}
        snapToInterval={IMG_SIZE}
        contentContainerStyle={styles.carouselContainer}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.descText}>{car.description}</Text>
        <Text style={styles.groupTitle}>{'About'}</Text>
        {descriptionRows.map(row => (
          <View key={row.title} style={styles.row}>
            <Text style={styles.rowTitle}>{row.title}</Text>
            <Text style={styles.rowValue}>{row.value}</Text>
          </View>
        ))}
        <Text style={styles.groupTitle}>{'Seller'}</Text>
        {sellerRows.map(row => (
          <View key={row.title} style={styles.row}>
            <Text style={styles.rowTitle}>{row.title}</Text>
            <Text style={styles.rowValue}>{row.value}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  imgContainer: {
    height: IMG_SIZE,
    width: IMG_SIZE,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ddd',
    borderRadius: 12,
    overflow: 'hidden',
  },
  img: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end',
  },
  carouselContainer: {
    padding: 24,
  },
  infoContainer: {
    padding: 24,
  },
  descText: {
    fontSize: 16,
    marginBottom: 12,
  },
  groupTitle: {
    fontSize: 18,
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rowValue: {
    fontSize: 16,
  },
});
