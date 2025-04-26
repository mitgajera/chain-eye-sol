
import { Connection, PublicKey, ParsedTransactionWithMeta } from '@solana/web3.js';

// Updated Solana RPC endpoints
const RPC_ENDPOINTS = {
  MAINNET: 'https://api.mainnet-beta.solana.com',
  DEVNET: 'https://api.devnet.solana.com',
  QUICKNODE: 'https://solana-mainnet.g.alchemy.com/v2/demo', // Public demo endpoint
  GENESYSGO: 'https://ssc-dao.genesysgo.net', // Public endpoint
  PUBLIC_RPC: 'https://api.mainnet-beta.solana.com', // Default public RPC
  HELIUS_DEMO: 'https://rpc.helius.xyz/?api-key=1bd65ee3-0c4f-438f-9e8d-c3d47f436177' // Updated Helius endpoint
};

export class SolanaClient {
  private connections: Connection[];
  private currentConnectionIndex: number = 0;

  constructor() {
    // Create multiple connections to different endpoints for redundancy
    this.connections = [
      new Connection(RPC_ENDPOINTS.PUBLIC_RPC),
      new Connection(RPC_ENDPOINTS.GENESYSGO),
      new Connection(RPC_ENDPOINTS.QUICKNODE),
      new Connection(RPC_ENDPOINTS.HELIUS_DEMO)
    ];
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
    
    // Try all connections until one works
    for (let attempt = 0; attempt < this.connections.length; attempt++) {
      try {
        const balance = await this.connection.getBalance(pubkey);
        return balance / 10 ** 9; // Convert lamports to SOL
      } catch (error) {
        console.warn(`Error with connection ${this.currentConnectionIndex}, trying next one:`, error);
        this.switchConnection();
      }
    }
    
    // If all connections fail
    throw new Error("Failed to get balance after trying all endpoints");
  }

  async getTransactions(address: string, limit = 20): Promise<ParsedTransactionWithMeta[]> {
    const pubkey = new PublicKey(address);
    
    // Try all connections until one works
    for (let attempt = 0; attempt < this.connections.length; attempt++) {
      try {
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
        console.warn(`Error with connection ${this.currentConnectionIndex}, trying next one:`, error);
        this.switchConnection();
      }
    }
    
    // If all connections fail
    console.log("Failed to get transactions after trying all endpoints");
    return [];
  }

  async getAccountInfo(address: string): Promise<any> {
    const pubkey = new PublicKey(address);
    
    // Try all connections until one works
    for (let attempt = 0; attempt < this.connections.length; attempt++) {
      try {
        const accountInfo = await this.connection.getAccountInfo(pubkey);
        return accountInfo;
      } catch (error) {
        console.warn(`Error with connection ${this.currentConnectionIndex}, trying next one:`, error);
        this.switchConnection();
      }
    }
    
    // If all connections fail
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
