"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import mermaid from "mermaid";
import { formatDiagramCode } from "~/lib/format-diagram";
// Remove the direct import
// import svgPanZoom from "svg-pan-zoom";

interface MermaidChartProps {
  chart: string;
  zoomingEnabled?: boolean;
}

// Função para formatar o texto do diagrama Mermaid apenas como fallback
const formatMermaidText = (text: string) => {
  // Se já tiver quebras de linha, mantém como está
  if (text.includes('\n')) {
    return text;
  }
  
  // Formatação básica para casos simples
  return text
    .replace(/flowchart (TD|LR|BT|RL)/g, 'flowchart $1\n  ')
    .replace(/classDiagram/g, 'classDiagram\n  ')
    .replace(/sequenceDiagram/g, 'sequenceDiagram\n  ')
    .replace(/erDiagram/g, 'erDiagram\n  ')
    .replace(/gantt/g, 'gantt\n  ')
    .replace(/pie/g, 'pie\n  ')
    .replace(/graph (TD|LR|BT|RL)/g, 'graph $1\n  ')
    .replace(/-->/g, '-->\n  ')
    .replace(/--/g, '--\n  ')
    .replace(/\|\|/g, '\|\|\n  ');
};

const MermaidChart = ({ chart, zoomingEnabled = false }: MermaidChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [renderError, setRenderError] = useState(false);
  const [fallbackChart, setFallbackChart] = useState<string | null>(null);
  const [svgHeight, setSvgHeight] = useState<number | null>(null);

  useEffect(() => {
    setIsClient(true);
    setRenderError(false);
    setSvgHeight(null);
  }, [chart]);

  // Função para inicializar o pan/zoom
  const initializePanZoom = async () => {
    if (!containerRef.current || !zoomingEnabled) return;
    
    const svgElement = containerRef.current.querySelector("svg");
    if (svgElement) {
      try {
        // Importar dinamicamente o svg-pan-zoom
        const svgPanZoom = (await import("svg-pan-zoom")).default;
        
        // Inicializar o pan/zoom
        svgPanZoom(svgElement, {
          zoomEnabled: true,
          controlIconsEnabled: true,
          fit: true,
          center: true,
          minZoom: 0.5,
          maxZoom: 3
        });
      } catch (error) {
        console.error("Erro ao inicializar pan/zoom:", error);
      }
    }
  };

  useEffect(() => {
    if (!isClient) return;

    mermaid.initialize({
      startOnLoad: true,
      theme: "neutral",
      securityLevel: 'loose', // Permite carregamento de diagramas externos
      logLevel: 'error',
      htmlLabels: true,
      flowchart: {
        htmlLabels: true,
        curve: "basis",
        nodeSpacing: 50,
        rankSpacing: 60,
        padding: 20,
        useMaxWidth: false
      },
      sequence: {
        diagramMarginX: 50,
        diagramMarginY: 30,
        actorMargin: 80,
        width: 150,
        height: 80,
        boxMargin: 10,
        boxTextMargin: 5,
        noteMargin: 10,
        messageMargin: 40,
        mirrorActors: false,
        bottomMarginAdj: 30, // Aumento da margem inferior
        useMaxWidth: false, // Não limita a largura máxima
      },
      er: {
        useMaxWidth: false
      },
      gantt: {
        useMaxWidth: false
      },
      pie: {
        useMaxWidth: false
      }
    });

    const renderDiagram = async () => {
      try {
        setRenderError(false);
        
        // Usar a função de formatação da biblioteca
        const formattedChart = formatDiagramCode(chart);
        
        // Adicionar um id único para evitar problemas de renderização duplicada
        const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
        
        if (containerRef.current) {
          const mermaidDiv = containerRef.current.querySelector(".mermaid");
          
          if (mermaidDiv instanceof HTMLElement) {
            mermaidDiv.id = uniqueId;
            mermaidDiv.setAttribute("data-processed", "false");
            mermaidDiv.textContent = formattedChart;
            
            // Log para debug
            console.log("Renderizando diagrama:", formattedChart);
            
            // Tentar renderizar o diagrama
            await mermaid.run({
              nodes: [mermaidDiv]
            });
            
            // Adicionar zoom SVG se ativado
            if (zoomingEnabled) {
              await initializePanZoom();
              
              // Permitir mais espaço para visualizar diagramas grandes
              if (containerRef.current) {
                const svgElement = containerRef.current.querySelector("svg");
                if (svgElement) {
                  const height = svgElement.getBoundingClientRect().height;
                  if (height > 0) {
                    setSvgHeight(height + 100); // Adiciona 100px para espaço extra
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.error("Erro ao renderizar diagrama:", error);
        setRenderError(true);
        
        // Usar um diagrama de fallback com quebras de linha explícitas
        const fallbackDiagram = `flowchart TD
  A[Diagrama] -->|Erro| B[Não foi possível renderizar]
  B --> C[Verifique a sintaxe do código]
  C --> D[Certifique-se de que o diagrama está bem formatado]
  D --> E[Remova delimitadores ''' ou \`\`\`]`;
        
        setFallbackChart(fallbackDiagram);
      }
    };

    void renderDiagram();
  }, [chart, zoomingEnabled, isClient]);

  // Efeito separado para renderizar o diagrama de fallback quando necessário
  useEffect(() => {
    if (!isClient || !renderError || !fallbackChart || !containerRef.current) return;

    const renderFallbackDiagram = async () => {
      try {
        // Verificando novamente se containerRef.current existe
        if (!containerRef.current) return;
        
        // Criar um novo elemento para o fallback com mermaid-js
        const fallbackContainer = containerRef.current.querySelector(".fallback-container");
        if (!fallbackContainer) return;
        
        // Limpar o container
        fallbackContainer.innerHTML = '';
        
        // Criar um novo elemento div para o mermaid
        const fallbackDiv = document.createElement("div");
        fallbackDiv.className = "mermaid-fallback";
        fallbackDiv.textContent = fallbackChart;
        
        // Adicionar ao container
        fallbackContainer.appendChild(fallbackDiv);
        
        // Configuração simplificada para o diagrama de fallback
        mermaid.initialize({
          startOnLoad: false,
          theme: "neutral",
          securityLevel: 'loose',
          logLevel: 'error',
          htmlLabels: true,
          flowchart: {
            htmlLabels: true,
            curve: "basis",
            useMaxWidth: false
          }
        });
        
        // Renderizar o fallback
        await mermaid.run({
          nodes: [fallbackDiv]
        });
      } catch (error) {
        console.error("Erro ao renderizar diagrama de fallback:", error);
        
        // Exibir mensagem de texto simples se nem o fallback funcionar
        if (containerRef.current) {
          const fallbackContainer = containerRef.current.querySelector(".fallback-container");
          if (fallbackContainer) {
            fallbackContainer.innerHTML = `
              <pre class="text-red-600 whitespace-pre-wrap overflow-x-auto p-4 bg-gray-100 rounded">
${fallbackChart}
              </pre>
            `;
          }
        }
      }
    };

    void renderFallbackDiagram();
  }, [isClient, renderError, fallbackChart]);

  // Adicionar classe específica para adicionar espaço extra na parte inferior do container
  const containerClass = `w-full max-w-full p-4 min-h-[600px] overflow-visible ${
    renderError ? 'pb-20' : 'pb-12'
  }`;

  if (!isClient) {
    return (
      <div
        ref={containerRef}
        className={containerClass}
      >
        <div className="flex items-center justify-center h-full">
          <div className="animate-pulse">Carregando diagrama...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={containerClass}
      style={svgHeight ? { minHeight: `${svgHeight}px` } : {}}
    >
      <div
        className={`mermaid h-full overflow-visible ${
          zoomingEnabled ? "rounded-lg border-2 border-gray-200" : ""
        }`}
      >
        {chart}
      </div>
      
      {renderError && fallbackChart && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg border-2 border-red-200">
          <p className="text-red-600 mb-2 font-semibold">
            Erro ao renderizar o diagrama. É possível que ele esteja sendo cortado ou tenha sintaxe inválida.
          </p>
          <div className="p-4 bg-white rounded border border-gray-200 fallback-container">
            {/* O diagrama de fallback será inserido aqui pelo useEffect */}
          </div>
        </div>
      )}
    </div>
  );
};

export default MermaidChart;
