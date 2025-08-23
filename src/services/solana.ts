import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';

const DEVNET_RPC = clusterApiUrl('devnet');
export const connection = new Connection(DEVNET_RPC, 'confirmed');

const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

export interface SplTokenHolding {
  mint: string;
  amount: number;
  decimals: number;
  tokenAccount: string;
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
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const lamports = await connection.getBalance(new PublicKey(ownerPubkey));
  return lamports / LAMPORTS_PER_SOL;
}