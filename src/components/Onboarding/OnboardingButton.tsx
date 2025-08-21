import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { OnboardingButtonProps } from '../../types/onboarding.types';

export const OnboardingButton: React.FC<OnboardingButtonProps> = ({
  step,
  onContinue,
  onNext,
  onComplete
}) => {
  return (
    <View 
      className="absolute bottom-10 left-0 right-0 px-6 space-y-4"
      style={{ zIndex: 20 }}
    >
      {step === 0 && (
        <TouchableOpacity
          onPress={onContinue}
          className="bg-white rounded-full py-4 items-center shadow-lg"
        >
          <Text className="text-black font-semibold text-lg">Continue</Text>
        </TouchableOpacity>
      )}
      
      {(step === 1 || step === 2) && (
        <TouchableOpacity
          onPress={onNext}
          className="bg-black rounded-full py-4 items-center shadow-lg"
        >
          <Text className="text-white font-semibold text-lg">Next</Text>
        </TouchableOpacity>
      )}
      
      {step === 3 && (
        <TouchableOpacity
          onPress={onComplete}
          className="bg-black rounded-full py-4 items-center shadow-lg"
        >
          <Text className="text-white font-semibold text-lg">Get Started</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};