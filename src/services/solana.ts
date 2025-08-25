import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram, sendAndConfirmTransaction, Keypair } from '@solana/web3.js';
import { HELIUS_MAINNET_RPC_URL } from '@env';
import { createTransferInstruction, getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount, TOKEN_PROGRAM_ID as SPL_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { getTokenPrices, getSolPrice } from './price';

const MAINNET_RPC = HELIUS_MAINNET_RPC_URL;
export const connection = new Connection(MAINNET_RPC, 'confirmed');

const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

export interface TokenMetadata {
  name: string;
  symbol: string;
  logoURI?: string;
  verified?: boolean;
}

export interface SplTokenHolding {
  mint: string;
  amount: number;
  decimals: number;
  tokenAccount: string;
  usdPrice?: number; 
  totalUsdValue?: number;
  metadata?: TokenMetadata;
}

export interface WithdrawableToken {
  type: 'SOL' | 'SPL';
  mint: string;
  symbol: string;
  name: string;
  logoURI?: string;
  balance: number;
  decimals: number;
  usdPrice?: number;
  totalUsdValue?: number;
  tokenAccount?: string;
}

export async function getSplTokenHoldings(ownerPubkey: string): Promise<SplTokenHolding[]> {
  const owner = new PublicKey(ownerPubkey);
  const resp = await connection.getParsedTokenAccountsByOwner(owner, { programId: TOKEN_PROGRAM_ID });

  const holdings: SplTokenHolding[] = [];
  for (const { pubkey, account } of resp.value as any[]) {
    const info = account.data.parsed.info;
    const tokenAmount = info.tokenAmount;
    const uiAmount = typeof tokenAmount.uiAmount === 'number'
      ? tokenAmount.uiAmount
      : parseFloat(tokenAmount.amount) / Math.pow(10, tokenAmount.decimals);

    if (uiAmount > 0) {
      holdings.push({
        mint: info.mint,
        amount: uiAmount,
        decimals: tokenAmount.decimals,
        tokenAccount: pubkey.toBase58(),
      });
    }
  }
  return holdings;
}

export async function getSolBalance(ownerPubkey: string): Promise<number> {
  const lamports = await connection.getBalance(new PublicKey(ownerPubkey));
  return lamports / LAMPORTS_PER_SOL;
}

export async function getTokenMetadata(mintAddresses: string[]): Promise<Record<string, TokenMetadata>> {
  try {
    const mints = Array.from(new Set(mintAddresses)).filter(Boolean);
    if (mints.length === 0) return {};

    const result: Record<string, TokenMetadata> = {};

    const CHUNK = 8;
    const fetchOne = async (mint: string) => {
      try {
        const res = await fetch(`https://lite-api.jup.ag/tokens/v1/token/${mint}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const d = await res.json();
        result[mint] = {
          name: d.name || 'Unknown Token',
          symbol: d.symbol || 'UNK',
          logoURI: d.logoURI,
          verified: d.verified ?? true,
        };
      } catch {
      }
    };

    for (let i = 0; i < mints.length; i += CHUNK) {
      await Promise.all(mints.slice(i, i + CHUNK).map(fetchOne));
    }

    return result;
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    const metadata: Record<string, TokenMetadata> = {};
    mintAddresses.forEach(mint => {
      metadata[mint] = { name: 'Unknown Token', symbol: 'UNK', verified: false };
    });
    return metadata;
  }
}

export interface TransactionResult {
  success: boolean;
  signature?: string;
  error?: string;
}

export async function sendSolTransaction(
  fromKeypair: Keypair,
  toAddress: string,
  amount: number
): Promise<TransactionResult> {
  try {
    const transaction = new Transaction();
    const transferInstruction = SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: new PublicKey(toAddress),
      lamports: Math.floor(amount * LAMPORTS_PER_SOL),
    });
    
    transaction.add(transferInstruction);
    
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [fromKeypair]
    );
    
    return {
      success: true,
      signature,
    };
  } catch (error) {
    console.error('Error sending SOL transaction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function sendSplTokenTransaction(
  fromKeypair: Keypair,
  toAddress: string,
  amount: number,
  mint: string,
  decimals: number
): Promise<TransactionResult> {
  try {
    const mintPubkey = new PublicKey(mint);
    const toPubkey = new PublicKey(toAddress);
    
    const fromTokenAccount = await getAssociatedTokenAddress(
      mintPubkey,
      fromKeypair.publicKey
    );
    
    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      fromKeypair,
      mintPubkey,
      toPubkey
    );
    
    const transaction = new Transaction();
    const transferInstruction = createTransferInstruction(
      fromTokenAccount,
      toTokenAccount.address,
      fromKeypair.publicKey,
      Math.floor(amount * Math.pow(10, decimals))
    );
    
    transaction.add(transferInstruction);
    
    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [fromKeypair]
    );
    
    return {
      success: true,
      signature,
    };
  } catch (error) {
    console.error('Error sending SPL token transaction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export async function getWithdrawableTokens(publicKey: string): Promise<WithdrawableToken[]> {
  try {
    const [holdings, solBalance] = await Promise.all([
      getSplTokenHoldings(publicKey),
      getSolBalance(publicKey),
    ]);
    
    const mintAddresses = holdings.map(h => h.mint);
    const [tokenPrices, solPrice, metadataMap] = await Promise.all([
      getTokenPrices(mintAddresses),
      getSolPrice(),
      getTokenMetadata(mintAddresses),
    ]);
    
    const tokens: WithdrawableToken[] = [];
    
    if (solBalance > 0) {
      tokens.push({
        type: 'SOL',
        mint: 'So11111111111111111111111111111111111111112', 
        symbol: 'SOL',
        name: 'Solana',
        logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
        balance: solBalance,
        decimals: 9,
        usdPrice: solPrice || undefined,
        totalUsdValue: solPrice ? solBalance * solPrice : undefined,
      });
    }
    
    holdings.forEach(holding => {
      if (holding.amount > 0) {
        const metadata = metadataMap[holding.mint];
        const usdPrice = tokenPrices[holding.mint];
        
        tokens.push({
          type: 'SPL',
          mint: holding.mint,
          symbol: metadata?.symbol || 'UNK',
          name: metadata?.name || 'Unknown Token',
          logoURI: metadata?.logoURI,
          balance: holding.amount,
          decimals: holding.decimals,
          usdPrice,
          totalUsdValue: usdPrice ? holding.amount * usdPrice : undefined,
          tokenAccount: holding.tokenAccount,
        });
      }
    });
    
    return tokens;
  } catch (error) {
    console.error('Error getting withdrawable tokens:', error);
    return [];
  }
}



