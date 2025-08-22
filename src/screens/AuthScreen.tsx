import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Platform, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAppContext } from '../contexts/AppContext';

type UnlockType = 'date' | 'amount';

export default function AuthScreen() {
  const { authenticate } = useAppContext();
  const [selectedUnlockType, setSelectedUnlockType] = useState<UnlockType | undefined>();
  const [unlockAmount, setUnlockAmount] = useState<string>('');
  const [unlockDate, setUnlockDate] = useState<Date | undefined>();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleUnlockTypeChange = (type: UnlockType) => {
    setSelectedUnlockType(type);
    if (type === 'date') {
      setUnlockAmount('');
    } else {
      setUnlockDate(undefined);
      setShowDatePicker(false);
    }
  };

  const handleAmountChange = (amount: string) => {
    setUnlockAmount(amount);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || unlockDate;
    setUnlockDate(currentDate);
  };

  const handleDatePickerDone = () => {
    setShowDatePicker(false);
  };

  const handleDatePickerCancel = () => {
    setShowDatePicker(false);
  };

  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const handleCreateWallet = () => {
    const preferences = {
      unlockType: selectedUnlockType,
      unlockDate,
      unlockAmount: unlockAmount ? parseFloat(unlockAmount) : undefined,
    };
    console.log('User preferences:', preferences);
    // authenticate();
  };

  const isValid = () => {
    return !!(
      selectedUnlockType && 
      (
        (selectedUnlockType === 'date' && unlockDate) ||
        (selectedUnlockType === 'amount' && unlockAmount && parseFloat(unlockAmount) > 0)
      )
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      day: 'numeric',
      month: 'short', 
      year: 'numeric'
    });
  };

  const getMinimumDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-20">
        <View className="mb-10">
          <Text className="text-4xl font-light text-gray-900 mb-3 tracking-tight">
            Unlock Preferences
          </Text>
          <Text className="text-lg text-gray-600 font-light leading-7">
            Configure when you'd like to access your savings.
          </Text>
        </View>

        <ScrollView 
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          <View className="mb-8">
            <View className="gap-y-4">
              <TouchableOpacity
                onPress={() => handleUnlockTypeChange('date')}
                className={`p-6 rounded-3xl border ${
                  selectedUnlockType === 'date'
                    ? 'border-0 bg-[#335cff]'
                    : 'border-gray-200 bg-white'
                }`}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: selectedUnlockType === 'date' ? 0.15 : 0.08,
                  shadowRadius: selectedUnlockType === 'date' ? 20 : 12,
                  elevation: selectedUnlockType === 'date' ? 8 : 4,
                }}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className={`text-xl font-semibold mb-2 ${
                      selectedUnlockType === 'date' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Time-Based Unlock
                    </Text>
                    <Text className={`text-base font-light ${
                      selectedUnlockType === 'date' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Set a specific date when your funds become available
                    </Text>
                  </View>
                 
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleUnlockTypeChange('amount')}
                className={`p-6 rounded-3xl border ${
                  selectedUnlockType === 'amount'
                    ? 'border-0 bg-[#335cff]'
                    : 'border-gray-200 bg-white'
                }`}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: selectedUnlockType === 'amount' ? 0.15 : 0.08,
                  shadowRadius: selectedUnlockType === 'amount' ? 20 : 12,
                  elevation: selectedUnlockType === 'amount' ? 8 : 4,
                }}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className={`text-xl font-semibold mb-2 ${
                      selectedUnlockType === 'amount' ? 'text-white' : 'text-gray-900'
                    }`}>
                      Goal-Based Unlock
                    </Text>
                    <Text className={`text-base font-light ${
                      selectedUnlockType === 'amount' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Unlock when your savings reach a target amount
                    </Text>
                  </View>
                 
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {selectedUnlockType === 'date' && (
            <View className="space-y-6">
              <TouchableOpacity
                onPress={openDatePicker}
                className="border-2 border-gray-200 rounded-3xl px-6 py-6 bg-white"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 12,
                  elevation: 3,
                }}
              >
                <View>
                  <Text className="text-sm font-medium text-gray-500 mb-1">
                    Unlock Date
                  </Text>
                  <Text className="text-xl font-semibold text-gray-900">
                    {unlockDate ? formatDate(unlockDate) : 'Select date'}
                  </Text>
                </View>
              </TouchableOpacity>

              {unlockDate && (
                <View className="p-4 bg-gray-50 rounded-2xl">
                  <Text className="text-sm font-medium text-gray-700">
                    Your funds will be locked until{' '}
                    <Text className="font-bold">{formatDate(unlockDate)}</Text>
                  </Text>
                </View>
              )}

              {showDatePicker && (
                <Modal
                  visible={showDatePicker}
                  transparent={true}
                  animationType="slide"
                  onRequestClose={handleDatePickerCancel}
                >
                  <View className="flex-1 justify-end bg-black/50">
                    <View className="bg-white rounded-t-3xl p-6">
                      <View className="flex-row justify-between items-center mb-4">
                        <TouchableOpacity onPress={handleDatePickerCancel}>
                          <Text className="text-lg font-medium text-gray-500">Cancel</Text>
                        </TouchableOpacity>
                        <Text className="text-lg font-semibold">Select Date</Text>
                        <TouchableOpacity onPress={handleDatePickerDone}>
                          <Text className="text-lg font-medium text-blue-600">Done</Text>
                        </TouchableOpacity>
                      </View>
                      <DateTimePicker
                        testID="dateTimePicker"
                        value={unlockDate || getMinimumDate()}
                        mode="date"
                        display="spinner"
                        minimumDate={getMinimumDate()}
                        onChange={handleDateChange}
                        style={{ backgroundColor: 'white' }}
                      />
                    </View>
                  </View>
                </Modal>
              )}
            </View>
          )}

          {selectedUnlockType === 'amount' && (
            <View className="space-y-6">
              <View className="border-2 border-gray-200 rounded-3xl px-6 py-6 bg-white"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 12,
                  elevation: 3,
                }}
              >
                <View>
                  <Text className="text-sm font-medium text-gray-500 mb-3">
                    Target Amount (USD)
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-3xl font-bold text-[#303030] mr-3">$</Text>
                    <TextInput
                      value={unlockAmount}
                      onChangeText={handleAmountChange}
                      placeholder="0.00"
                      keyboardType="numeric"
                      className="flex-1 text-3xl font-bold text-[#303030]"
                      placeholderTextColor="#D1D5DB"
                    />
                  </View>
                </View>
              </View>

              {unlockAmount && parseFloat(unlockAmount) > 0 && (
                <View className="p-4 bg-gray-50 rounded-2xl">
                  <Text className="text-sm font-medium text-gray-700">
                    Your funds will unlock when you reach{' '}
                    <Text className="font-bold">${parseFloat(unlockAmount).toLocaleString()}</Text>
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>

      <View className="absolute bottom-10 left-0 right-0 px-6">
        <TouchableOpacity
          onPress={handleCreateWallet}
          disabled={!isValid()}
          className={`rounded-full py-5 items-center ${
            !isValid() ? 'opacity-40' : ''
          }`}
          style={{ 
            backgroundColor: '#000',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isValid() ? 0.25 : 0.1,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <Text className="text-white font-medium text-lg tracking-wide">
            Create Wallet
          </Text>
        </TouchableOpacity>
        
        {!isValid() && (
          <Text className="text-center text-gray-400 text-sm mt-3 font-light">
            Please configure your unlock preference to continue
          </Text>
        )}
      </View>
    </View>
  );
}


