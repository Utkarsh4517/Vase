import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, Dimensions } from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolate,
  withSequence,
  withRepeat,
  withDelay,
  runOnJS
} from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';
import AnimatedCyclingCategories from '../components/Onboarding/AnimatedCyclingCategories';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const OnboardingScreen: React.FC = () => {
  const { completeOnboarding } = useAppContext();
  const gradientPosition = useSharedValue(0);
  
  const [gradientType, setGradientType] = useState<'blue' | 'orange' | 'purple'>('blue');
  const [step, setStep] = useState(0);
  
  const handleContinue = () => {
    console.log('animating');
    setStep(1)
    gradientPosition.value = withTiming(2, { 
      duration: 1500
    });
  };

  const cycleGradientColors = () => {
    setGradientType(current => {
      if (current === 'blue') return 'orange';
      if (current === 'orange') return 'purple';
      return 'blue';
    });
  };

  const animatedGradientStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      gradientPosition.value,
      [0, 1, 2],
      [screenHeight * 0.4, 0, -screenHeight * 0.7]
    );
    
    return {
      transform: [{ translateY }],
    };
  });

  const AnimatedSvg = Animated.createAnimatedComponent(Svg);

  const gradientColors = (() => {
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
  })();

  const getButtonText = () => {
    switch (gradientType) {
      case 'blue': return 'Orange Colors';
      case 'orange': return 'Purple Colors';
      case 'purple': return 'Blue Colors';
    }
  };

  return (
    <View className="flex-1 bg-white">
      <AnimatedSvg
        style={[
          {
            position: 'absolute',
            width: screenWidth * 8,
            height: screenWidth * 8,
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
      
      {step === 0 && <AnimatedCyclingCategories />}
      
      <View 
        className="absolute bottom-20 left-0 right-0 px-6 space-y-4"
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
