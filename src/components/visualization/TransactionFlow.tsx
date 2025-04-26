
import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Node {
  id: string;
  label: string;
  value: number;
  type: 'source' | 'exchange' | 'destination' | 'intermediate';
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
}

const demoTransactionData: TransactionFlowData = {
  nodes: [
    { id: 'wallet1', label: 'Source Wallet', value: 75, type: 'source' },
    { id: 'wallet2', label: 'Exchange', value: 50, type: 'exchange' },
    { id: 'wallet3', label: 'Intermediate', value: 30, type: 'intermediate' },
    { id: 'wallet4', label: 'Destination', value: 20, type: 'destination' },
    { id: 'wallet5', label: 'Exchange 2', value: 35, type: 'exchange' },
  ],
  edges: [
    { from: 'wallet1', to: 'wallet2', value: 50, label: '50 SOL' },
    { from: 'wallet1', to: 'wallet3', value: 25, label: '25 SOL' },
    { from: 'wallet2', to: 'wallet4', value: 20, label: '20 SOL' },
    { from: 'wallet3', to: 'wallet5', value: 15, label: '15 SOL' },
    { from: 'wallet5', to: 'wallet4', value: 10, label: '10 SOL' },
  ]
};

export function TransactionFlow({ data, isLoading = false }: TransactionFlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const flowData = data?.nodes.length ? data : demoTransactionData;

  useEffect(() => {
    // In a real application, you would use a library like vis.js, cytoscape, or d3
    // to create an interactive network visualization
    const drawSimpleGraph = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      container.innerHTML = '';
      
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
      <CardHeader>
        <CardTitle>Transaction Flow Visualization</CardTitle>
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
