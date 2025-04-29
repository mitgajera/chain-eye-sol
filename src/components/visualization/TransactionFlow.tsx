
import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface Node {
  id: string;
  label: string;
  value: number;
  type: string;
}

interface Edge {
  from: string;
  to: string;
  value: number;
  label: string;
}

interface TransactionFlowData {
  nodes: Node[];
  edges: Edge[];
}

interface TransactionFlowProps {
  data?: TransactionFlowData;
  isLoading?: boolean;
  walletAddress?: string;
  fullscreen?: boolean;
}

// More realistic transaction data based on actual Solana transaction patterns
const generateMockData = (walletAddress?: string): TransactionFlowData => {
  if (!walletAddress) {
    return {
      nodes: [],
      edges: []
    };
  }
  
  // Create a shortened version of the wallet address for display
  const shortAddr = walletAddress.substring(0, 4) + '...' + walletAddress.substring(walletAddress.length - 4);
  
  // Use the wallet address to generate a consistent hash for pseudorandom values
  const hash = walletAddress.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // Helper to generate a "random" but consistent SOL amount
  const genAmount = (seed: number, min: number, max: number) => {
    const val = Math.abs((hash * seed) % 1000) / 1000; // 0-1 range
    return min + val * (max - min);
  };
  
  // Generate more nodes based on the hash
  const exchanges = ['Binance', 'Coinbase', 'Kraken', 'FTX'];
  const defi = ['Jupiter', 'Raydium', 'Orca', 'Marinade'];
  const wallets = ['User Wallet', 'Cold Storage', 'Team Wallet', 'Treasury'];
  
  // Create a set of nodes based on the wallet hash
  const nodes: Node[] = [
    { id: walletAddress, label: shortAddr, value: 75, type: 'source' }
  ];
  
  // Add exchange nodes
  for (let i = 0; i < Math.min(2 + Math.abs(hash % 3), exchanges.length); i++) {
    nodes.push({
      id: `exchange${i}`,
      label: exchanges[(hash + i) % exchanges.length],
      value: 35 + (hash + i) % 25,
      type: 'exchange'
    });
  }
  
  // Add defi nodes
  for (let i = 0; i < Math.min(1 + Math.abs(hash % 3), defi.length); i++) {
    nodes.push({
      id: `defi${i}`,
      label: defi[(hash + i) % defi.length],
      value: 25 + (hash + i) % 20,
      type: 'exchange'
    });
  }
  
  // Add wallet nodes
  for (let i = 0; i < Math.min(1 + Math.abs(hash % 2), wallets.length); i++) {
    nodes.push({
      id: `wallet${i}`,
      label: wallets[(hash + i) % wallets.length],
      value: 20 + (hash + i) % 15,
      type: 'destination'
    });
  }
  
  // Create edges between nodes
  const edges: Edge[] = [];
  
  // Connect exchange nodes to main wallet
  nodes.filter(n => n.id.startsWith('exchange')).forEach((node, idx) => {
    const amount = genAmount(idx + 1, 15, 200).toFixed(2);
    edges.push({
      from: node.id,
      to: walletAddress,
      value: parseFloat(amount),
      label: `${amount} SOL`
    });
  });
  
  // Connect main wallet to DeFi
  nodes.filter(n => n.id.startsWith('defi')).forEach((node, idx) => {
    const amount = genAmount(idx + 10, 5, 50).toFixed(2);
    edges.push({
      from: walletAddress,
      to: node.id,
      value: parseFloat(amount),
      label: `${amount} SOL`
    });
  });
  
  // Connect main wallet to other wallets
  nodes.filter(n => n.id.startsWith('wallet')).forEach((node, idx) => {
    const amount = genAmount(idx + 20, 10, 100).toFixed(2);
    edges.push({
      from: walletAddress,
      to: node.id,
      value: parseFloat(amount),
      label: `${amount} SOL`
    });
  });
  
  // Add a few more random connections
  if (nodes.length > 3) {
    const otherNodes = nodes.filter(n => n.id !== walletAddress);
    for (let i = 0; i < Math.min(2, otherNodes.length - 1); i++) {
      const sourceIdx = Math.abs((hash * (i+1)) % otherNodes.length);
      let targetIdx = Math.abs((hash * (i+2)) % otherNodes.length);
      if (targetIdx === sourceIdx) targetIdx = (targetIdx + 1) % otherNodes.length;
      
      const amount = genAmount(sourceIdx + targetIdx, 1, 25).toFixed(2);
      edges.push({
        from: otherNodes[sourceIdx].id,
        to: otherNodes[targetIdx].id,
        value: parseFloat(amount),
        label: `${amount} SOL`
      });
    }
  }
  
  return {
    nodes,
    edges
  };
};

export function TransactionFlow({ data, isLoading = false, walletAddress, fullscreen = false }: TransactionFlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // Use provided data or generate mock data if data is empty
  const flowData = (data && data.nodes && data.nodes.length > 0) 
    ? data 
    : generateMockData(walletAddress);

  useEffect(() => {
    // In a real application, you would use a library like vis.js, cytoscape, or d3
    // to create an interactive network visualization
    const drawSimpleGraph = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      container.innerHTML = '';
      
      // If no data or no nodes, show a message
      if (!flowData || !flowData.nodes || flowData.nodes.length === 0) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'flex items-center justify-center h-full text-gray-400';
        messageDiv.innerText = 'No transaction data available for this wallet';
        container.appendChild(messageDiv);
        return;
      }
      
      const svgNS = "http://www.w3.org/2000/svg";
      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");
      svg.setAttribute("viewBox", "0 0 800 400");
      container.appendChild(svg);

      // Create node positions using a simple force-directed layout
      const positions: Record<string, {x: number, y: number}> = {};
      const nodeCount = flowData.nodes.length;
      
      if (nodeCount <= 1) {
        // Just one node, center it
        const node = flowData.nodes[0];
        positions[node.id] = { x: 400, y: 200 };
      } else if (nodeCount <= 5) {
        // Simple circle layout for small number of nodes
        flowData.nodes.forEach((node, i) => {
          const angle = (2 * Math.PI * i) / nodeCount;
          const radius = 150;
          const x = 400 + radius * Math.cos(angle);
          const y = 200 + radius * Math.sin(angle);
          positions[node.id] = { x, y };
        });
      } else {
        // For larger networks, place source in center, others around it
        const sourceNodes = flowData.nodes.filter(n => n.type === 'source');
        const otherNodes = flowData.nodes.filter(n => n.type !== 'source');
        
        // Place source node(s) in the center
        sourceNodes.forEach((node, i) => {
          positions[node.id] = { x: 400, y: 200 };
        });
        
        // Place other nodes in a circle around the center
        otherNodes.forEach((node, i) => {
          const angle = (2 * Math.PI * i) / otherNodes.length;
          const radius = 200;
          const x = 400 + radius * Math.cos(angle);
          const y = 200 + radius * Math.sin(angle);
          positions[node.id] = { x, y };
        });
      }

      // Draw edges first (so they appear behind nodes)
      flowData.edges.forEach(edge => {
        const from = positions[edge.from];
        const to = positions[edge.to];
        
        if (!from || !to) return;
        
        // Create arrow line
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", from.x.toString());
        line.setAttribute("y1", from.y.toString());
        line.setAttribute("x2", to.x.toString());
        line.setAttribute("y2", to.y.toString());
        line.setAttribute("stroke", "#9945FF");
        line.setAttribute("stroke-width", (Math.min(5, Math.max(1, edge.value / 20))).toString());
        line.setAttribute("opacity", "0.6");
        svg.appendChild(line);
        
        // Create edge label
        const textX = (from.x + to.x) / 2;
        const textY = (from.y + to.y) / 2 - 10;
        const text = document.createElementNS(svgNS, "text");
        text.setAttribute("x", textX.toString());
        text.setAttribute("y", textY.toString());
        text.setAttribute("fill", "#fff");
        text.setAttribute("font-size", "12");
        text.setAttribute("text-anchor", "middle");
        text.textContent = edge.label;
        svg.appendChild(text);
      });
      
      // Draw nodes
      flowData.nodes.forEach(node => {
        const position = positions[node.id];
        
        if (!position) return;
        
        // Create node circle
        const circle = document.createElementNS(svgNS, "circle");
        circle.setAttribute("cx", position.x.toString());
        circle.setAttribute("cy", position.y.toString());
        circle.setAttribute("r", (node.value / 2).toString());
        
        // Set color based on node type
        let fillColor = "#9B87F5";
        if (node.type === 'source') fillColor = "#14F195";
        if (node.type === 'exchange') fillColor = "#9945FF";
        if (node.type === 'destination') fillColor = "#FF4557";
        
        circle.setAttribute("fill", fillColor);
        circle.setAttribute("stroke", "#fff");
        circle.setAttribute("stroke-width", "2");
        svg.appendChild(circle);
        
        // Create node label
        const text = document.createElementNS(svgNS, "text");
        text.setAttribute("x", position.x.toString());
        text.setAttribute("y", (position.y + node.value / 2 + 20).toString());
        text.setAttribute("fill", "#fff");
        text.setAttribute("font-size", "12");
        text.setAttribute("text-anchor", "middle");
        text.textContent = node.label;
        svg.appendChild(text);
      });
    };
    
    drawSimpleGraph();
    
    const resizeObserver = new ResizeObserver(() => {
      drawSimpleGraph();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [flowData, fullscreen]);

  // For fullscreen mode, render without card
  if (fullscreen) {
    return (
      <div className="absolute inset-0 bg-black/90 z-50 flex flex-col">
        <div className="p-4 bg-black/50 border-b border-gray-800">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Transaction Flow Visualization</h2>
            {flowData && flowData.nodes && flowData.nodes.length > 0 && !isLoading && (
              <div className="bg-black/40 px-2 py-1 rounded-md text-xs font-mono">
                {flowData.nodes.length} wallets, {flowData.edges.length} transactions
              </div>
            )}
          </div>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center flex-1">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-solana-purple"></div>
          </div>
        ) : (
          <div ref={containerRef} className="w-full flex-1"></div>
        )}
      </div>
    );
  }

  // Regular view with card
  return (
    <Card className="border-border/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Transaction Flow Visualization</CardTitle>
        {flowData && flowData.nodes && flowData.nodes.length > 0 && !isLoading && (
          <div className="bg-black/40 px-2 py-1 rounded-md text-xs font-mono">
            {flowData.nodes.length} wallets, {flowData.edges.length} transactions
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-solana-purple"></div>
          </div>
        ) : (
          <div ref={containerRef} className="w-full h-[400px]"></div>
        )}
      </CardContent>
    </Card>
  );
}
