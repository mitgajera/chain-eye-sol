
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletSearch } from "@/components/search/WalletSearch";
import { useWalletData } from "@/hooks/useWalletData";
import { Badge } from "@/components/ui/badge";
import { shortenAddress } from "@/lib/solana";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const ClusteringPage = () => {
  const { walletData, isLoading, analyzeWallet, walletAddress, refetch } = useWalletData();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-3xl font-bold text-white mb-4 md:mb-0">Address Clustering</h1>
          {walletAddress && (
            <Button variant="outline" size="sm" onClick={() => refetch()} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </Button>
          )}
        </div>

        <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Search Wallet</CardTitle>
            <CardDescription>
              Enter a Solana wallet address to analyze transaction clusters
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WalletSearch onSearch={analyzeWallet} isLoading={isLoading} />
          </CardContent>
        </Card>

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-[120px] w-full" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        )}

        {walletData && walletData.clusterData && walletData.clusterData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {walletData.clusterData.map((cluster, index) => (
              <Card key={index} className="border-gray-800 bg-black/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{cluster.name}</span>
                    <Badge variant="outline">{cluster.txCount} Transactions</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {cluster.addresses.map((address) => (
                      <li key={address} className="bg-gray-900 p-3 rounded-md">
                        <div className="flex justify-between">
                          <span className="font-mono text-sm text-gray-400">{shortenAddress(address, 6)}</span>
                          <Badge variant="secondary">{walletData.flowData.nodes.find(n => n.id === address)?.label || 'Unknown'}</Badge>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : walletAddress ? (
          <Card className="border-gray-800 bg-black/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>No Clusters Found</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                No address clusters were detected for this wallet. This could mean the wallet has few transactions or interacts with unique addresses each time.
              </p>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </MainLayout>
  );
};

export default ClusteringPage;
