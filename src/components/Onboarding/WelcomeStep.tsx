import React from 'react';
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { VaseWhiteLogo } from '../CustomSvgs';
import { WelcomeStepProps } from '../../types/onboarding.types';

export const WelcomeStep: React.FC<WelcomeStepProps> = ({
  isVisible,
  animatedStyle
}) => {
  if (!isVisible) return null;

  return (
    <>
      <Animated.View 
        className="absolute top-60 left-10 right-0"
        style={[{ zIndex: 30 }, animatedStyle]}
      >
        <Text className="text-[#303030] font-bold text-4xl mt-3 ml-1">
          Vase
        </Text>
        <Text className="text-[#666666] font-bold text-xl mt-0.5 ml-1">
          The Crypto Piggy
        </Text>
      </Animated.View>

      <Animated.View 
        className="absolute bottom-40 left-10 right-0"
        style={[{ zIndex: 30 }, animatedStyle]}
      >
        <View className="rounded-4xl overflow-hidden">
          <VaseWhiteLogo width={60} height={60} />
        </View>
        <Text className="text-[#fff] font-semibold mt-4 text-4xl ml-1">
          Save crypto,{"\n"}regularly
        </Text>
        <Text className="text-[#fff] opacity-70 font-regular mt-4 text-lg ml-1" style={{ lineHeight: 15 }}>
          Choose when to unlock{"\n"}
          your savings and reach your targets!
        </Text>
      </Animated.View>
    </>
  );
};