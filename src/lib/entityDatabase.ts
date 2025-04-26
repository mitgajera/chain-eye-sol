
// Entity database for known addresses
export const knownEntities: Record<string, { name: string, type: string }> = {
  // System accounts
  '1nc1nerator11111111111111111111111111111111': { name: 'Incinerator', type: 'system' },
  'SysvarRent111111111111111111111111111111111': { name: 'Rent Sysvar', type: 'system' },
  'SysvarC1ock11111111111111111111111111111111': { name: 'Clock Sysvar', type: 'system' },
  '11111111111111111111111111111111': { name: 'System Program', type: 'system' },
  'Vote111111111111111111111111111111111111111': { name: 'Vote Program', type: 'system' },
  'Stake11111111111111111111111111111111111111': { name: 'Stake Program', type: 'system' },
  
  // Token programs
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA': { name: 'Token Program', type: 'program' },
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL': { name: 'Associated Token Program', type: 'program' },
  
  // DEXes and Exchanges
  'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4': { name: 'Jupiter', type: 'exchange' },
  'DZjbn4XC8qoHKikZqzmhemykVzmossoayV9ffbsUqxVj': { name: 'Raydium', type: 'exchange' },
  'srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX': { name: 'Serum', type: 'exchange' },
  'MEisE1HzehtrDpAAT8PnLHjpSSkRYakotTuJRPjTpo8': { name: 'Mango Markets', type: 'exchange' },
  '5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1': { name: 'Marinade', type: 'staking' },
  'oRcY5eEJBDnBQ3Kzg1PBSxvG2hR3TAyPsKEcz9dnJHQ': { name: 'Orca', type: 'exchange' },
  
  // Major CEXes deposit addresses
  '38XnKP91qt1YWxNpbG6gJ8LYYv8xPSfftSJ9TgzRTU1W': { name: 'Binance Hot Wallet', type: 'exchange' },
  '9hKpwEX9oTYYxdSQHJBgveHGHfxTKqXw3GSNGxWTZE1z': { name: 'Coinbase', type: 'exchange' },
  'FTbiUmGeVGEwkGJZb665xcyn5JL5xKMWXYEYGpKx8JkU': { name: 'FTX', type: 'exchange' },
  'CEzN7mqP9xoxn2LmHk3LYgf1Qxm8HqMehyTYqBYXUK3T': { name: 'Kraken', type: 'exchange' },
  'StakeYvgbJ7T8iLX3GmJMUiKWqAdkM7EQgSKnwQEuSK9': { name: 'Lido', type: 'staking' },
  
  // NFT Marketplaces
  'M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K': { name: 'Magic Eden', type: 'marketplace' },
  'hausS13jsjafwWwGqZTUQRmWyvyxn9EQpqMwV1PBBmk': { name: 'Tensor', type: 'marketplace' },
  'CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz': { name: 'Solanart', type: 'marketplace' },
  
  // Known protocols
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s': { name: 'Metaplex', type: 'protocol' },
  'wormDTUJ6AWPNvk59vGQbDvGJmqbDTdgWgAqcLBCgUb': { name: 'Wormhole', type: 'bridge' },
  'So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo': { name: 'Solend', type: 'defi' },
  'Port7uDYB3wk6GJAw4KT1WpTeMtSu9bTcChBHkX2LfR': { name: 'Port Finance', type: 'defi' },
  'BLDd8K9ZYPr9PUVrYQM3pQ9gGF1Copyright5JqM4': { name: 'Blend', type: 'defi' },
  '8szGkuLTAux9XMgZ2vtY39jVSowEcpBfFfD8hZ2EmwaR': { name: 'Marinade Finance', type: 'defi' },
  'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So': { name: 'Marinade Staked SOL', type: 'token' },
  '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs': { name: 'Orca Whirlpool', type: 'defi' },
};
