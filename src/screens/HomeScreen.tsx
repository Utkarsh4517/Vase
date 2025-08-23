import React, { useState } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Image } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';


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

export default function HomeScreen() {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);

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
              <Text className="text-[#666666] text-[11px] font-light">Transactions</Text>
            </View>
            <View className="items-center">
              <TouchableOpacity 
                className="w-12 h-12 bg-[#335cff] rounded-full items-center justify-center mb-3"
                onPress={() => console.log('Withdraw pressed')}
              >
                <DownArrowIcon />
              </TouchableOpacity>
              <Text className="text-[#666666] text-[11px] font-light">Withdraw</Text>
            </View>
          </View>
        </View>
        <View className='bg-white rounded-3xl w-full px-6 mt-6 py-6 items-center justify-center'>
          <LockIcon size={120} color="#AEAEAE" />
        </View>
      </View>
    

    </ScrollView>
  );
}
