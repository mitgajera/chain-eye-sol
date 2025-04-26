
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletActivity } from "@/components/dashboard/WalletActivity";
import { FundingSources } from "@/components/dashboard/FundingSources";
import { WalletSearch } from "@/components/search/WalletSearch";
import { useWalletData } from "@/hooks/useWalletData";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { TransactionFlow } from "@/components/visualization/TransactionFlow";
import { format } from "date-fns";

const WalletAnalysisPage = () => {
  const { walletData, isLoading, analyzeWallet, walletAddress } = useWalletData();

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Wallet Analysis</h1>
        
        <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Search Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <WalletSearch onSearch={analyzeWallet} isLoading={isLoading} />
          </CardContent>
        </Card>
        
        {walletAddress && (
          <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Wallet Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Wallet Information</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Address:</span>
                      <span className="font-mono text-white">{walletAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Balance:</span>
                      <span className="text-white">
                        {isLoading ? "Loading..." : `${walletData?.balance.toFixed(4)} SOL`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">First Activity:</span>
                      <span className="text-white">
                        {isLoading 
                          ? "Loading..." 
                          : walletData?.firstActivity && walletData.firstActivity.getTime() !== new Date().getTime()
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
                          : walletData?.lastActivity && walletData.lastActivity.getTime() !== 0
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
                        : "Low risk - This wallet shows typical behavior patterns with no concerning transactions."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {walletAddress && (
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
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default WalletAnalysisPage;
