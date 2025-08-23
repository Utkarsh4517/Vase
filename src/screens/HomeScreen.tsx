import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StorageService, UserPreferences } from '../utils/storage';
import { MainTabParamList } from '../types/navigation';
import BalanceCard from '../components/BalanceCard';
import LockProgressCard from '../components/LockProgressCard';

type HomeScreenNavigationProp = StackNavigationProp<MainTabParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [progress, setProgress] = useState(0);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  // fake balance
  const currentBalance = 5.78;

  useEffect(() => {
    loadUserPreferences();
    loadPublicKey();
  }, []);

  useEffect(() => {
    if (userPreferences) {
      calculateProgress();
    }
  }, [userPreferences, currentBalance]);

  const loadUserPreferences = async () => {
    try {
      const preferences = await StorageService.getUserPreferences();
      setUserPreferences(preferences);
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

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
    navigation.navigate('Withdraw');
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
