import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { ProgressIndicatorProps } from '../../types/auth.types';

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  onBack
}) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const showBackButton = currentStep > 0;

  return (
    <View className="px-6 pt-16 pb-8">
      <View className="flex-row items-center space-x-4">
        {showBackButton ? (
          <TouchableOpacity
            onPress={onBack}
            className="w-8 h-8 rounded-full bg-gray-200 items-center justify-center mr-4"
          >
            <Text className="text-black text-sm font-bold">←</Text>
          </TouchableOpacity>
        ) : (
          <View className="w-8 h-8" />
        )}
        
        <View className="flex-1 h-2 bg-gray-200 rounded-full">
          <View 
            className="h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${progress}%`,
              backgroundColor: '#303030'
            }}
          />
        </View>
      </View>
    </View>
  )}