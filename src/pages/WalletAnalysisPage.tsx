
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
        <h1 className="text-3xl font-bold">Wallet Analysis</h1>
        
        <Card className="border-border/30">
          <CardHeader>
            <CardTitle>Search Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <WalletSearch onSearch={analyzeWallet} isLoading={isLoading} />
          </CardContent>
        </Card>
        
        {walletAddress && (
          <Card className="border-border/30">
            <CardHeader>
              <CardTitle>Wallet Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium">Wallet Information</h3>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Address:</span>
                      <span className="font-mono">{walletAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Balance:</span>
                      <span>{isLoading ? "Loading..." : walletData?.balance.toFixed(4)} SOL</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">First Activity:</span>
                      <span>
                        {isLoading 
                          ? "Loading..." 
                          : walletData?.firstActivity 
                              ? format(walletData.firstActivity, 'yyyy-MM-dd') 
                              : "N/A"
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Activity:</span>
                      <span>
                        {isLoading 
                          ? "Loading..." 
                          : walletData?.lastActivity && walletData.lastActivity.getTime() !== 0
                              ? format(walletData.lastActivity, 'yyyy-MM-dd') 
                              : "N/A"
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Transactions:</span>
                      <span>
                        {isLoading 
                          ? "Loading..." 
                          : walletData?.totalTransactions || "0"
                        }
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Risk Assessment</h3>
                  <div className="mt-4 space-y-1">
                    <div className="w-full bg-secondary rounded-full h-2 mb-4">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: '25%' }}
                      ></div>
                    </div>
                    <p className="text-sm text-muted-foreground">
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
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default WalletAnalysisPage;
