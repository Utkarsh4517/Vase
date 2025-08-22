export type AuthStep = 0 | 1 | 2 | 3 | 4;

export interface AuthStepProps {
  step: AuthStep;
  currentStep: AuthStep;
  isVisible: boolean;
}

export interface ProgressIndicatorProps {
    currentStep: AuthStep;
    totalSteps: number;
    onBack: () => void;
  }

export interface AuthButtonProps {
  step: AuthStep;
  onNext: () => void;
  onCreateWallet: () => void;
}