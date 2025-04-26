
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface Transaction {
  id: string;
  from: string;
  to: string;
  amount: string;
  timestamp: string;
  status: "confirmed" | "pending" | "failed";
  type: "transfer" | "swap" | "deposit" | "withdrawal" | "unknown";
}

interface RecentTransactionsProps {
  transactions?: Transaction[];
  isLoading?: boolean;
}

const defaultTransactions: Transaction[] = [
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

export function RecentTransactions({ transactions, isLoading = false }: RecentTransactionsProps) {
  const txList = transactions || defaultTransactions;
  
  return (
    <Card className="border-border/30 bg-black/20 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Latest activity for tracked wallets</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-solana-purple"></div>
          </div>
        ) : (
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs uppercase text-gray-400 py-3">Transaction</TableHead>
                  <TableHead className="text-xs uppercase text-gray-400 py-3">From</TableHead>
                  <TableHead className="text-xs uppercase text-gray-400 py-3">To</TableHead>
                  <TableHead className="text-xs uppercase text-gray-400 py-3">Amount</TableHead>
                  <TableHead className="text-xs uppercase text-gray-400 py-3">Type</TableHead>
                  <TableHead className="text-xs uppercase text-gray-400 py-3">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {txList.map((tx) => (
                  <TableRow key={tx.id} className="border-t border-gray-800 hover:bg-gray-800/50">
                    <TableCell className="py-3 font-mono text-xs">{tx.id}</TableCell>
                    <TableCell className="py-3 font-mono text-xs">{tx.from}</TableCell>
                    <TableCell className="py-3 font-mono text-xs">{tx.to}</TableCell>
                    <TableCell className="py-3">{tx.amount}</TableCell>
                    <TableCell className="py-3">
                      <Badge 
                        className={cn(
                          "text-xs font-medium py-1 px-3 rounded-full",
                          tx.type === "transfer" && "bg-blue-900/50 text-blue-400 border-blue-700",
                          tx.type === "swap" && "bg-purple-900/50 text-purple-400 border-purple-700",
                          tx.type === "deposit" && "bg-green-900/50 text-green-400 border-green-700",
                          tx.type === "withdrawal" && "bg-orange-900/50 text-orange-400 border-orange-700",
                          tx.type === "unknown" && "bg-gray-900/50 text-gray-400 border-gray-700"
                        )}
                      >
                        {tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3">
                      <div className={cn(
                        "flex items-center",
                        tx.status === "confirmed" ? "text-green-500" : 
                        tx.status === "pending" ? "text-yellow-500" : "text-red-500"
                      )}>
                        <div className={cn(
                          "w-2 h-2 rounded-full mr-2",
                          tx.status === "confirmed" ? "bg-green-500" : 
                          tx.status === "pending" ? "bg-yellow-500" : "bg-red-500"
                        )}></div>
                        {tx.status}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
