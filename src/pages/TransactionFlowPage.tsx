
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionFlow } from "@/components/visualization/TransactionFlow";

const TransactionFlowPage = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Transaction Flow Analysis</h1>
        
        <Card className="border-border/30">
          <CardHeader>
            <CardTitle>Flow Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Configure transaction flow visualization parameters.</p>
          </CardContent>
        </Card>
        
        <TransactionFlow />
      </div>
    </MainLayout>
  );
};

export default TransactionFlowPage;
