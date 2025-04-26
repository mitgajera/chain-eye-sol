
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionFlow } from "@/components/visualization/TransactionFlow";
import { WalletSearch } from "@/components/search/WalletSearch";
import { useWalletData } from "@/hooks/useWalletData";

const TransactionFlowPage = () => {
  const { walletData, isLoading, analyzeWallet, walletAddress } = useWalletData();

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Transaction Flow Analysis</h1>
        
        <Card className="border-border/30">
          <CardHeader>
            <CardTitle>Flow Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <WalletSearch onSearch={analyzeWallet} isLoading={isLoading} />
          </CardContent>
        </Card>
        
        <TransactionFlow data={walletData?.flowData} isLoading={isLoading} />
      </div>
    </MainLayout>
  );
};

export default TransactionFlowPage;
