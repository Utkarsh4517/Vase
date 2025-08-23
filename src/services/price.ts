const JUPITER_PRICE_API = 'https://lite-api.jup.ag/price/v3';
export interface JupiterTokenPrice {
  id: string;
  type: string;
  usdPrice: number;
  decimals?: number;
  blockId?: number;
  priceChange24h?: number;
}
export interface JupiterPriceResponse {
  [mintAddress: string]: JupiterTokenPrice;
}

export async function getTokenPrices(mintAddresses: string[]): Promise<Record<string, number>> {
  try {
    if (mintAddresses.length === 0) {
      return {};
    }
    const ids = mintAddresses.join(',');
    const response = await fetch(`${JUPITER_PRICE_API}?ids=${ids}`);
    if (!response.ok) {
      throw new Error(`Price API responded with status: ${response.status}`);
    }
    const result: JupiterPriceResponse = await response.json();
    const prices: Record<string, number> = {};
    Object.entries(result).forEach(([mint, data]) => {
      if (data && typeof data.usdPrice === 'number') {
        prices[mint] = data.usdPrice;
      }
    });
    
    return prices;
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return {};
  }
}

export async function getSolPrice(): Promise<number | null> {
  try {
    const SOL_MINT = 'So11111111111111111111111111111111111111112';
    const prices = await getTokenPrices([SOL_MINT]);
    return prices[SOL_MINT] || null;
  } catch (error) {
    console.error('Error fetching SOL price:', error);
    return null;
  }
}

export async function getPricesWithFallback(mintAddresses: string[]): Promise<Record<string, number>> {
  try {
    return await getTokenPrices(mintAddresses);
  } catch (error) {
    console.warn('Lite API failed, trying pro API:', error);
    // Fallback to pro API if lite fails
    try {
      const ids = mintAddresses.join(',');
      const response = await fetch(`https://api.jup.ag/price/v3?ids=${ids}`);
      
      if (!response.ok) {
        throw new Error(`Pro API responded with status: ${response.status}`);
      }
      const result: JupiterPriceResponse = await response.json();
      const prices: Record<string, number> = {};
      Object.entries(result).forEach(([mint, data]) => {
        if (data && typeof data.usdPrice === 'number') {
          prices[mint] = data.usdPrice;
        }
      });
      
      return prices;
    } catch (proError) {
      console.error('Both price APIs failed:', proError);
      return {};
    }
  }
}

import { getSplTokenHoldings, getSolBalance } from './solana';

export interface PortfolioValue {
  totalUsdValue: number;
  solValue: number;
  splTokensValue: number;
  isLoading: boolean;
  error: string | null;
}

export async function getPortfolioValue(publicKey: string): Promise<PortfolioValue> {
  try {
    // Fetch balances
    const [holdings, solBalance] = await Promise.all([
      getSplTokenHoldings(publicKey),
      getSolBalance(publicKey),
    ]);
    
    // Fetch prices
    const mintAddresses = holdings.map(h => h.mint);
    const [tokenPrices, solPrice] = await Promise.all([
      getPricesWithFallback(mintAddresses),
      getSolPrice(),
    ]);
    
    // Calculate SOL value
    const solValue = solPrice && solBalance ? solBalance * solPrice : 0;
    
    // Calculate SPL tokens value
    const splTokensValue = holdings.reduce((total, holding) => {
      const tokenPrice = tokenPrices[holding.mint];
      if (tokenPrice && holding.amount) {
        return total + (holding.amount * tokenPrice);
      }
      return total;
    }, 0);
    
    const totalUsdValue = solValue + splTokensValue;
    
    return {
      totalUsdValue,
      solValue,
      splTokensValue,
      isLoading: false,
      error: null,
    };
  } catch (error) {
    console.error('Error calculating portfolio value:', error);
    return {
      totalUsdValue: 0,
      solValue: 0,
      splTokensValue: 0,
      isLoading: false,
      error: 'Failed to load portfolio value',
    };
  }
}
