
import { MainLayout } from "@/components/layout/MainLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { TransactionFlow } from "@/components/visualization/TransactionFlow";
import { WalletActivity } from "@/components/dashboard/WalletActivity";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { FundingSources } from "@/components/dashboard/FundingSources";
import { Database, Map, ChartBar, Users } from "lucide-react";

const Index = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Tracked Wallets" 
            value="14" 
            icon={<Database className="h-5 w-5" />} 
            trend={{ value: 12, positive: true }}
          />
          <StatsCard 
            title="Analyzed Transactions" 
            value="1,264" 
            icon={<Map className="h-5 w-5" />} 
            trend={{ value: 8, positive: true }}
          />
          <StatsCard 
            title="Identified Clusters" 
            value="5" 
            icon={<ChartBar className="h-5 w-5" />} 
            trend={{ value: 2, positive: true }}
          />
          <StatsCard 
            title="Known Entities" 
            value="42" 
            icon={<Users className="h-5 w-5" />} 
          />
        </div>

        {/* Transaction Flow Visualization */}
        <TransactionFlow />
        
        {/* Activity Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <WalletActivity />
          <FundingSources />
        </div>
        
        {/* Recent Transactions */}
        <RecentTransactions />
      </div>
    </MainLayout>
  );
};

export default Index;
