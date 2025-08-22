import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { AuthButtonProps } from '../../types/auth.types';

export const AuthButton: React.FC<AuthButtonProps> = ({
  step,
  onNext,
  onCreateWallet
}) => {
  const isLastStep = step === 4;

  return (
    <View className="absolute bottom-10 left-0 right-0 px-6">
      <TouchableOpacity
        onPress={isLastStep ? onCreateWallet : onNext}
        className="rounded-full py-4 items-center shadow-lg"
        style={{ backgroundColor: '#303030' }}
      >
        <Text className="text-white font-semibold text-lg">
          {isLastStep ? 'Create your Wallet' : 'Next'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
