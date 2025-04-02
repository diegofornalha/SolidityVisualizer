"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidChartProps {
  chart: string;
  zoomingEnabled?: boolean;
}

const MermaidChart = ({ chart, zoomingEnabled = false }: MermaidChartProps) => {
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Inicializar o estado de cliente no useEffect
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Efeito para renderizar o diagrama
  useEffect(() => {
    if (!isClient) return;
    
    mermaid.initialize({
      startOnLoad: true,
      theme: "neutral",
      securityLevel: 'loose',
      logLevel: 'error',
      htmlLabels: true,
      flowchart: { curve: "basis" },
      sequence: { 
        diagramMarginX: 50,
        diagramMarginY: 30,
        actorMargin: 80,
        width: 150,
        height: 80,
        boxMargin: 10,
        messageMargin: 40,
        bottomMarginAdj: 30,
        useMaxWidth: false
      }
    });
    
    const renderDiagram = async () => {
      if (containerRef.current) {
        try {
          // Limpar o conteúdo atual
          const mermaidDiv = containerRef.current.querySelector(".mermaid");
          if (mermaidDiv instanceof HTMLElement) {
            mermaidDiv.textContent = chart;
            
            // Renderizar o diagrama
            await mermaid.run({
              nodes: [mermaidDiv],
            });
          }
        } catch (error) {
          console.error("Erro ao renderizar diagrama:", error);
          
          // Se houver erro, mostrar um diagrama simplificado
          const mermaidDiv = containerRef.current.querySelector(".mermaid");
          if (mermaidDiv instanceof HTMLElement) {
            mermaidDiv.textContent = `
              graph TD
                A[Erro] --> B[Não foi possível renderizar o diagrama]
            `;
            
            try {
              await mermaid.run({
                nodes: [mermaidDiv],
              });
            } catch (secondError) {
              console.error("Erro ao renderizar diagrama de fallback:", secondError);
            }
          }
        }
      }
    };
    
    void renderDiagram();
  }, [chart, isClient]);
  
  return (
    <div ref={containerRef} className="overflow-visible">
      <div className="mermaid overflow-visible">
        {chart}
      </div>
    </div>
  );
};

export default MermaidChart; 