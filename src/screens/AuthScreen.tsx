import React, { useState } from 'react';
import { View } from 'react-native';
import { useAppContext } from '../contexts/AppContext';
import { ProgressIndicator } from '../components/Auth/ProgressIndicator';
import { AuthStep } from '../components/Auth/AuthStep';
import { AuthButton } from '../components/Auth/AuthButton';
import { AuthStep as AuthStepType } from '../types/auth.types';

export default function AuthScreen() {
  const { authenticate } = useAppContext();
  const [currentStep, setCurrentStep] = useState<AuthStepType>(0);
  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((prevStep) => (prevStep + 1) as AuthStepType);
    }
  };


  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prevStep) => (prevStep - 1) as AuthStepType);
    }
  };

  const handleCreateWallet = () => {
    authenticate();
  };

  return (
    <View className="flex-1 bg-white pt-4">
      <ProgressIndicator 
        currentStep={currentStep} 
        totalSteps={totalSteps} 
        onBack={handleBack}
      />
      
      {[0, 1, 2, 3, 4].map((step) => (
        <AuthStep
          key={step}
          step={step as AuthStepType}
          currentStep={currentStep}
          isVisible={currentStep === step}
        />
      ))}

      <AuthButton 
        step={currentStep}
        onNext={handleNext}
        onCreateWallet={handleCreateWallet}
      />
    </View>
  );
}


