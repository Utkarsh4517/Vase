import React from 'react';
import { Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';
import { GradientBackgroundProps, GradientColors, GradientType } from '../../types/onboarding.types';

const { width: screenWidth } = Dimensions.get('window');
const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const getGradientColors = (gradientType: GradientType): GradientColors => {
  switch (gradientType) {
    case 'orange':
      return {
        stop1: '#FFD700',
        stop2: '#FF8C00', 
        stop3: '#FF6347', 
        stop4: '#ffffff',
      };
    case 'purple':
      return {
        stop1: '#8A2BE2', 
        stop2: '#9370DB',
        stop3: '#DDA0DD',
        stop4: '#ffffff',
      };
    default:
      return {
        stop1: '#0000FF',
        stop2: '#4169E1',
        stop3: '#87CEEB',
        stop4: '#ffffff',
      };
  }
};

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  gradientType,
  animatedStyle
}) => {
  const gradientColors = getGradientColors(gradientType);

  return (
    <AnimatedSvg
      style={[
        {
          position: 'absolute',
          width: screenWidth * 8,
          height: screenWidth * 8,
          left: -screenWidth * 0.5,
          zIndex: 1,
        },
        animatedStyle
      ]}
      pointerEvents="none"
    >
      <Defs>
        <RadialGradient
          id="radialGradient"
          cx="50%"
          cy="50%"
          r="50%"
        >
          <Stop offset="0%" stopColor={gradientColors.stop1} stopOpacity="1" />
          <Stop offset="30%" stopColor={gradientColors.stop2} stopOpacity="1" />
          <Stop offset="60%" stopColor={gradientColors.stop3} stopOpacity="1" />
          <Stop offset="85%" stopColor={gradientColors.stop4} stopOpacity="0.8" />
          <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      
      <Ellipse
        cx={screenWidth}
        cy={screenWidth * 1.5}
        rx={screenWidth * 1.5}
        ry={screenWidth * 1.5}
        fill="url(#radialGradient)"
      />
    </AnimatedSvg>
  );
};