
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface FundingSourceProps {
  data?: Array<{ name: string; value: number }>;
  isLoading?: boolean;
}

const defaultData = [
  { name: "DEX Swaps", value: 42 },
  { name: "Known Exchanges", value: 28 },
  { name: "Other Wallets", value: 18 },
  { name: "Mining/Staking", value: 12 },
];

const COLORS = ["#9945FF", "#14F195", "#9B87F5", "#6E59A5"];

export function FundingSources({ data, isLoading = false }: FundingSourceProps) {
  const chartData = data || defaultData;
  
  return (
    <Card className="border-border/30">
      <CardHeader>
        <CardTitle>Funding Sources</CardTitle>
        <CardDescription>Origin of funds for tracked wallet</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-solana-purple"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  borderColor: '#374151',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                formatter={(value) => [`${value}%`, 'Percentage']}
              />
              <Legend align="center" verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
