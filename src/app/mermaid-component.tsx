"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidProps {
  chart: string;
  zoomingEnabled?: boolean;
}

// Função de log que envia erros para o servidor
async function logServerError(error: any, message: string) {
  try {
    await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: error?.message || String(error), 
        stack: error?.stack,
        message,
        timestamp: new Date().toISOString()
      })
    });
  } catch (e) {
    // Silenciar erros de logging para não criar loops
    console.error('Falha ao enviar log para o servidor:', e);
  }
}

const MermaidChart = ({ chart, zoomingEnabled = true }: MermaidProps) => {
  const [isClient, setIsClient] = useState(false);
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
      startOnLoad: false, // Mudado para false para ter controle total sobre a renderização
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
      // Configurações adicionais para melhorar estabilidade
      fontSize: 16
    });
    
    // Usar setTimeout para garantir que o DOM está realmente pronto
    const renderTimeout = setTimeout(() => {
      const renderDiagram = async () => {
        if (containerRef.current) {
          try {
            // Limpar o conteúdo atual
            const mermaidDiv = containerRef.current.querySelector(".mermaid");
            if (mermaidDiv instanceof HTMLElement) {
              // Método alternativo de renderização que é mais robusto
              const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
              mermaidDiv.id = uniqueId;
              mermaidDiv.innerHTML = '';  // Limpar completamente o conteúdo
              mermaidDiv.textContent = chart;  // Definir o conteúdo
              
              try {
                // Tentativa com mermaid.render que é mais confiável em alguns casos
                const { svg } = await mermaid.render(uniqueId, chart);
                mermaidDiv.innerHTML = svg;
                
                // Ajustar SVG para caber no container
                const svgElement = mermaidDiv.querySelector("svg");
                if (svgElement) {
                  svgElement.style.maxWidth = "100%";
                  svgElement.style.height = "auto";
                  svgElement.style.display = "block";
                  
                  if (zoomingEnabled) {
                    svgElement.classList.add("transform", "transition-transform", "duration-300", "hover:scale-105");
                  }
                }
              } catch (renderError) {
                console.warn("Falha no método render, tentando mermaid.run", renderError);
                logServerError(renderError, "Falha no método render do Mermaid");
                
                // Fallback para mermaid.run
                await mermaid.run({
                  nodes: [mermaidDiv]
                });
              }
            }
          } catch (error) {
            console.error("Erro ao renderizar diagrama:", error);
            logServerError(error, "Erro geral ao renderizar diagrama Mermaid");
            
            // Se houver erro, mostrar um diagrama simplificado como texto
            const mermaidDiv = containerRef.current.querySelector(".mermaid");
            if (mermaidDiv instanceof HTMLElement) {
              mermaidDiv.innerHTML = `
                <div class="p-4 border border-amber-300 bg-amber-50 text-amber-700 rounded">
                  <p class="font-semibold">Diagrama:</p>
                  <pre class="text-xs overflow-auto p-2 bg-white rounded mt-2">${chart.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
                </div>
              `;
            }
          }
        }
      };
      
      renderDiagram().catch(e => {
        console.error("Erro no renderDiagram:", e);
        logServerError(e, "Erro não tratado no renderDiagram");
      });
    }, 100); // Um pequeno atraso para garantir que o DOM esteja pronto
    
    return () => clearTimeout(renderTimeout);
  }, [chart, isClient, zoomingEnabled]);

  // Render um placeholder vazio se não estiver no cliente
  if (!isClient) {
    return (
      <div className="w-full p-8 flex justify-center items-center min-h-[300px] bg-gray-100 rounded">
        <div className="animate-pulse">Carregando diagrama...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="overflow-visible w-full">
      <div className="mermaid overflow-visible w-full min-h-[100px]"></div>
    </div>
  );
};

export default MermaidChart; 