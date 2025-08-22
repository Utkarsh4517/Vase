import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

const ONBOARDING_KEY = '__hasVaseCompletedOnboarding?';
const AUTH_KEY = '__isVaseAuthenticated???_';
const USER_PREFERENCES_KEY = '__vaseUserPreferences';
const WALLET_PUBLIC_KEY = '__vaseWalletPublicKey';
const WALLET_PRIVATE_KEY_SERVICE = 'VaseWalletPrivateKey';

export type UnlockType = 'date' | 'amount';

export interface UserPreferences {
  unlockType: UnlockType;
  unlockDate?: Date;
  unlockAmount?: number;
}

export class StorageService {
  static async setOnboardingCompleted(
    completed: boolean = true,
  ): Promise<void> {
    await AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify(completed));
  }

  static async hasCompletedOnboarding(): Promise<boolean> {
    const value = await AsyncStorage.getItem(ONBOARDING_KEY);
    return value ? JSON.parse(value) : false;
  }

  static async setAuthenticated(authenticated: boolean = true): Promise<void> {
    await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(authenticated));
  }

  static async isAuthenticated(): Promise<boolean> {
    const value = await AsyncStorage.getItem(AUTH_KEY);
    return value ? JSON.parse(value) : false;
  }

  static async setUserPreferences(preferences: UserPreferences): Promise<void> {
    await AsyncStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences));
  }

  static async getUserPreferences(): Promise<UserPreferences | null> {
    const value = await AsyncStorage.getItem(USER_PREFERENCES_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value);
    if (parsed.unlockDate) {
      parsed.unlockDate = new Date(parsed.unlockDate);
    }
    return parsed;
  }

  static async setWalletPublicKey(publicKey: string): Promise<void> {
    await AsyncStorage.setItem(WALLET_PUBLIC_KEY, publicKey);
  }

  static async getWalletPublicKey(): Promise<string | null> {
    return await AsyncStorage.getItem(WALLET_PUBLIC_KEY);
  }

  static async setWalletPrivateKey(privateKey: string): Promise<void> {
    await Keychain.setInternetCredentials(
      WALLET_PRIVATE_KEY_SERVICE,
      'wallet',
      privateKey
    );
  }

  static async getWalletPrivateKey(): Promise<string | null> {
    try {
      const credentials = await Keychain.getInternetCredentials(WALLET_PRIVATE_KEY_SERVICE);
      if (credentials) {
        return credentials.password;
      }
      return null;
    } catch (error) {
      console.error('Error retrieving private key:', error);
      return null;
    }
  }

  static async hasWallet(): Promise<boolean> {
    const publicKey = await this.getWalletPublicKey();
    return !!publicKey;
  }

  static async clearWalletData(): Promise<void> {
    await AsyncStorage.removeItem(WALLET_PUBLIC_KEY);
    await AsyncStorage.removeItem(USER_PREFERENCES_KEY);
    await Keychain.resetInternetCredentials({server: WALLET_PRIVATE_KEY_SERVICE});
  }
}
