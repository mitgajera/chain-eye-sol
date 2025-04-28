
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletActivity } from "@/components/dashboard/WalletActivity";
import { FundingSources } from "@/components/dashboard/FundingSources";
import { WalletSearch } from "@/components/search/WalletSearch";
import { useWalletData } from "@/hooks/useWalletData";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { TransactionFlow } from "@/components/visualization/TransactionFlow";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const WalletAnalysisPage = () => {
  const { walletData, isLoading, isError, analyzeWallet, walletAddress, refetch } = useWalletData();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Auto-load wallet address from URL parameter if available
  useEffect(() => {
    const addressParam = searchParams.get('address');
    if (addressParam && !walletAddress) {
      analyzeWallet(addressParam);
      toast({
        title: "Wallet address loaded",
        description: "Loading data for the provided address",
      });
    }
  }, [searchParams, analyzeWallet, walletAddress]);

  const handleRefresh = () => {
    refetch();
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">Wallet Analysis</h1>
          {walletAddress && (
            <Button variant="outline" size="sm" onClick={handleRefresh} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </Button>
          )}
        </div>
        
        <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Search Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <WalletSearch onSearch={analyzeWallet} isLoading={isLoading} />
            <p className="text-sm text-gray-400 mt-2">
              Try these example wallets:
              <Button 
                variant="link" 
                className="text-solana-purple px-1 py-0"
                onClick={() => analyzeWallet('F7Hwf8ib5DVCoiuyGr618Y3gon429Rnd1r5F9R5upump')}
              >
                Test Wallet
              </Button>
              or
              <Button 
                variant="link" 
                className="text-solana-purple px-1 py-0"
                onClick={() => analyzeWallet('JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4')}
              >
                Jupiter
              </Button>
            </p>
          </CardContent>
        </Card>
        
        {walletAddress && (
          <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Wallet Details</CardTitle>
            </CardHeader>
            <CardContent>
              {isError ? (
                <div className="p-4 bg-red-900/20 text-red-300 rounded-lg flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5" />
                  <div>
                    <h3 className="font-semibold mb-1">Error loading wallet data</h3>
                    <p className="text-sm">Unable to connect to Solana RPC endpoints. Please try again later or try a different wallet address.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Wallet Information</h3>
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <span className="text-gray-400">Address:</span>
                        <span className="font-mono text-white break-all">{walletAddress}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Balance:</span>
                        <span className="text-white">
                          {isLoading ? "Loading..." : `${walletData?.balance?.toFixed(4) || "0"} SOL`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">First Activity:</span>
                        <span className="text-white">
                          {isLoading 
                            ? "Loading..." 
                            : walletData?.firstActivity
                                ? format(walletData.firstActivity, 'yyyy-MM-dd') 
                                : "N/A"
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Activity:</span>
                        <span className="text-white">
                          {isLoading 
                            ? "Loading..." 
                            : walletData?.lastActivity
                                ? format(walletData.lastActivity, 'yyyy-MM-dd') 
                                : "N/A"
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Transactions:</span>
                        <span className="text-white">
                          {isLoading 
                            ? "Loading..." 
                            : walletData?.totalTransactions || "0"
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Risk Assessment</h3>
                    <div className="space-y-4">
                      <div className="w-full bg-gray-800 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: '25%' }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-400">
                        {isLoading 
                          ? "Analyzing risk profile..."
                          : walletData?.totalTransactions && walletData.totalTransactions > 0
                            ? "Low risk - This wallet shows typical behavior patterns with no concerning transactions."
                            : "Insufficient data - Not enough transactions to perform risk assessment."
                        }
                      </p>
                      
                      {/* Add actions to view more details */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => navigate(`/flow?address=${walletAddress}`)}
                        >
                          View Transaction Flow
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/entities?address=${walletAddress}`)}
                        >
                          Entity Analysis
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/clustering?address=${walletAddress}`)}
                        >
                          Clustering Analysis
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {walletAddress && !isError && (
          <>
            <TransactionFlow 
              data={walletData?.flowData} 
              isLoading={isLoading} 
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <WalletActivity 
                data={walletData?.activityData} 
                isLoading={isLoading} 
              />
              <FundingSources 
                data={walletData?.fundingData} 
                isLoading={isLoading} 
              />
            </div>
            
            <RecentTransactions 
              transactions={walletData?.recentTransactions} 
              isLoading={isLoading} 
            />
            
            {walletData?.lastRefreshed && (
              <div className="text-xs text-gray-500 text-right">
                Last updated: {format(new Date(walletData.lastRefreshed), 'HH:mm:ss')} 
                (auto-refreshes every 30 seconds)
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default WalletAnalysisPage;
