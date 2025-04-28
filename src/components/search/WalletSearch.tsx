
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { isValidSolanaAddress } from '@/lib/solana';
import { SearchIcon, Loader2, History, Wallet, Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface WalletSearchProps {
  onSearch: (address: string) => void;
  isLoading?: boolean;
}

export function WalletSearch({ onSearch, isLoading = false }: WalletSearchProps) {
  const [searchInput, setSearchInput] = useState('');
  const [isValidInput, setIsValidInput] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    // Only validate if there's input
    if (value.length > 0) {
      setIsValidInput(isValidSolanaAddress(value));
    } else {
      setIsValidInput(true); // Don't show error for empty input
    }
  };

  const saveToRecentSearches = (address: string) => {
    const updatedSearches = [
      address, 
      ...recentSearches.filter(item => item !== address)
    ].slice(0, 5); // Keep only 5 recent searches
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput && isValidSolanaAddress(searchInput)) {
      saveToRecentSearches(searchInput);
      onSearch(searchInput);
    } else {
      setIsValidInput(false);
    }
  };

  const handleExampleClick = (address: string) => {
    setSearchInput(address);
    setIsValidInput(true);
    saveToRecentSearches(address);
    onSearch(address);
  };

  // Example wallets for quick testing
  const exampleWallets = [
    { name: "Test Wallet", address: "F7Hwf8ib5DVCoiuyGr618Y3gon429Rnd1r5F9R5upump" },
    { name: "Jupiter Protocol", address: "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4" }
  ];

  return (
    <div className="space-y-3 w-full">
      <form onSubmit={handleSubmit} className="flex w-full max-w-2xl space-x-2">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Enter Solana wallet address..."
            value={searchInput}
            onChange={handleInputChange}
            className={`pl-4 pr-10 py-2 border ${!isValidInput ? 'border-red-500' : 'border-border/30'}`}
            disabled={isLoading}
          />
          {!isValidInput && (
            <p className="text-red-500 text-xs mt-1">Please enter a valid Solana address</p>
          )}
        </div>
        <Button 
          type="submit" 
          disabled={isLoading || !searchInput || !isValidInput}
          className="bg-solana-purple hover:bg-solana-purple/90"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing...</span>
            </div>
          ) : (
            <>
              <SearchIcon className="mr-2 h-4 w-4" />
              Analyze Wallet
            </>
          )}
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" disabled={isLoading}>
              <Info className="h-4 w-4" />
              <span className="sr-only">View help</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium">About This Tool</h4>
              <p className="text-sm text-muted-foreground">
                This Solana analysis tool helps you visualize transaction flows, analyze wallet activity,
                and identify connections between addresses.
              </p>
              <h4 className="font-medium mt-2">Demo Wallets</h4>
              <p className="text-xs text-muted-foreground">
                Click on an example wallet below to see the tool in action.
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </form>
      
      <div className="flex flex-wrap gap-2">
        {/* Recent searches */}
        {recentSearches.length > 0 && (
          <div className="flex items-center mr-2">
            <History className="h-3 w-3 mr-1 text-gray-400" />
            <span className="text-xs text-gray-400">Recent:</span>
          </div>
        )}
        
        {recentSearches.map((address, index) => (
          <Button 
            key={`recent-${index}`}
            variant="outline" 
            size="sm"
            className="text-xs h-6 px-2"
            onClick={() => handleExampleClick(address)}
            disabled={isLoading}
          >
            {address.substring(0, 4)}...{address.substring(address.length - 4)}
          </Button>
        ))}
        
        {/* Example wallets */}
        <div className="flex items-center ml-2">
          <Wallet className="h-3 w-3 mr-1 text-gray-400" />
          <span className="text-xs text-gray-400">Examples:</span>
        </div>
        
        {exampleWallets.map((wallet, index) => (
          <Button 
            key={`example-${index}`}
            variant="outline" 
            size="sm"
            className="text-xs h-6 px-2 bg-black/10"
            onClick={() => handleExampleClick(wallet.address)}
            disabled={isLoading}
          >
            {wallet.name}
          </Button>
        ))}
      </div>
    </div>
  );
}
