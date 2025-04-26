
import { Connection, PublicKey, ParsedTransactionWithMeta } from '@solana/web3.js';

// Updated Solana RPC endpoints with working public endpoints
const RPC_ENDPOINTS = {
  MAINNET: 'https://api.mainnet-beta.solana.com',
  DEVNET: 'https://api.devnet.solana.com',
  QUICKNODE: 'https://solana-mainnet.g.alchemy.com/v2/demo',
  PUBLIC_RPC1: 'https://free.rpcpool.com',
  PUBLIC_RPC2: 'https://api.mainnet-beta.solana.com',
  HELIUS: 'https://mainnet.helius-rpc.com/?api-key=1bd65ee3-0c4f-438f-9e8d-c3d47f436177'
};

export class SolanaClient {
  private connections: Connection[];
  private currentConnectionIndex: number = 0;

  constructor() {
    // Create multiple connections to different endpoints for redundancy
    this.connections = [
      new Connection(RPC_ENDPOINTS.PUBLIC_RPC1),
      new Connection(RPC_ENDPOINTS.PUBLIC_RPC2),
      new Connection(RPC_ENDPOINTS.QUICKNODE),
      new Connection(RPC_ENDPOINTS.HELIUS)
    ];
    console.log('SolanaClient initialized with multiple RPC endpoints');
  }

  // Switch to next available connection
  private switchConnection() {
    this.currentConnectionIndex = (this.currentConnectionIndex + 1) % this.connections.length;
    console.log(`Switched to RPC endpoint ${this.currentConnectionIndex}`);
    return this.connections[this.currentConnectionIndex];
  }

  // Get current connection
  private get connection() {
    return this.connections[this.currentConnectionIndex];
  }

  async getBalance(address: string): Promise<number> {
    const pubkey = new PublicKey(address);
    let lastError;
    
    // Try all connections until one works
    for (let attempt = 0; attempt < this.connections.length * 2; attempt++) {
      try {
        console.log(`Attempting to get balance using endpoint ${this.currentConnectionIndex}`);
        const balance = await this.connection.getBalance(pubkey);
        console.log(`Balance retrieved successfully: ${balance / 10 ** 9} SOL`);
        return balance / 10 ** 9; // Convert lamports to SOL
      } catch (error) {
        lastError = error;
        console.warn(`Error with connection ${this.currentConnectionIndex}:`, error);
        this.switchConnection();
      }
    }
    
    // If all connections fail
    console.error("Failed to get balance after trying all endpoints", lastError);
    throw new Error("Failed to get balance after trying all endpoints");
  }

  async getTransactions(address: string, limit = 20): Promise<ParsedTransactionWithMeta[]> {
    const pubkey = new PublicKey(address);
    let lastError;
    
    // Try all connections until one works
    for (let attempt = 0; attempt < this.connections.length * 2; attempt++) {
      try {
        console.log(`Attempting to get transactions using endpoint ${this.currentConnectionIndex}`);
        const signatures = await this.connection.getSignaturesForAddress(pubkey, { limit });
        
        if (signatures.length === 0) {
          console.log("No transactions found for this address");
          return [];
        }

        console.log(`Found ${signatures.length} transaction signatures`);
        
        const transactions = await Promise.all(
          signatures.map(sig => this.connection.getParsedTransaction(sig.signature, { maxSupportedTransactionVersion: 0 }))
        );
        
        const validTransactions = transactions.filter((tx): tx is ParsedTransactionWithMeta => tx !== null);
        console.log(`Retrieved ${validTransactions.length} valid transactions`);
        
        return validTransactions;
      } catch (error) {
        lastError = error;
        console.warn(`Error with connection ${this.currentConnectionIndex}:`, error);
        this.switchConnection();
      }
    }
    
    // If all connections fail
    console.error("Failed to get transactions after trying all endpoints", lastError);
    return []; // Return empty array instead of throwing to avoid breaking the UI
  }

  async getAccountInfo(address: string): Promise<any> {
    const pubkey = new PublicKey(address);
    let lastError;
    
    // Try all connections until one works
    for (let attempt = 0; attempt < this.connections.length * 2; attempt++) {
      try {
        console.log(`Attempting to get account info using endpoint ${this.currentConnectionIndex}`);
        const accountInfo = await this.connection.getAccountInfo(pubkey);
        return accountInfo;
      } catch (error) {
        lastError = error;
        console.warn(`Error with connection ${this.currentConnectionIndex}:`, error);
        this.switchConnection();
      }
    }
    
    // If all connections fail
    console.error("Failed to get account info after trying all endpoints", lastError);
    throw new Error("Failed to get account info after trying all endpoints");
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
