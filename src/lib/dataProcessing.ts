
import { ParsedTransactionWithMeta } from '@solana/web3.js';
import { shortenAddress } from './solana';

interface Node {
  id: string;
  label: string;
  value: number;
  type: 'source' | 'exchange' | 'destination' | 'intermediate';
}

interface Edge {
  from: string;
  to: string;
  value: number;
  label: string;
}

interface TransactionFlowData {
  nodes: Node[];
  edges: Edge[];
}

// Known exchanges and services for entity labeling
const knownEntities: Record<string, { name: string, type: string }> = {
  // Some well-known Solana addresses
  '1nc1nerator11111111111111111111111111111111': { name: 'Incinerator', type: 'system' },
  'SysvarRent111111111111111111111111111111111': { name: 'Rent Sysvar', type: 'system' },
  'SysvarC1ock11111111111111111111111111111111': { name: 'Clock Sysvar', type: 'system' },
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA': { name: 'Token Program', type: 'program' },
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL': { name: 'Associated Token Program', type: 'program' },
  'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4': { name: 'Jupiter', type: 'exchange' },
  'DZjbn4XC8qoHKikZqzmhemykVzmossoayV9ffbsUqxVj': { name: 'Raydium', type: 'exchange' },
  'srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX': { name: 'Serum', type: 'exchange' },
  'MEisE1HzehtrDpAAT8PnLHjpSSkRYakotTuJRPjTpo8': { name: 'Mango Markets', type: 'exchange' },
  '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1': { name: 'Marinade', type: 'staking' },
  '11111111111111111111111111111111': { name: 'System Program', type: 'system' },
};

export function identifyEntityType(address: string): { name: string, type: 'source' | 'exchange' | 'destination' | 'intermediate' | 'system' | 'program' | 'staking' | 'unknown' } {
  if (address in knownEntities) {
    return { 
      name: knownEntities[address].name, 
      type: knownEntities[address].type as any 
    };
  }
  return { name: shortenAddress(address), type: 'unknown' };
}

export function transactionsToFlowData(
  walletAddress: string,
  transactions: ParsedTransactionWithMeta[]
): TransactionFlowData {
  const nodes = new Map<string, Node>();
  const edges = new Map<string, Edge>();
  const sourceWallet = walletAddress;

  // Add source wallet node
  nodes.set(sourceWallet, {
    id: sourceWallet,
    label: shortenAddress(sourceWallet),
    value: 50,
    type: 'source'
  });

  transactions.forEach(tx => {
    if (!tx.meta || tx.meta.err) return;

    const preBalances = tx.meta.preBalances;
    const postBalances = tx.meta.postBalances;
    const accountKeys = tx.transaction.message.accountKeys.map(key => key.pubkey.toString());
    
    // Only process transactions with at least 2 accounts
    if (accountKeys.length < 2) return;

    // Process account balance changes to detect fund transfers
    accountKeys.forEach((address, index) => {
      if (address === sourceWallet) return; // Skip source wallet as it's already added
      
      const preBal = preBalances[index];
      const postBal = postBalances[index];
      const balChange = (postBal - preBal) / 10 ** 9; // Convert lamports to SOL
      
      // Skip accounts with no significant balance change
      if (Math.abs(balChange) < 0.001) return;

      // Identify entity type
      const entity = identifyEntityType(address);
      
      // Add node if it doesn't exist
      if (!nodes.has(address)) {
        nodes.set(address, {
          id: address,
          label: entity.name,
          value: 30,
          type: (entity.type === 'exchange' ? 'exchange' : 
                entity.type === 'system' || entity.type === 'program' ? 'intermediate' : 
                'destination')
        });
      }

      // Create edge representing fund transfer
      if (balChange < 0) {
        // Funds leaving
        const edgeId = `${address}-${sourceWallet}`;
        edges.set(edgeId, {
          from: address,
          to: sourceWallet,
          value: Math.abs(balChange),
          label: `${Math.abs(balChange).toFixed(2)} SOL`
        });
      } else if (balChange > 0) {
        // Funds receiving
        const edgeId = `${sourceWallet}-${address}`;
        edges.set(edgeId, {
          from: sourceWallet,
          to: address,
          value: balChange,
          label: `${balChange.toFixed(2)} SOL`
        });
      }
    });
  });

  return {
    nodes: Array.from(nodes.values()),
    edges: Array.from(edges.values())
  };
}

export function processWalletActivity(transactions: ParsedTransactionWithMeta[]): { name: string, transactions: number }[] {
  const monthlyActivity: Record<string, number> = {};
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Initialize all months with 0
  months.forEach(month => {
    monthlyActivity[month] = 0;
  });
  
  // Count transactions by month
  transactions.forEach(tx => {
    const timestamp = tx.blockTime ? new Date(tx.blockTime * 1000) : new Date();
    const month = months[timestamp.getMonth()];
    monthlyActivity[month]++;
  });
  
  // Convert to array format for chart
  return months.map(month => ({
    name: month,
    transactions: monthlyActivity[month]
  }));
}

export function processFundingSources(transactions: ParsedTransactionWithMeta[]): { name: string, value: number }[] {
  const sources: Record<string, number> = {
    "DEX Swaps": 0,
    "Known Exchanges": 0,
    "Other Wallets": 0,
    "Mining/Staking": 0,
  };
  
  transactions.forEach(tx => {
    if (!tx.meta || tx.meta.err) return;
    
    const accountKeys = tx.transaction.message.accountKeys.map(key => key.pubkey.toString());
    
    // Identify transaction type by checking involved accounts
    let classified = false;
    
    for (const account of accountKeys) {
      const entity = identifyEntityType(account);
      
      if (entity.type === 'exchange') {
        sources["Known Exchanges"] += 1;
        classified = true;
        break;
      } else if (entity.type === 'program' && 
                (account.includes('swap') || account.includes('dex') || account.includes('amm'))) {
        sources["DEX Swaps"] += 1;
        classified = true;
        break;
      } else if (entity.type === 'staking') {
        sources["Mining/Staking"] += 1;
        classified = true;
        break;
      }
    }
    
    if (!classified) {
      sources["Other Wallets"] += 1;
    }
  });
  
  // Convert to percentage
  const total = Object.values(sources).reduce((sum, count) => sum + count, 0) || 1;
  
  return Object.entries(sources).map(([name, count]) => ({
    name,
    value: Math.round((count / total) * 100)
  }));
}

export function processRecentTransactions(transactions: ParsedTransactionWithMeta[], walletAddress: string) {
  return transactions.slice(0, 5).map((tx, index) => {
    if (!tx.meta) {
      return {
        id: `tx${index}`,
        from: "Unknown",
        to: "Unknown",
        amount: "0 SOL",
        timestamp: new Date().toISOString(),
        status: "failed" as const, // Use const assertion to fix the type
        type: "unknown" as const  // Use const assertion to fix the type
      };
    }
    
    // Get sender and receiver from transaction
    const accountKeys = tx.transaction.message.accountKeys.map(key => key.pubkey.toString());
    const sender = accountKeys[0]; // Typically the fee payer
    let receiver = accountKeys[1];
    
    // Try to find the receiver (not the wallet address itself)
    if (receiver === walletAddress && accountKeys.length > 2) {
      receiver = accountKeys[2];
    }
    
    // Determine transaction type
    let type: "transfer" | "swap" | "deposit" | "withdrawal" | "unknown" = "transfer";
    if (accountKeys.some(account => {
      const entity = identifyEntityType(account);
      return entity.type === 'exchange';
    })) {
      type = sender === walletAddress ? "withdrawal" : "deposit";
    }
    
    // Calculate amount (rough estimate based on balance changes)
    let amount = "0";
    if (tx.meta.preBalances && tx.meta.postBalances) {
      const walletIndex = accountKeys.findIndex(addr => addr === walletAddress);
      if (walletIndex !== -1) {
        const balChange = (tx.meta.postBalances[walletIndex] - tx.meta.preBalances[walletIndex]) / 10 ** 9;
        amount = `${Math.abs(balChange).toFixed(2)} SOL`;
      }
    }
    
    // Ensure status is one of the allowed values: "confirmed" | "pending" | "failed"
    const status: "confirmed" | "pending" | "failed" = tx.meta.err ? "failed" : "confirmed";
    
    return {
      id: tx.transaction.signatures[0].substring(0, 8),
      from: shortenAddress(sender),
      to: shortenAddress(receiver),
      amount,
      timestamp: tx.blockTime ? new Date(tx.blockTime * 1000).toISOString() : new Date().toISOString(),
      status,
      type
    };
  });
}

