import React, { useState, useEffect, useCallback } from 'react';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  ScrollView,
  TextInput,
  Image,
  Dimensions
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { StorageService } from '../utils/storage';
import { 
  getWithdrawableTokens, 
  WithdrawableToken, 
  sendSolTransaction, 
  sendSplTokenTransaction,
  isValidSolanaAddress,
  TransactionResult
} from '../services/solana';
import { Keypair } from '@solana/web3.js';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Buffer } from 'buffer';

const { width } = Dimensions.get('window');

interface RouteParams {
  step?: number;
  selectedToken?: WithdrawableToken;
  recipientAddress?: string;
  amount?: string;
}

export default function WithdrawScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as RouteParams || {};
  
  const [currentStep, setCurrentStep] = useState(params.step || 1);
  const [tokens, setTokens] = useState<WithdrawableToken[]>([]);
  const [selectedToken, setSelectedToken] = useState<WithdrawableToken | null>(params.selectedToken || null);
  const [recipientAddress, setRecipientAddress] = useState(params.recipientAddress || '');
  const [amount, setAmount] = useState(params.amount || '0');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [transactionResult, setTransactionResult] = useState<TransactionResult | null>(null);

  useEffect(() => {
    if (currentStep === 1) {
      loadTokens();
    }
  }, [currentStep]);

  const loadTokens = async () => {
    setLoading(true);
    try {
      const publicKey = await StorageService.getWalletPublicKey();
      if (publicKey) {
        const withdrawableTokens = await getWithdrawableTokens(publicKey);
        setTokens(withdrawableTokens);
      }
    } catch (error) {
      console.error('Error loading tokens:', error);
      Alert.alert('Error', 'Failed to load tokens');
    } finally {
      setLoading(false);
    }
  };

  const filteredTokens = tokens.filter(token =>
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatUSD = (value: number) => 
    `$${value.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;

  const formatTokenAmount = (amount: number, decimals: number) =>
    amount.toLocaleString(undefined, { 
      maximumFractionDigits: Math.min(decimals, 6),
      minimumFractionDigits: 0 
    });

  const handleTokenSelect = (token: WithdrawableToken) => {
    setSelectedToken(token);
    setCurrentStep(2);
  };

  const handleBackPress = () => {
    if (currentStep === 1) {
      navigation.goBack();
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleContinueToAmount = () => {
    if (!isValidSolanaAddress(recipientAddress)) {
      Alert.alert('Invalid Address', 'Please enter a valid Solana address');
      return;
    }
    setCurrentStep(3);
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await Clipboard.getString();
      if (text && isValidSolanaAddress(text)) {
        setRecipientAddress(text);
      } else {
        Alert.alert('Invalid Address', 'Clipboard does not contain a valid Solana address');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to paste from clipboard');
    }
  };

  const handleNumberPress = (num: string) => {
    if (num === '.') {
      if (!amount.includes('.')) {
        setAmount(amount === '0' ? '0.' : amount + '.');
      }
    } else if (num === 'backspace') {
      if (amount.length > 1) {
        setAmount(amount.slice(0, -1));
      } else {
        setAmount('0');
      }
    } else {
      if (amount === '0') {
        setAmount(num);
      } else {
        setAmount(amount + num);
      }
    }
  };

  const handleMaxPress = () => {
    if (selectedToken) {
      const maxAmount = selectedToken.type === 'SOL' 
        ? Math.max(0, selectedToken.balance - 0.001) 
        : selectedToken.balance;
      setAmount(maxAmount.toString());
    }
  };

  const handleSendTransaction = async () => {
    if (!selectedToken) return;

    setLoading(true);
    setCurrentStep(4);

    try {
      const privateKeyString = await StorageService.getWalletPrivateKey();
      if (!privateKeyString) {
        throw new Error('Private key not found');
      }

      const privateKeyBytes = Uint8Array.from(Buffer.from(privateKeyString, 'base64'));
      const keypair = Keypair.fromSecretKey(privateKeyBytes);

      const sendAmount = parseFloat(amount);
      
      let result: TransactionResult;
      
      if (selectedToken.type === 'SOL') {
        result = await sendSolTransaction(keypair, recipientAddress, sendAmount);
      } else {
        result = await sendSplTokenTransaction(
          keypair,
          recipientAddress,
          sendAmount,
          selectedToken.mint,
          selectedToken.decimals
        );
      }

      setTransactionResult(result);
    } catch (error) {
      console.error('Transaction error:', error);
      setTransactionResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setLoading(false);
    }
  };

  const renderHeader = () => {
    const titles = ['', 'Select coin', 'Choose recipient', 'Enter amount', 'Transaction Status'];
    
    return (
      <View className="flex-row items-center px-6 pt-16 pb-6">
        <TouchableOpacity 
          onPress={handleBackPress}
          className="w-10 h-10 items-center justify-center"
        >
          <Text className="text-2xl text-gray-700">←</Text>
        </TouchableOpacity>
        <Text className="flex-1 text-center text-xl font-semibold text-gray-900">
          {titles[currentStep]}
        </Text>
        <View className="w-10" />
      </View>
    );
  };

  const renderStepOne = () => (
    <View className="flex-1 px-6">
      <View className="mb-6">
        <View className="bg-gray-100 rounded-xl px-4 py-4 flex-row items-center">
          <TextInput
            placeholder="Search coins"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 text-base"
            placeholderTextColor="#9CA3AF"
            style={{ textAlignVertical: 'center', height: 20 }}
          />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {loading ? (
          <View className="items-center justify-center py-20">
            <ActivityIndicator size="large" color="#3B82F6" />
            <Text className="mt-4 text-gray-500">Loading tokens...</Text>
          </View>
        ) : (
          filteredTokens.map((token, index) => (
            <TouchableOpacity
              key={`${token.type}-${token.mint}`}
              onPress={() => handleTokenSelect(token)}
              className="bg-white rounded-xl p-4 mb-3 flex-row items-center"
            
            >
              <View className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 items-center justify-center mr-4">
                {token.logoURI ? (
                  <Image 
                    source={{ uri: token.logoURI }} 
                    className="w-12 h-12 rounded-full" 
                    style={{ resizeMode: 'cover' }}
                  />
                ) : (
                  <Text className="text-gray-400 font-semibold text-xs">
                    {token.symbol.slice(0, 3)}
                  </Text>
                )}
              </View>
              
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-900">{token.symbol}</Text>
                <Text className="text-sm text-gray-500">{token.name}</Text>
              </View>
              
              <View className="items-end">
                <Text className="text-lg font-semibold text-gray-900">
                  {formatTokenAmount(token.balance, token.decimals)}
                </Text>
                {token.totalUsdValue && (
                  <Text className="text-sm text-gray-500">
                    {formatUSD(token.totalUsdValue)}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );

  const renderStepTwo = () => (
    <View className="flex-1 px-6">
      <View className="mb-6">
        <View className="bg-gray-100 rounded-xl px-4 py-4 flex-row items-center">
          <TextInput
            placeholder="Recipient address"
            value={recipientAddress}
            onChangeText={setRecipientAddress}
            className="flex-1 text-base"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity 
            onPress={pasteFromClipboard}
            className="ml-3"
          >
            <Text className="text-blue-600 font-semibold">Paste</Text>
          </TouchableOpacity>
          
        </View>
      </View>

    

      <View className="absolute bottom-10 left-6 right-6">
        <TouchableOpacity
          onPress={handleContinueToAmount}
          disabled={!isValidSolanaAddress(recipientAddress)}
          className={`bg-gray-900 rounded-full py-4 items-center ${
            !isValidSolanaAddress(recipientAddress) ? 'opacity-50' : ''
          }`}
        >
          <Text className="text-white font-semibold text-lg">Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStepThree = () => {
    const usdValue = selectedToken?.usdPrice ? parseFloat(amount) * selectedToken.usdPrice : 0;
    
    return (
      <View className="flex-1 px-6">
        <View className="items-center mb-8">
          <View className="flex-row items-center mb-4">
            <View className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 items-center justify-center mr-3">
              {selectedToken?.logoURI ? (
                <Image 
                  source={{ uri: selectedToken.logoURI }} 
                  className="w-8 h-8 rounded-full" 
                />
              ) : (
                <Text className="text-xs font-semibold">
                  {selectedToken?.symbol.slice(0, 3)}
                </Text>
              )}
            </View>
            <Text className="text-xl font-semibold">{selectedToken?.symbol}</Text>
          </View>

          <View className="items-center">
            <Text className="text-6xl font-light text-gray-900 mb-2">{amount}</Text>
            <Text className="text-xl text-gray-500">{formatUSD(usdValue)}</Text>
            <TouchableOpacity 
              onPress={handleMaxPress}
              className="mt-4 bg-gray-200 rounded-full px-6 py-2"
            >
              <Text className="font-semibold text-gray-700">MAX</Text>
            </TouchableOpacity>
          </View>
        </View>

      

        <View className="flex-1 justify-end">
          <View className="mb-8">
            {[['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['.', '0', '⌫']].map((row, rowIndex) => (
              <View key={rowIndex} className="flex-row justify-center mb-4">
                {row.map((num) => (
                  <TouchableOpacity
                    key={num}
                    onPress={() => handleNumberPress(num === '⌫' ? 'backspace' : num)}
                    className="w-20 h-16 items-center justify-center mx-4"
                  >
                    <Text className="text-2xl font-light">{num}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={handleSendTransaction}
            disabled={parseFloat(amount) <= 0 || parseFloat(amount) > (selectedToken?.balance || 0)}
            className={`bg-gray-900 rounded-full py-4 items-center mb-8 ${
              parseFloat(amount) <= 0 || parseFloat(amount) > (selectedToken?.balance || 0) ? 'opacity-50' : ''
            }`}
          >
            <Text className="text-white font-semibold text-lg">Review</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderStepFour = () => (
    <View className="flex-1 px-6 items-center justify-center">
      {loading ? (
        <View className="items-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-4 text-lg text-gray-600">Sending transaction...</Text>
        </View>
      ) : transactionResult ? (
        <View className="items-center">
          {transactionResult.success ? (
            <>
              <Text className="text-2xl font-semibold text-green-600 mb-4">Transaction Sent!</Text>
              <Text className="text-center text-gray-600 mb-8">
                Your {selectedToken?.symbol} has been sent successfully
              </Text>
              
              {transactionResult.signature && (
                <View className="bg-gray-100 rounded-xl p-4 w-full mb-6">
                  <Text className="text-sm text-gray-500 mb-2">Transaction Hash:</Text>
                  <Text className="font-mono text-xs break-all">
                    {transactionResult.signature}
                  </Text>
                </View>
              )}

              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="bg-blue-600 rounded-full py-4 px-8 mb-4"
              >
                <Text className="text-white font-semibold text-lg">Done</Text>
              </TouchableOpacity>

              {transactionResult.signature && (
                <TouchableOpacity
                  className="bg-gray-200 rounded-full py-3 px-6"
                  onPress={() => {
                    if (transactionResult.signature) {
                      const url = `https://solscan.io/tx/${transactionResult.signature}`;
                      import('react-native').then(({ Linking }) => {
                        Linking.openURL(url);
                      });
                    }
                  }}
                >
                  <Text className="text-gray-700 font-medium">View on Explorer</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <>
              <Text className="text-2xl font-semibold text-red-600 mb-4">Transaction Failed</Text>
              <Text className="text-center text-gray-600 mb-8">
                {transactionResult.error || 'An unknown error occurred'}
              </Text>
              
              <TouchableOpacity
                onPress={() => setCurrentStep(3)}
                className="bg-blue-600 rounded-full py-4 px-8 mb-4"
              >
                <Text className="text-white font-semibold text-lg">Try Again</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="bg-gray-200 rounded-full py-3 px-6"
              >
                <Text className="text-gray-700 font-medium">Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ) : null}
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {renderHeader()}
      
      {currentStep === 1 && renderStepOne()}
      {currentStep === 2 && renderStepTwo()}
      {currentStep === 3 && renderStepThree()}
      {currentStep === 4 && renderStepFour()}
    </View>
  );
}
