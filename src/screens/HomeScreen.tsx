import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Image } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { StorageService, UserPreferences } from '../utils/storage';


const EyeIcon = ({ size = 16, color = "#AEAEAE" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
  </Svg>
);

const PlusIcon = ({ size = 20, color = "white" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 5V19M5 12H19"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const DownArrowIcon = ({ size = 20, color = "white" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 5V19M19 12L12 19L5 12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const CardIcon = ({ size = 20, color = "white" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect 
      x="2" 
      y="6" 
      width="20" 
      height="12" 
      rx="2" 
      stroke={color} 
      strokeWidth="2"
      fill="none"
    />
    <Path
      d="M2 10H22"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

const LockIcon = ({ size = 64, color = "#AEAEAE" }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
    <Rect
      x="15"
      y="40"
      width="70"
      height="50"
      rx="12"
      ry="12"
      fill={color}
      stroke={color}
      strokeWidth="3"
    />
    
    <Path
      d="M25 40 V22 C25 12.1 32.1 5 42 5 L58 5 C67.9 5 75 12.1 75 22 V40"
      fill="none"
      stroke={color}
      strokeWidth="10"
      strokeLinecap="round"
    />
    <Circle
      cx="50"
      cy="60"
      r="6"
      fill="white"
    />
    <Rect
      x="47"
      y="63"
      width="6"
      height="12"
      fill="white"
    />
  </Svg>
);

// Circular Progress Bar component
const CircularProgressBar = ({ 
  size = 140, 
  strokeWidth = 8, 
  progress = 0, 
  children 
}: {
  size?: number;
  strokeWidth?: number;
  progress: number;
  children: React.ReactNode;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View className="items-center justify-center relative" style={{ width: size, height: size }}>
      <Svg width={size} height={size} className="absolute">
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E5E5"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#335cff"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      
      <View className="absolute items-center justify-center" style={{ width: size, height: size }}>
        {children}
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [progress, setProgress] = useState(0);
  
  // fake balance
  const currentBalance = 5.78;

  useEffect(() => {
    loadUserPreferences();
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

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <View className="flex-1 items-center bg-[#F5F5F7] px-6">
        <Text className="text-3xl font-bold text-[#303030] mb-8">Vase</Text>
        <View className='bg-white w-full rounded-3xl p-6 items-center'>
          <View className="flex-row items-center mb-3">
            <Text className='font-light text-[#AEAEAE] mr-2'>Total Balance</Text>
            <TouchableOpacity onPress={toggleBalanceVisibility}>
              <EyeIcon size={20} />
            </TouchableOpacity>
          </View>
          <Text className='font-bold text-5xl mb-6'>
            {isBalanceVisible ? (
              <>
                <Text className="text-[#303030]">$60</Text>
                <Text className="text-[#AEAEAE]">.78</Text>
              </>
            ) : (
              <Text className="text-[#AEAEAE]">****</Text>
            )}
          </Text>
          <View className="flex-row justify-center gap-x-6 w-full">
            <View className="items-center">
              <TouchableOpacity 
                className="w-12 h-12 bg-[#335cff] rounded-full items-center justify-center mb-3"
                onPress={() => console.log('Deposit pressed')}
              >
                <PlusIcon/>
              </TouchableOpacity>
              <Text className="text-[#666666] text-[11px] font-light">Deposit</Text>
            </View>
            <View className="items-center">
              <TouchableOpacity 
                className="w-12 h-12 bg-[#335cff] rounded-full items-center justify-center mb-3"
                onPress={() => console.log('Transactions pressed')}
              >
                <CardIcon />
              </TouchableOpacity>
              <Text className="text-[#666666] text-[11px] font-light">Holdings</Text>
            </View>
            <View className="items-center">
              <TouchableOpacity 
                className={`w-12 h-12 rounded-full items-center justify-center mb-3 ${
                  (() => {
                    if (!userPreferences) return 'bg-[#335cff]';
                    
                    if (userPreferences.unlockType === 'date' && userPreferences.unlockDate) {
                      const now = new Date();
                      const unlockDate = new Date(userPreferences.unlockDate);
                      return now >= unlockDate ? 'bg-[#335cff]' : 'bg-[#aeaeae]';
                    } else if (userPreferences.unlockType === 'amount' && userPreferences.unlockAmount) {
                      return currentBalance >= userPreferences.unlockAmount ? 'bg-[#335cff]' : 'bg-[#aeaeae]';
                    }
                    
                    return 'bg-[#335cff]';
                  })()
                }`}
                onPress={() => console.log('Unlock pressed')}
              >
                <DownArrowIcon />
              </TouchableOpacity>
              <Text className="text-[#666666] text-[11px] font-light">Unlock</Text>
            </View>
          </View>
        </View>
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
              {userPreferences.unlockType === 'date' 
                ? (() => {
                    const now = new Date();
                    const unlockDate = new Date(userPreferences.unlockDate!);
                    const daysLeft = Math.ceil((unlockDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    return daysLeft > 0 
                      ? `${daysLeft} day${daysLeft === 1 ? '' : 's'} left to unlock your funds`
                      : 'Your funds are ready to unlock!';
                  })()
                : (() => {
                    const remaining = userPreferences.unlockAmount! - currentBalance;
                    return remaining > 0
                      ? `You need $${remaining.toFixed(2)} more to unlock your funds`
                      : 'Congratulations! You can unlock your funds now!';
                  })()
              }
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
