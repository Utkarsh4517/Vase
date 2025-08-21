import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolate,
  withSequence,
  withRepeat,
} from 'react-native-reanimated';

const categories = [
  { emoji: '💰', text: 'Pay' },
  { emoji: '💎', text: 'Save' },
  { emoji: '📈', text: 'Invest' },
  { emoji: '💳', text: 'Spend' },
  { emoji: '💸', text: 'Earn' },
];

const AnimatedCyclingCategories: React.FC = () => {
  const scrollOffset = useSharedValue(0);
  const itemHeight = 50;
  const totalItems = categories.length;

  useEffect(() => {
    const createSteppedAnimation = () => {
      const animations = [];
      for (let i = 0; i < totalItems; i++) {
        animations.push(
          withTiming(i, { duration: 300 }),
          withTiming(i, { duration: 1000 })
        );
      }
      animations.push(
        withTiming(totalItems, { duration: 300 }),
        withTiming(totalItems, { duration: 100 })
      );
      
      return withSequence(...animations);
    };

    scrollOffset.value = withRepeat(
      createSteppedAnimation(),
      -1,
      false
    );
  }, []);

  const renderItem = (item: typeof categories[0], index: number) => {
    const animatedStyle = useAnimatedStyle(() => {
      const currentOffset = scrollOffset.value % totalItems;
      let itemPosition = index - currentOffset;
      if (itemPosition < -totalItems / 2) {
        itemPosition += totalItems;
      } else if (itemPosition > totalItems / 2) {
        itemPosition -= totalItems;
      }
      const distanceFromCenter = Math.abs(itemPosition);
      const translateY = -itemPosition * itemHeight;
      const opacity = interpolate(
        distanceFromCenter,
        [0, 1, 2],
        [1, 0.5, 0.1],
        'clamp'
      );
      const scale = interpolate(
        distanceFromCenter,
        [0, 1, 2],
        [1.3, 0.9, 0.7],
        'clamp'
      );
      return {
        opacity,
        transform: [
          { translateY },
          { scale }
        ],
      };
    });

    const emojiAnimatedStyle = useAnimatedStyle(() => {
      const currentOffset = scrollOffset.value % totalItems;
      let itemPosition = index - currentOffset;
      if (itemPosition < -totalItems / 2) {
        itemPosition += totalItems;
      } else if (itemPosition > totalItems / 2) {
        itemPosition -= totalItems;
      }
      const distanceFromCenter = Math.abs(itemPosition);
      const emojiOpacity = distanceFromCenter < 0.3 ? 1 : 0;
      
      return {
        opacity: emojiOpacity,
      };
    });

    const textAnimatedStyle = useAnimatedStyle(() => {
      const currentOffset = scrollOffset.value % totalItems;
      let itemPosition = index - currentOffset;
      if (itemPosition < -totalItems / 2) {
        itemPosition += totalItems;
      } else if (itemPosition > totalItems / 2) {
        itemPosition -= totalItems;
      }
      const distanceFromCenter = Math.abs(itemPosition);
      const translateX = distanceFromCenter < 0.3 ? 0 : -35;
      return {
        transform: [{ translateX }],
      };
    });

    return (
      <Animated.View
        key={index}
        style={[
          {
            position: 'absolute',
            flexDirection: 'row',
            alignItems: 'center',
            height: itemHeight,
            width: 120,
            justifyContent: 'center',
          },
          animatedStyle
        ]}
      >
        <Animated.Text 
          style={[
            { 
              fontSize: 20, 
              marginRight: 6,
            },
            emojiAnimatedStyle
          ]}
        >
          {item.emoji}
        </Animated.Text>
        <Animated.Text style={[
          { 
            fontSize: 18, 
            fontWeight: '700',
            color: '#000',
            textShadowColor: 'rgba(255,255,255,0.5)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
          },
          textAnimatedStyle
        ]}>
          {item.text}
        </Animated.Text>
      </Animated.View>
    );
  };

  return (
    <View style={{
      position: 'absolute',
      top: 80,
      left: 20,
      height: itemHeight * 3,
      width: 120,
      zIndex: 50,
      justifyContent: 'center',
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 10,
      paddingHorizontal: 8,
    }}>
      <View style={{
        position: 'absolute',
        top: itemHeight,
        left: 0,
        right: 0,
        height: itemHeight,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
      }} />
      
      <View style={{
        height: itemHeight * 3,
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}>
        {categories.map((item, index) => renderItem(item, index))}
      </View>
    </View>
  );
};

export default AnimatedCyclingCategories;