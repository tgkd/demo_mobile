import React, { useCallback } from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface Props {
  children: React.ReactNode;
  onPress: () => void;
  style: StyleProp<ViewStyle>;
  disabled?: boolean;
}

const animationValues = {
  scale: {
    start: 1,
    end: 0.97,
  },
};

export const AnimatedButton = (props: Props) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(animationValues.scale.end);
  };

  const handlePressOut = () => {
    scale.value = withSpring(animationValues.scale.start);
  };

  const handlePress = useCallback(() => {
    requestAnimationFrame(() => {
      props.onPress();
    });
  }, [props]);

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: scale.value }],
    }),
    [scale],
  );

  return (
    <TouchableWithoutFeedback
      disabled={props.disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}>
      <Animated.View style={[styles.button, props.style, animatedStyle]}>
        {props.children}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
