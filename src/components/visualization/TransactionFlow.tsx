
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
  
  return {
    nodes: [
      { id: walletAddress, label: shortAddr, value: 75, type: 'source' },
      { id: 'exchange1', label: 'Binance', value: 50, type: 'exchange' },
      { id: 'dex1', label: 'Jupiter', value: 40, type: 'exchange' },
      { id: 'wallet1', label: 'User Wallet', value: 30, type: 'destination' },
      { id: 'staking1', label: 'Staking Pool', value: 35, type: 'destination' },
      { id: 'nft1', label: 'NFT Marketplace', value: 25, type: 'exchange' },
    ],
    edges: [
      { from: 'exchange1', to: walletAddress, value: 50, label: '50 SOL' },
      { from: walletAddress, to: 'dex1', value: 15, label: '15 SOL' },
      { from: walletAddress, to: 'wallet1', value: 10, label: '10 SOL' },
      { from: walletAddress, to: 'staking1', value: 20, label: '20 SOL' },
      { from: 'dex1', to: 'nft1', value: 5, label: '5 SOL' },
      { from: 'nft1', to: walletAddress, value: 3, label: '3 SOL' },
    ]
  };
};

export function TransactionFlow({ data, isLoading = false, walletAddress }: TransactionFlowProps) {
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
        line.setAttribute("stroke-width", (Math.min(5, Math.max(1, edge.value / 10))).toString());
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
  }, [flowData]);

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
