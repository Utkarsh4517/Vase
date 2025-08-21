import React from 'react';
import { View } from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import { useOnboarding } from '../hooks/useOnboarding';
import { GradientBackground } from '../components/Onboarding/GradientBackground';
import { WelcomeStep } from '../components/Onboarding/WelcomeStep';
import { FeatureStep } from '../components/Onboarding/FeatureStep';
import { OnboardingButton } from '../components/Onboarding/OnboardingButton';
import { BlurOverlay } from '../components/Onboarding/BlurOverlay';


const OnboardingScreen: React.FC = () => {
  const { completeOnboarding } = useAppContext();
  
  const {
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
  } = useOnboarding();

  return (
    <View className="flex-1 bg-white">
      <GradientBackground 
        gradientType={gradientType}
        animatedStyle={animatedGradientStyle}
      />
      
      <WelcomeStep 
        isVisible={step === 0}
        animatedStyle={animatedLogoStyle}
      />
      
      <FeatureStep 
        step={1}
        currentStep={step}
        animatedStyle={animatedStep1Style}
        onNavigateToStep={navigateToStep}
      />
      
      <FeatureStep 
        step={2}
        currentStep={step}
        animatedStyle={animatedStep2Style}
        onNavigateToStep={navigateToStep}
      />
      
      <FeatureStep 
        step={3}
        currentStep={step}
        animatedStyle={animatedStep3Style}
        onNavigateToStep={navigateToStep}
      />

      <BlurOverlay animatedStyle={animatedBlurStyle} />
      
      <OnboardingButton 
        step={step}
        onContinue={handleContinue}
        onNext={handleNext}
        onComplete={completeOnboarding}
      />
    </View>
  );
};

export default OnboardingScreen;
