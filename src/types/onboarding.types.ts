export type GradientType = 'blue' | 'orange' | 'purple';

export type OnboardingStep = 0 | 1 | 2 | 3;

export interface GradientColors {
  stop1: string;
  stop2: string;
  stop3: string;
  stop4: string;
}

export interface FeatureStepProps {
  step: OnboardingStep;
  currentStep: OnboardingStep;
  animatedStyle: any;
  onNavigateToStep: (step: OnboardingStep, gradient: GradientType) => void;
}

export interface GradientBackgroundProps {
  gradientType: GradientType;
  animatedStyle: any;
}

export interface WelcomeStepProps {
  isVisible: boolean;
  animatedStyle: any;
}

export interface BlurOverlayProps {
  animatedStyle: any;
}

export interface OnboardingButtonProps {
  step: OnboardingStep;
  onContinue: () => void;
  onNext: () => void;
  onComplete: () => void;
}