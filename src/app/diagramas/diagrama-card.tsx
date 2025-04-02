"use client";

import { useRef, useEffect } from 'react';
import mermaid from 'mermaid';

// Inicializar o Mermaid com configurações básicas
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
});

interface DiagramaCardProps {
  codigo: string;
  titulo?: string;
}

export function DiagramaCard({ codigo }: DiagramaCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !codigo) return;

    // Limpar o container antes de renderizar
    containerRef.current.innerHTML = '';

    const renderDiagram = async () => {
      try {
        // Criar um ID único para o diagrama
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        
        // Preparar o elemento para o diagrama
        const element = document.createElement('div');
        element.id = id;
        element.style.width = '100%';
        element.style.overflow = 'auto';
        element.style.marginTop = '1rem';
        
        // Adicionar o elemento ao container
        if (containerRef.current) {
          containerRef.current.appendChild(element);
        }

        // Formatar código para remover problemas comuns
        let codigoFormatado = codigo
          .replace(/```mermaid/g, '')
          .replace(/```/g, '')
          .trim();

        // Corrigir problemas comuns em diagramas
        codigoFormatado = codigoFormatado
          // Garantir que cada linha termina com quebra
          .replace(/([A-Z][^>\n]*?)-->/g, '$1-->\n')
          .replace(/([A-Z][^>\n]*?)--[^>]/g, '$1--\n')
          // Remover aspas em nomes de estilos
          .replace(/style\s+"([^"]+)"\s+/g, 'style $1 ')
          // Substituir espaços em nomes por underscores em classes de estilo
          .replace(/style\s+([^{]+)\s+{/g, (match, p1) => 
            `style ${p1.replace(/\s+/g, '_')} {`
          );

        console.log('Tentando renderizar diagrama com código:', codigoFormatado);

        // Tentar renderizar o diagrama
        const { svg } = await mermaid.render(id, codigoFormatado);
        
        // Substituir o elemento pelo SVG renderizado
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
          
          // Garantir que o SVG tenha width e preserveAspectRatio corretos
          const svgElement = containerRef.current.querySelector('svg');
          if (svgElement) {
            svgElement.setAttribute('width', '100%');
            svgElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
          }
        }
      } catch (error) {
        console.error('Erro ao renderizar o diagrama:', error);
        
        // Mostrar mensagem de erro no container
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div class="p-4 border border-red-300 rounded-md bg-red-50 text-red-700">
              <p class="font-semibold mb-2">Erro ao renderizar o diagrama</p>
              <pre class="text-xs overflow-x-auto p-2 bg-gray-100 rounded">${codigo}</pre>
            </div>
          `;
        }
      }
    };

    // Executar a renderização após um pequeno delay para garantir que o DOM está pronto
    const timer = setTimeout(() => {
      renderDiagram();
    }, 100);

    return () => clearTimeout(timer);
  }, [codigo]);

  return (
    <div 
      ref={containerRef} 
      className="w-full min-h-[150px] rounded-md overflow-hidden border border-gray-200"
    />
  );
} 