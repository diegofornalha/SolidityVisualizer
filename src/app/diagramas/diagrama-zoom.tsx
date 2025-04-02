"use client";

import { useState } from "react";
import { DiagramaCard } from "./diagrama-card";
import { Button } from '~/components/ui/button';
import { ZoomIn, ZoomOut, Maximize, X, RefreshCw } from 'lucide-react';

interface DiagramaZoomProps {
  codigo: string;
  titulo?: string;
}

export function DiagramaZoom({ codigo, titulo }: DiagramaZoomProps) {
  const [escala, setEscala] = useState(1);
  const [emTelaCheia, setEmTelaCheia] = useState(false);
  
  // Funções de controle de zoom
  const aumentarZoom = () => setEscala(prev => Math.min(prev + 0.25, 3));
  const diminuirZoom = () => setEscala(prev => Math.max(prev - 0.25, 0.5));
  const resetarZoom = () => setEscala(1);
  const alternarTelaCheia = () => setEmTelaCheia(!emTelaCheia);
  
  return (
    <div className={`relative ${emTelaCheia ? 'fixed inset-0 z-50 bg-white p-4' : ''}`}>
      {emTelaCheia && (
        <Button
          variant="outline"
          size="icon"
          onClick={alternarTelaCheia}
          className="absolute top-2 right-2 z-10"
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <div className="mb-2 flex items-center gap-2 justify-end">
        <div className="flex items-center gap-1">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={diminuirZoom}
            className="h-8 w-8"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <span className="bg-gray-100 px-2 py-1 text-xs rounded">
            {Math.round(escala * 100)}%
          </span>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={aumentarZoom}
            className="h-8 w-8"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={resetarZoom}
            className="h-8 w-8 ml-1"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        
        {!emTelaCheia && (
          <Button 
            variant="outline" 
            size="icon" 
            onClick={alternarTelaCheia}
            className="h-8 w-8"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div 
        style={{ 
          transform: `scale(${escala})`, 
          transformOrigin: 'top left',
          marginBottom: `${(escala - 1) * 100}px`
        }}
      >
        <DiagramaCard codigo={codigo} />
      </div>
    </div>
  );
} 