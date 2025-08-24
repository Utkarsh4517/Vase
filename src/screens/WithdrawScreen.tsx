import React, { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  ScrollView 
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useAppContext } from '../contexts/AppContext';
import { StorageService } from '../utils/storage';

export default function WithdrawScreen() {
  const { resetApp } = useAppContext();
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasConfirmedImport, setHasConfirmedImport] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    loadPrivateKey();
  }, []);

  const loadPrivateKey = async () => {
    try {
      const key = await StorageService.getWalletPrivateKey();
      setPrivateKey(key);
    } catch (error) {
      console.error('Error loading private key:', error);
      Alert.alert('Error', 'Failed to load private key');
    } finally {
      setLoading(false);
    }
  };

  const copyPrivateKey = async () => {
    if (privateKey) {
      Clipboard.setString(privateKey);
      Alert.alert('Copied!', 'Private key copied to clipboard');
    }
  };

  const handleStartJourneyAgain = () => {
    Alert.alert(
      'Reset App',
      'This will reset the app with a new wallet. All current data will be permanently deleted. Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          style: 'destructive',
          onPress: performAppReset,
        },
      ]
    );
  };

  const performAppReset = async () => {
    setIsResetting(true);
    try {
      await resetApp();
    } catch (error) {
      console.error('Error resetting app:', error);
      Alert.alert('Error', 'Failed to reset app. Please try again.');
      setIsResetting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 px-6 pt-20" showsVerticalScrollIndicator={false}>
        <View className="mb-10">
          <Text className="text-4xl font-light text-gray-900 mb-3 tracking-tight">
            Unlock Your Funds
          </Text>
          <Text className="text-lg text-gray-600 font-light leading-7">
            You're unlocking your funds. Make sure to save your private key safely before proceeding.
          </Text>
        </View>

        <View className="mb-8">
          <Text className="text-xl font-semibold text-gray-900 mb-4">
            Your Private Key
          </Text>
          <View 
            className="bg-gray-50 rounded-3xl p-6 border border-gray-200"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <Text className="text-sm font-medium text-gray-500 mb-3">
              Private Key (Base64)
            </Text>
            <View className="bg-white rounded-2xl p-4 mb-4">
              <Text 
                className="text-sm font-mono text-gray-800 leading-5"
                style={{ lineHeight: 20 }}
              >
                {privateKey || 'Unable to load private key'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={copyPrivateKey}
              disabled={!privateKey}
              className={`bg-[#303030] rounded-2xl py-3 px-4 flex-row items-center justify-center ${
                !privateKey ? 'opacity-50' : ''
              }`}
              style={{
                shadowColor: '#3B82F6',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <Text className="text-white font-semibold text-base mr-2">Copy Private Key</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-8">
          <TouchableOpacity
            onPress={() => setHasConfirmedImport(!hasConfirmedImport)}
            className="flex-row items-start p-6 bg-gray-50 rounded-3xl border border-gray-200"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <View 
              className={`w-6 h-6 rounded-lg mr-4 mt-1 border-2 items-center justify-center ${
                hasConfirmedImport 
                  ? 'bg-green-500 border-green-500' 
                  : 'bg-white border-gray-300'
              }`}
            >
              {hasConfirmedImport && (
                <Text className="text-white font-bold text-sm">✓</Text>
              )}
            </View>
            <View className="flex-1">
              <Text className="text-base font-medium text-gray-900 mb-1">
                Import Confirmation
              </Text>
              <Text className="text-sm text-gray-600 leading-5">
                I have imported this private key to another wallet and confirmed it works properly.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="mb-8 p-6 bg-orange-50 rounded-3xl border border-orange-200">
          <View className="flex-row items-start">
            <Text className="text-orange-500 text-xl mr-3">⚠️</Text>
            <View className="flex-1">
              <Text className="text-base font-semibold text-orange-800 mb-2">
                Important Security Notice
              </Text>
              <Text className="text-sm text-orange-700 leading-5">
                Make sure you have safely stored your private key before resetting the app. 
                Without it, you won't be able to access your funds in other wallets.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-10 left-0 right-0 px-6">
        <TouchableOpacity
          onPress={handleStartJourneyAgain}
          disabled={!hasConfirmedImport || isResetting}
          className={`rounded-full py-5 items-center flex-row justify-center ${
            !hasConfirmedImport || isResetting ? 'opacity-40' : ''
          }`}
          style={{ 
            backgroundColor: '#EF4444',
            shadowColor: '#EF4444',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: hasConfirmedImport && !isResetting ? 0.25 : 0.1,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          {isResetting && (
            <ActivityIndicator 
              size="small" 
              color="white" 
              style={{ marginRight: 8 }}
            />
          )}
          <Text className="text-white font-semibold text-lg tracking-wide">
            {isResetting ? 'Resetting App...' : 'Start Your Journey Again'}
          </Text>
        </TouchableOpacity>
        
        {!hasConfirmedImport && (
          <Text className="text-center text-gray-400 text-sm mt-3 font-light">
            Please confirm you've imported your private key to continue
          </Text>
        )}
      </View>
    </View>
  );
}
