"use client";

import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

interface DiagramDisplayProps {
  code: string;
}

export default function DiagramDisplay({ code }: DiagramDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && code) {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose',
        flowchart: {
          htmlLabels: true,
          curve: 'basis'
        },
        themeVariables: {
          primaryColor: '#7B61FF',
          primaryTextColor: '#fff',
          primaryBorderColor: '#7B61FF',
          lineColor: '#7B61FF',
          secondaryColor: '#FF9900',
          tertiaryColor: '#f1f1f1'
        }
      });
      
      try {
        // Limpar o conteúdo anterior
        containerRef.current.innerHTML = "";
        
        // ID único para o diagrama
        const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;
        
        // Criar um elemento para o diagrama
        const element = document.createElement("div");
        element.id = id;
        element.className = "mermaid";
        element.textContent = code;
        
        // Adicionar ao container
        containerRef.current.appendChild(element);
        
        // Renderizar o diagrama
        mermaid.render(id, code).then(({ svg }) => {
          element.innerHTML = svg;
        });
      } catch (error) {
        console.error("Erro ao renderizar o diagrama:", error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div class="p-4 text-red-500">Erro ao renderizar o diagrama: ${error}</div>`;
        }
      }
    }
  }, [code]);

  return (
    <div className="p-4 overflow-auto">
      <div ref={containerRef} className="mermaid-container w-full"></div>
    </div>
  );
}
