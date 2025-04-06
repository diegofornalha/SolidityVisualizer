"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { ZoomIn, ZoomOut, RotateCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DiagramDisplayProps {
  code: string;
}

export default function DiagramDisplay({ code }: DiagramDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (containerRef.current && code) {
      setError(null);
      
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
        }).catch(err => {
          console.error("Erro ao renderizar o diagrama:", err);
          setError(`Erro ao renderizar: ${err.message || 'Formato inválido'}`); 
        });
      } catch (error: any) {
        console.error("Erro ao processar o diagrama:", error);
        setError(`Erro ao processar: ${error.message || 'Formato inválido'}`);
      }
    }
  }, [code]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleReset = () => {
    setZoom(1);
  };

  const handleDownload = () => {
    if (!containerRef.current) return;
    
    try {
      const svgElement = containerRef.current.querySelector('svg');
      if (!svgElement) return;
      
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `diagrama-${Date.now()}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao baixar SVG:', err);
    }
  };

  return (
    <div className="relative">
      {error ? (
        <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-md">
          <p className="font-medium">{error}</p>
          <p className="text-sm mt-2">Verifique se o código do diagrama está no formato correto do Mermaid.</p>
        </div>
      ) : (
        <>
          <div className="absolute top-2 right-2 flex space-x-2 z-10 bg-white/80 dark:bg-black/50 p-1 rounded-md">
            <Button variant="outline" size="icon" onClick={handleZoomIn} title="Aumentar zoom">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleZoomOut} title="Diminuir zoom">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleReset} title="Resetar zoom">
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleDownload} title="Baixar SVG">
              <Download className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="overflow-auto p-4 border rounded-md bg-white dark:bg-gray-900">
            <div 
              className="mermaid-container w-full flex justify-center transition-transform" 
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center top' }}
            >
              <div ref={containerRef} className="w-full"></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
