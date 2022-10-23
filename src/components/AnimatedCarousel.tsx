import React, { useMemo } from 'react';
import { Dimensions, FlatListProps, Platform, ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

type ItemProps<T, P> = {
  item: T;
  index: number;
} & P;

interface Props<T, P> extends Omit<FlatListProps<T>, 'renderItem'> {
  ItemView: (props: ItemProps<T, P>) => JSX.Element;
  itemViewProps: P;
  itemViewStyle?: ViewStyle;
}

export function AnimatedCarousel<
  T extends { id: string | number },
  P extends object = {},
>({ ItemView, itemViewProps, itemViewStyle, ...props }: Props<T, P>) {
  const translationX = useSharedValue(0);
  const listRef = useAnimatedRef<Animated.FlatList<T>>();

  const scrollHandler = useAnimatedScrollHandler(event => {
    translationX.value = event.contentOffset.x;
  });

  const failedScrollHandler = ({ index }: { index: number }) => {
    new Promise(resolve => setTimeout(() => resolve(null), 500)).then(() => {
      listRef.current?.getNode()?.scrollToIndex({ index });
    });
  };

  const renderItem = (params: { item: T; index: number }) => {
    return (
      <AnimatedItemView
        index={params.index}
        itemWidth={props.snapToInterval}
        translationX={translationX}
        itemViewStyle={itemViewStyle}
        itemsLength={props.data?.length}>
        <ItemView {...params} {...itemViewProps} />
      </AnimatedItemView>
    );
  };

  return (
    <Animated.FlatList
      {...props}
      ref={listRef}
      data={props.data}
      renderItem={renderItem}
      keyExtractor={item => `${item.id}`}
      showsHorizontalScrollIndicator={false}
      bounces={false}
      horizontal
      decelerationRate={Platform.OS === 'ios' ? 0 : 0.98}
      renderToHardwareTextureAndroid
      snapToAlignment="start"
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      onScrollToIndexFailed={failedScrollHandler}
    />
  );
}

interface ItemViewProps {
  translationX: SharedValue<number>;
  children: JSX.Element;
  index: number;
  itemWidth?: number;
  itemViewStyle?: ViewStyle;
  itemsLength?: number;
}

function AnimatedItemView({
  translationX,
  children,
  index,
  itemWidth = Dimensions.get('window').width,
  itemViewStyle,
  itemsLength,
}: ItemViewProps) {
  const { inputRange, outputRange } = useMemo(() => {
    if (!itemsLength || itemsLength < 2) {
      return {
        inputRange: [
          (index - 1) * itemWidth,
          index * itemWidth,
          (index + 1) * itemWidth,
        ],
        outputRange: [0.9, 1, 0.9],
      };
    }
    return {
      inputRange: Array.from({ length: itemsLength }, (_, i) => i * itemWidth),
      outputRange: Array.from({ length: itemsLength }, (_, i) =>
        i === index ? 1 : 0.9,
      ),
    };
  }, [index, itemWidth, itemsLength]);

  const viewStyle = useAnimatedStyle(
    () => ({
      transform: [
        { scale: interpolate(translationX.value, inputRange, outputRange) },
      ],
    }),
    [translationX],
  );
  return (
    <Animated.View style={[itemViewStyle, viewStyle]}>{children}</Animated.View>
  );
}
