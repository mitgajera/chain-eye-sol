
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletActivity } from "@/components/dashboard/WalletActivity";
import { FundingSources } from "@/components/dashboard/FundingSources";

const WalletAnalysisPage = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Wallet Analysis</h1>
        
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
                    <span className="font-mono">Hx7zN...1f3h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Balance:</span>
                    <span>324.45 SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">First Activity:</span>
                    <span>2022-09-18</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Activity:</span>
                    <span>2023-12-01</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium">Risk Assessment</h3>
                <div className="mt-4 space-y-1">
                  <div className="w-full bg-secondary rounded-full h-2 mb-4">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Low risk - This wallet shows typical behavior patterns
                    with no concerning transactions.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <WalletActivity />
          <FundingSources />
        </div>
      </div>
    </MainLayout>
  );
};

export default WalletAnalysisPage;
