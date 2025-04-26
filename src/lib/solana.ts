
import { Connection, PublicKey, ParsedTransactionWithMeta } from '@solana/web3.js';

// Default Solana RPC endpoints
const RPC_ENDPOINTS = {
  MAINNET: 'https://api.mainnet-beta.solana.com',
  DEVNET: 'https://api.devnet.solana.com',
};

export class SolanaClient {
  private connection: Connection;

  constructor(endpoint = RPC_ENDPOINTS.MAINNET) {
    this.connection = new Connection(endpoint);
  }

  async getBalance(address: string): Promise<number> {
    try {
      const pubkey = new PublicKey(address);
      const balance = await this.connection.getBalance(pubkey);
      return balance / 10 ** 9; // Convert lamports to SOL
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  async getTransactions(address: string, limit = 20): Promise<ParsedTransactionWithMeta[]> {
    try {
      const pubkey = new PublicKey(address);
      const signatures = await this.connection.getSignaturesForAddress(pubkey, { limit });
      
      const transactions = await Promise.all(
        signatures.map(sig => this.connection.getParsedTransaction(sig.signature, { maxSupportedTransactionVersion: 0 }))
      );
      
      return transactions.filter((tx): tx is ParsedTransactionWithMeta => tx !== null);
    } catch (error) {
      console.error('Error getting transactions:', error);
      throw error;
    }
  }

  async getAccountInfo(address: string): Promise<any> {
    try {
      const pubkey = new PublicKey(address);
      const accountInfo = await this.connection.getAccountInfo(pubkey);
      return accountInfo;
    } catch (error) {
      console.error('Error getting account info:', error);
      throw error;
    }
  }
}

export const solanaClient = new SolanaClient();

export function shortenAddress(address: string, chars = 4): string {
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
}

export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch (error) {
    return false;
  }
}
