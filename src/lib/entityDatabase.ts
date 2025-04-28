
// Entity database for known addresses
export const knownEntities: Record<string, { name: string, type: string }> = {
  // System accounts
  '1nc1nerator11111111111111111111111111111111': { name: 'Incinerator', type: 'system' },
  'SysvarRent111111111111111111111111111111111': { name: 'Rent Sysvar', type: 'system' },
  'SysvarC1ock11111111111111111111111111111111': { name: 'Clock Sysvar', type: 'system' },
  '11111111111111111111111111111111': { name: 'System Program', type: 'system' },
  'Vote111111111111111111111111111111111111111': { name: 'Vote Program', type: 'system' },
  'Stake11111111111111111111111111111111111111': { name: 'Stake Program', type: 'system' },
  'AddressLookupTab1e1111111111111111111111111': { name: 'Address Lookup Table', type: 'system' },
  
  // Token programs
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA': { name: 'Token Program', type: 'program' },
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL': { name: 'Associated Token Program', type: 'program' },
  'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb': { name: 'Token-2022', type: 'program' },
  
  // DEXes and Exchanges
  'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4': { name: 'Jupiter', type: 'exchange' },
  'jupoNjAxXgZ4rjzxzPMP4uBwxeqbGmwQfB6nQbFFSGF': { name: 'Jupiter v6', type: 'exchange' },
  'JUP2jxvXaqu7NQY1GmNF4m1vodw12LVXYxbFL2uJvfo': { name: 'Jupiter v4', type: 'exchange' },
  'DZjbn4XC8qoHKikZqzmhemykVzmossoayV9ffbsUqxVj': { name: 'Raydium', type: 'exchange' },
  'OrcaEKBSpx9uLArb5c8MeW8Ya3J4Qn9RVt5dVQ3HZ4R': { name: 'Orca Swap v1', type: 'exchange' },
  'srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX': { name: 'Serum', type: 'exchange' },
  // Remove the duplicate entry for MEisE1HzehtrDpAAT8PnLHjpSSkRYakotTuJRPjTpo8
  '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1': { name: 'Marinade', type: 'staking' },
  'oRcY5eEJBDnBQ3Kzg1PBSxvG2hR3TAyPsKEcz9dnJHQ': { name: 'Orca', type: 'exchange' },
  
  // Major CEXes deposit addresses
  '38XnKP91qt1YWxNpbG6gJ8LYYv8xPSfftSJ9TgzRTU1W': { name: 'Binance Hot Wallet', type: 'exchange' },
  'FDXBQMSr4K6xDDrL5ZnFrQ4GwBptuMzYz4xv7bxbtahn': { name: 'Binance Deposit', type: 'exchange' },
  'AFrGkxNmVLBmcY2ZdYjLZ45pgYnYHyB3iEbXrMEkAMcP': { name: 'Binance Cold Wallet', type: 'exchange' },
  '9hKpwEX9oTYYxdSQHJBgveHGHfxTKqXw3GSNGxWTZE1z': { name: 'Coinbase', type: 'exchange' },
  '3NtGCPqA5dTW3otdxh9ySpwm84rYRvyfdaGNRgbZJnVs': { name: 'Coinbase 2', type: 'exchange' },
  'FTbiUmGeVGEwkGJZb665xcyn5JL5xKMWXYEYGpKx8JkU': { name: 'FTX', type: 'exchange' },
  'CEzN7mqP9xoxn2LmHk3LYgf1Qxm8HqMehyTYqBYXUK3T': { name: 'Kraken', type: 'exchange' },
  'StakeYvgbJ7T8iLX3GmJMUiKWqAdkM7EQgSKnwQEuSK9': { name: 'Lido', type: 'staking' },
  'GE6atKoWiQ2pt3zL7N8G32k9UQGtsuwMCGAUuKMi65Z9': { name: 'OKX', type: 'exchange' },
  
  // NFT Marketplaces
  'M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K': { name: 'Magic Eden', type: 'marketplace' },
  'MEisE1HzehtrDpAAT8PnLHjpSSkRYakotTuJRPjTpo8': { name: 'Magic Eden v2', type: 'marketplace' },
  'hausS13jsjafwWwGqZTUQRmWyvyxn9EQpqMwV1PBBmk': { name: 'Tensor', type: 'marketplace' },
  'TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN': { name: 'Tensor Swap', type: 'marketplace' },
  'CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz': { name: 'Solanart', type: 'marketplace' },
  
  // Known protocols
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s': { name: 'Metaplex', type: 'protocol' },
  'wormDTUJ6AWPNvk59vGQbDvGJmqbDTdgWgAqcLBCgUb': { name: 'Wormhole', type: 'bridge' },
  'worm2ZoG2kUd4vFXhvjh93UUH596ayRfgQ2MgjNMTth': { name: 'Wormhole v2', type: 'bridge' },
  'brdgGfTLBWYzxjAJcTt5zJ9KP8L5h1wyG59YFHSzRYD': { name: 'Wormhole Portal Token Bridge', type: 'bridge' },
  'So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo': { name: 'Solend', type: 'defi' },
  'Port7uDYB3wk6GJAw4KT1WpTeMtSu9bTcChBHkX2LfR': { name: 'Port Finance', type: 'defi' },
  'BLDd8K9ZYPr9PUVrYQM3pQ9gGF1Copyright5JqM4': { name: 'Blend', type: 'defi' },
  '8szGkuLTAux9XMgZ2vtY39jVSowEcpBfFfD8hZ2EmwaR': { name: 'Marinade Finance', type: 'defi' },
  'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So': { name: 'Marinade Staked SOL', type: 'token' },
  '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs': { name: 'Orca Whirlpool', type: 'defi' },
  'DjVE6JNiYqPL2QXyCUUh8rNjHrbz9hXHNYt99MQ59qw1': { name: 'Kamino Finance', type: 'defi' },
  'SPoo1Ku8WFXoNDMHPsrGSTSG1Y47rzgn41SLUNakuHy': { name: 'Solana Pool', type: 'defi' },
  
  // Test wallets - for development/testing
  'F7Hwf8ib5DVCoiuyGr618Y3gon429Rnd1r5F9R5upump': { name: 'Test Wallet', type: 'user' },
};
