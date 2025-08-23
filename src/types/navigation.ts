export type RootStackParamList = {
    Onboarding: undefined;
    AuthNavigator: undefined;
    Main: undefined;
  };
  
  export type AuthStackParamList = {
    Auth: undefined;
  };
  
  export type MainTabParamList = {
    Home: undefined;
    Deposit: { publicKey: string | null };
    Holdings: undefined;
    Withdraw: undefined
  };
  