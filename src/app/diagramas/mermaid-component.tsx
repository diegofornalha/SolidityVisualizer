"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidChartProps {
  chart: string;
  zoomingEnabled?: boolean;
}

const MermaidChart = ({ chart, zoomingEnabled = false }: MermaidChartProps) => {
  const [isClient, setIsClient] = useState(false);
  const [renderError, setRenderError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Inicializar o estado de cliente no useEffect
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Efeito para renderizar o diagrama
  useEffect(() => {
    if (!isClient) return;
    
    // Configuração do Mermaid otimizada para vários tipos de diagramas
    mermaid.initialize({
      startOnLoad: true,
      theme: "neutral",
      securityLevel: 'loose',
      logLevel: 'error',
      htmlLabels: true,
      flowchart: { 
        curve: "basis",
        htmlLabels: true,
        useMaxWidth: false
      },
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
      },
      er: {
        useMaxWidth: false
      },
      gantt: {
        useMaxWidth: false
      }
    });
    
    const renderDiagram = async () => {
      if (containerRef.current) {
        try {
          setRenderError(false);
          
          // Limpar o código mermaid
          let processedChart = chart;
          
          // Remover delimitadores ```mermaid ou '''mermaid no início
          processedChart = processedChart.replace(/^(?:```|''')(?:mermaid)?\s*/i, '');
          // Remover delimitadores ``` ou ''' no final
          processedChart = processedChart.replace(/(?:```|''')$/i, '');
          
          // Limpar o conteúdo atual
          const mermaidDiv = containerRef.current.querySelector(".mermaid");
          if (mermaidDiv instanceof HTMLElement) {
            // Adicionar um ID único para evitar conflitos em múltiplos diagramas
            const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
            mermaidDiv.id = uniqueId;
            mermaidDiv.setAttribute("data-processed", "false");
            mermaidDiv.textContent = processedChart;
            
            // Renderizar o diagrama
            await mermaid.run({
              nodes: [mermaidDiv],
            });
            
            // Ajustar SVG para caber no container
            const svgElement = mermaidDiv.querySelector("svg");
            if (svgElement) {
              svgElement.style.maxWidth = "100%";
              svgElement.style.height = "auto";
              svgElement.style.display = "block";
            }
          }
        } catch (error) {
          console.error("Erro ao renderizar diagrama:", error);
          setRenderError(true);
          
          // Se houver erro, mostrar um diagrama simplificado
          const mermaidDiv = containerRef.current.querySelector(".mermaid");
          if (mermaidDiv instanceof HTMLElement) {
            mermaidDiv.textContent = `
              graph TD
                A[Erro] --> B[Não foi possível renderizar o diagrama]
                B --> C[Verifique a sintaxe]
            `;
            
            try {
              await mermaid.run({
                nodes: [mermaidDiv],
              });
            } catch (secondError) {
              console.error("Erro ao renderizar diagrama de fallback:", secondError);
              // Mostrar mensagem de erro diretamente
              if (mermaidDiv) {
                mermaidDiv.innerHTML = `
                  <div class="p-4 border border-red-300 bg-red-50 text-red-700 rounded">
                    <p>Não foi possível renderizar o diagrama. Erro de sintaxe no código.</p>
                  </div>
                `;
              }
            }
          }
        }
      }
    };
    
    void renderDiagram();
  }, [chart, isClient]);
  
  return (
    <div ref={containerRef} className="overflow-visible w-full">
      <div className="mermaid overflow-visible w-full">
        {chart}
      </div>
      {renderError && (
        <div className="mt-2 text-sm text-red-600">
          Erro ao renderizar. Este diagrama pode conter sintaxe inválida.
        </div>
      )}
    </div>
  );
};

export default MermaidChart; 