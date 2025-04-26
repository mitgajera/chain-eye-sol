
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { isValidSolanaAddress } from '@/lib/solana';
import { SearchIcon } from 'lucide-react';

interface WalletSearchProps {
  onSearch: (address: string) => void;
  isLoading?: boolean;
}

export function WalletSearch({ onSearch, isLoading = false }: WalletSearchProps) {
  const [searchInput, setSearchInput] = useState('');
  const [isValidInput, setIsValidInput] = useState(true);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput && isValidSolanaAddress(searchInput)) {
      onSearch(searchInput);
    } else {
      setIsValidInput(false);
    }
  };

  return (
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
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            <span>Analyzing...</span>
          </div>
        ) : (
          <>
            <SearchIcon className="mr-2 h-4 w-4" />
            Analyze Wallet
          </>
        )}
      </Button>
    </form>
  );
}
