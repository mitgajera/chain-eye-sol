
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', transactions: 65 },
  { name: 'Feb', transactions: 59 },
  { name: 'Mar', transactions: 80 },
  { name: 'Apr', transactions: 81 },
  { name: 'May', transactions: 56 },
  { name: 'Jun', transactions: 55 },
  { name: 'Jul', transactions: 40 },
  { name: 'Aug', transactions: 50 },
  { name: 'Sep', transactions: 70 },
  { name: 'Oct', transactions: 91 },
  { name: 'Nov', transactions: 125 },
  { name: 'Dec', transactions: 110 },
];

export function WalletActivity() {
  return (
    <Card className="border-border/30">
      <CardHeader>
        <CardTitle>Wallet Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
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
      </CardContent>
    </Card>
  );
}
