import React, { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import Clipboard from '@react-native-clipboard/clipboard';
import { MainTabParamList } from '../types/navigation';

type DepositScreenRouteProp = RouteProp<MainTabParamList, 'Deposit'>;

interface DepositScreenProps {
  route: DepositScreenRouteProp;
}



export default function DepositScreen({ route }: DepositScreenProps) {
  const navigation = useNavigation();
  const { publicKey } = route.params;

  const copyToClipboard = async () => {
    if (publicKey) {
      Clipboard.setString(publicKey);
      navigation.goBack();
    }
  };


  return (
    <View className="flex-1 bg-[#f5f5f7]">
      <View className="flex-1 items-center justify-center px-6">
        <View className="bg-white p-8 rounded-[32px] shadow-lg items-center justify-center">
          <View className="overflow-hidden">
            <QRCode
              value={publicKey || 'No public key available'}
              size={280}
              color="#000000"
              backgroundColor="#ffffff"
              logoSize={0}
              logoBackgroundColor="transparent"
            />
          </View>
        </View>
      </View>
     
      <View 
        className="absolute bottom-10 left-0 right-0 px-6"
        style={{ zIndex: 20 }}
      >
         <Text className='text-center font-light text-[#666666] mb-4'>
          You can deposit any SPL token, but you will need some SOL while withdrawing to cover gas fees.
        </Text>
       
        <TouchableOpacity
          onPress={copyToClipboard}
          className="bg-black rounded-full py-4 items-center shadow-lg"
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold text-lg">
            Copy Address
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
