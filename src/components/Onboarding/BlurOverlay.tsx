import React from 'react';
import Animated from 'react-native-reanimated';

interface BlurOverlayProps {
  animatedStyle: any;
}

export const BlurOverlay: React.FC<BlurOverlayProps> = ({ animatedStyle }) => {
  return (
    <Animated.View
      className="absolute inset-0 bg-white"
      style={[
        { zIndex: 40 },
        animatedStyle
      ]}
      pointerEvents="none"
    />
  );
};