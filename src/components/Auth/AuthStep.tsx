import React from 'react';
import { View, Text } from 'react-native';
import { AuthStepProps } from '../../types/auth.types';

export const AuthStep: React.FC<AuthStepProps> = ({ step, isVisible }) => {
  if (!isVisible) return null;

  const getStepContent = () => {
    switch (step) {
      case 0:
        return {
          title: 'Welcome to Vase',
          description: 'Your secure digital wallet for managing cryptocurrencies and digital assets.'
        };
      case 1:
        return {
          title: 'Secure & Private',
          description: 'Your private keys are stored securely on your device. We never have access to your funds.'
        };
      case 2:
        return {
          title: 'Multi-Currency Support',
          description: 'Store and manage multiple cryptocurrencies in one convenient location.'
        };
      case 3:
        return {
          title: 'Easy Transactions',
          description: 'Send and receive digital assets with just a few taps.'
        };
      case 4:
        return {
          title: 'Ready to Get Started?',
          description: 'Create your wallet to begin your journey into digital finance.'
        };
      default:
        return { title: '', description: '' };
    }
  };

  const { title, description } = getStepContent();

  return (
    <View className="flex-1 justify-center px-6">
      <View className="items-center">
        <Text className="text-3xl font-bold text-gray-900 text-center mb-6">
          {title}
        </Text>
        <Text className="text-lg text-gray-600 text-center leading-6">
          {description}
        </Text>
      </View>
    </View>
  );
};
