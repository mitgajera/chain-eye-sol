
import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const demoTransactionData = {
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

export function TransactionFlow() {
  const containerRef = useRef<HTMLDivElement>(null);

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

      // Create node positions
      const positions = {
        'wallet1': { x: 100, y: 200 },
        'wallet2': { x: 300, y: 100 },
        'wallet3': { x: 300, y: 300 },
        'wallet4': { x: 700, y: 200 },
        'wallet5': { x: 500, y: 200 },
      };

      // Draw edges first (so they appear behind nodes)
      demoTransactionData.edges.forEach(edge => {
        const from = positions[edge.from as keyof typeof positions];
        const to = positions[edge.to as keyof typeof positions];
        
        // Create arrow line
        const line = document.createElementNS(svgNS, "line");
        line.setAttribute("x1", from.x.toString());
        line.setAttribute("y1", from.y.toString());
        line.setAttribute("x2", to.x.toString());
        line.setAttribute("y2", to.y.toString());
        line.setAttribute("stroke", "#9945FF");
        line.setAttribute("stroke-width", (edge.value / 10).toString());
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
      demoTransactionData.nodes.forEach(node => {
        const position = positions[node.id as keyof typeof positions];
        
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
  }, []);

  return (
    <Card className="border-border/30">
      <CardHeader>
        <CardTitle>Transaction Flow Visualization</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={containerRef} className="w-full h-[400px]"></div>
      </CardContent>
    </Card>
  );
}
