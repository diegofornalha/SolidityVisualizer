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
        diagramMarginX: 40,
        diagramMarginY: 20,
        actorMargin: 60,
        width: 120,
        height: 60,
        boxMargin: 8,
        messageMargin: 30,
        bottomMarginAdj: 20,
        useMaxWidth: true,
        wrap: true,
        wrapPadding: 10,
        mirrorActors: false
      },
      fontSize: 14
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
            
            // Ajustar o SVG para garantir que fique dentro do container
            const svg = mermaidDiv.querySelector("svg");
            if (svg) {
              svg.setAttribute("width", "100%");
              svg.setAttribute("height", "auto");
              svg.style.maxWidth = "100%";
              
              // Adicionar zoom se necessário
              if (zoomingEnabled) {
                svg.classList.add("transform", "transition-transform", "duration-300", "hover:scale-105");
              }
            }
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
              // Mostrar mensagem de texto como fallback final
              if (mermaidDiv) {
                mermaidDiv.innerHTML = `
                  <div class="p-4 border border-red-300 bg-red-50 text-red-700 rounded">
                    <p>Não foi possível renderizar o diagrama.</p>
                  </div>
                `;
              }
            }
          }
        }
      }
    };
    
    // Usar setTimeout para garantir que o DOM está pronto
    const timer = setTimeout(() => {
      renderDiagram().catch(e => console.error("Falha no renderDiagram:", e));
    }, 50);
    
    return () => clearTimeout(timer);
  }, [chart, isClient, zoomingEnabled]);
  
  return (
    <div ref={containerRef} className="w-full">
      <div className="mermaid w-full">
        {chart}
      </div>
    </div>
  );
};

export default MermaidChart; 