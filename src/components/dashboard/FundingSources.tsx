
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "DEX Swaps", value: 42 },
  { name: "Known Exchanges", value: 28 },
  { name: "Other Wallets", value: 18 },
  { name: "Mining/Staking", value: 12 },
];

const COLORS = ["#9945FF", "#14F195", "#9B87F5", "#6E59A5"];

export function FundingSources() {
  return (
    <Card className="border-border/30">
      <CardHeader>
        <CardTitle>Funding Sources</CardTitle>
        <CardDescription>Origin of funds for tracked wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
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
      </CardContent>
    </Card>
  );
}
