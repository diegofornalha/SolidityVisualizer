"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';

const MCPXDiagramV0Page = () => {
  useEffect(() => {
    // Função para carregar scripts dinamicamente
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Falha ao carregar script: ${src}`));
        document.head.appendChild(script);
      });
    };

    // Função para carregar estilos inline
    const loadStyles = () => {
      const style = document.createElement('style');
      style.innerHTML = `
        html, body {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
        }
        
        .container {
          background-color: black;
          color: #00BFFF;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          top: 0;
          overflow: hidden;
        }
        
        .back-link {
          position: absolute;
          top: 15px;
          left: 15px;
          z-index: 1000;
          color: #00BFFF;
          text-decoration: none;
          font-size: 14px;
        }
        
        .back-link:hover {
          text-decoration: underline;
        }
        
        .panzoom {
          position: absolute;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 255, 0.1);
          left: 0;
          top: 0;
          overflow: visible;
          border: 5px dotted rgba(204, 204, 204, 0.1);
          box-sizing: border-box;
        }
        
        .diagram {
          position: absolute;
        }
        
        .item {
          cursor: pointer;
          position: absolute;
          overflow: hidden;
          white-space: nowrap;
          border: 1px solid #003366;
          padding: 8px;
          border-radius: 3px;
          background-color: rgba(0, 191, 255, 0.2);
          color: white;
          font-size: 14px;
          min-width: 120px;
          text-align: center;
          z-index: 20;
        }
        
        .item:hover {
          border: 1px solid #00BFFF;
          background-color: rgba(0, 191, 255, 0.3);
          z-index: 30;
        }
        
        .jsplumb-connector path {
          stroke: #00BFFF;
          stroke-width: 1.5px;
          z-index: 10;
        }
        
        .jsplumb-endpoint {
          z-index: 20;
        }
        
        .hint {
          position: absolute;
          color: grey;
          left: 100%;
          top: -24px;
          white-space: nowrap;
          font-size: 14px;
          padding-left: 15px;
        }
        
        .hint h4 {
          margin-left: 15px;
          color: #CCC;
        }
        
        .hint a {
          margin-left: 25px;
          color: red;
          text-decoration: none;
        }
        
        .hint a:hover {
          text-decoration: underline;
        }
        
        .hint li a {
          margin-left: 0;
          color: #00BFFF;
        }
        
        .item.actor {
          background-color: rgba(64, 196, 255, 0.2);
          border-color: #0078d7;
        }
        
        .item.system {
          background-color: rgba(128, 0, 128, 0.2);
          border-color: #800080;
        }
        
        .item.highlight {
          background-color: rgba(255, 213, 79, 0.2);
          border-color: #ffc107;
          font-weight: bold;
        }
      `;
      document.head.appendChild(style);
    };

    // Função principal para inicializar o diagrama
    const initDiagram = async () => {
      try {
        loadStyles(); // Carregar estilos primeiro

        // Carregar scripts em ordem
        await loadScript('https://code.jquery.com/jquery-2.2.4.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.12.0/lodash.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jsPlumb/2.0.7/jsPlumb.min.js');
        await loadScript('https://cdn.rawgit.com/cpettitt/dagre/e66c29b8/dist/dagre.min.js');
        await loadScript('https://cdn.rawgit.com/YuriGor/jquery.panzoom/ignoreChildrensEvents/dist/jquery.panzoom.min.js');

        // Configurar o diagrama após o carregamento
        setupDiagram();
      } catch (error) {
        console.error('Erro ao carregar recursos:', error);
      }
    };

    // Função para configurar o diagrama
    const setupDiagram = () => {
      const $ = (window as any).jQuery;
      const jsPlumb = (window as any).jsPlumb;
      const dagre = (window as any).dagre;
      const _ = (window as any)._;

      const minScale = 0.4;
      const maxScale = 2;
      const incScale = 0.1;
      let plumb: any = null;
      let $panzoom: any = null;
      let $container = $(".container");
      let $diagram = $container.find(".diagram");

      // Links do diagrama MCPX
      const mcpxLinks = [
        { from: "usuario", to: "mcpxCrew" },
        { from: "mcpxCrew", to: "agenteIA" },
        { from: "agenteIA", to: "mcp" },
        { from: "agenteIA", to: "respostaProc" },
        { from: "respostaProc", to: "usuario" }
      ];

      // Inicializar jsPlumb
      jsPlumb.ready(() => {
        plumb = jsPlumb.getInstance({
          PaintStyle: { strokeWidth: 1 },
          Anchors: [["Left", "Right", "Bottom"], ["Top", "Bottom"]],
          Container: $diagram,
        });
        
        // Conectar os nós
        _.each(mcpxLinks, function(link: {from: string, to: string}) {
          plumb.connect({
            source: link.from,
            target: link.to,
            connector: ["Flowchart", {
              cornerRadius: 3,
              stub: 16
            }],
            endpoints: ["Blank", "Blank"],
            overlays: [["Arrow", { location: 1, width: 10, length: 10 }]],
          });
        });

        // Layout automático com Dagre
        const dg = new dagre.graphlib.Graph();
        dg.setGraph({
          nodesep: 50,
          ranksep: 80,
          marginx: 50,
          marginy: 50,
          rankdir: 'LR'
        });
        
        dg.setDefaultEdgeLabel(() => ({}));
        
        // Adicionar nós ao grafo
        $container.find(".item").each((idx: number, node: any) => {
          const $n = $(node);
          const box = {
            width: Math.round($n.outerWidth()),
            height: Math.round($n.outerHeight())
          };
          dg.setNode($n.attr('id'), box);
        });
        
        // Adicionar arestas ao grafo
        plumb.getAllConnections().forEach((edge: any) => {
          dg.setEdge(edge.source.id, edge.target.id);
        });
        
        // Calcular layout
        dagre.layout(dg);
        
        // Aplicar posições calculadas
        dg.nodes().forEach((n: string) => {
          const node = dg.node(n);
          const top = Math.round(node.y - node.height / 2) + 'px';
          const left = Math.round(node.x - node.width / 2) + 'px';
          $('#' + n).css({ left, top });
        });
        
        // Repintar conexões
        plumb.repaintEverything();

        // Configurar pan e zoom
        setTimeout(() => {
          $panzoom = $container.find('.panzoom').panzoom({
            minScale: minScale,
            maxScale: maxScale,
            increment: incScale,
            cursor: "",
            ignoreChildrensEvents: true,
            contain: false
          }).on("panzoomstart", function(e: any, pz: any, ev: any) {
            $panzoom.css("cursor", "move");
          })
          .on("panzoomend", function(e: any, pz: any) {
            $panzoom.css("cursor", "");
          });
          
          // Configurar eventos do mouse
          $panzoom.parent()
            .on('mousewheel.focal', function(e: any) {
              if (e.ctrlKey || e.originalEvent.ctrlKey) {
                e.preventDefault();
                const delta = e.delta || e.originalEvent.wheelDelta;
                const zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
                $panzoom.panzoom('zoom', zoomOut, {
                  animate: true,
                  exponential: false,
                });
              } else {
                e.preventDefault();
                const deltaY = e.deltaY || e.originalEvent.wheelDeltaY || (-e.originalEvent.deltaY);
                const deltaX = e.deltaX || e.originalEvent.wheelDeltaX || (-e.originalEvent.deltaX);
                $panzoom.panzoom("pan", deltaX/2, deltaY/2, {
                  animate: true,
                  relative: true,
                });
              }
            })
            .on("mousedown touchstart", function(this: any, ev: any) {
              const matrix = $container.find(".panzoom").panzoom("getMatrix");
              const offsetX = matrix[4];
              const offsetY = matrix[5];
              const dragstart = {x: ev.pageX, y: ev.pageY, dx: offsetX, dy: offsetY};
              $(ev.target).css("cursor", "move");
              $(this).data('dragstart', dragstart);
            })
            .on("mousemove touchmove", function(this: any, ev: any) {
              const dragstart = $(this).data('dragstart');
              if (dragstart) {
                const deltaX = dragstart.x - ev.pageX;
                const deltaY = dragstart.y - ev.pageY;
                const matrix = $container.find(".panzoom").panzoom("getMatrix");
                matrix[4] = parseInt(dragstart.dx) - deltaX;
                matrix[5] = parseInt(dragstart.dy) - deltaY;
                $container.find(".panzoom").panzoom("setMatrix", matrix);
              }
            })
            .on("mouseup touchend touchcancel", function(this: any, ev: any) {
              $(this).data('dragstart', null);
              $(ev.target).css("cursor", "");
            });
          
          // Centralizar o diagrama baseado nas dimensões da tela
          const centerDiagram = () => {
            const windowWidth = $(window).width() || 1000;
            const windowHeight = $(window).height() || 800;
            
            // Obter dimensões do diagrama
            let diagramBounds = {
              left: Number.MAX_VALUE,
              top: Number.MAX_VALUE,
              right: 0,
              bottom: 0
            };
            
            $container.find(".item").each(function(this: HTMLElement) {
              const $this = $(this);
              const position = $this.position();
              const width = $this.outerWidth();
              const height = $this.outerHeight();
              
              diagramBounds.left = Math.min(diagramBounds.left, position.left);
              diagramBounds.top = Math.min(diagramBounds.top, position.top);
              diagramBounds.right = Math.max(diagramBounds.right, position.left + width);
              diagramBounds.bottom = Math.max(diagramBounds.bottom, position.top + height);
            });
            
            const diagramWidth = diagramBounds.right - diagramBounds.left;
            const diagramHeight = diagramBounds.bottom - diagramBounds.top;
            
            // Calcular escala apropriada
            const scaleX = windowWidth / (diagramWidth + 100);
            const scaleY = windowHeight / (diagramHeight + 100);
            const scale = Math.min(Math.min(scaleX, scaleY), 1);
            
            // Calcular posição central
            const centerX = (windowWidth / 2) - ((diagramBounds.left + diagramWidth / 2) * scale);
            const centerY = (windowHeight / 2) - ((diagramBounds.top + diagramHeight / 2) * scale);
            
            // Aplicar transformação
            $panzoom.panzoom('zoom', scale, {
              animate: false,
              silent: true
            });
            
            $panzoom.panzoom('pan', centerX, centerY, {
              animate: false,
              relative: false,
              silent: true
            });
          };
          
          // Aplicar centralização
          centerDiagram();
          
          // Recentralizar quando a janela for redimensionada
          $(window).on('resize', _.debounce(centerDiagram, 250));
        }, 100);

        // Tornar nós arrastáveis
        let currentScale = 1;
        $container.find(".diagram .item").draggable({
          start: function(e: any) {
            const pz = $container.find(".panzoom");
            currentScale = pz.panzoom("getMatrix")[0];
            $(this).css("cursor", "move");
            
            // Garantir que o elemento sendo arrastado fique à frente
            $(this).css({
              "z-index": 50
            });
            
            pz.panzoom("disable");
          },
          drag: function(e: any, ui: any) {
            // Ajustar a posição com base na escala atual
            ui.position.left = ui.position.left / currentScale;
            ui.position.top = ui.position.top / currentScale;
            
            // Garantir que o elemento permanece visível durante o arrasto
            $(this).css({
              visibility: 'visible',
              opacity: 1
            });
            
            // Atualizar as conexões durante o arrasto
            plumb.revalidate($(this).attr('id'));
            
            // Reposicionar conectores visualmente
            setTimeout(() => {
              plumb.repaintEverything();
            }, 0);
          },
          stop: function(e: any, ui: any) {
            const nodeId = $(this).attr('id');
            
            // Forçar visibilidade do nó
            $(this).css({
              visibility: 'visible',
              opacity: 1,
              zIndex: 30
            });
            
            // Revalidar todas as conexões
            plumb.revalidate(nodeId);
            
            // Repintar tudo após um pequeno atraso para garantir atualização visual
            setTimeout(() => {
              plumb.repaintEverything();
              
              // Redefinir z-index dos elementos
              $container.find(".diagram .item").each(function() {
                if ($(this).attr('id') !== nodeId) {
                  $(this).css("z-index", 20);
                }
              });
            }, 50);
            
            $(this).css("cursor", "");
            $container.find(".panzoom").panzoom("enable");
          }
        });
        
        // Garantir que os nós permaneçam visíveis após qualquer interação
        $container.on('mouseup', function() {
          setTimeout(() => {
            $container.find(".diagram .item").css({
              visibility: 'visible',
              opacity: 1
            });
            plumb.repaintEverything();
          }, 100);
        });
        
        // Adicionar evento click para trazer nó para frente
        $container.find(".diagram .item").on('mousedown', function() {
          $(this).css("z-index", 30);
        });
      });
    };
    initDiagram();
    return () => {
      if ((window as any).jsPlumb) {
        (window as any).jsPlumb.reset();
      }
      // Remover scripts adicionados
      document.querySelectorAll('script').forEach(script => {
        if (script.src.includes('jquery') || 
            script.src.includes('jqueryui') || 
            script.src.includes('lodash') || 
            script.src.includes('jsPlumb') || 
            script.src.includes('dagre') || 
            script.src.includes('panzoom')) {
          script.remove();
        }
      });
    };
  }, []);

  return (
    <div className="container">
      <Link href="/" className="back-link">← Voltar</Link>
      
      <div className="panzoom">
        <div className="diagram">
          <div id="usuario" className="item actor">Usuário</div>
          <div id="agenteIA" className="item actor">Agente IA</div>
          <div id="mcp" className="item system">Model Context Protocol</div>
          <div id="mcpxCrew" className="item highlight">@MCPX CrewAI Prompt</div>
          <div id="respostaProc" className="item highlight">Resposta Processada</div>
        </div>
      </div>
    </div>
  );
};

export default MCPXDiagramV0Page; 