import { Connection, PublicKey, LAMPORTS_PER_SOL, Transaction, SystemProgram, sendAndConfirmTransaction, Keypair } from '@solana/web3.js';
import { createTransferInstruction, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, getAccount } from '@solana/spl-token';
import { HELIUS_MAINNET_RPC_URL } from '@env';

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
  tokenAccount?: string; // Only for SPL tokens
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
    if (mintAddresses.length === 0) return {};
    
    // Use Jupiter's verified token list
    const response = await fetch('https://token.jup.ag/verified');
    
    if (!response.ok) {
      throw new Error(`Token list API responded with status: ${response.status}`);
    }
    
    const tokenList = await response.json();
    const metadata: Record<string, TokenMetadata> = {};
    
    // Create a map for faster lookup
    const tokenMap = new Map();
    tokenList.forEach((token: any) => {
      if (token.address) {
        tokenMap.set(token.address, {
          name: token.name || 'Unknown Token',
          symbol: token.symbol || 'UNK',
          logoURI: token.logoURI,
          verified: true,
        });
      }
    });
    
    // Get metadata for requested mints
    mintAddresses.forEach(mint => {
      metadata[mint] = tokenMap.get(mint) || {
        name: 'Unknown Token',
        symbol: 'UNK',
        verified: false,
      };
    });
    
    return metadata;
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    // Return default metadata for all mints
    const metadata: Record<string, TokenMetadata> = {};
    mintAddresses.forEach(mint => {
      metadata[mint] = {
        name: 'Unknown Token',
        symbol: 'UNK',
        verified: false,
      };
    });
    return metadata;
  }
}

export async function getWithdrawableTokens(publicKey: string): Promise<WithdrawableToken[]> {
  try {
    const [holdings, solBalance] = await Promise.all([
      getSplTokenHoldings(publicKey),
      getSolBalance(publicKey),
    ]);
    
    const mintAddresses = holdings.map(h => h.mint);
    const [tokenPrices, metadata, solPrice] = await Promise.all([
      getTokenPrices(mintAddresses),
      getTokenMetadata(mintAddresses),
      getSolPrice(),
    ]);
    
    const tokens: WithdrawableToken[] = [];
    
    // Add SOL
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
    
    // Add SPL tokens
    holdings.forEach(holding => {
      const meta = metadata[holding.mint];
      const price = tokenPrices[holding.mint];
      
      tokens.push({
        type: 'SPL',
        mint: holding.mint,
        symbol: meta?.symbol || 'UNK',
        name: meta?.name || 'Unknown Token',
        logoURI: meta?.logoURI,
        balance: holding.amount,
        decimals: holding.decimals,
        usdPrice: price,
        totalUsdValue: price ? holding.amount * price : undefined,
        tokenAccount: holding.tokenAccount,
      });
    });
    
    return tokens;
  } catch (error) {
    console.error('Error fetching withdrawable tokens:', error);
    return [];
  }
}

export async function sendSolTransaction(
  fromPrivateKey: string,
  toAddress: string,
  amount: number // in SOL
): Promise<string> {
  try {
    const fromKeypair = Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(fromPrivateKey))
    );
    const toPublicKey = new PublicKey(toAddress);
    
    const lamports = Math.floor(amount * LAMPORTS_PER_SOL);
    
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey: toPublicKey,
        lamports,
      })
    );
    
    const signature = await sendAndConfirmTransaction(connection, transaction, [fromKeypair]);
    return signature;
  } catch (error) {
    console.error('Error sending SOL:', error);
    throw error;
  }
}

export async function sendSplTokenTransaction(
  fromPrivateKey: string,
  toAddress: string,
  tokenMint: string,
  amount: number,
  decimals: number,
  fromTokenAccount: string
): Promise<string> {
  try {
    const fromKeypair = Keypair.fromSecretKey(
      new Uint8Array(JSON.parse(fromPrivateKey))
    );
    const toPublicKey = new PublicKey(toAddress);
    const mintPublicKey = new PublicKey(tokenMint);
    const fromTokenAccountPubkey = new PublicKey(fromTokenAccount);
    
    // Get or create associated token account for recipient
    const toTokenAccount = await getAssociatedTokenAddress(
      mintPublicKey,
      toPublicKey
    );
    
    const transaction = new Transaction();
    
    // Check if recipient's token account exists
    try {
      await getAccount(connection, toTokenAccount);
    } catch (error) {
      // Account doesn't exist, create it
      transaction.add(
        createAssociatedTokenAccountInstruction(
          fromKeypair.publicKey, // payer
          toTokenAccount, // associated token account
          toPublicKey, // owner
          mintPublicKey // mint
        )
      );
    }
    
    // Add transfer instruction
    const transferAmount = Math.floor(amount * Math.pow(10, decimals));
    transaction.add(
      createTransferInstruction(
        fromTokenAccountPubkey, // source
        toTokenAccount, // destination
        fromKeypair.publicKey, // owner
        transferAmount
      )
    );
    
    const signature = await sendAndConfirmTransaction(connection, transaction, [fromKeypair]);
    return signature;
  } catch (error) {
    console.error('Error sending SPL token:', error);
    throw error;
  }
}