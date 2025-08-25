import { createTransferInstruction, getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount, TOKEN_PROGRAM_ID as SPL_TOKEN_PROGRAM_ID } from '@solana/spl-token';

export type RootStackParamList = {
    Onboarding: undefined;
    AuthNavigator: undefined;
    Main: undefined;
  };
  
  export type AuthStackParamList = {
    Auth: undefined;
  };

  export type WithdrawableToken = {
    type: 'SOL' | 'SPL';
    mint: string;
    symbol: string;
    name: string;
    logoURI?: string;
    balance: number;
    decimals: number;
    usdPrice?: number;
    totalUsdValue?: number;
    tokenAccount?: string;
  };
  
  export type MainTabParamList = {
    Home: undefined;
    Deposit: { publicKey: string | null };
    Holdings: undefined;
    Withdraw: {
      step?: number;
      selectedToken?: WithdrawableToken;
      recipientAddress?: string;
      amount?: string;
    };
  };
  