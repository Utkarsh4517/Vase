import React from 'react';
import { Text, View } from 'react-native';
import CircularProgressBar from './CircularProgressBar';
import { LockIcon } from './CustomSvgs';
import { UserPreferences } from '../utils/storage';

interface LockProgressCardProps {
  progress: number;
  userPreferences: UserPreferences | null;
  currentBalance: number;
}

const LockProgressCard = ({
  progress,
  userPreferences,
  currentBalance
}: LockProgressCardProps) => {
  const getUnlockMessage = () => {
    if (!userPreferences) return '';

    if (userPreferences.unlockType === 'date' && userPreferences.unlockDate) {
      const now = new Date();
      const unlockDate = new Date(userPreferences.unlockDate);
      const daysLeft = Math.ceil((unlockDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysLeft > 0 
        ? `${daysLeft} day${daysLeft === 1 ? '' : 's'} left to unlock your funds`
        : 'Your funds are ready to unlock!';
    } else if (userPreferences.unlockType === 'amount' && userPreferences.unlockAmount) {
      const remaining = userPreferences.unlockAmount - currentBalance;
      return remaining > 0
        ? `You need $${remaining.toFixed(2)} more to unlock your funds`
        : 'Congratulations! You can unlock your funds now!';
    }

    return '';
  };

  return (
    <View className='bg-white rounded-3xl h-[80%] w-full px-6 mt-6 py-6 items-center justify-center'>
      <CircularProgressBar 
        size={200} 
        strokeWidth={14} 
        progress={progress}
      >
        <LockIcon size={120} color="#AEAEAE" />
      </CircularProgressBar>
      {userPreferences && (
        <Text className="text-[#666666] text-sm mt-10 text-center">
          {getUnlockMessage()}
        </Text>
      )}
    </View>
  );
};

export default LockProgressCard;
