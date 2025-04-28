
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface WalletActivityProps {
  data?: Array<{ name: string; transactions: number }>;
  isLoading?: boolean;
}

// Real-looking transaction activity data based on actual wallet behavior
const defaultData = [
  { name: 'Jan', transactions: 24 },
  { name: 'Feb', transactions: 37 },
  { name: 'Mar', transactions: 52 },
  { name: 'Apr', transactions: 43 },
  { name: 'May', transactions: 69 },
  { name: 'Jun', transactions: 42 },
  { name: 'Jul', transactions: 38 },
  { name: 'Aug', transactions: 55 },
  { name: 'Sep', transactions: 71 },
  { name: 'Oct', transactions: 85 },
  { name: 'Nov', transactions: 102 },
  { name: 'Dec', transactions: 76 },
];

export function WalletActivity({ data, isLoading = false }: WalletActivityProps) {
  const chartData = data || defaultData;

  return (
    <Card className="border-border/30">
      <CardHeader>
        <CardTitle>Wallet Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-solana-purple"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis 
                dataKey="name" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  borderColor: '#374151',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar 
                dataKey="transactions" 
                radius={[4, 4, 0, 0]}
                fill="#9B87F5" 
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
