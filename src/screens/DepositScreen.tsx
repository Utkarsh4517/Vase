import React from 'react';
import { Text, View } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { MainTabParamList } from '../types/navigation';

type DepositScreenRouteProp = RouteProp<MainTabParamList, 'Deposit'>;

interface DepositScreenProps {
  route: DepositScreenRouteProp;
}

export default function DepositScreen({ route }: DepositScreenProps) {
  const { publicKey } = route.params;

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-xl font-bold text-blue-500 mb-6">Deposit Screen</Text>
      
      <View className="w-full bg-gray-100 p-4 rounded-lg">
        <Text className="text-sm font-medium text-gray-600 mb-2">Wallet Public Key:</Text>
        <Text className="text-xs font-mono text-gray-800 break-words">
          {publicKey || 'No public key found'}
        </Text>
      </View>
    </View>
  );
}
