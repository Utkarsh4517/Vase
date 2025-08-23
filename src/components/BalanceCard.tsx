import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { EyeIcon, PlusIcon, DownArrowIcon, CardIcon } from './CustomSvgs';
import { UserPreferences } from '../utils/storage';

interface BalanceCardProps {
  currentBalance: number;
  isBalanceVisible: boolean;
  toggleBalanceVisibility: () => void;
  userPreferences: UserPreferences | null;
  onDepositPress: () => void;
  onHoldingsPress: () => void;
  onUnlockPress: () => void;
}

const BalanceCard = ({
  currentBalance,
  isBalanceVisible,
  toggleBalanceVisibility,
  userPreferences,
  onDepositPress,
  onHoldingsPress,
  onUnlockPress
}: BalanceCardProps) => {
  const formatBalance = (balance: number) => {
    const [dollars, cents] = balance.toFixed(2).split('.');
    return { dollars, cents };
  };

  const { dollars, cents } = formatBalance(currentBalance);

  const getUnlockButtonClass = () => {
    if (!userPreferences) return 'bg-[#335cff]';
    
    if (userPreferences.unlockType === 'date' && userPreferences.unlockDate) {
      const now = new Date();
      const unlockDate = new Date(userPreferences.unlockDate);
      return now >= unlockDate ? 'bg-[#335cff]' : 'bg-[#aeaeae]';
    } else if (userPreferences.unlockType === 'amount' && userPreferences.unlockAmount) {
      return currentBalance >= userPreferences.unlockAmount ? 'bg-[#335cff]' : 'bg-[#aeaeae]';
    }
    
    return 'bg-[#335cff]';
  };

  return (
    <View className='bg-white w-full rounded-3xl p-6 items-center'>
      <View className="flex-row items-center mb-3">
        <Text className='font-light text-[#AEAEAE] mr-2'>Total Balance</Text>
        <TouchableOpacity onPress={toggleBalanceVisibility}>
          <EyeIcon />
        </TouchableOpacity>
      </View>
      <Text className='font-bold text-5xl mb-6'>
        {isBalanceVisible ? (
          <>
            <Text className="text-[#303030]">${dollars}</Text>
            <Text className="text-[#AEAEAE]">.{cents}</Text>
          </>
        ) : (
          <Text className="text-[#AEAEAE]">****</Text>
        )}
      </Text>
      <View className="flex-row justify-center gap-x-6 w-full">
        <View className="items-center">
          <TouchableOpacity 
            className="w-12 h-12 bg-[#335cff] rounded-full items-center justify-center mb-3"
            onPress={onDepositPress}
          >
            <PlusIcon/>
          </TouchableOpacity>
          <Text className="text-[#666666] text-[11px] font-light">Deposit</Text>
        </View>
        <View className="items-center">
          <TouchableOpacity 
            className="w-12 h-12 bg-[#335cff] rounded-full items-center justify-center mb-3"
            onPress={onHoldingsPress}
          >
            <CardIcon />
          </TouchableOpacity>
          <Text className="text-[#666666] text-[11px] font-light">Holdings</Text>
        </View>
        <View className="items-center">
          <TouchableOpacity 
            className={`w-12 h-12 rounded-full items-center justify-center mb-3 ${getUnlockButtonClass()}`}
            onPress={onUnlockPress}
          >
            <DownArrowIcon />
          </TouchableOpacity>
          <Text className="text-[#666666] text-[11px] font-light">Unlock</Text>
        </View>
      </View>
    </View>
  );
};

export default BalanceCard;
