
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { solanaClient } from '@/lib/solana';
import { 
  transactionsToFlowData, 
  processWalletActivity, 
  processFundingSources,
  processRecentTransactions
} from '@/lib/dataProcessing';
import { toast } from '@/hooks/use-toast';

export function useWalletData(address: string = '') {
  const [walletAddress, setWalletAddress] = useState<string>(address);

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
        // Get balance
        const balance = await solanaClient.getBalance(walletAddress);
        
        // Get transactions
        const transactions = await solanaClient.getTransactions(walletAddress, 50);
        
        // Transform data for visualizations
        const flowData = transactionsToFlowData(walletAddress, transactions);
        const activityData = processWalletActivity(transactions);
        const fundingData = processFundingSources(transactions);
        const recentTxs = processRecentTransactions(transactions, walletAddress);
        
        // First and last activity dates
        let firstActivity = new Date();
        let lastActivity = new Date(0);
        
        transactions.forEach(tx => {
          if (tx.blockTime) {
            const date = new Date(tx.blockTime * 1000);
            if (date < firstActivity) firstActivity = date;
            if (date > lastActivity) lastActivity = date;
          }
        });
        
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
          totalTransactions: transactions.length
        };
      } catch (err) {
        console.error("Error fetching wallet data:", err);
        toast({
          title: "Error fetching data",
          description: err instanceof Error ? err.message : "Unknown error occurred",
          variant: "destructive"
        });
        throw err;
      }
    },
    enabled: Boolean(walletAddress),
    retry: 1,
  });

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
