import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { FeatureStepProps } from '../../types/onboarding.types';

const features = {
  1: {
    title: 'Daily Deposits',
    description: 'Add a set amount of crypto daily with automatic conversion.\nWatch your savings grow automatically, and never miss a day of building your future.',
    others: [
      { title: 'Smart Locks', step: 2, gradient: 'orange' as const, size: 'text-2xl' },
      { title: 'Reach Goals', step: 3, gradient: 'purple' as const, size: 'text-xl' }
    ]
  },
  2: {
    title: 'Smart Locks',
    description: 'Set custom unlock conditions for your savings.\nTime-based locks, goal amounts, or special dates - you decide when to access your crypto.',
    others: [
      { title: 'Daily Deposits', step: 1, gradient: 'blue' as const, size: 'text-2xl' },
      { title: 'Reach Goals', step: 3, gradient: 'purple' as const, size: 'text-2xl' }
    ]
  },
  3: {
    title: 'Reach Goals',
    description: 'Track your progress and celebrate milestones.\nSet savings targets, monitor growth, and unlock achievements as you build your crypto wealth.',
    others: [
      { title: 'Daily Deposits', step: 1, gradient: 'blue' as const, size: 'text-xl' },
      { title: 'Smart Locks', step: 2, gradient: 'orange' as const, size: 'text-2xl' }
    ]
  }
};

export const FeatureStep: React.FC<FeatureStepProps> = ({
  step,
  currentStep,
  animatedStyle,
  onNavigateToStep
}) => {
  if (currentStep !== step || step === 0) return null;

  const feature = features[step];

  return (
    <Animated.View 
      className="absolute bottom-36 left-10 right-0" 
      style={[{ zIndex: 30 }, animatedStyle]}
    >
      <View className="gap-y-4">
        <View className="flex-row items-start">
          <View className="flex-1">
            {step === 2 && (
              <TouchableOpacity 
                onPress={() => onNavigateToStep(1, 'blue')}
                className="mb-4"
              >
                <Text className="text-[#aeaeae] font-bold text-2xl">
                  Daily Deposits
                </Text>
              </TouchableOpacity>
            )}
            
            {step === 3 && (
              <>
                <TouchableOpacity 
                  onPress={() => onNavigateToStep(1, 'blue')}
                  className="mb-2"
                >
                  <Text className="text-[#aeaeae] font-bold text-xl">
                    Daily Deposits
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => onNavigateToStep(2, 'orange')}
                  className="mb-4"
                >
                  <Text className="text-[#aeaeae] font-bold text-2xl">
                    Smart Locks
                  </Text>
                </TouchableOpacity>
              </>
            )}
            
            <Text className="text-[#303030] font-bold text-4xl mb-4">
              {feature.title}
            </Text>
            <Text className="text-[#8a8a8a] max-w-[75%] text-sm" style={{ lineHeight: 18 }}>
              {feature.description}
            </Text>
            {step === 1 && (
              <>
                <TouchableOpacity 
                  onPress={() => onNavigateToStep(2, 'orange')}
                  className="mt-4"
                >
                  <Text className="text-[#aeaeae] font-bold text-2xl">
                    Smart Locks
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => onNavigateToStep(3, 'purple')}
                  className="mt-2"
                >
                  <Text className="text-[#aeaeae] font-bold text-xl">
                    Reach Goals
                  </Text>
                </TouchableOpacity>
              </>
            )}
            
            {step === 2 && (
              <TouchableOpacity 
                onPress={() => onNavigateToStep(3, 'purple')}
                className="mt-4"
              >
                <Text className="text-[#aeaeae] font-bold text-2xl">
                  Reach Goals
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
};