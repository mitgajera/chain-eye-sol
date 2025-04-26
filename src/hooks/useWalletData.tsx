
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

// Reduced polling interval to 30 seconds
const REFRESH_INTERVAL = 30000;

export function useWalletData(address: string = '') {
  const [walletAddress, setWalletAddress] = useState<string>(address);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [errorCount, setErrorCount] = useState(0);

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
    queryKey: ['walletData', walletAddress],
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
            flowData: { nodes: [{ id: walletAddress, label: walletAddress.substring(0, 4) + '...' + walletAddress.substring(walletAddress.length - 4), value: 50, type: 'source' as const }], edges: [] },
            activityData: [],
            fundingData: [],
            recentTransactions: [],
            firstActivity: null,
            lastActivity: null,
            totalTransactions: 0,
            lastRefreshed: new Date()
          };
        }
        
        // Transform data for visualizations
        console.log("Transforming data for visualizations...");
        const flowData = transactionsToFlowData(walletAddress, transactions);
        const activityData = processWalletActivity(transactions);
        const fundingData = processFundingSources(transactions);
        const recentTxs = processRecentTransactions(transactions, walletAddress);
        
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
          lastRefreshed: new Date()
        };
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
    retry: 2,
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000), // Exponential backoff
    refetchInterval: REFRESH_INTERVAL, // Refetch data every 30 seconds
    refetchIntervalInBackground: false,
  });

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
      
      // If too many errors, slow down the polling
      const interval = errorCount > 5 ? 60000 : REFRESH_INTERVAL;
      
      pollingIntervalRef.current = setInterval(() => {
        console.log("Auto-refreshing data...");
        refetch();
      }, interval);
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

  return {
    walletData,
    isLoading,
    isError,
    error,
    analyzeWallet,
    refetch,
    walletAddress
  };
}
