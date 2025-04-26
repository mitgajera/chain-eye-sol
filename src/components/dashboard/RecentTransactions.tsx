
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const transactions = [
  {
    id: "tx1",
    from: "Hx7zN...1f3h",
    to: "9cLL3...5kFj",
    amount: "145.2 SOL",
    timestamp: "2023-12-01T14:32:23Z",
    status: "confirmed",
    type: "transfer"
  },
  {
    id: "tx2",
    from: "9cLL3...5kFj",
    to: "RaydX",
    amount: "25.5 SOL",
    timestamp: "2023-12-01T14:35:12Z",
    status: "confirmed",
    type: "swap"
  },
  {
    id: "tx3",
    from: "Hx7zN...1f3h",
    to: "JupAg",
    amount: "72.3 SOL",
    timestamp: "2023-12-01T15:01:45Z",
    status: "confirmed",
    type: "swap"
  },
  {
    id: "tx4",
    from: "Unknown",
    to: "Hx7zN...1f3h",
    amount: "200.0 SOL",
    timestamp: "2023-12-01T11:22:05Z",
    status: "confirmed",
    type: "deposit"
  },
  {
    id: "tx5",
    from: "9cLL3...5kFj",
    to: "Binance",
    amount: "15.0 SOL",
    timestamp: "2023-12-01T16:44:18Z",
    status: "pending",
    type: "withdrawal"
  }
];

export function RecentTransactions() {
  return (
    <Card className="border-border/30">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Latest activity for tracked wallets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase text-muted-foreground">
              <tr>
                <th scope="col" className="px-4 py-3">Transaction</th>
                <th scope="col" className="px-4 py-3">From</th>
                <th scope="col" className="px-4 py-3">To</th>
                <th scope="col" className="px-4 py-3">Amount</th>
                <th scope="col" className="px-4 py-3">Type</th>
                <th scope="col" className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-t border-border/30 hover:bg-secondary/50">
                  <td className="px-4 py-3 font-mono text-xs">{tx.id}</td>
                  <td className="px-4 py-3 font-mono text-xs">{tx.from}</td>
                  <td className="px-4 py-3 font-mono text-xs">{tx.to}</td>
                  <td className="px-4 py-3">{tx.amount}</td>
                  <td className="px-4 py-3">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        tx.type === "transfer" && "border-blue-500 text-blue-500",
                        tx.type === "swap" && "border-purple-500 text-purple-500",
                        tx.type === "deposit" && "border-green-500 text-green-500",
                        tx.type === "withdrawal" && "border-orange-500 text-orange-500"
                      )}
                    >
                      {tx.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className={cn(
                      "flex items-center",
                      tx.status === "confirmed" ? "text-solana-green" : "text-yellow-500"
                    )}>
                      <div className={cn(
                        "w-2 h-2 rounded-full mr-2",
                        tx.status === "confirmed" ? "bg-solana-green" : "bg-yellow-500"
                      )}></div>
                      {tx.status}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
