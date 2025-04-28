
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { solanaClient } from '@/lib/solana';
import { 
  transactionsToFlowData, 
  processWalletActivity, 
  processFundingSources,
  processRecentTransactions
} from '@/lib/dataProcessing';
import { toast } from '@/hooks/use-toast';
import { knownEntities } from '@/lib/entityDatabase';

// Reduce refresh interval to 30 seconds for faster updates
const REFRESH_INTERVAL = 30000;

export type Transaction = {
  id: string;
  from: string;
  to: string;
  amount: string;
  timestamp: string;
  status: "confirmed" | "pending" | "failed";
  type: "transfer" | "swap" | "deposit" | "withdrawal" | "unknown";
};

export type WalletDataType = {
  address: string;
  balance: number;
  transactions: any[];
  flowData: {
    nodes: {
      id: string;
      label: string;
      value: number;
      type: string;
    }[];
    edges: {
      from: string;
      to: string;
      value: number;
      label: string;
    }[];
  };
  activityData: { name: string, transactions: number }[];
  fundingData: { name: string, value: number }[];
  recentTransactions: Transaction[];
  firstActivity: Date | null;
  lastActivity: Date | null;
  totalTransactions: number;
  lastRefreshed: Date;
  clusterData?: { name: string, addresses: string[], txCount: number }[];
};

export function useWalletData(address: string = '') {
  const [walletAddress, setWalletAddress] = useState<string>(address);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const { 
    data: walletData,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['walletData', walletAddress, retryCount],
    queryFn: async () => {
      if (!walletAddress) return null;
      
      try {
        console.log("Fetching data for wallet", walletAddress);
        
        // Get balance
        console.log("Getting balance...");
        const balance = await solanaClient.getBalance(walletAddress);
        console.log("Balance retrieved:", balance);
        
        // Get transactions
        console.log("Getting transactions...");
        const transactions = await solanaClient.getTransactions(walletAddress, 50);
        console.log("Retrieved transactions count:", transactions.length);
        
        // Reset error count on successful fetch
        setErrorCount(0);
        
        // If no transactions were found
        if (transactions.length === 0) {
          return {
            address: walletAddress,
            balance,
            transactions: [],
            flowData: { 
              nodes: [{ 
                id: walletAddress, 
                label: walletAddress.substring(0, 4) + '...' + walletAddress.substring(walletAddress.length - 4), 
                value: 50, 
                type: 'source' 
              }], 
              edges: [] 
            },
            activityData: [],
            fundingData: [],
            recentTransactions: [],
            firstActivity: null,
            lastActivity: null,
            totalTransactions: 0,
            lastRefreshed: new Date()
          } as WalletDataType;
        }
        
        // Transform data for visualizations
        console.log("Transforming data for visualizations...");
        const flowData = transactionsToFlowData(walletAddress, transactions);
        const activityData = processWalletActivity(transactions);
        const fundingData = processFundingSources(transactions);
        const recentTxs = processRecentTransactions(transactions, walletAddress) as Transaction[];
        
        // First and last activity dates
        let firstActivity = null;
        let lastActivity = null;
        
        if (transactions.length > 0) {
          // Find transactions with valid timestamps
          const timestampedTxs = transactions.filter(tx => tx.blockTime);
          
          if (timestampedTxs.length > 0) {
            // Sort by timestamp
            const sortedTxs = [...timestampedTxs].sort((a, b) => 
              (a.blockTime || 0) - (b.blockTime || 0)
            );
            
            firstActivity = new Date(sortedTxs[0].blockTime! * 1000);
            lastActivity = new Date(sortedTxs[sortedTxs.length - 1].blockTime! * 1000);
          }
        }
        
        // Create clusters data for clustering visualization
        const clusterData = createClusters(transactions, walletAddress);
        
        return {
          address: walletAddress,
          balance,
          transactions,
          flowData,
          activityData,
          fundingData,
          recentTransactions: recentTxs,
          firstActivity,
          lastActivity,
          totalTransactions: transactions.length,
          lastRefreshed: new Date(),
          clusterData
        } as WalletDataType;
      } catch (err) {
        // Increment error count
        setErrorCount(prev => prev + 1);
        
        console.error("Error fetching wallet data:", err);
        toast({
          title: "Error fetching data",
          description: err instanceof Error ? err.message : "Unknown error occurred. Trying alternative RPC endpoints.",
          variant: "destructive"
        });
        
        throw err;
      }
    },
    enabled: Boolean(walletAddress),
    retry: 3,
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000), // Exponential backoff
    refetchInterval: REFRESH_INTERVAL, // Refetch data every 30 seconds
    refetchIntervalInBackground: false,
  });

  // Helper function to create clusters from transactions
  function createClusters(transactions: any[], walletAddress: string) {
    if (!transactions || transactions.length === 0) return [];
    
    const addressFrequency: Record<string, number> = {};
    const clusters: { name: string, addresses: string[], txCount: number }[] = [];
    
    // Count address occurrences
    transactions.forEach(tx => {
      if (!tx.meta || !tx.transaction) return;
      
      const addresses = tx.transaction.message.accountKeys
        .map((key: any) => key.pubkey.toString())
        .filter((addr: string) => addr !== walletAddress);
      
      addresses.forEach(addr => {
        addressFrequency[addr] = (addressFrequency[addr] || 0) + 1;
      });
    });
    
    // Form clusters based on frequency
    const highFrequency = Object.entries(addressFrequency)
      .filter(([_, count]) => count > 1)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 5);
    
    // Create clusters
    if (highFrequency.length > 0) {
      clusters.push({
        name: 'Frequent Interactions',
        addresses: highFrequency.map(([addr]) => addr),
        txCount: highFrequency.reduce((sum, [_, count]) => sum + count, 0)
      });
    }
    
    // Add exchange cluster if any
    const exchangeAddresses = Object.keys(addressFrequency).filter(addr => 
      Object.keys(knownEntities).includes(addr) && 
      knownEntities[addr]?.type === 'exchange'
    );
    
    if (exchangeAddresses.length > 0) {
      clusters.push({
        name: 'Exchange Activity',
        addresses: exchangeAddresses,
        txCount: exchangeAddresses.reduce((sum, addr) => sum + addressFrequency[addr], 0)
      });
    }
    
    // Add a NFT cluster if any
    const nftAddresses = Object.keys(addressFrequency).filter(addr => 
      Object.keys(knownEntities).includes(addr) && 
      knownEntities[addr]?.type === 'marketplace'
    );
    
    if (nftAddresses.length > 0) {
      clusters.push({
        name: 'NFT Activity',
        addresses: nftAddresses,
        txCount: nftAddresses.reduce((sum, addr) => sum + addressFrequency[addr], 0)
      });
    }
    
    return clusters;
  }

  // Set up auto-refresh
  useEffect(() => {
    if (walletAddress) {
      // Initial fetch
      refetch();
      
      // Only show auto-refresh toast if we haven't shown too many error messages
      if (errorCount < 3) {
        // Notify user about auto-refresh
        toast({
          title: "Auto-refresh enabled",
          description: "Transaction data will update every 30 seconds",
        });
      }
      
      // Set up polling for real-time updates
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      
      pollingIntervalRef.current = setInterval(() => {
        console.log("Auto-refreshing data...");
        refetch();
      }, REFRESH_INTERVAL);
    }
    
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [walletAddress, refetch, errorCount]);

  const analyzeWallet = (address: string) => {
    setWalletAddress(address);
  };

  // Manual refresh function with retry counter to force a refetch
  const forceRefresh = () => {
    setRetryCount(prev => prev + 1);
    refetch();
    toast({
      title: "Refreshing data",
      description: "Fetching latest wallet information...",
    });
  };

  return {
    walletData,
    isLoading,
    isError,
    error,
    analyzeWallet,
    refetch: forceRefresh,
    walletAddress
  };
}
