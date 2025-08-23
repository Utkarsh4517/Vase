import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { StorageService } from '../utils/storage';
import { getSplTokenHoldings, SplTokenHolding, getSolBalance } from '../services/solana';
import { getTokenPrices, getSolPrice } from '../services/price';

export default function HoldingsScreen() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [tokens, setTokens] = useState<SplTokenHolding[]>([]);
  const [sol, setSol] = useState<number | null>(null);
  const [solPrice, setSolPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const pk = await StorageService.getWalletPublicKey();
      setPublicKey(pk);
      if (!pk) {
        setTokens([]);
        setSol(null);
        setSolPrice(null);
        setError('No wallet found');
      } else {
        const [holdings, solBal] = await Promise.all([
          getSplTokenHoldings(pk),
          getSolBalance(pk),
        ]);
        
        const mintAddresses = holdings.map(h => h.mint);
        const [tokenPrices, currentSolPrice] = await Promise.all([
          getTokenPrices(mintAddresses),
          getSolPrice(),
        ]);
        
        const holdingsWithPrices = holdings.map(holding => ({
          ...holding,
          usdPrice: tokenPrices[holding.mint],
          totalUsdValue: tokenPrices[holding.mint] 
            ? tokenPrices[holding.mint] * holding.amount 
            : undefined,
        }));
        
        setTokens(holdingsWithPrices);
        setSol(solBal);
        setSolPrice(currentSolPrice);
      }
    } catch (e) {
      setSol(null);
      setSolPrice(null);
      setError('Failed to load holdings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const short = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  
  const formatUSD = (value: number) => 
    `$${value.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`;

  return (
    <View className="flex-1 items-center justify-start bg-white px-4 pt-8">
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
          <Text className="mt-2 text-gray-500">Loading balances...</Text>
        </View>
      ) : error ? (
        <Text className="text-red-500">{error}</Text>
      ) : (
        <ScrollView className="w-full">
          {sol !== null && (
            <View
              key="native-sol"
              className="mb-3 w-full rounded-lg border border-gray-200 bg-white p-4"
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-base font-semibold text-[#303030]">
                  {sol.toLocaleString(undefined, { maximumFractionDigits: 6 })} SOL
                </Text>
                {solPrice && (
                  <Text className="text-base font-semibold text-green-600">
                    {formatUSD(sol * solPrice)}
                  </Text>
                )}
              </View>
              <View className="flex-row items-center justify-between mt-1">
                <Text className="text-xs text-gray-500">Native SOL balance</Text>
                {solPrice && (
                  <Text className="text-xs text-gray-500">
                    {formatUSD(solPrice)} per SOL
                  </Text>
                )}
              </View>
            </View>
          )}

          {tokens.length === 0 ? (
            <Text className="text-gray-600">No SPL tokens found.</Text>
          ) : (
            tokens.map((t) => (
              <View
                key={`${t.tokenAccount}-${t.mint}`}
                className="mb-3 w-full rounded-lg border border-gray-200 bg-white p-4"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="text-base font-semibold text-[#303030]">
                    {t.amount.toLocaleString(undefined, { maximumFractionDigits: t.decimals })}
                  </Text>
                  {t.totalUsdValue && (
                    <Text className="text-base font-semibold text-green-600">
                      {formatUSD(t.totalUsdValue)}
                    </Text>
                  )}
                </View>
                <View className="flex-row items-center justify-between mt-1">
                  <Text className="text-xs text-gray-500">{short(t.mint)}</Text>
                  {t.usdPrice && (
                    <Text className="text-xs text-gray-500">
                      {formatUSD(t.usdPrice)} each
                    </Text>
                  )}
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}