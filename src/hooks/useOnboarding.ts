import { useState, useEffect } from 'react';
import { useSharedValue, withTiming, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import { GradientType, OnboardingStep } from '../types/onboarding.types';

const { height: screenHeight } = Dimensions.get('window');

export const useOnboarding = () => {
  const [step, setStep] = useState<OnboardingStep>(0);
  const [gradientType, setGradientType] = useState<GradientType>('blue');
  const gradientPosition = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const step1Opacity = useSharedValue(0);
  const step2Opacity = useSharedValue(0);
  const step3Opacity = useSharedValue(0);
  const blurOpacity = useSharedValue(0);
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

  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
    };
  });

  const animatedStep1Style = useAnimatedStyle(() => {
    return {
      opacity: step1Opacity.value,
    };
  });

  const animatedStep2Style = useAnimatedStyle(() => {
    return {
      opacity: step2Opacity.value,
    };
  });

  const animatedStep3Style = useAnimatedStyle(() => {
    return {
      opacity: step3Opacity.value,
    };
  });

  const animatedBlurStyle = useAnimatedStyle(() => {
    return {
      opacity: blurOpacity.value,
    };
  });

  useEffect(() => {
    if (step === 0) {
      logoOpacity.value = withTiming(1, { duration: 800 });
    } else if (step === 1) {
      step1Opacity.value = withTiming(1, { duration: 800 });
    } else if (step === 2) {
      step2Opacity.value = withTiming(1, { duration: 800 });
    } else if (step === 3) {
      step3Opacity.value = withTiming(1, { duration: 800 });
    }
  }, [step]);

  const handleContinue = () => {
    logoOpacity.value = withTiming(0, { duration: 500 });
    setTimeout(() => {
      setStep(1);
      gradientPosition.value = withTiming(2, { duration: 1500 });
    }, 500);
    gradientPosition.value = withTiming(2, { duration: 1500 });
  };

  const handleNext = () => {
    if (step === 1) {
      navigateToStep(2, 'orange');
    } else if (step === 2) {
      navigateToStep(3, 'purple');
    }
  };

  const navigateToStep = (targetStep: OnboardingStep, gradientColor: GradientType) => {
    blurOpacity.value = withTiming(1, { duration: 250 });
    
    if (step === 1) {
      step1Opacity.value = withTiming(0, { duration: 250 });
    } else if (step === 2) {
      step2Opacity.value = withTiming(0, { duration: 250 });
    } else if (step === 3) {
      step3Opacity.value = withTiming(0, { duration: 250 });
    }
    
    setTimeout(() => {
      setGradientType(gradientColor);
      setStep(targetStep);
      setTimeout(() => {
        blurOpacity.value = withTiming(0, { duration: 250 });
      }, 100);
    }, 250);
  };

  return {
    step,
    gradientType,
    animatedGradientStyle,
    animatedLogoStyle,
    animatedStep1Style,
    animatedStep2Style,
    animatedStep3Style,
    animatedBlurStyle,
    handleContinue,
    handleNext,
    navigateToStep
  };
};