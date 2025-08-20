import React from 'react';
import { Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolate,
  withSequence
} from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const OnboardingScreen: React.FC = () => {
  const { completeOnboarding } = useAppContext();
  const gradientPosition = useSharedValue(0);
  const handleContinue = () => {
    console.log('animating');
    gradientPosition.value = withSequence(
      withTiming(1, { duration: 750 }), // Fill screen
      withTiming(2, { duration: 750 })  // Move to top
    );
  };
  const animatedGradientStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      gradientPosition.value,
      [0, 1, 2],
      [screenHeight * 0.6, 0, -screenHeight * 0.7] // bottom -> full -> top
    );
    
    return {
      transform: [{ translateY }],
    };
  });

  const AnimatedSvg = Animated.createAnimatedComponent(Svg);

  return (
    <View className="flex-1 bg-white">
      <AnimatedSvg
        style={[
          {
            position: 'absolute',
            width: screenWidth * 2,
            height: screenWidth * 2,
            left: -screenWidth * 0.5,
            zIndex: 1,
          },
          animatedGradientStyle
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
            <Stop offset="0%" stopColor="#0000FF" stopOpacity="1" />
            <Stop offset="30%" stopColor="#4169E1" stopOpacity="1" />
            <Stop offset="60%" stopColor="#87CEEB" stopOpacity="1" />
            <Stop offset="85%" stopColor="#ffffff" stopOpacity="0.8" />
            <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        
        <Ellipse
          cx={screenWidth}
          cy={screenWidth}
          rx={screenWidth}
          ry={screenWidth}
          fill="url(#radialGradient)"
        />
      </AnimatedSvg>
      
      <View 
        className="absolute bottom-20 left-0 right-0 px-6"
        style={{ zIndex: 20 }}
      >
        <TouchableOpacity
          onPress={handleContinue}
          className="bg-white rounded-full py-4 items-center shadow-lg"
        >
          <Text className="text-black font-semibold text-lg">Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;
