import React, { useEffect, useState, useCallback } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { StorageService } from '../utils/storage';
import { getSplTokenHoldings, SplTokenHolding, getSolBalance } from '../services/solana';

export default function HoldingsScreen() {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [tokens, setTokens] = useState<SplTokenHolding[]>([]);
  const [sol, setSol] = useState<number | null>(null);
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
        setError('No wallet found');
      } else {
        const [holdings, solBal] = await Promise.all([
          getSplTokenHoldings(pk),
          getSolBalance(pk),
        ]);
        setTokens(holdings);
        setSol(solBal);
      }
    } catch (e) {
      setSol(null);
      setError('Failed to load holdings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const short = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

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
              <Text className="text-base font-semibold text-[#303030]">
                {sol.toLocaleString(undefined, { maximumFractionDigits: 6 })} SOL
              </Text>
              <Text className="text-xs text-gray-500 mt-1">Native SOL balance</Text>
            </View>
          )}

          {tokens.length === 0 ? (
            <Text className="text-gray-600">No SPL tokens found on devnet.</Text>
          ) : (
            tokens.map((t) => (
              <View
                key={`${t.tokenAccount}-${t.mint}`}
                className="mb-3 w-full rounded-lg border border-gray-200 bg-white p-4"
              >
                <Text className="text-base font-semibold text-[#303030]">
                  {t.amount.toLocaleString(undefined, { maximumFractionDigits: t.decimals })}
                </Text>
                <Text className="text-xs text-gray-500 mt-1">Mint: {short(t.mint)}</Text>
                <Text className="text-[10px] text-gray-400 mt-1">Acct: {short(t.tokenAccount)}</Text>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}