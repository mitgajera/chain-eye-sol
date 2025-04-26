
import { Connection, PublicKey, ParsedTransactionWithMeta } from '@solana/web3.js';

// Default Solana RPC endpoints
const RPC_ENDPOINTS = {
  MAINNET: 'https://api.mainnet-beta.solana.com',
  DEVNET: 'https://api.devnet.solana.com',
  HELIUS: 'https://mainnet.helius-rpc.com/?api-key=1bd65ee3-0c4f-438f-9e8d-c3d47f436177' // Using a temp API key
};

export class SolanaClient {
  private connection: Connection;
  private heliusConnection: Connection;

  constructor(endpoint = RPC_ENDPOINTS.MAINNET) {
    this.connection = new Connection(endpoint);
    this.heliusConnection = new Connection(RPC_ENDPOINTS.HELIUS);
  }

  async getBalance(address: string): Promise<number> {
    try {
      const pubkey = new PublicKey(address);
      // Try using Helius first for better reliability
      try {
        const balance = await this.heliusConnection.getBalance(pubkey);
        return balance / 10 ** 9; // Convert lamports to SOL
      } catch {
        // Fallback to regular endpoint
        const balance = await this.connection.getBalance(pubkey);
        return balance / 10 ** 9;
      }
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  async getTransactions(address: string, limit = 20): Promise<ParsedTransactionWithMeta[]> {
    try {
      const pubkey = new PublicKey(address);
      
      // Try Helius first for better reliability
      try {
        const signatures = await this.heliusConnection.getSignaturesForAddress(pubkey, { limit });
        
        const transactions = await Promise.all(
          signatures.map(sig => this.heliusConnection.getParsedTransaction(sig.signature, { maxSupportedTransactionVersion: 0 }))
        );
        
        return transactions.filter((tx): tx is ParsedTransactionWithMeta => tx !== null);
      } catch (error) {
        console.warn('Error using Helius, falling back to regular endpoint', error);
        
        // Fallback to regular endpoint
        const signatures = await this.connection.getSignaturesForAddress(pubkey, { limit });
        
        const transactions = await Promise.all(
          signatures.map(sig => this.connection.getParsedTransaction(sig.signature, { maxSupportedTransactionVersion: 0 }))
        );
        
        return transactions.filter((tx): tx is ParsedTransactionWithMeta => tx !== null);
      }
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
