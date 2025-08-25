import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StorageService, UserPreferences } from '../utils/storage';
import { MainTabParamList } from '../types/navigation';
import BalanceCard from '../components/BalanceCard';
import LockProgressCard from '../components/LockProgressCard';
import { getPortfolioValue, PortfolioValue } from '../services/price';
import NotificationService from '../services/notification';

type HomeScreenNavigationProp = StackNavigationProp<MainTabParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [progress, setProgress] = useState(0);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [portfolioValue, setPortfolioValue] = useState<PortfolioValue>({
    totalUsdValue: 0,
    solValue: 0,
    splTokensValue: 0,
    isLoading: true,
    error: null,
  });
  
  const currentBalance = portfolioValue.totalUsdValue;

  useEffect(() => {
    loadUserPreferences();
    loadPublicKey();
  }, []);

  useEffect(() => {
    if (userPreferences) {
      calculateProgress();
      scheduleNotifications();
    }
  }, [userPreferences, currentBalance]);

  useEffect(() => {
    if (publicKey) {
      loadPortfolioValue();
    }
  }, [publicKey]);

  const scheduleNotifications = async () => {
    try {
      await NotificationService.scheduleGoalNotifications();
    } catch (error) {
      //TODO BABY
    }
  };

  const loadPortfolioValue = async () => {
    if (!publicKey) return;
    
    setPortfolioValue(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const value = await getPortfolioValue(publicKey);
      setPortfolioValue(value);
    } catch (error) {
      console.error('Error loading portfolio value:', error);
      setPortfolioValue(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load balance',
      }));
    }
  };

  const loadUserPreferences = async () => {
    try {
      const preferences = await StorageService.getUserPreferences();
      setUserPreferences(preferences);
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

  const isWalletUnlocked = () => {
    if (userPreferences?.unlockType === 'date' && userPreferences?.unlockDate) {
      const now = new Date();
      const unlockDate = new Date(userPreferences?.unlockDate);
      return now >= unlockDate ? true : false;
    } else if (userPreferences?.unlockType === 'amount' && userPreferences?.unlockAmount) {
      return currentBalance >= userPreferences.unlockAmount ? true : false;
    }
  }

  const loadPublicKey = async () => {
    try {
      const key = await StorageService.getWalletPublicKey();
      setPublicKey(key);
    } catch (error) {
      console.error('Error loading public key:', error);
    }
  };

  const calculateProgress = () => {
    if (!userPreferences) return;

    if (userPreferences.unlockType === 'date' && userPreferences.unlockDate) {
      const now = new Date();
      const unlockDate = new Date(userPreferences.unlockDate);
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      
      const totalDuration = unlockDate.getTime() - startDate.getTime();
      const elapsed = now.getTime() - startDate.getTime();
      const progressPercentage = Math.min((elapsed / totalDuration) * 100, 100);
      
      setProgress(Math.max(0, progressPercentage));
    } else if (userPreferences.unlockType === 'amount' && userPreferences.unlockAmount) {
      const progressPercentage = (currentBalance / userPreferences.unlockAmount) * 100;
      setProgress(Math.min(progressPercentage, 100));
    }
  };

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible);
  };

  const handleDepositPress = () => {
    navigation.navigate('Deposit', { publicKey });
  };

  const handleHoldingsPress = () => {
    navigation.navigate('Holdings');
  };

  const handleUnlockPress = () => {
    // if(isWalletUnlocked()) {
      navigation.navigate('Withdraw');
    // }
  };

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View className="flex-1 items-center bg-[#F5F5F7] px-6">
        <Text className="text-3xl font-bold text-[#303030] mb-8">Vase</Text>
        
        <BalanceCard
          currentBalance={currentBalance}
          isBalanceVisible={isBalanceVisible}
          toggleBalanceVisibility={toggleBalanceVisibility}
          userPreferences={userPreferences}
          onDepositPress={handleDepositPress}
          onHoldingsPress={handleHoldingsPress}
          onUnlockPress={handleUnlockPress}
          isLoading={portfolioValue.isLoading}
          error={portfolioValue.error}
        />
        
        <LockProgressCard
          progress={progress}
          userPreferences={userPreferences}
          currentBalance={currentBalance}
         
        />
      </View>
    </ScrollView>
  );
}
