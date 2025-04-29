
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionFlow } from "@/components/visualization/TransactionFlow";
import { WalletSearch } from "@/components/search/WalletSearch";
import { useWalletData } from "@/hooks/useWalletData";
import { toast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const TransactionFlowPage = () => {
  const { walletData, isLoading, analyzeWallet, walletAddress, refetch } = useWalletData();
  const [searchParams] = useSearchParams();
  
  // Auto-load wallet address from URL parameter if available
  useEffect(() => {
    const addressParam = searchParams.get('address');
    if (addressParam && !walletAddress) {
      analyzeWallet(addressParam);
      toast({
        title: "Wallet address loaded",
        description: "Loading transaction flow data for the provided address",
      });
    }
  }, [searchParams, analyzeWallet, walletAddress]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-3xl font-bold">Transaction Flow Analysis</h1>
          
          {walletAddress && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </Button>
          )}
        </div>
        
        <Card className="border-border/30">
          <CardHeader>
            <CardTitle>Flow Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <WalletSearch onSearch={analyzeWallet} isLoading={isLoading} />
          </CardContent>
        </Card>
        
        <TransactionFlow 
          data={walletData?.flowData} 
          isLoading={isLoading} 
          walletAddress={walletAddress}
        />
        
        {walletAddress && !isLoading && walletData?.flowData && (
          <div className="text-xs text-gray-500 text-right">
            Note: You are viewing demonstration data generated for this wallet address.
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TransactionFlowPage;
