# Chain-Eye-Sol: Solana Forensic Analysis Tool

A comprehensive blockchain forensics and visualization tool for tracking and analyzing on-chain fund movements in the Solana ecosystem. This tool provides sophisticated transaction flow mapping, detailed wallet analysis, and entity identification across the Solana blockchain.

## Features

### Transaction Flow Visualization
- Interactive flow charts showing connections between wallets
- Visual differentiation between exchanges, sources, and destinations
- Fund flow tracking with transaction amounts and directions
- Hover details for transaction information

### Wallet Analysis
- Comprehensive funding source breakdown
- Activity patterns and transaction history visualization
- First and last activity timestamps
- Transaction volume analysis with time-series graphs

### Transaction Clustering
- Related transaction grouping by behavior patterns
- Identification of associated wallets and entities
- Detection of exchange and marketplace interactions
- Cluster visualization with force-directed graphs

### Entity and Exchange Labeling
- Built-in database of known entities (exchanges, marketplaces, protocols)
- Add and manage custom entity labels
- Automatic entity recognition and categorization
- Visualization of interactions with known entities

## Technical Implementation

- Built with React, TypeScript, and Tailwind CSS
- Component library built with Shadcn UI
- Responsive design for desktop and mobile viewing
- Multiple RPC endpoint fallback system for reliable data access
- Comprehensive error handling with graceful fallbacks
- Demo mode with mock data for testing and demonstration purposes

## Getting Started

### Prerequisites
- Node.js 16+ installed
- Git

### Installation
1. Clone the repository:
```bash
git clone https://github.com/mitgajera/chain-eye-sol.git
```

2. Install dependencies:
```
cd chain-eye-sol
npm install
```

3. Start the development server:
```
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## Usage

1. Enter a Solana wallet address in the search bar
2. View transaction flow visualization showing connections between wallets
3. Analyze wallet activity patterns and funding sources
4. Explore transaction clusters and entity interactions
5. Use filtering and visualization options to focus on specific data points

## Demo Wallets

For demonstration purposes, you can use these example wallet addresses:
- `F7Hwf8ib5DVCoiuyGr618Y3gon429Rnd1r5F9R5upump` (Test wallet)
- `JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4` (Jupiter protocol)

## Technical Details

The application uses multiple Solana RPC endpoints with failover capabilities to ensure reliable data access. In case of network issues, the application falls back to demo mode with pre-generated mock data.

Entity identification is performed using a database of known Solana addresses, and transactions are processed to identify patterns and relationships between different addresses.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Solana Web3.js](https://github.com/solana-labs/solana-web3.js)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/)
