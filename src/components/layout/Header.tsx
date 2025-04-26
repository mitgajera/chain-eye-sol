
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Here you would implement search functionality
  };

  return (
    <header className="flex justify-between items-center gap-4 p-4 border-b border-border/30">
      <div className="flex-1 md:flex-initial">
        <h1 className="text-xl md:text-2xl font-bold">Solana Forensic Analysis</h1>
      </div>

      <form onSubmit={handleSearch} className="flex-1 max-w-md">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search wallet address or transaction..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary border-none"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
      </form>

      <div className="hidden md:flex items-center gap-2">
        <Button variant="outline" size="sm">
          Connect Wallet
        </Button>
      </div>
    </header>
  );
}
