
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionFlow } from "@/components/visualization/TransactionFlow";
import { WalletSearch } from "@/components/search/WalletSearch";
import { useWalletData } from "@/hooks/useWalletData";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Info, RefreshCw, Download, Maximize2 } from "lucide-react";

const TransactionFlowPage = () => {
  const { walletData, isLoading, analyzeWallet, walletAddress, refetch } = useWalletData();
  const [searchParams] = useSearchParams();
  const [fullscreen, setFullscreen] = useState(false);
  
  // Apply dark mode settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        if (parsedSettings.general.darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (err) {
        console.error("Error parsing saved settings:", err);
      }
    }
  }, []);
  
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

  // Function to export flow data as JSON
  const exportFlowData = () => {
    if (!walletData?.flowData) return;
    
    const dataStr = JSON.stringify(walletData.flowData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${walletAddress}-flow-data.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Flow data exported",
      description: "Transaction flow data has been exported to a JSON file",
    });
  };

  // Toggle fullscreen mode for better visualization
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-3xl font-bold">Transaction Flow Analysis</h1>
          
          {walletAddress && (
            <div className="flex items-center gap-2 mt-2 md:mt-0">
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
              
              <Button
                variant="outline"
                size="sm"
                onClick={exportFlowData}
                className="flex items-center gap-2"
                disabled={isLoading || !walletData?.flowData}
              >
                <Download className="h-4 w-4" />
                Export Data
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                className="flex items-center gap-2"
                disabled={isLoading}
              >
                <Maximize2 className="h-4 w-4" />
                {fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </Button>
            </div>
          )}
        </div>
        
        {!fullscreen && (
          <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Flow Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <WalletSearch onSearch={analyzeWallet} isLoading={isLoading} />
            </CardContent>
          </Card>
        )}
        
        <TransactionFlow 
          data={walletData?.flowData} 
          isLoading={isLoading} 
          walletAddress={walletAddress}
          fullscreen={fullscreen}
        />
        
        {walletAddress && !isLoading && walletData?.flowData && !fullscreen && (
          <div className="flex items-start p-4 bg-yellow-900/20 border border-yellow-900/30 rounded-md space-x-3">
            <Info className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm text-yellow-300 font-medium">Visualization Notice</p>
              <p className="text-xs text-yellow-300/80">
                Due to RPC limitations, you're viewing demonstration data generated for wallet 
                <span className="font-mono bg-yellow-900/30 px-1 mx-1 rounded">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>. 
                For production use, add your own Helius API key in Settings.
              </p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TransactionFlowPage;
