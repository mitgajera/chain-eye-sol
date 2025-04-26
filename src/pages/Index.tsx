
import { MainLayout } from "@/components/layout/MainLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { TransactionFlow } from "@/components/visualization/TransactionFlow";
import { WalletActivity } from "@/components/dashboard/WalletActivity";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { FundingSources } from "@/components/dashboard/FundingSources";
import { Database, Map, ChartBar, Users } from "lucide-react";
import { WalletSearch } from "@/components/search/WalletSearch";
import { useWalletData } from "@/hooks/useWalletData";

const Index = () => {
  const { walletData, isLoading, analyzeWallet } = useWalletData();

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        
        <div className="w-full max-w-3xl mx-auto mb-8">
          <WalletSearch onSearch={analyzeWallet} isLoading={isLoading} />
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard 
            title="Tracked Wallets" 
            value={walletData ? "1" : "0"} 
            icon={<Database className="h-5 w-5" />} 
            trend={walletData ? { value: 100, positive: true } : undefined}
          />
          <StatsCard 
            title="Analyzed Transactions" 
            value={walletData?.totalTransactions?.toString() || "0"} 
            icon={<Map className="h-5 w-5" />} 
            trend={walletData ? { value: 8, positive: true } : undefined}
          />
          <StatsCard 
            title="Identified Clusters" 
            value={walletData?.flowData.nodes.filter(n => n.type === 'exchange').length.toString() || "0"} 
            icon={<ChartBar className="h-5 w-5" />} 
            trend={walletData ? { value: 2, positive: true } : undefined}
          />
          <StatsCard 
            title="Known Entities" 
            value={walletData ? "42" : "0"} 
            icon={<Users className="h-5 w-5" />} 
          />
        </div>

        {/* Transaction Flow Visualization */}
        <TransactionFlow data={walletData?.flowData} isLoading={isLoading} />
        
        {/* Activity Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <WalletActivity data={walletData?.activityData} isLoading={isLoading} />
          <FundingSources data={walletData?.fundingData} isLoading={isLoading} />
        </div>
        
        {/* Recent Transactions */}
        <RecentTransactions transactions={walletData?.recentTransactions} isLoading={isLoading} />
      </div>
    </MainLayout>
  );
};

export default Index;
